from __future__ import annotations

import atexit
import contextvars
import ctypes
import hashlib
import importlib
import json
import logging
from logging.handlers import RotatingFileHandler
import mimetypes
import os
import re
import shutil
import socket
import subprocess
import sys
import threading
import tempfile
import time
import uuid
import webbrowser
from concurrent.futures import Future, ThreadPoolExecutor
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from importlib.metadata import PackageNotFoundError, version as package_version
from urllib.parse import unquote, urlparse
from urllib.request import urlopen


ROOT = Path(sys.executable if getattr(sys, "frozen", False) else __file__).resolve().parent
BUNDLE_ROOT = Path(getattr(sys, "_MEIPASS", ROOT))
STATIC_DIR = BUNDLE_ROOT / "static"
if getattr(sys, "frozen", False):
    BUNDLED_NODE = BUNDLE_ROOT / "node" / "node.exe"
    POT_SERVER_DIR = BUNDLE_ROOT / "pot-server"
else:
    BUNDLED_NODE = ROOT / "vendor" / "node-v22.23.2-win-x64" / "node.exe"
    POT_SERVER_DIR = ROOT / "vendor" / "bgutil-ytdlp-pot-provider" / "server"
DOWNLOAD_DIR = ROOT / "downloads"
TEMP_DIR = ROOT / "temp"
DOWNLOAD_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)


def select_state_dir() -> tuple[Path, bool]:
    """Pick a persistent writable directory without assuming AppData is accessible."""
    override = os.environ.get("MEDIA_SPRINTER_STATE_DIR")
    if override:
        candidates = [Path(override)]
    else:
        local_app_data = os.environ.get("LOCALAPPDATA")
        portable_data_root = ROOT.parent.parent if getattr(sys, "frozen", False) else ROOT
        candidates = [portable_data_root / "user-data"]
        if local_app_data:
            candidates.append(Path(local_app_data) / "Media Sprinter")
        candidates.append(Path(tempfile.gettempdir()) / "Media Sprinter")

    errors: list[OSError] = []
    for index, candidate in enumerate(candidates):
        probe_path: Path | None = None
        moved_path: Path | None = None
        try:
            candidate.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(prefix=".write-check-", dir=candidate, delete=False) as probe:
                probe.write(b"Media Sprinter write check")
                probe_path = Path(probe.name)
            moved_path = probe_path.with_name(probe_path.name + ".renamed")
            probe_path.replace(moved_path)
            moved_path.unlink()
            return candidate, index > 0
        except OSError as error:
            errors.append(error)
            for temporary_path in (probe_path, moved_path):
                if temporary_path:
                    try:
                        temporary_path.unlink(missing_ok=True)
                    except OSError:
                        pass
    detail = errors[-1] if errors else "No se encontró una carpeta de configuración"
    raise OSError(f"No se pudo preparar una carpeta local para la configuración de Media Sprinter: {detail}")


APP_STATE_DIR, USING_FALLBACK_STATE_DIR = select_state_dir()
SETTINGS_FILE = APP_STATE_DIR / "settings.json"
HISTORY_FILE = APP_STATE_DIR / "history.json"
LOG_FILE = APP_STATE_DIR / "app.log"
INSTANCE_FILE = APP_STATE_DIR / "instance.json"
STATE_DIR_OVERRIDE = bool(os.environ.get("MEDIA_SPRINTER_STATE_DIR"))
USER_DOWNLOADS_DIR = Path(os.environ.get("MEDIA_SPRINTER_DOWNLOADS", r"D:\Descargas"))

HOST = "127.0.0.1"
PORT = int(os.environ.get("MEDIA_SPRINTER_PORT", "8765"))
MAX_URL_LENGTH = 2048
MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024
MAX_ACTIVE_JOBS = 2
MAX_QUEUED_JOBS = 20
MAX_HISTORY_ITEMS = 100
ANALYSIS_CACHE_SECONDS = 180
MIN_FREE_SPACE = 64 * 1024 * 1024
ALLOWED_EXTENSIONS = {".mp3", ".mp4", ".webm", ".m4a", ".mkv", ".mov", ".aac", ".ogg", ".wav"}
ALLOWED_HOSTS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
    "instagram.com",
    "www.instagram.com",
    "m.instagram.com",
    "instagr.am",
    "www.instagr.am",
    "x.com",
    "www.x.com",
    "m.x.com",
    "mobile.x.com",
    "twitter.com",
    "www.twitter.com",
    "m.twitter.com",
    "mobile.twitter.com",
}
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"}
TWITTER_HOSTS = {
    "x.com", "www.x.com", "m.x.com", "mobile.x.com",
    "twitter.com", "www.twitter.com", "m.twitter.com", "mobile.twitter.com",
}
TWITTER_STATUS_PATH = re.compile(r"^/(?:(?:i/web|[^/]+)/status|statuses)/\d+(?:/(?:video|photo)/\d+)?/?$", re.IGNORECASE)
AUDIO_QUALITIES = {"320", "192", "128"}
VIDEO_QUALITY_PATTERN = re.compile(r"^(?P<width>[1-9]\d{1,3})x(?P<height>[1-9]\d{1,3})$")
AUDIO_LANGUAGE_PATTERN = re.compile(r"^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$")
NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)

jobs: dict[str, dict[str, Any]] = {}
jobs_lock = threading.Lock()
settings_lock = threading.Lock()
history_lock = threading.Lock()
analysis_lock = threading.Lock()
analysis_cache: dict[str, dict[str, Any]] = {}
analysis_pending: dict[str, Future] = {}
executor = ThreadPoolExecutor(max_workers=MAX_ACTIVE_JOBS, thread_name_prefix="media-download")
pot_lock = threading.Lock()
plugin_init_lock = threading.Lock()
initialized_plugin_version: str | None = None
pot_process: subprocess.Popen[bytes] | None = None
pot_url: str | None = None
active_job_context: contextvars.ContextVar[str | None] = contextvars.ContextVar("media_sprinter_job", default=None)
ffmpeg_patch_lock = threading.Lock()
ffmpeg_patch_installed = False
single_instance_handle: int | None = None
single_instance_api: Any = None

logger = logging.getLogger("media_sprinter")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = RotatingFileHandler(LOG_FILE, maxBytes=1_000_000, backupCount=2, encoding="utf-8")
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(handler)
if USING_FALLBACK_STATE_DIR:
    logger.warning("La carpeta local preferida no está disponible; se usará una ubicación alternativa para ajustes e historial.")


def json_bytes(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False).encode("utf-8")


def atomic_json_write(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def migrate_legacy_state_files() -> None:
    """Preserve existing local preferences/history when state storage moves."""
    if STATE_DIR_OVERRIDE:
        return
    local_app_data = os.environ.get("LOCALAPPDATA")
    if not local_app_data:
        return
    legacy_dir = Path(local_app_data) / "Media Sprinter"
    try:
        if legacy_dir.resolve() == APP_STATE_DIR.resolve():
            return
    except OSError:
        return
    for filename, expected_type in (("settings.json", dict), ("history.json", list)):
        source = legacy_dir / filename
        destination = APP_STATE_DIR / filename
        if destination.exists() or not source.is_file():
            continue
        try:
            if source.stat().st_size > 1_000_000:
                continue
            value = json.loads(source.read_text(encoding="utf-8"))
            if isinstance(value, expected_type):
                atomic_json_write(destination, value)
        except (OSError, json.JSONDecodeError):
            logger.warning("No se pudo migrar el archivo local %s.", filename)


migrate_legacy_state_files()
if "MEDIA_SPRINTER_DOWNLOADS" not in os.environ:
    try:
        stored_settings = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        configured_dir = stored_settings.get("downloads_dir")
        if isinstance(configured_dir, str) and configured_dir.strip():
            USER_DOWNLOADS_DIR = Path(configured_dir)
    except (OSError, json.JSONDecodeError, AttributeError):
        pass


def active_instance_url(requested_port: int) -> str | None:
    ports: list[int] = []
    try:
        record = json.loads(INSTANCE_FILE.read_text(encoding="utf-8"))
        recorded_port = int(record.get("port"))
        if 1 <= recorded_port <= 65535:
            ports.append(recorded_port)
    except (OSError, ValueError, TypeError, json.JSONDecodeError, AttributeError):
        pass
    if 1 <= requested_port <= 65535 and requested_port not in ports:
        ports.append(requested_port)
    for port in ports:
        base_url = f"http://{HOST}:{port}"
        try:
            with urlopen(f"{base_url}/", timeout=0.75) as response:
                if response.status == 200 and b"Media Sprinter" in response.read(4096):
                    return base_url
        except Exception:
            continue
    return None


def acquire_single_instance(port: int) -> bool:
    """Use a Windows mutex; SO_REUSEADDR alone permits duplicate listeners on Windows."""
    global single_instance_handle, single_instance_api
    if os.name != "nt":
        return True
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel32.CreateMutexW.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_wchar_p]
    kernel32.CreateMutexW.restype = ctypes.c_void_p
    kernel32.CloseHandle.argtypes = [ctypes.c_void_p]
    kernel32.CloseHandle.restype = ctypes.c_int
    ctypes.set_last_error(0)
    handle = kernel32.CreateMutexW(None, 1, f"Local\\MediaSprinter-{port}")
    if not handle:
        raise ctypes.WinError(ctypes.get_last_error())
    if ctypes.get_last_error() == 183:  # ERROR_ALREADY_EXISTS
        kernel32.CloseHandle(handle)
        return False
    single_instance_handle = handle
    single_instance_api = kernel32
    return True


def release_single_instance() -> None:
    global single_instance_handle, single_instance_api
    handle, kernel32 = single_instance_handle, single_instance_api
    single_instance_handle = None
    single_instance_api = None
    if handle and kernel32:
        try:
            kernel32.ReleaseMutex.argtypes = [ctypes.c_void_p]
            kernel32.ReleaseMutex(handle)
            kernel32.CloseHandle(handle)
        except (AttributeError, OSError):
            pass


def write_instance_record(port: int) -> None:
    try:
        atomic_json_write(INSTANCE_FILE, {"pid": os.getpid(), "port": port})
    except OSError as exc:
        logger.warning("No se pudo guardar el puerto de la instancia activa: %s", safe_log_message(str(exc)))


def clear_instance_record() -> None:
    try:
        record = json.loads(INSTANCE_FILE.read_text(encoding="utf-8"))
        if int(record.get("pid") or 0) == os.getpid():
            INSTANCE_FILE.unlink(missing_ok=True)
    except (OSError, ValueError, TypeError, json.JSONDecodeError, AttributeError):
        pass


def get_downloads_dir() -> Path:
    with settings_lock:
        return USER_DOWNLOADS_DIR


def validate_destination(raw_path: Any, expected_size: int | None = None) -> Path:
    if not isinstance(raw_path, str) or not raw_path.strip():
        raise ValueError("Escribe una carpeta de destino.")
    raw_path = raw_path.strip()
    candidate = Path(raw_path).expanduser()
    if not candidate.is_absolute() or candidate.drive.startswith("\\\\"):
        raise ValueError("Usa una ruta local absoluta, por ejemplo D:\\Descargas.")
    destination = candidate.resolve()
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix=".media-sprinter-", dir=destination, delete=True):
        pass
    free_space = shutil.disk_usage(destination).free
    required_space = max(MIN_FREE_SPACE, int(expected_size * 1.15) if expected_size else 0)
    if free_space < required_space:
        raise OSError(
            f"Espacio insuficiente en la carpeta de destino: se requieren {format_size_label(required_space, False)} "
            f"y hay {format_size_label(free_space, False)} libres."
        )
    return destination


def save_destination(raw_path: Any) -> Path:
    global USER_DOWNLOADS_DIR
    destination = validate_destination(raw_path)
    if "MEDIA_SPRINTER_DOWNLOADS" not in os.environ:
        with settings_lock:
            USER_DOWNLOADS_DIR = destination
            current = {}
            try:
                current = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                pass
            current["downloads_dir"] = str(destination)
            atomic_json_write(SETTINGS_FILE, current)
    else:
        with settings_lock:
            USER_DOWNLOADS_DIR = destination
    return destination


def read_history() -> list[dict[str, Any]]:
    try:
        payload = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        return payload if isinstance(payload, list) else []
    except (OSError, json.JSONDecodeError):
        return []


def write_history(items: list[dict[str, Any]]) -> None:
    atomic_json_write(HISTORY_FILE, items[:MAX_HISTORY_ITEMS])


def remember_job(job: dict[str, Any]) -> None:
    item = {
        "id": job.get("id"),
        "title": job.get("title") or "Descarga sin completar",
        "platform": job.get("platform"),
        "mode": job.get("mode"),
        "quality": job.get("quality"),
        "audio_language": job.get("audio_language"),
        "audio_language_label": job.get("audio_language_label"),
        "status": job.get("status"),
        "stage": job.get("stage"),
        "error": job.get("error"),
        "path": job.get("saved_path"),
        "destination": job.get("destination"),
        "filename": job.get("filename"),
        "created_at": job.get("created_at"),
        "finished_at": int(time.time()),
    }
    with history_lock:
        items = [existing for existing in read_history() if existing.get("id") != item["id"]]
        write_history([item, *items])


def safe_log_message(message: str) -> str:
    value = re.sub(r"https?://\S+", "[enlace oculto]", message, flags=re.IGNORECASE)
    value = re.sub(r"(?i)(token|signature|sig|cookie|authorization)=([^&\s]+)", r"\1=[oculto]", value)
    return value[:300]


def analysis_cache_key(raw_url: str) -> str:
    return hashlib.sha256(raw_url.encode("utf-8")).hexdigest()


def cache_analysis(raw_url: str, media: dict[str, Any]) -> None:
    now = time.time()
    with analysis_lock:
        stale = [key for key, value in analysis_cache.items() if now - value["created_at"] > ANALYSIS_CACHE_SECONDS]
        for key in stale:
            analysis_cache.pop(key, None)
        if len(analysis_cache) >= 128:
            oldest = min(analysis_cache, key=lambda key: analysis_cache[key]["created_at"])
            analysis_cache.pop(oldest, None)
        analysis_cache[analysis_cache_key(raw_url)] = {"created_at": now, "media": media}


def get_cached_analysis(raw_url: str) -> dict[str, Any] | None:
    key = analysis_cache_key(raw_url)
    with analysis_lock:
        cached = analysis_cache.get(key)
        if not cached or time.time() - cached["created_at"] > ANALYSIS_CACHE_SECONDS:
            analysis_cache.pop(key, None)
            return None
        return cached["media"]


def get_media_analysis(raw_url: str) -> dict[str, Any]:
    """Reuse recent metadata and share concurrent lookups of the same link."""
    key = analysis_cache_key(raw_url)
    with analysis_lock:
        cached = analysis_cache.get(key)
        if cached and time.time() - cached["created_at"] <= ANALYSIS_CACHE_SECONDS:
            return cached["media"]
        pending = analysis_pending.get(key)
        owner = pending is None
        if owner:
            if len(analysis_pending) >= 4:
                raise RuntimeError("Hay varios enlaces analizándose. Espera un momento e inténtalo otra vez.")
            pending = Future()
            analysis_pending[key] = pending
    if not owner:
        return pending.result(timeout=85)
    started = time.monotonic()
    try:
        media = analyze_media(raw_url)
        cache_analysis(raw_url, media)
        pending.set_result(media)
        logger.info("Análisis %s completado en %.2f s", platform_name(raw_url), time.monotonic() - started)
        return media
    except BaseException as exc:
        pending.set_exception(exc)
        raise
    finally:
        with analysis_lock:
            analysis_pending.pop(key, None)


def check_cancelled(job_id: str) -> None:
    with jobs_lock:
        job = jobs.get(job_id)
        cancel_event = job.get("cancel_event") if job else None
    if cancel_event and cancel_event.is_set():
        raise InterruptedError("Descarga cancelada por el usuario.")


def stop_subprocess(process: subprocess.Popen[Any]) -> None:
    if process.poll() is None:
        process.terminate()
        try:
            process.communicate(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()
            process.communicate()


def install_cancellable_ytdlp_processes() -> None:
    global ffmpeg_patch_installed
    if ffmpeg_patch_installed:
        return
    with ffmpeg_patch_lock:
        if ffmpeg_patch_installed:
            return
        from yt_dlp.utils import Popen as YtPopen  # type: ignore

        original_run = YtPopen.run.__func__

        def cancellation_aware_run(cls: Any, *args: Any, timeout: float | None = None, input: Any = None, **kwargs: Any) -> tuple[Any, Any, int]:
            job_id = active_job_context.get()
            if not job_id or input is not None:
                return original_run(cls, *args, timeout=timeout, input=input, **kwargs)
            with cls(*args, **kwargs) as process:
                started = time.monotonic()
                text_mode = bool(getattr(process, "_Popen__text_mode", False))
                stdout: Any = "" if text_mode else b""
                stderr: Any = "" if text_mode else b""
                while True:
                    try:
                        if timeout is not None:
                            remaining = timeout - (time.monotonic() - started)
                            if remaining <= 0:
                                raise subprocess.TimeoutExpired(args[0] if args else "ffmpeg", timeout, output=stdout, stderr=stderr)
                            wait_for = min(.25, remaining)
                        else:
                            wait_for = .25
                        stdout, stderr = process.communicate(timeout=wait_for)
                        break
                    except subprocess.TimeoutExpired as exc:
                        stdout, stderr = exc.output or stdout, exc.stderr or stderr
                        try:
                            check_cancelled(job_id)
                        except InterruptedError:
                            stop_subprocess(process)
                            raise
                        if timeout is not None and time.monotonic() - started >= timeout:
                            stop_subprocess(process)
                            raise subprocess.TimeoutExpired(args[0] if args else "ffmpeg", timeout, output=stdout, stderr=stderr) from exc
                return stdout or ("" if text_mode else b""), stderr or ("" if text_mode else b""), process.returncode

        YtPopen.run = classmethod(cancellation_aware_run)
        ffmpeg_patch_installed = True


def run_cancellable(command: list[str], job_id: str, **kwargs: Any) -> subprocess.CompletedProcess[Any]:
    timeout = kwargs.pop("timeout", None)
    check = kwargs.pop("check", False)
    if kwargs.pop("capture_output", False):
        if kwargs.get("stdout") is not None or kwargs.get("stderr") is not None:
            raise ValueError("capture_output no puede combinarse con stdout o stderr.")
        kwargs["stdout"] = subprocess.PIPE
        kwargs["stderr"] = subprocess.PIPE
    process = subprocess.Popen(command, **kwargs)
    started = time.monotonic()
    stdout: Any = "" if kwargs.get("text") else b""
    stderr: Any = "" if kwargs.get("text") else b""
    while True:
        try:
            check_cancelled(job_id)
            if timeout is not None:
                remaining = timeout - (time.monotonic() - started)
                if remaining <= 0:
                    raise subprocess.TimeoutExpired(command, timeout, output=stdout, stderr=stderr)
                wait_for = min(.25, remaining)
            else:
                wait_for = .25
            stdout, stderr = process.communicate(timeout=wait_for)
            break
        except InterruptedError:
            stop_subprocess(process)
            raise
        except subprocess.TimeoutExpired as exc:
            stdout, stderr = exc.output or stdout, exc.stderr or stderr
            try:
                check_cancelled(job_id)
            except InterruptedError:
                stop_subprocess(process)
                raise
            if timeout is not None and time.monotonic() - started >= timeout:
                process.kill()
                process.communicate()
                raise
    completed = subprocess.CompletedProcess(command, process.returncode, stdout, stderr)
    if check and completed.returncode:
        raise subprocess.CalledProcessError(completed.returncode, command, output=stdout, stderr=stderr)
    return completed


def cancel_job(job_id: str) -> tuple[bool, str]:
    with jobs_lock:
        job = jobs.get(job_id)
        if not job:
            return False, "Descarga no encontrada."
        if job.get("status") not in {"queued", "running"}:
            return False, "Esta descarga ya terminó."
        cancel_event = job.get("cancel_event")
        if cancel_event:
            cancel_event.set()
        future = job.get("future")
        was_queued = job.get("status") == "queued" and future is not None and future.cancel()
        if was_queued:
            job.update({"status": "cancelled", "stage": "Cancelada", "error": "Se quitó de la cola.", "cancel_requested": True})
            snapshot = dict(job)
        else:
            job.update({"stage": "Cancelando", "cancel_requested": True})
            snapshot = None
    if snapshot:
        remember_job(snapshot)
    return True, "Descarga cancelada." if was_queued else "Se cancelará al terminar la etapa actual."


def submit_job(
    job_id: str,
    raw_url: str,
    mode: str,
    quality: str,
    resume: bool = False,
    audio_language: str = "",
) -> None:
    future = executor.submit(download_job, job_id, raw_url, mode, quality, resume, audio_language)
    with jobs_lock:
        if job_id in jobs:
            jobs[job_id]["future"] = future


def safe_url(raw_url: str) -> tuple[bool, str]:
    if not isinstance(raw_url, str) or not raw_url.strip():
        return False, "Pega un enlace para comenzar."
    raw_url = raw_url.strip()
    if len(raw_url) > MAX_URL_LENGTH:
        return False, "El enlace es demasiado largo."
    try:
        parsed = urlparse(raw_url)
    except ValueError:
        return False, "El enlace no es válido."
    host = (parsed.hostname or "").lower().rstrip(".")
    if parsed.scheme.lower() != "https":
        return False, "Usa un enlace HTTPS de YouTube, Instagram o X."
    try:
        has_port = parsed.port is not None
    except ValueError:
        return False, "El puerto del enlace no es válido."
    if parsed.username or parsed.password or has_port:
        return False, "El enlace no puede incluir credenciales ni puertos."
    if host not in ALLOWED_HOSTS:
        return False, "Por seguridad, solo se aceptan enlaces de YouTube, Instagram o X."
    if not parsed.path or parsed.path == "/":
        return False, "El enlace no parece apuntar a un video."
    if host in TWITTER_HOSTS and not TWITTER_STATUS_PATH.fullmatch(parsed.path):
        return False, "Pega el enlace de una publicación de X que contenga un video."
    return True, raw_url


def find_ffmpeg() -> str | None:
    """Return the bundled ffmpeg executable when imageio-ffmpeg is installed."""
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return shutil.which("ffmpeg")


def pot_plugin_version() -> str | None:
    global initialized_plugin_version
    with plugin_init_lock:
        if initialized_plugin_version:
            return initialized_plugin_version
        try:
            # This app uses only its bundled providers. Auto-discovery reloads
            # decorated modules and is unreliable inside the frozen executable.
            # Frozen builds may need explicit imports for bundled-only modules.
            importlib.import_module("yt_dlp_plugins.extractor.getpot_bgutil_http")
            importlib.import_module("yt_dlp_plugins.extractor.getpot_bgutil_script")
            from yt_dlp.globals import all_plugins_loaded
            all_plugins_loaded.value = True
            base = importlib.import_module("yt_dlp_plugins.extractor.getpot_bgutil")
            initialized_plugin_version = str(getattr(base, "__version__", None) or "instalado")
            return initialized_plugin_version
        except Exception as exc:
            logger.warning("No se pudo cargar el complemento de YouTube: %s", safe_log_message(str(exc)))
            return None


def pot_ping(base_url: str) -> bool:
    try:
        with urlopen(f"{base_url}/ping", timeout=1.5) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return response.status == 200 and str(payload.get("version") or "").startswith("1.")
    except Exception:
        return False


def stop_pot_provider() -> None:
    global pot_process, pot_url
    with pot_lock:
        process = pot_process
        pot_process = None
        pot_url = None
    if process and process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()


def ensure_pot_provider() -> str | None:
    global pot_process, pot_url
    if pot_url and pot_process and pot_process.poll() is None and pot_ping(pot_url):
        return pot_url
    with pot_lock:
        if pot_url and pot_process and pot_process.poll() is None and pot_ping(pot_url):
            return pot_url
        main_script = POT_SERVER_DIR / "build" / "main.js"
        if not BUNDLED_NODE.is_file() or not main_script.is_file() or not pot_plugin_version():
            return None
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            probe.bind((HOST, 0))
            port = int(probe.getsockname()[1])
        base_url = f"http://{HOST}:{port}"
        environment = os.environ.copy()
        environment["MEDIA_SPRINTER_PARENT_PID"] = str(os.getpid())
        try:
            process = subprocess.Popen(
                [str(BUNDLED_NODE), str(main_script), "--port", str(port)],
                cwd=str(POT_SERVER_DIR),
                env=environment,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=NO_WINDOW,
            )
        except OSError:
            return None
        for _ in range(40):
            if process.poll() is not None:
                break
            if pot_ping(base_url):
                pot_process = process
                pot_url = base_url
                return base_url
            time.sleep(0.25)
        if process.poll() is None:
            process.terminate()
        return None


def node_info() -> dict[str, Any]:
    node = str(BUNDLED_NODE) if BUNDLED_NODE.is_file() else shutil.which("node")
    if not node:
        return {"path": None, "version": None, "major": None}
    try:
        result = subprocess.run(
            [node, "--version"],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
            creationflags=NO_WINDOW,
        )
    except (OSError, subprocess.TimeoutExpired):
        return {"path": node, "version": None, "major": None}
    raw_version = result.stdout.strip()
    match = re.search(r"v?(\d+)(?:\.(\d+))?(?:\.(\d+))?", raw_version)
    if not match:
        return {"path": node, "version": raw_version or None, "major": None}
    return {"path": node, "version": raw_version, "major": int(match.group(1))}


def ejs_version() -> str | None:
    try:
        return package_version("yt-dlp-ejs")
    except PackageNotFoundError:
        return None


def curl_cffi_version() -> str | None:
    try:
        return package_version("curl-cffi")
    except PackageNotFoundError:
        return None


def find_defender() -> str | None:
    candidates = [
        Path(os.environ.get("ProgramFiles", "C:\\Program Files")) / "Windows Defender" / "MpCmdRun.exe",
        Path(os.environ.get("ProgramW6432", "C:\\Program Files")) / "Windows Defender" / "MpCmdRun.exe",
        Path(os.environ.get("ProgramFiles", "C:\\Program Files")) / "Microsoft Defender" / "MpCmdRun.exe",
    ]
    return next((str(path) for path in candidates if path.exists()), None)


def dependency_status() -> dict[str, Any]:
    node = node_info()
    ejs = ejs_version()
    impersonation = curl_cffi_version()
    provider = pot_plugin_version()
    provider_ready = bool(provider and ensure_pot_provider())
    status: dict[str, Any] = {
        "ready": True,
        "yt_dlp": None,
        "ffmpeg": None,
        "defender": bool(find_defender()),
        "node": node.get("version"),
        "ejs": ejs,
        "curl_cffi": impersonation,
        "pot_provider": provider,
        "pot_ready": provider_ready,
        "instagram_ready": bool(impersonation),
        "youtube_ready": bool(ejs and node.get("path") and node.get("major", 0) >= 22 and provider_ready),
    }
    try:
        import yt_dlp  # type: ignore

        status["yt_dlp"] = getattr(yt_dlp, "__version__", None) or getattr(getattr(yt_dlp, "version", None), "__version__", "instalado")
    except Exception:
        status["yt_dlp"] = None
        status["ready"] = False
    if not impersonation:
        status["ready"] = False
    ffmpeg = find_ffmpeg()
    if ffmpeg:
        status["ffmpeg"] = ffmpeg
    else:
        status["ready"] = False
    return status


def update_job(job_id: str, **updates: Any) -> None:
    with jobs_lock:
        if job_id in jobs:
            jobs[job_id].update(updates)


def public_job(job: dict[str, Any]) -> dict[str, Any]:
    keys = (
        "id",
        "status",
        "stage",
        "progress",
        "downloaded_bytes",
        "total_bytes",
        "speed",
        "eta",
        "title",
        "filename",
        "extension",
        "quality",
        "audio_language",
        "audio_language_label",
        "mode",
        "platform",
        "error",
        "download_url",
        "saved_to",
        "sha256",
        "security",
        "created_at",
        "size_estimate",
        "cancel_requested",
    )
    return {key: job.get(key) for key in keys}


def progress_hook(job_id: str, payload: dict[str, Any]) -> None:
    check_cancelled(job_id)
    status = payload.get("status")
    filename = Path(str(payload.get("filename") or "video")).name
    with jobs_lock:
        job = jobs.get(job_id)
        if not job:
            return
        parts = job.setdefault("progress_parts", {})
        part = parts.setdefault(filename, {"downloaded": 0, "total": None, "finished": False})
    if status == "downloading":
        total = payload.get("total_bytes") or payload.get("total_bytes_estimate")
        downloaded = payload.get("downloaded_bytes", 0)
        with jobs_lock:
            job = jobs.get(job_id)
            if not job:
                return
            part = job.setdefault("progress_parts", {}).setdefault(filename, {})
            part.update({"downloaded": int(downloaded or 0), "total": int(total) if total else None, "finished": False})
            known_parts = [entry for entry in job["progress_parts"].values() if entry.get("total")]
            total_bytes = sum(entry["total"] for entry in known_parts)
            downloaded_bytes = sum(min(entry.get("downloaded", 0), entry["total"]) for entry in known_parts)
            candidate_progress = round(downloaded_bytes * 95 / total_bytes) if total_bytes else None
            previous_progress = job.get("progress")
            progress = max(int(previous_progress or 0), min(95, candidate_progress)) if candidate_progress is not None else None
        state = "Descargando audio y video" if len(parts) > 1 else "Descargando"
        update_job(
            job_id,
            stage=state,
            progress=progress,
            downloaded_bytes=downloaded_bytes,
            total_bytes=total_bytes or None,
            speed=payload.get("speed"),
            eta=payload.get("eta"),
        )
    elif status == "finished":
        with jobs_lock:
            job = jobs.get(job_id)
            if job:
                job.setdefault("progress_parts", {}).setdefault(filename, {})["finished"] = True
        update_job(job_id, stage="Procesando", speed=None, eta=None)


def postprocessor_hook(job_id: str, payload: dict[str, Any]) -> None:
    check_cancelled(job_id)
    status = payload.get("status")
    name = str(payload.get("postprocessor") or "").lower()
    if status == "started":
        stage = "Convirtiendo a MP3" if "extractaudio" in name else "Uniendo audio y video"
        update_job(job_id, stage=stage, progress=None, speed=None, eta=None)
    elif status == "finished":
        update_job(job_id, stage="Validando archivo", progress=None)


def locate_result(job_dir: Path, requested: str) -> Path:
    files = [
        path
        for path in job_dir.iterdir()
        if path.is_file() and not path.name.endswith((".part", ".ytdl", ".tmp"))
    ]
    if not files:
        raise RuntimeError("No se encontró el archivo descargado.")
    files.sort(key=lambda path: path.stat().st_mtime, reverse=True)
    result = files[0]
    if result.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise RuntimeError("El formato recibido no está permitido.")
    if result.stat().st_size <= 0 or result.stat().st_size > MAX_FILE_SIZE:
        raise RuntimeError("El archivo supera el límite permitido o está vacío.")
    return result


def move_to_downloads(path: Path, downloads_dir: Path, job_id: str) -> Path:
    downloads_dir.mkdir(parents=True, exist_ok=True)
    counter = 1
    while True:
        name = path.name if counter == 1 else f"{path.stem} ({counter}){path.suffix}"
        destination = downloads_dir / name
        try:
            file_descriptor = os.open(destination, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o666)
            break
        except FileExistsError:
            counter += 1
    try:
        with os.fdopen(file_descriptor, "wb") as target, path.open("rb") as source:
            while True:
                check_cancelled(job_id)
                chunk = source.read(1024 * 1024)
                if not chunk:
                    break
                target.write(chunk)
            target.flush()
            os.fsync(target.fileno())
        shutil.copystat(path, destination)
        path.unlink()
        return destination
    except Exception:
        destination.unlink(missing_ok=True)
        raise


def sha256_file(path: Path, job_id: str | None = None) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        while True:
            if job_id:
                check_cancelled(job_id)
            chunk = file.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def validate_media(path: Path, ffmpeg: str, job_id: str) -> None:
    """Validate the complete container quickly, then decode a short sample."""
    try:
        structure = run_cancellable(
            [
                ffmpeg,
                "-nostdin",
                "-hide_banner",
                "-v",
                "error",
                "-i",
                str(path),
                "-map",
                "0",
                "-c",
                "copy",
                "-f",
                "null",
                "-",
            ],
            job_id,
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
            creationflags=NO_WINDOW,
        )
        sample = run_cancellable(
            [
                ffmpeg,
                "-nostdin",
                "-hide_banner",
                "-v",
                "error",
                "-i",
                str(path),
                "-map",
                "0:v:0?",
                "-map",
                "0:a:0?",
                "-t",
                "3",
                "-f",
                "null",
                "-",
            ],
            job_id,
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
            creationflags=NO_WINDOW,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError("No se pudo validar el archivo multimedia.") from exc
    if structure.returncode != 0 or sample.returncode != 0:
        raise RuntimeError("El archivo multimedia no pasó la validación.")


def scan_with_defender(path: Path, job_id: str) -> str:
    scanner = find_defender()
    if not scanner:
        return "no-disponible"
    try:
        result = run_cancellable(
            [scanner, "-Scan", "-ScanType", "3", "-File", str(path)],
            job_id,
            capture_output=True,
            text=True,
            timeout=180,
            check=False,
            creationflags=NO_WINDOW,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError("El escaneo de seguridad no pudo completarse.") from exc
    if result.returncode != 0:
        raise RuntimeError("El escaneo de seguridad detectó un problema o fue bloqueado.")
    return "limpio"


def platform_name(raw_url: str) -> str:
    host = (urlparse(raw_url).hostname or "").lower().rstrip(".")
    if host in YOUTUBE_HOSTS:
        return "YouTube"
    return "X" if host in TWITTER_HOSTS else "Instagram"


def extractor_options(raw_url: str, *, for_analysis: bool = False) -> dict[str, Any]:
    # Initialize once before any YoutubeDL instance can run plugin discovery.
    pot_plugin_version()
    options: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "playlistend": 1,
        "ignoreconfig": True,
        "retries": 3,
        "fragment_retries": 3,
        "socket_timeout": 25,
        "max_filesize": MAX_FILE_SIZE,
    }
    host = (urlparse(raw_url).hostname or "").lower().rstrip(".")
    if host in YOUTUBE_HOSTS:
        node = node_info()
        if not ejs_version() or node.get("major", 0) < 22:
            raise RuntimeError("No se pudo iniciar la protección de acceso de YouTube. Cierra y vuelve a abrir la app.")
        options["js_runtimes"] = {"node": {"path": node["path"]}}
        options["extractor_args"] = {
            "youtube": {"player_client": ["mweb"]},
        }
        if for_analysis:
            # Listing dimensions does not need signed media access. Download jobs
            # always re-extract with the provider below; never reuse these URLs.
            options["extractor_args"]["youtube"].update({"fetch_pot": ["never"], "formats": ["missing_pot"]})
            options["check_formats"] = False
        else:
            provider_url = ensure_pot_provider()
            if not provider_url:
                raise RuntimeError("No se pudo iniciar la protección de acceso de YouTube. Cierra y vuelve a abrir la app.")
            options["extractor_args"]["youtubepot-bgutilhttp"] = {"base_url": [provider_url]}
    elif host not in TWITTER_HOSTS and not curl_cffi_version():
        raise RuntimeError("Falta el componente de compatibilidad con Instagram. Reinstala o actualiza la app.")
    return options


def primary_media_info(info: dict[str, Any]) -> dict[str, Any]:
    if info.get("_type") != "playlist":
        return info
    entries = info.get("entries") or []
    for entry in entries:
        if isinstance(entry, dict) and entry.get("formats"):
            return entry
    raise RuntimeError("El enlace no contiene un video descargable.")


def available_video_qualities(info: dict[str, Any]) -> list[dict[str, str]]:
    formats = [item for item in (info.get("formats") or []) if isinstance(item, dict)]
    resolutions: set[tuple[int, int]] = set()
    for media_format in formats:
        if not isinstance(media_format, dict) or media_format.get("vcodec") == "none":
            continue
        try:
            width = int(media_format.get("width") or 0)
            height = int(media_format.get("height") or 0)
        except (TypeError, ValueError):
            continue
        if 32 <= width <= 8192 and 32 <= height <= 8192:
            resolutions.add((width, height))
    if not any(media_format.get("vcodec") != "none" for media_format in formats):
        raise RuntimeError("El enlace no contiene un video descargable.")
    ordered = sorted(resolutions, key=lambda size: (size[0] * size[1], size[0], size[1]), reverse=True)
    qualities = []
    for value, size in [("best", None), *[(f"{width}x{height}", (width, height)) for width, height in ordered[:10]]]:
        estimate, approximate = estimate_video_size(info, size)
        qualities.append({
            "value": value,
            "label": "Mejor disponible" if size is None else f"{size[0]} × {size[1]}",
            "size_estimate": estimate,
            "size_is_estimate": approximate,
        })
    return qualities


_AUDIO_LANGUAGE_NAMES = {
    "af": "Afrikáans", "am": "Amhárico", "ar": "Árabe", "az": "Azerí", "bg": "Búlgaro",
    "bn": "Bengalí", "ca": "Catalán", "cs": "Checo", "da": "Danés", "de": "Alemán",
    "el": "Griego", "en": "Inglés", "es": "Español", "es-419": "Español (Latinoamérica)",
    "es-es": "Español (España)", "eu": "Euskera", "fa": "Persa", "fi": "Finés", "fil": "Filipino",
    "fr": "Francés", "gl": "Gallego", "gu": "Guyaratí", "he": "Hebreo", "hi": "Hindi",
    "hr": "Croata", "hu": "Húngaro", "id": "Indonesio", "it": "Italiano", "ja": "Japonés",
    "kn": "Canarés", "ko": "Coreano", "ml": "Malayalam", "mn": "Mongol", "mr": "Maratí",
    "ms": "Malayo", "nb": "Noruego", "ne": "Nepalí", "nl": "Neerlandés", "or": "Odia",
    "pa": "Punyabí", "pl": "Polaco", "pt": "Portugués", "pt-br": "Portugués (Brasil)",
    "pt-pt": "Portugués (Portugal)", "ro": "Rumano", "ru": "Ruso", "si": "Cingalés",
    "sk": "Eslovaco", "sl": "Esloveno", "sr": "Serbio", "sv": "Sueco", "sw": "Suajili",
    "ta": "Tamil", "te": "Telugu", "th": "Tailandés", "tr": "Turco", "uk": "Ucraniano",
    "ur": "Urdu", "vi": "Vietnamita", "zh": "Chino", "zh-cn": "Chino simplificado",
    "zh-hans": "Chino simplificado", "zh-hant": "Chino tradicional", "zh-tw": "Chino tradicional",
}


def audio_language_label(language: str) -> str:
    code = language.strip()
    if code.lower() in _AUDIO_LANGUAGE_NAMES:
        return _AUDIO_LANGUAGE_NAMES[code.lower()]
    pieces = code.split("-", 1)
    base = _AUDIO_LANGUAGE_NAMES.get(pieces[0].lower(), pieces[0])
    region = pieces[1].upper() if len(pieces) == 2 and len(pieces[1]) == 2 else (pieces[1] if len(pieces) == 2 else "")
    return f"{base} ({region})" if region else base


def available_audio_languages(info: dict[str, Any]) -> list[dict[str, str]]:
    """Return the distinct, selectable languages on YouTube audio formats."""
    languages = {
        str(media_format.get("language") or "").strip()
        for media_format in (info.get("formats") or [])
        if isinstance(media_format, dict)
        and media_format.get("acodec") not in (None, "none")
        and AUDIO_LANGUAGE_PATTERN.fullmatch(str(media_format.get("language") or "").strip())
    }
    return [{"value": code, "label": audio_language_label(code)} for code in sorted(languages, key=str.casefold)]


def format_size_label(size: int | None, approximate: bool) -> str | None:
    if not size or size <= 0:
        return None
    amount = float(size)
    unit = "B"
    for next_unit in ("KB", "MB", "GB"):
        if amount < 1024:
            break
        amount /= 1024
        unit = next_unit
    prefix = "≈ " if approximate else ""
    digits = 1 if amount < 10 and unit in {"MB", "GB"} else 0
    return f"{prefix}{amount:.{digits}f} {unit}"


def format_size_value(media_format: dict[str, Any]) -> tuple[int | None, bool]:
    exact = media_format.get("filesize")
    if isinstance(exact, (int, float)) and exact > 0:
        return int(exact), False
    estimate = media_format.get("filesize_approx")
    if isinstance(estimate, (int, float)) and estimate > 0:
        return int(estimate), True
    return None, False


def metric_number(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def estimate_video_size(info: dict[str, Any], size: tuple[int, int] | None) -> tuple[int | None, bool]:
    formats = [item for item in (info.get("formats") or []) if isinstance(item, dict)]
    video_formats = [item for item in formats if item.get("vcodec") not in (None, "none")]
    if size:
        video_formats = [item for item in video_formats if (item.get("width"), item.get("height")) == size]
    video_formats.sort(key=lambda item: (
        metric_number(item.get("fps")),
        metric_number(item.get("tbr") or item.get("vbr")),
        metric_number(item.get("height")),
    ), reverse=True)
    audio_formats = [item for item in formats if item.get("acodec") not in (None, "none")]
    audio_formats.sort(key=lambda item: metric_number(item.get("abr") or item.get("tbr")), reverse=True)
    if not video_formats:
        return None, False
    video_size, video_approx = format_size_value(video_formats[0])
    selected_video = video_formats[0]
    if selected_video.get("acodec") not in (None, "none"):
        return video_size, video_approx
    audio_size, audio_approx = format_size_value(audio_formats[0]) if audio_formats else (None, False)
    if video_size is None or audio_size is None:
        return None, False
    return video_size + audio_size, video_approx or audio_approx


def has_audio(info: dict[str, Any]) -> bool:
    if info.get("acodec") not in (None, "none"):
        return True
    return any(
        isinstance(media_format, dict) and media_format.get("acodec") not in (None, "none")
        for media_format in (info.get("formats") or [])
    )


def audio_format_for_language(language: str) -> str | None:
    if not language:
        return None
    if not AUDIO_LANGUAGE_PATTERN.fullmatch(language):
        return None
    return f"bestaudio[language={language}]"


def video_format_for_quality(quality: str, audio_language: str = "") -> str | None:
    if audio_language and not AUDIO_LANGUAGE_PATTERN.fullmatch(audio_language):
        return None
    language_filter = f"[language={audio_language}]" if audio_language else ""
    if quality == "best":
        return f"bv+ba{language_filter}/b{language_filter}" if audio_language else "bv*+ba/b"
    match = VIDEO_QUALITY_PATTERN.fullmatch(quality)
    if not match:
        return None
    width = int(match.group("width"))
    height = int(match.group("height"))
    if not (32 <= width <= 8192 and 32 <= height <= 8192):
        return None
    resolution = f"[width={width}][height={height}]"
    if audio_language:
        return f"bv{resolution}+ba{language_filter}/b{resolution}{language_filter}"
    return f"bv*{resolution}+ba/b{resolution}/bv*{resolution}"


def user_facing_error(exc: Exception, raw_url: str, failed_stage: str | None = None) -> str:
    if isinstance(exc, TimeoutError):
        return "La plataforma tardó demasiado en responder. Espera un momento y vuelve a analizar el enlace."
    message = re.sub(r"\s+", " ", str(exc).strip())
    lowered = message.lower()
    stage = (failed_stage or "").lower()
    if isinstance(exc, InterruptedError) or "cancelada por el usuario" in lowered:
        return "Descarga cancelada. Se eliminaron los archivos temporales de esta tarea."
    if platform_name(raw_url) == "Instagram" and any(
        marker in lowered
        for marker in ("empty media response", "login required", "log in", "rate-limit", "registered users")
    ):
        return (
            "Instagram no permitió acceder a este video sin iniciar sesión. "
            "Comprueba que sea público y que abra en una ventana privada del navegador; después inténtalo otra vez."
        )
    if platform_name(raw_url) == "X" and any(
        marker in lowered for marker in ("no video could be found", "no video in", "tweet not found", "tweet unavailable")
    ):
        return "No se encontró un video accesible en esa publicación de X. Comprueba que sea pública y contenga un video."
    if "winerror 10013" in lowered or "permissionerror" in lowered:
        return "Windows o el firewall está bloqueando la conexión de Media Sprinter. Permite que la app acceda a internet y vuelve a intentarlo."
    if "http error 403" in lowered or "http error 429" in lowered:
        return f"{platform_name(raw_url)} rechazó temporalmente la transferencia. Espera un momento e inténtalo otra vez."
    extraction_markers = ("no video could be found", "no video in", "requested format is not available", "video unavailable")
    if platform_name(raw_url) == "YouTube" and stage.startswith(("descargando", "actualizando formatos", "renovando enlace")) and any(
        marker in lowered for marker in extraction_markers
    ):
        return (
            "El análisis encontró el video, pero YouTube no entregó la pista o calidad a la descarga. "
            "Se reintentó; vuelve a analizar y elige otra vez el idioma y la calidad. Si continúa, puede ser un bloqueo temporal."
        )
    if any(marker in lowered for marker in ("timed out", "timeout", "connection reset", "connection aborted", "name or service not known", "urlopen error")):
        return "La conexión se interrumpió. Comprueba tu internet e inténtalo de nuevo."
    if "unable to download api page" in lowered:
        return "YouTube no respondió al preparar la descarga. Espera un momento y vuelve a intentarlo."
    if any(marker in lowered for marker in ("no video could be found", "no video in", "requested format is not available", "video unavailable", "tweet not found", "tweet unavailable")):
        return "No se encontró un video público y accesible en ese enlace. Comprueba que la publicación siga disponible y contenga un video."
    if "conversion" in stage or "mp3" in stage or "uniendo" in stage:
        return "Falló el procesamiento del video. Inténtalo otra vez; el archivo original incompleto no se guardó."
    if "validando" in stage or "verificando" in stage:
        return "El archivo descargado no superó la validación multimedia y no se guardó."
    if "guardando" in stage or "carpeta" in stage:
        return "No se pudo guardar el archivo. Revisa la carpeta de destino, los permisos y el espacio disponible."
    if stage.startswith("analizando"):
        return "No se pudo obtener la información del enlace. Comprueba que sea público y vuelve a intentarlo."
    if stage.startswith("descargando") or stage.startswith("renovando"):
        return "La transferencia se interrumpió. Revisa tu conexión y vuelve a intentarlo."
    message = re.sub(r"^ERROR:\s*(?:\[[^]]+\]\s*)?(?:[^:]+:\s*)?", "", message, flags=re.IGNORECASE)
    return message[:500] or "No se pudo completar la operación."


def analyze_media(raw_url: str) -> dict[str, Any]:
    started = time.monotonic()
    try:
        import yt_dlp  # type: ignore
    except Exception as exc:
        raise RuntimeError("Falta yt-dlp. Ejecuta primero install.ps1.") from exc
    options = extractor_options(raw_url, for_analysis=True)
    prepared = time.monotonic()
    # Metadata is interactive: keep download retry budgets out of this lookup.
    options.update({"skip_download": True, "socket_timeout": 12, "extractor_retries": 1, "retries": 1})
    try:
        with yt_dlp.YoutubeDL(options) as downloader:
            extracted = downloader.extract_info(raw_url, download=False)
        logger.info("Análisis %s: preparación %.2f s, consulta %.2f s", platform_name(raw_url),
                    prepared - started, time.monotonic() - prepared)
        info = primary_media_info(extracted)
        title = re.sub(r"\s+", " ", str(info.get("title") or "Video encontrado")).strip()[:180]
        duration = info.get("duration")
        audio_available = has_audio(info)
        audio_qualities = []
        if audio_available:
            for bitrate, label in ((320, "alta"), (192, "media"), (128, "ligera")):
                estimate = int(float(duration) * bitrate * 1000 / 8) if isinstance(duration, (int, float)) and duration > 0 else None
                audio_qualities.append({
                    "value": str(bitrate),
                    "label": f"{bitrate} kbps · {label}" + (f" · {format_size_label(estimate, True)}" if estimate else ""),
                    "size_estimate": estimate,
                    "size_is_estimate": True,
                })
        video_qualities = available_video_qualities(info)
        for option in video_qualities:
            formatted = format_size_label(option.get("size_estimate"), bool(option.get("size_is_estimate")))
            if formatted:
                option["label"] += f" · {formatted}"
        return {
            "title": title,
            "platform": platform_name(raw_url),
            "duration": duration,
            "thumbnail": info.get("thumbnail"),
            "has_audio": audio_available,
            "audio_languages": available_audio_languages(info) if platform_name(raw_url) == "YouTube" else [],
            "video_qualities": video_qualities,
            "audio_qualities": audio_qualities,
        }
    except Exception as exc:
        raise RuntimeError(user_facing_error(exc, raw_url)) from exc


def error_is_expired_link(exc: Exception) -> bool:
    message = str(exc).lower()
    return any(marker in message for marker in (
        "http error 403", "http error 410", "url has expired", "url expired", "token expired", "signature expired",
    ))


def should_retry_download_extraction(raw_url: str, exc: Exception) -> bool:
    """Retry one fresh YouTube extraction when the transient player response is incomplete."""
    if error_is_expired_link(exc):
        return True
    if platform_name(raw_url) != "YouTube":
        return False
    message = str(exc).lower()
    return any(marker in message for marker in (
        "http error 429", "http error 500", "http error 502", "http error 503", "http error 504",
        "unable to download api page", "winerror 10013", "no video could be found",
        "requested format is not available", "video unavailable",
    ))


def download_job(
    job_id: str,
    raw_url: str,
    mode: str,
    quality: str,
    resume: bool = False,
    audio_language: str = "",
) -> None:
    job_dir = DOWNLOAD_DIR / job_id
    ffmpeg = find_ffmpeg()
    failed_stage = "Analizando enlace"
    context_token = active_job_context.set(job_id)
    try:
        check_cancelled(job_id)
        if not ffmpeg:
            raise RuntimeError("Falta FFmpeg. Ejecuta primero install.ps1.")
        try:
            import yt_dlp  # type: ignore
        except Exception as exc:
            raise RuntimeError("Falta yt-dlp. Ejecuta primero install.ps1.") from exc
        install_cancellable_ytdlp_processes()

        with jobs_lock:
            job = jobs.get(job_id, {})
            destination = Path(job.get("destination") or get_downloads_dir())
            expected_size = job.get("size_estimate")
        update_job(job_id, status="running", stage="Revisando carpeta", progress=jobs.get(job_id, {}).get("progress"))
        try:
            destination = validate_destination(str(destination), expected_size)
        except (OSError, ValueError) as exc:
            raise RuntimeError(str(exc)) from exc
        required_temp_space = max(MIN_FREE_SPACE, int(expected_size * 1.15) if expected_size else 0)
        temp_free_space = shutil.disk_usage(DOWNLOAD_DIR).free
        if temp_free_space < required_temp_space:
            raise RuntimeError(
                "No hay espacio suficiente en el disco temporal de la app. "
                f"Se requieren {format_size_label(required_temp_space, False)} y hay {format_size_label(temp_free_space, False)} libres."
            )
        update_job(job_id, destination=str(destination), stage="Analizando enlace")
        failed_stage = "Descargando"
        job_dir.mkdir(parents=True, exist_ok=True)
        temp_dir = TEMP_DIR / job_id
        temp_dir.mkdir(parents=True, exist_ok=True)
        output_template = str(job_dir / "%(title)s [%(id)s].%(ext)s")
        options = extractor_options(raw_url)
        options.update({
            "restrictfilenames": True,
            "windowsfilenames": True,
            "trim_file_name": 160,
            "continuedl": True,
            "outtmpl": output_template,
            "paths": {"home": str(job_dir), "temp": str(temp_dir)},
            "ffmpeg_location": ffmpeg,
            "progress_hooks": [lambda payload: progress_hook(job_id, payload)],
            "postprocessor_hooks": [lambda payload: postprocessor_hook(job_id, payload)],
        })
        if mode == "mp3":
            audio_format = audio_format_for_language(audio_language)
            if audio_language and not audio_format:
                raise RuntimeError("El idioma de audio seleccionado no es válido.")
            options.update({
                "format": audio_format or "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": quality,
                }],
            })
        else:
            video_format = video_format_for_quality(quality, audio_language)
            if not video_format:
                raise RuntimeError("La calidad seleccionada no es válida.")
            options.update({"format": video_format, "merge_output_format": "mp4"})

        title = "Tu descarga"
        previous_error: Exception | None = None
        update_job(job_id, stage="Descargando", progress=None, speed=None, eta=None)
        for attempt in range(2):
            check_cancelled(job_id)
            if attempt:
                retry_stage = "Renovando enlace multimedia" if previous_error and error_is_expired_link(previous_error) else "Actualizando formatos de YouTube"
                update_job(job_id, stage=retry_stage, speed=None, eta=None)
            try:
                with yt_dlp.YoutubeDL(options) as downloader:
                    info = downloader.extract_info(raw_url, download=True)
                    title = str(info.get("title") or title)
                break
            except InterruptedError:
                raise
            except Exception as exc:
                check_cancelled(job_id)
                if attempt == 0 and should_retry_download_extraction(raw_url, exc):
                    retry_stage = "renovar el enlace caducado" if error_is_expired_link(exc) else "actualizar formatos"
                    logger.info("Se reintentará %s para la tarea %s (%s)", retry_stage, job_id, platform_name(raw_url))
                    previous_error = exc
                    continue
                raise

        check_cancelled(job_id)
        update_job(job_id, stage="Procesando", speed=None, eta=None)
        failed_stage = "Validando archivo"
        result = locate_result(job_dir, mode)
        update_job(job_id, stage="Validando archivo", progress=None)
        validate_media(result, ffmpeg, job_id)
        check_cancelled(job_id)
        update_job(job_id, stage="Verificando seguridad", progress=None)
        checksum = sha256_file(result, job_id)
        update_job(job_id, stage="Analizando con Microsoft Defender", progress=None)
        security = scan_with_defender(result, job_id)
        if security == "no-disponible":
            security_label = "Validado; Defender no está disponible en este equipo."
        else:
            security_label = "Microsoft Defender no detectó amenazas."
        check_cancelled(job_id)
        failed_stage = "Guardando archivo"
        update_job(job_id, stage="Guardando archivo", progress=None)
        saved = move_to_downloads(result, destination, job_id)
        update_job(
            job_id,
            status="done",
            stage="Completado",
            progress=100,
            title=title,
            filename=saved.name,
            extension=saved.suffix.lower().lstrip("."),
            quality=quality,
            download_url=f"/api/files/{job_id}",
            saved_to=str(saved),
            saved_path=str(saved),
            sha256=checksum,
            security=security_label,
            error=None,
        )
        logger.info("Tarea %s completada en %s (%s)", job_id, platform_name(raw_url), mode)
        with jobs_lock:
            finished_job = dict(jobs[job_id])
        remember_job(finished_job)
        shutil.rmtree(job_dir, ignore_errors=True)
        shutil.rmtree(temp_dir, ignore_errors=True)
    except InterruptedError as exc:
        update_job(job_id, status="cancelled", stage="Cancelada", error="Descarga cancelada. Se eliminaron los archivos temporales de esta tarea.", speed=None, eta=None)
        shutil.rmtree(job_dir, ignore_errors=True)
        shutil.rmtree(TEMP_DIR / job_id, ignore_errors=True)
        logger.info("Tarea %s cancelada (%s)", job_id, platform_name(raw_url))
        with jobs_lock:
            finished_job = dict(jobs[job_id])
        remember_job(finished_job)
    except Exception as exc:  # noqa: BLE001 - user-facing downloader boundary
        with jobs_lock:
            stage_now = str(jobs.get(job_id, {}).get("stage") or failed_stage)
        actual_failed_stage = stage_now if stage_now != "Cancelando" else failed_stage
        safe_message = user_facing_error(exc, raw_url, actual_failed_stage)
        update_job(job_id, status="error", stage="Error en " + actual_failed_stage.lower(), failed_stage=actual_failed_stage, error=safe_message, speed=None, eta=None)
        diagnostic_error = safe_log_message(f"{type(exc).__name__}: {exc}")
        logger.warning("Tarea %s falló durante %s (%s): %s | detalle: %s", job_id, actual_failed_stage,
                       platform_name(raw_url), safe_log_message(safe_message), diagnostic_error)
        with jobs_lock:
            finished_job = dict(jobs[job_id])
        remember_job(finished_job)
    finally:
        active_job_context.reset(context_token)


class RequestHandler(BaseHTTPRequestHandler):
    server_version = "MediaSprinter/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        # Keep the terminal useful without logging URLs that may contain tokens.
        print(f"[{self.log_date_time_string()}] {self.command} {self.path.split('?')[0]}")

    def send_json(self, value: Any, status: int = HTTPStatus.OK) -> None:
        payload = json_bytes(value)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        route = parsed.path
        if route == "/api/health":
            self.send_json({"ok": True, "dependencies": dependency_status()})
            return
        if route == "/api/jobs":
            with jobs_lock:
                all_jobs = [dict(job) for job in jobs.values()]
            active = [job for job in all_jobs if job.get("status") in {"queued", "running"}]
            recent = sorted(
                (job for job in all_jobs if job.get("status") not in {"queued", "running"}),
                key=lambda item: int(item.get("created_at") or 0),
                reverse=True,
            )[:8]
            combined = sorted(active + recent, key=lambda item: int(item.get("created_at") or 0), reverse=True)
            self.send_json({"jobs": [public_job(job) for job in combined]})
            return
        if route == "/api/settings":
            destination = get_downloads_dir()
            self.send_json({"downloads_dir": str(destination), "free_bytes": shutil.disk_usage(destination).free if destination.exists() else None})
            return
        if route == "/api/history":
            items = read_history()
            for item in items:
                path = Path(str(item.get("path") or ""))
                item["file_exists"] = path.is_file() if item.get("path") else False
            self.send_json({"items": items})
            return
        if route == "/api/diagnostics":
            try:
                lines = LOG_FILE.read_text(encoding="utf-8", errors="replace").splitlines()[-80:]
            except OSError:
                lines = ["Todavía no hay registros locales."]
            sanitized = [safe_log_message(line) for line in lines]
            home = str(Path.home())
            if home:
                sanitized = [line.replace(home, "~") for line in sanitized]
            diagnostic = "Media Sprinter · diagnóstico local\n" + "\n".join(sanitized)
            self.send_json({"diagnostic": diagnostic})
            return
        if route.startswith("/api/jobs/"):
            parts = route.strip("/").split("/")
            if len(parts) != 3 or not re.fullmatch(r"[0-9a-f]{32}", parts[2]):
                self.send_json({"error": "Descarga no encontrada."}, HTTPStatus.NOT_FOUND)
                return
            job_id = parts[2]
            with jobs_lock:
                job = jobs.get(job_id)
            if not job:
                self.send_json({"error": "Descarga no encontrada."}, HTTPStatus.NOT_FOUND)
                return
            self.send_json(public_job(job))
            return
        if route.startswith("/api/files/"):
            self.serve_result(route.rsplit("/", 1)[-1])
            return
        self.serve_static(route)

    def do_POST(self) -> None:  # noqa: N802
        route = urlparse(self.path).path
        if not self.same_origin_required():
            return
        supported_actions = {"/api/analyze", "/api/download", "/api/settings/destination"}
        job_action = re.fullmatch(r"/api/jobs/([0-9a-f]{32})/(cancel|retry)", route)
        open_action = re.fullmatch(r"/api/(open-file|open-folder)/([0-9a-f]{32})", route)
        if route not in supported_actions and not job_action and not open_action:
            self.send_json({"error": "Ruta no encontrada."}, HTTPStatus.NOT_FOUND)
            return
        if job_action:
            job_id, action = job_action.groups()
            if action == "cancel":
                accepted, message = cancel_job(job_id)
                with jobs_lock:
                    job = jobs.get(job_id)
                    snapshot = dict(job) if job else None
                if not accepted:
                    self.send_json({"error": message}, HTTPStatus.CONFLICT if snapshot else HTTPStatus.NOT_FOUND)
                    return
                self.send_json({"message": message, "job": public_job(snapshot or {})})
                return
            with jobs_lock:
                job = jobs.get(job_id)
                if not job or job.get("status") != "error":
                    self.send_json({"error": "Solo se pueden reintentar descargas fallidas."}, HTTPStatus.CONFLICT)
                    return
                active = [entry for entry in jobs.values() if entry.get("status") in {"queued", "running"}]
                queued = sum(1 for entry in active if entry.get("status") == "queued")
                if queued >= MAX_QUEUED_JOBS:
                    self.send_json({"error": "La cola está llena. Espera a que termine una descarga."}, HTTPStatus.TOO_MANY_REQUESTS)
                    return
                if int(job.get("attempt_count") or 1) >= 4:
                    self.send_json({"error": "Esta descarga ya alcanzó el límite de reintentos."}, HTTPStatus.CONFLICT)
                    return
                job.update({
                    "status": "queued", "stage": "En cola", "error": None, "cancel_requested": False,
                    "cancel_event": threading.Event(), "attempt_count": int(job.get("attempt_count") or 1) + 1,
                })
                raw_url, mode, quality = job["raw_url"], job["mode"], job["quality"]
                audio_language = job.get("audio_language") or ""
                future = executor.submit(download_job, job_id, raw_url, mode, quality, True, audio_language)
                job["future"] = future
                response_job = dict(job)
            self.send_json({"job": public_job(response_job)}, HTTPStatus.ACCEPTED)
            return
        if open_action:
            action, job_id = open_action.groups()
            self.open_job_location(job_id, reveal_file=action == "open-file")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 12_000:
                raise ValueError
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(body, dict):
                raise ValueError
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"error": "Solicitud inválida."}, HTTPStatus.BAD_REQUEST)
            return

        if route == "/api/settings/destination":
            try:
                destination = save_destination(body.get("path"))
            except (OSError, ValueError) as exc:
                self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
                return
            self.send_json({"downloads_dir": str(destination)})
            return

        valid, value = safe_url(body.get("url"))
        if not valid:
            self.send_json({"error": value}, HTTPStatus.BAD_REQUEST)
            return
        if route == "/api/analyze":
            try:
                media = get_media_analysis(value)
                self.send_json({"media": media})
            except Exception as exc:  # noqa: BLE001 - request boundary
                self.send_json({"error": user_facing_error(exc, value)}, HTTPStatus.UNPROCESSABLE_ENTITY)
            return
        mode = body.get("mode", "mp4")
        if mode not in {"mp4", "mp3"}:
            self.send_json({"error": "Elige MP4 o MP3."}, HTTPStatus.BAD_REQUEST)
            return
        quality = str(body.get("quality") or ("320" if mode == "mp3" else "best"))
        audio_language = body.get("audio_language") or ""
        if not isinstance(audio_language, str) or len(audio_language) > 32 or (audio_language and not AUDIO_LANGUAGE_PATTERN.fullmatch(audio_language)):
            self.send_json({"error": "El idioma de audio seleccionado no es válido."}, HTTPStatus.BAD_REQUEST)
            return
        valid_quality = quality in AUDIO_QUALITIES if mode == "mp3" else video_format_for_quality(quality, audio_language) is not None
        if not valid_quality:
            self.send_json({"error": "La calidad seleccionada no es válida."}, HTTPStatus.BAD_REQUEST)
            return
        try:
            media = get_media_analysis(value)
        except Exception as exc:  # noqa: BLE001 - request boundary
            self.send_json({"error": user_facing_error(exc, value)}, HTTPStatus.UNPROCESSABLE_ENTITY)
            return
        available = media.get("audio_qualities" if mode == "mp3" else "video_qualities") or []
        chosen = next((option for option in available if option.get("value") == quality), None)
        if mode == "mp3" and not media.get("has_audio"):
            self.send_json({"error": "Este video no tiene una pista de audio disponible."}, HTTPStatus.UNPROCESSABLE_ENTITY)
            return
        if not chosen:
            self.send_json({"error": "Esa calidad no está disponible en el enlace. Analízalo de nuevo y elige otra."}, HTTPStatus.BAD_REQUEST)
            return
        available_languages = media.get("audio_languages") or []
        selected_language = next((item for item in available_languages if item.get("value") == audio_language), None)
        if audio_language and (platform_name(value) != "YouTube" or not selected_language):
            self.send_json({"error": "Ese idioma no está disponible en este video. Analízalo de nuevo y elige otra pista."}, HTTPStatus.BAD_REQUEST)
            return
        language_label = selected_language.get("label") if selected_language else ""
        try:
            requested_size = int(chosen.get("size_estimate") or 0)
        except (TypeError, ValueError):
            requested_size = 0
        if requested_size < 0 or requested_size > MAX_FILE_SIZE:
            requested_size = 0
        try:
            destination = validate_destination(str(get_downloads_dir()), requested_size or None)
        except (OSError, ValueError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.INSUFFICIENT_STORAGE)
            return
        with jobs_lock:
            duplicate = next((job for job in jobs.values() if job.get("status") in {"queued", "running"}
                              and job.get("raw_url") == value and job.get("mode") == mode
                              and job.get("quality") == quality and (job.get("audio_language") or "") == audio_language), None)
            if duplicate:
                self.send_json({"job": public_job(duplicate), "duplicate": True}, HTTPStatus.OK)
                return
            active_jobs = [job for job in jobs.values() if job.get("status") in {"queued", "running"}]
            queued_count = sum(1 for job in active_jobs if job.get("status") == "queued")
            if queued_count >= MAX_QUEUED_JOBS:
                self.send_json({"error": "La cola está llena. Espera a que termine una descarga."}, HTTPStatus.TOO_MANY_REQUESTS)
                return
            job_id = uuid.uuid4().hex
            jobs[job_id] = {
                "id": job_id,
                "status": "queued",
                "stage": "En cola",
                "progress": 0,
                "downloaded_bytes": 0,
                "total_bytes": None,
                "speed": None,
                "eta": None,
                "title": None,
                "filename": None,
                "extension": None,
                "quality": quality,
                "audio_language": audio_language,
                "audio_language_label": language_label,
                "mode": mode,
                "platform": platform_name(value),
                "raw_url": value,
                "destination": str(destination),
                "size_estimate": requested_size or None,
                "attempt_count": 1,
                "cancel_event": threading.Event(),
                "cancel_requested": False,
                "progress_parts": {},
                "error": None,
                "download_url": None,
                "saved_to": None,
                "saved_path": None,
                "sha256": None,
                "security": None,
                "created_at": int(time.time()),
            }
            future = executor.submit(download_job, job_id, value, mode, quality, False, audio_language)
            jobs[job_id]["future"] = future
            response_job = dict(jobs[job_id])
            ahead = sum(1 for job in active_jobs if job.get("status") == "queued")
        self.send_json({"job": public_job(response_job), "queued_ahead": ahead}, HTTPStatus.ACCEPTED)

    def do_DELETE(self) -> None:  # noqa: N802
        if not self.same_origin_required():
            return
        match = re.fullmatch(r"/api/history/([0-9a-f]{32})", urlparse(self.path).path)
        if not match:
            self.send_json({"error": "Ruta no encontrada."}, HTTPStatus.NOT_FOUND)
            return
        item_id = match.group(1)
        with history_lock:
            items = [item for item in read_history() if item.get("id") != item_id]
            write_history(items)
        self.send_json({"ok": True, "message": "Se quitó del historial. El archivo guardado no se borró."})

    def serve_static(self, route: str) -> None:
        relative = "index.html" if route in {"", "/"} else unquote(route.lstrip("/"))
        candidate = (STATIC_DIR / relative).resolve()
        if STATIC_DIR.resolve() not in candidate.parents and candidate != STATIC_DIR.resolve():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if not candidate.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content = candidate.read_bytes()
        content_type = mimetypes.guess_type(candidate.name)[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8" if content_type.startswith("text/") else content_type)
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Content-Security-Policy", "default-src 'self'; img-src 'self' https: data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(content)

    def serve_result(self, job_id: str) -> None:
        if not re.fullmatch(r"[0-9a-f]{32}", job_id):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        with jobs_lock:
            job = jobs.get(job_id)
        if not job or job.get("status") != "done":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        expected = Path(str(job.get("saved_path") or "")).resolve()
        destination = Path(str(job.get("destination") or "")).resolve()
        if expected.parent != destination or expected.suffix.lower() not in {".mp3", ".mp4"} or not expected.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = mimetypes.guess_type(expected.name)[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(expected.stat().st_size))
        self.send_header("Content-Disposition", f'attachment; filename="{expected.name.replace(chr(34), "")}"')
        self.send_header("X-Content-SHA256", str(job.get("sha256")))
        self.end_headers()
        with expected.open("rb") as file:
            shutil.copyfileobj(file, self.wfile, length=1024 * 1024)

    def verify_local_origin(self) -> bool:
        try:
            host = urlparse(f"http://{self.headers.get('Host', '')}")
            origin = urlparse(self.headers.get("Origin", ""))
            return (
                host.hostname in {HOST, "localhost"}
                and (host.port or 80) == PORT
                and origin.scheme == "http"
                and origin.hostname in {HOST, "localhost"}
                and (origin.port or 80) == PORT
            )
        except ValueError:
            return False

    def same_origin_required(self) -> bool:
        if self.verify_local_origin():
            return True
        self.send_json({"error": "Solicitud local no autorizada."}, HTTPStatus.FORBIDDEN)
        return False

    def open_job_location(self, job_id: str, reveal_file: bool) -> None:
        with jobs_lock:
            job = jobs.get(job_id)
        if not job:
            with history_lock:
                job = next((item for item in read_history() if item.get("id") == job_id and item.get("status") == "done"), None)
        if not job or job.get("status") != "done" or not (job.get("saved_path") or job.get("path")):
            self.send_json({"error": "El archivo ya no está disponible."}, HTTPStatus.NOT_FOUND)
            return
        path = Path(str(job.get("saved_path") or job.get("path"))).resolve()
        expected_parent = Path(str(job.get("destination") or "")).resolve()
        if path.parent != expected_parent or not path.is_file():
            self.send_json({"error": "El archivo ya no está en la carpeta de destino."}, HTTPStatus.NOT_FOUND)
            return
        try:
            if reveal_file:
                if os.name == "nt":
                    os.startfile(path)  # type: ignore[attr-defined]
                else:
                    webbrowser.open(path.as_uri())
            elif os.name == "nt":
                os.startfile(path.parent)  # type: ignore[attr-defined]
            else:
                webbrowser.open(path.parent.as_uri())
        except OSError:
            self.send_json({"error": "No se pudo abrir la ubicación del archivo."}, HTTPStatus.INTERNAL_SERVER_ERROR)
            return
        self.send_json({"ok": True})


class LocalThreadingHTTPServer(ThreadingHTTPServer):
    # Prevent Windows SO_REUSEADDR from allowing two app processes to share a port.
    allow_reuse_address = False


def browser_enabled() -> bool:
    return "--no-browser" not in sys.argv and os.environ.get("MEDIA_SPRINTER_NO_BROWSER") != "1"


def open_existing_app(base_url: str) -> None:
    if browser_enabled():
        webbrowser.open(base_url)


def main() -> None:
    global PORT
    requested_port = PORT
    existing_url = active_instance_url(requested_port)
    if existing_url:
        open_existing_app(existing_url)
        return

    if not acquire_single_instance(requested_port):
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            existing_url = active_instance_url(requested_port)
            if existing_url:
                open_existing_app(existing_url)
                return
            time.sleep(0.25)
        logger.warning("La instancia existente no respondió; no se inició un segundo servidor.")
        return

    # Close the race with an older build that does not know about the named mutex.
    existing_url = active_instance_url(requested_port)
    if existing_url:
        open_existing_app(existing_url)
        return

    try:
        server = LocalThreadingHTTPServer((HOST, PORT), RequestHandler)
    except OSError as exc:
        if exc.errno not in {getattr(socket, "EADDRINUSE", 10048), 10048, 98}:
            raise
        existing_url = active_instance_url(requested_port)
        if existing_url:
            open_existing_app(existing_url)
            return
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            probe.bind((HOST, 0))
            PORT = int(probe.getsockname()[1])
        server = LocalThreadingHTTPServer((HOST, PORT), RequestHandler)

    write_instance_record(PORT)
    threading.Thread(target=ensure_pot_provider, name="youtube-access", daemon=True).start()
    print(f"Media Sprinter listo en http://{HOST}:{PORT}")
    print("Descarga únicamente contenido que tengas derecho a guardar.")
    if browser_enabled():
        threading.Timer(0.7, lambda: webbrowser.open(f"http://{HOST}:{PORT}")).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nCerrando Media Sprinter...")
    finally:
        server.server_close()
        executor.shutdown(wait=False, cancel_futures=True)
        stop_pot_provider()
        clear_instance_record()


atexit.register(stop_pot_provider)
atexit.register(clear_instance_record)
atexit.register(release_single_instance)


if __name__ == "__main__":
    main()


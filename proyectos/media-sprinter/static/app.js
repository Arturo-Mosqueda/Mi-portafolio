const form = document.querySelector("#downloadForm");
const urlInput = document.querySelector("#urlInput");
const pasteButton = document.querySelector("#pasteButton");
const downloadButton = document.querySelector("#downloadButton");
const buttonLabel = downloadButton.querySelector(".button-label");
const formHint = document.querySelector("#formHint");
const analysisAction = document.querySelector("#analysisAction");
const qualityField = document.querySelector("#qualityField");
const qualitySelect = document.querySelector("#qualitySelect");
const choiceRow = document.querySelector(".choice-row");
const languageField = document.querySelector("#languageField");
const audioLanguageSelect = document.querySelector("#audioLanguageSelect");
const audioNote = document.querySelector("#audioNote");
const mediaPreview = document.querySelector("#mediaPreview");
const mediaThumbnail = document.querySelector("#mediaThumbnail");
const mediaFallback = document.querySelector("#mediaFallback");
const mediaPlatform = document.querySelector("#mediaPlatform");
const mediaTitle = document.querySelector("#mediaTitle");
const mediaDuration = document.querySelector("#mediaDuration");
const destinationLabel = document.querySelector("#destinationLabel");
const destinationInput = document.querySelector("#destinationInput");
const settingsDetails = document.querySelector("#settingsDetails");
const settingsHint = document.querySelector("#settingsHint");
const queueSection = document.querySelector("#queueSection");
const queueList = document.querySelector("#queueList");
const queueCount = document.querySelector("#queueCount");
const downloadView = document.querySelector("#downloadView");
const historyView = document.querySelector("#historyView");
const historyList = document.querySelector("#historyList");
const healthBadge = document.querySelector("#healthBadge");
const healthText = document.querySelector("#healthText");

const supportedHosts = new Set([
  "youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be",
  "instagram.com", "www.instagram.com", "m.instagram.com", "instagr.am", "www.instagr.am",
  "x.com", "www.x.com", "m.x.com", "mobile.x.com",
  "twitter.com", "www.twitter.com", "m.twitter.com", "mobile.twitter.com",
]);
const twitterHosts = new Set([
  "x.com", "www.x.com", "m.x.com", "mobile.x.com",
  "twitter.com", "www.twitter.com", "m.twitter.com", "mobile.twitter.com",
]);
const twitterStatusPath = /^\/(?:(?:i\/web|[^/]+)\/status|statuses)\/\d+(?:\/(?:video|photo)\/\d+)?\/?$/i;
const queueRows = new Map();

let analyzeTimer = null;
let analyzeController = null;
let analyzedUrl = "";
let analysisData = null;
let isAnalyzing = false;
let isSubmitting = false;
let jobsTimer = null;
let analysisSequence = 0;

async function request(url, options = {}) {
  const response = await fetch(url, { cache: "no-store", ...options });
  const data = await response.json().catch(function badJson() { return {}; });
  if (!response.ok) throw new Error(data.error || "No se pudo completar la solicitud.");
  return data;
}

function postJson(url, value = {}) {
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
}

function selectedMode() {
  const selected = document.querySelector('input[name="mode"]:checked');
  return selected ? selected.value : "mp4";
}

function validSupportedLink(rawValue) {
  try {
    const parsed = new URL(rawValue);
    const host = parsed.hostname.toLowerCase();
    return parsed.protocol === "https:"
      && !parsed.username && !parsed.password && !parsed.port
      && supportedHosts.has(host)
      && parsed.pathname !== "/"
      && (!twitterHosts.has(host) || twitterStatusPath.test(parsed.pathname));
  } catch {
    return false;
  }
}

function setHint(kind, text) {
  formHint.classList.toggle("is-error", kind === "error");
  formHint.classList.toggle("is-analyzing", kind === "analyzing");
  formHint.classList.toggle("is-success", kind === "success");
  formHint.textContent = text;
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let amount = bytes;
  let unit = 0;
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024;
    unit += 1;
  }
  const digits = unit >= 2 && amount < 10 ? 1 : 0;
  return amount.toFixed(digits) + " " + units[unit];
}

function formatEta(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "";
  if (value < 60) return Math.round(value) + " s restantes";
  return Math.floor(value / 60) + " min " + Math.round(value % 60) + " s restantes";
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "Duración no disponible";
  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function savedPreference(key, fallback) {
  try { return localStorage.getItem("media-sprinter-" + key) || fallback; }
  catch { return fallback; }
}

function rememberPreference(key, value) {
  try { localStorage.setItem("media-sprinter-" + key, value); }
  catch { /* The download flow does not depend on browser storage. */ }
}

function updateControls() {
  const matchesCurrentUrl = Boolean(analysisData && analyzedUrl === urlInput.value.trim());
  const audioChoice = document.querySelector('input[name="mode"][value="mp3"]');
  const audioSubtitle = audioChoice.nextElementSibling.querySelector("small");
  const audioAvailable = !matchesCurrentUrl || analysisData.has_audio !== false;
  audioSubtitle.textContent = matchesCurrentUrl && !audioAvailable ? "Sin pista de audio" : "MP3";
  audioChoice.disabled = isSubmitting || !audioAvailable;
  document.querySelectorAll('input[name="mode"]').forEach(function lockMode(input) {
    input.disabled = isSubmitting || (input.value === "mp3" && !audioAvailable);
  });
  qualitySelect.disabled = isSubmitting || isAnalyzing || !matchesCurrentUrl;
  audioLanguageSelect.disabled = isSubmitting || !matchesCurrentUrl || languageField.classList.contains("is-hidden");
  urlInput.disabled = isSubmitting;
  pasteButton.disabled = isSubmitting;
  downloadButton.disabled = isSubmitting || isAnalyzing || !matchesCurrentUrl || (selectedMode() === "mp3" && !audioAvailable);
  buttonLabel.textContent = isSubmitting ? "Añadiendo…" : "Descargar";
  audioNote.textContent = !audioAvailable
    ? "Este video no incluye una pista de audio disponible."
    : "El bitrate elegido cambia el tamaño del MP3; no mejora el audio original.";
  audioNote.classList.toggle("is-hidden", selectedMode() !== "mp3" && audioAvailable);
}

function renderQualityOptions() {
  const matchesCurrentUrl = Boolean(analysisData && analyzedUrl === urlInput.value.trim());
  qualityField.classList.toggle("is-waiting", !matchesCurrentUrl);
  qualityField.classList.toggle("is-ready", matchesCurrentUrl);
  let options = [];
  if (isAnalyzing) options = [{ value: "", label: "Buscando calidades…" }];
  else if (!matchesCurrentUrl) options = [{ value: "", label: "Pega un enlace primero" }];
  else options = selectedMode() === "mp3" ? analysisData.audio_qualities : analysisData.video_qualities;
  qualitySelect.replaceChildren();
  if (!Array.isArray(options) || !options.length) {
    options = [{ value: "", label: selectedMode() === "mp3" ? "Audio no disponible" : "Calidad no disponible" }];
  }
  options.forEach(function addQuality(entry) {
    const option = document.createElement("option");
    option.value = entry.value;
    option.textContent = entry.label;
    if (entry.value === savedPreference("quality-" + selectedMode(), "")) option.selected = true;
    qualitySelect.appendChild(option);
  });
  renderAudioLanguages(matchesCurrentUrl);
  updateControls();
}

function renderAudioLanguages(matchesCurrentUrl) {
  const languages = matchesCurrentUrl && analysisData.platform === "YouTube" && Array.isArray(analysisData.audio_languages)
    ? analysisData.audio_languages : [];
  const hasChoices = languages.length > 1;
  languageField.classList.toggle("is-hidden", !hasChoices);
  document.querySelector("#audioLanguageNote").classList.toggle("is-hidden", !hasChoices);
  choiceRow.classList.toggle("has-audio-languages", hasChoices);
  audioLanguageSelect.replaceChildren();
  const automatic = document.createElement("option");
  automatic.value = "";
  automatic.textContent = "Predeterminado";
  audioLanguageSelect.appendChild(automatic);
  languages.forEach(function addAudioLanguage(language) {
    const option = document.createElement("option");
    option.value = language.value;
    option.textContent = language.label;
    audioLanguageSelect.appendChild(option);
  });
  const preferred = savedPreference("audio-language", "");
  audioLanguageSelect.value = languages.some(language => language.value === preferred) ? preferred : "";
}

function setPreview(media) {
  mediaPreview.classList.remove("is-hidden");
  mediaPlatform.textContent = media.platform || "Video";
  mediaTitle.textContent = media.title || "Video encontrado";
  mediaDuration.textContent = formatDuration(media.duration);
  mediaFallback.textContent = (media.platform || "MS").slice(0, 2).toUpperCase();
  mediaThumbnail.hidden = true;
  mediaThumbnail.removeAttribute("src");
  try {
    const image = new URL(media.thumbnail || "");
    const allowed = image.protocol === "https:" && (
      image.hostname === "i.ytimg.com" || image.hostname.endsWith(".cdninstagram.com") || image.hostname === "pbs.twimg.com"
    );
    if (allowed) {
      mediaThumbnail.referrerPolicy = "no-referrer";
      mediaThumbnail.onload = function onThumbnailLoaded() { mediaThumbnail.hidden = false; mediaFallback.hidden = true; };
      mediaThumbnail.onerror = function onThumbnailError() { mediaFallback.hidden = false; };
      mediaThumbnail.src = image.href;
    }
  } catch { /* A title and platform are enough when no trusted thumbnail exists. */ }
}

function clearAnalysis(message) {
  analysisData = null;
  analyzedUrl = "";
  mediaPreview.classList.add("is-hidden");
  renderQualityOptions();
  if (message) setHint("neutral", message);
}

async function analyzeLink(rawValue) {
  const url = rawValue.trim();
  if (!validSupportedLink(url)) {
    clearAnalysis();
    setHint("error", "Enlace no válido. Usa una publicación de YouTube, Instagram o X.");
    return false;
  }
  if (analysisData && analyzedUrl === url) return true;
  if (analyzeController) analyzeController.abort();
  const controller = new AbortController();
  analyzeController = controller;
  const sequence = ++analysisSequence;
  analysisData = null;
  analyzedUrl = "";
  isAnalyzing = true;
  analysisAction.textContent = "Cancelar espera";
  analysisAction.classList.remove("is-hidden");
  const startedAt = performance.now();
  let timedOut = false;
  const slowTimer = window.setInterval(function showAnalysisWait() {
    if (sequence !== analysisSequence || controller.signal.aborted) return;
    const seconds = Math.floor((performance.now() - startedAt) / 1000);
    setHint("analyzing", `Esperando las calidades de la plataforma · ${seconds} s. Puedes cancelar o cambiar el enlace.`);
  }, 5000);
  const deadlineTimer = window.setTimeout(function analysisDeadline() {
    timedOut = true;
    controller.abort();
  }, 90000);
  renderQualityOptions();
  setHint("analyzing", "Analizando enlace y buscando sus calidades…");
  try {
    const data = await request("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    if (controller.signal.aborted || sequence !== analysisSequence || urlInput.value.trim() !== url) return false;
    if (!data.media || !Array.isArray(data.media.video_qualities) || !data.media.video_qualities.length) {
      throw new Error("La plataforma no devolvió calidades. Intenta analizar el enlace de nuevo.");
    }
    analysisData = data.media;
    analyzedUrl = url;
    setPreview(analysisData);
    const count = Math.max(0, Number(analysisData.video_qualities.length) - 1);
    setHint("success", `${analysisData.platform} · ${count} ${count === 1 ? "calidad" : "calidades"} disponibles`);
    renderQualityOptions();
    return true;
  } catch (error) {
    if (sequence === analysisSequence) {
      clearAnalysis();
      if (timedOut) setHint("error", "La plataforma tardó demasiado en responder. Puedes reintentar el análisis.");
      else if (error.name === "AbortError") setHint("neutral", "Análisis cancelado. Puedes reintentarlo cuando quieras.");
      else setHint("error", error.message);
    }
    return false;
  } finally {
    window.clearInterval(slowTimer);
    window.clearTimeout(deadlineTimer);
    if (analyzeController === controller) {
      analyzeController = null;
      isAnalyzing = false;
      analysisAction.textContent = "Reintentar análisis";
      analysisAction.classList.toggle("is-hidden", Boolean(analysisData && analyzedUrl === url));
      renderQualityOptions();
    }
  }
}

function scheduleAnalysis() {
  if (analyzeTimer) window.clearTimeout(analyzeTimer);
  if (analyzeController) analyzeController.abort();
  analyzeController = null;
  analysisSequence += 1;
  isAnalyzing = false;
  analysisAction.classList.add("is-hidden");
  const url = urlInput.value.trim();
  clearAnalysis();
  if (!url) {
    setHint("neutral", "Las calidades aparecerán después de pegar el enlace.");
    return;
  }
  if (!validSupportedLink(url)) {
    setHint("error", "Enlace no válido. Usa una publicación de YouTube, Instagram o X.");
    return;
  }
  setHint("neutral", "Enlace detectado. Preparando el análisis…");
  analyzeTimer = window.setTimeout(function startAnalysis() { analyzeTimer = null; analyzeLink(url); }, 250);
}

analysisAction.addEventListener("click", function controlAnalysis() {
  if (analyzeController) analyzeController.abort();
  else analyzeLink(urlInput.value);
});

function platformIcon(platform) {
  const values = { YouTube: "YT", Instagram: "IG", X: "X" };
  return values[platform] || "MS";
}

function createQueueRow(job) {
  const article = document.createElement("article");
  article.className = "queue-item";
  article.dataset.jobId = job.id;
  article.innerHTML = `
    <div class="queue-topline">
      <span class="platform-tag"></span>
      <span class="queue-stage"></span>
      <span class="queue-percent"></span>
    </div>
    <strong class="queue-title"></strong>
    <div class="queue-track" aria-hidden="true"><span></span></div>
    <div class="queue-meta"><span class="queue-bytes"></span><span class="queue-speed"></span></div>
    <p class="queue-error is-hidden"></p>
    <div class="queue-actions">
      <button class="queue-action cancel-action" type="button">Cancelar</button>
      <button class="queue-action retry-action is-hidden" type="button">Reintentar</button>
      <button class="queue-action open-file-action is-hidden" type="button">Abrir archivo</button>
      <button class="queue-action open-folder-action is-hidden" type="button">Abrir carpeta</button>
    </div>`;
  const buttons = [
    [".cancel-action", () => postJson(`/api/jobs/${job.id}/cancel`).then(refreshJobs).catch(showActionError)],
    [".retry-action", () => postJson(`/api/jobs/${job.id}/retry`).then(refreshJobs).catch(showActionError)],
    [".open-file-action", () => postJson(`/api/open-file/${job.id}`).catch(showActionError)],
    [".open-folder-action", () => postJson(`/api/open-folder/${job.id}`).catch(showActionError)],
  ];
  buttons.forEach(([selector, callback]) => article.querySelector(selector).addEventListener("click", callback));
  queueRows.set(job.id, article);
  return article;
}

function showActionError(error) {
  settingsHint.textContent = error.message;
  settingsHint.classList.add("is-error");
  settingsDetails.open = true;
}

function updateQueueRow(article, job) {
  const platform = article.querySelector(".platform-tag");
  platform.textContent = platformIcon(job.platform);
  platform.setAttribute("aria-label", job.platform || "Media");
  article.querySelector(".queue-stage").textContent = job.stage || "En cola";
  article.querySelector(".queue-title").textContent = [job.title || `${job.platform || "Video"} · ${String(job.mode || "mp4").toUpperCase()}`, job.audio_language_label].filter(Boolean).join(" · ");
  const percent = article.querySelector(".queue-percent");
  const track = article.querySelector(".queue-track");
  const hasProgress = job.progress !== null && job.progress !== undefined && job.progress !== "" && Number.isFinite(Number(job.progress));
  const progress = hasProgress ? Number(job.progress) : 0;
  track.classList.toggle("is-indeterminate", !hasProgress && ["queued", "running"].includes(job.status));
  track.querySelector("span").style.width = hasProgress ? `${Math.max(0, Math.min(100, progress))}%` : "0%";
  percent.textContent = hasProgress ? `${Math.round(progress)}%` : (job.status === "running" ? "···" : "");
  const downloaded = Number(job.downloaded_bytes || 0);
  const total = Number(job.total_bytes || 0);
  article.querySelector(".queue-bytes").textContent = downloaded
    ? (total ? `${formatBytes(downloaded)} de ${formatBytes(total)}` : `${formatBytes(downloaded)} descargados`)
    : (job.status === "queued" ? "En espera" : "");
  const speedParts = [];
  if (Number(job.speed) > 0) speedParts.push(`${formatBytes(job.speed)}/s`);
  if (job.eta !== null && job.eta !== undefined && Number.isFinite(Number(job.eta))) speedParts.push(formatEta(job.eta));
  article.querySelector(".queue-speed").textContent = speedParts.join(" · ");
  const error = article.querySelector(".queue-error");
  error.textContent = job.error || "";
  error.classList.toggle("is-hidden", !job.error);
  article.querySelector(".cancel-action").classList.toggle("is-hidden", !["queued", "running"].includes(job.status));
  article.querySelector(".retry-action").classList.toggle("is-hidden", job.status !== "error");
  article.querySelector(".open-file-action").classList.toggle("is-hidden", job.status !== "done");
  article.querySelector(".open-folder-action").classList.toggle("is-hidden", job.status !== "done");
  article.classList.toggle("is-complete", job.status === "done");
  article.classList.toggle("is-error", job.status === "error");
  article.classList.toggle("is-cancelled", job.status === "cancelled");
}

async function refreshJobs() {
  try {
    const data = await request("/api/jobs");
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    const known = new Set(jobs.map(job => job.id));
    for (const job of jobs) {
      const row = queueRows.get(job.id) || createQueueRow(job);
      updateQueueRow(row, job);
    }
    for (const [id, row] of queueRows) {
      if (!known.has(id)) {
        row.remove();
        queueRows.delete(id);
      }
    }
    const order = jobs.map(job => job.id).join(",");
    const currentOrder = [...queueList.children].map(row => row.dataset.jobId).join(",");
    if (order !== currentOrder) {
      const fragment = document.createDocumentFragment();
      jobs.forEach(job => fragment.appendChild(queueRows.get(job.id)));
      queueList.replaceChildren(fragment);
    }
    queueCount.textContent = String(jobs.filter(job => ["queued", "running"].includes(job.status)).length);
    queueSection.classList.toggle("is-hidden", jobs.length === 0);
    if (jobs.some(job => ["queued", "running"].includes(job.status))) {
      jobsTimer = window.setTimeout(refreshJobs, 800);
    } else {
      jobsTimer = null;
    }
  } catch {
    jobsTimer = window.setTimeout(refreshJobs, 3000);
  }
}

async function loadSettings() {
  try {
    const data = await request("/api/settings");
    destinationInput.value = data.downloads_dir;
    destinationLabel.textContent = data.downloads_dir;
  } catch {
    destinationInput.value = "D:\\Descargas";
  }
  const mode = savedPreference("mode", "mp4");
  const modeChoice = document.querySelector(`input[name="mode"][value="${mode}"]`);
  if (modeChoice) modeChoice.checked = true;
}

async function loadHistory() {
  try {
    const data = await request("/api/history");
    const items = Array.isArray(data.items) ? data.items : [];
    historyList.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<span aria-hidden=\"true\">—</span><strong>Aún no hay descargas</strong><p>Cuando termines una descarga, aparecerá aquí.</p>";
      historyList.appendChild(empty);
      return;
    }
    items.forEach(function addHistoryItem(item) {
      const row = document.createElement("article");
      row.className = "history-item";
      const info = document.createElement("div");
      info.className = "history-info";
      const tag = document.createElement("span");
      tag.className = "platform-tag";
      tag.textContent = platformIcon(item.platform);
      const title = document.createElement("strong");
      title.textContent = item.title || "Descarga";
      const meta = document.createElement("small");
      const when = item.finished_at ? new Date(item.finished_at * 1000).toLocaleString() : "Fecha desconocida";
      meta.textContent = [item.platform || "Video", String(item.mode || "mp4").toUpperCase(), item.audio_language_label, when].filter(Boolean).join(" · ");
      info.append(tag, title, meta);
      const status = document.createElement("span");
      status.className = `history-status ${item.status || "error"}`;
      status.textContent = item.status === "done" ? "Completado" : item.status === "cancelled" ? "Cancelado" : "Falló";
      const actions = document.createElement("div");
      actions.className = "history-actions";
      if (item.status === "done" && item.file_exists) {
        const openFile = document.createElement("button");
        openFile.className = "queue-action";
        openFile.type = "button";
        openFile.textContent = "Abrir archivo";
        openFile.addEventListener("click", () => postJson(`/api/open-file/${item.id}`).catch(showActionError));
        const openFolder = document.createElement("button");
        openFolder.className = "queue-action";
        openFolder.type = "button";
        openFolder.textContent = "Carpeta";
        openFolder.addEventListener("click", () => postJson(`/api/open-folder/${item.id}`).catch(showActionError));
        actions.append(openFile, openFolder);
      } else if (item.status !== "done") {
        const reason = document.createElement("small");
        reason.className = "history-error";
        reason.textContent = item.error || "La descarga no se completó.";
        actions.appendChild(reason);
      }
      const remove = document.createElement("button");
      remove.className = "queue-action remove-history";
      remove.type = "button";
      remove.textContent = "Quitar";
      remove.setAttribute("aria-label", `Quitar ${item.title || "descarga"} del historial; no borra el archivo`);
      remove.addEventListener("click", async function removeHistoryItem() {
        try {
          await request(`/api/history/${item.id}`, { method: "DELETE" });
          loadHistory();
        } catch (error) { showActionError(error); }
      });
      actions.appendChild(remove);
      row.append(info, status, actions);
      historyList.appendChild(row);
    });
  } catch (error) {
    historyList.textContent = error.message;
  }
}

function showView(view) {
  const isHistory = view === "history";
  historyView.classList.toggle("is-hidden", !isHistory);
  downloadView.classList.toggle("is-hidden", isHistory);
  document.querySelector("#tabHistory").classList.toggle("is-selected", isHistory);
  document.querySelector("#tabDownload").classList.toggle("is-selected", !isHistory);
  document.querySelector("#tabHistory").toggleAttribute("aria-current", isHistory);
  document.querySelector("#tabDownload").toggleAttribute("aria-current", !isHistory);
  if (isHistory) loadHistory();
}

async function checkHealth() {
  try {
    const data = await request("/api/health");
    const dependencies = data.dependencies || {};
    const ready = dependencies.ready && dependencies.youtube_ready && dependencies.instagram_ready;
    healthBadge.classList.toggle("is-ready", Boolean(ready));
    healthBadge.classList.toggle("is-error", !ready);
    healthText.textContent = ready ? "Listo para descargar" : "Revisa la instalación";
  } catch {
    healthBadge.classList.add("is-error");
    healthText.textContent = "Servidor no disponible";
  }
}

form.addEventListener("submit", async function submitDownload(event) {
  event.preventDefault();
  if (isSubmitting || isAnalyzing) return;
  if (analyzeTimer) { window.clearTimeout(analyzeTimer); analyzeTimer = null; }
  const url = urlInput.value.trim();
  if (!analysisData || analyzedUrl !== url) {
    if (!(await analyzeLink(url))) return;
  }
  if (!qualitySelect.value) {
    setHint("error", "Elige una calidad disponible antes de descargar.");
    qualitySelect.focus();
    return;
  }
  const selected = qualitySelect.selectedOptions[0];
  const selectedQuality = selected ? selected.value : "best";
  const optionData = [...(selectedMode() === "mp3" ? analysisData.audio_qualities : analysisData.video_qualities)]
    .find(option => option.value === selectedQuality);
  isSubmitting = true;
  updateControls();
  try {
    const data = await postJson("/api/download", {
      url,
      mode: selectedMode(),
      quality: selectedQuality,
      audio_language: audioLanguageSelect.value,
      size_estimate: optionData ? optionData.size_estimate : null,
      has_audio: analysisData.has_audio,
    });
    rememberPreference("mode", selectedMode());
    rememberPreference("quality-" + selectedMode(), selectedQuality);
    if (data.duplicate) setHint("neutral", "Esta misma descarga ya está en la cola.");
    else setHint("success", data.queued_ahead ? `Añadida a la cola · ${data.queued_ahead} delante` : "Descarga añadida a la cola.");
    if (!jobsTimer) refreshJobs();
    queueSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    setHint("error", error.message);
  } finally {
    isSubmitting = false;
    updateControls();
  }
});

pasteButton.addEventListener("click", async function pasteLink() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      urlInput.value = text.trim();
      urlInput.focus();
      scheduleAnalysis();
    }
  } catch {
    urlInput.focus();
    setHint("neutral", "Pega el enlace con Ctrl + V.");
  }
});

urlInput.addEventListener("input", scheduleAnalysis);
document.querySelectorAll('input[name="mode"]').forEach(function watchMode(input) {
  input.addEventListener("change", function changeMode() {
    rememberPreference("mode", selectedMode());
    renderQualityOptions();
  });
});
qualitySelect.addEventListener("change", () => rememberPreference("quality-" + selectedMode(), qualitySelect.value));
audioLanguageSelect.addEventListener("change", () => rememberPreference("audio-language", audioLanguageSelect.value));

document.querySelector("#tabDownload").addEventListener("click", () => showView("download"));
document.querySelector("#tabHistory").addEventListener("click", () => showView("history"));
document.querySelector("#editDestinationButton").addEventListener("click", function editDestination() {
  settingsDetails.open = true;
  settingsDetails.scrollIntoView({ behavior: "smooth", block: "nearest" });
  destinationInput.focus();
});
document.querySelector("#saveDestinationButton").addEventListener("click", async function saveDestination() {
  settingsHint.classList.remove("is-error", "is-success");
  try {
    const data = await postJson("/api/settings/destination", { path: destinationInput.value });
    destinationInput.value = data.downloads_dir;
    destinationLabel.textContent = data.downloads_dir;
    settingsHint.textContent = "Carpeta guardada. Las próximas descargas se guardarán aquí.";
    settingsHint.classList.add("is-success");
  } catch (error) {
    settingsHint.textContent = error.message;
    settingsHint.classList.add("is-error");
  }
});
document.querySelector("#copyDiagnosticsButton").addEventListener("click", async function copyDiagnostics() {
  try {
    const data = await request("/api/diagnostics");
    await navigator.clipboard.writeText(data.diagnostic);
    settingsHint.textContent = "Diagnóstico copiado. No contiene enlaces ni cookies.";
    settingsHint.classList.remove("is-error");
    settingsHint.classList.add("is-success");
  } catch {
    settingsHint.textContent = "No se pudo copiar. Comprueba los permisos del portapapeles.";
    settingsHint.classList.add("is-error");
  }
});

document.addEventListener("keydown", function keyboardShortcuts(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v" && document.activeElement === urlInput) {
    window.setTimeout(scheduleAnalysis, 0);
  }
});

const initialMode = savedPreference("mode", "mp4");
const initialChoice = document.querySelector(`input[name="mode"][value="${initialMode}"]`);
if (initialChoice) initialChoice.checked = true;
renderQualityOptions();
loadSettings();
checkHealth();
refreshJobs();


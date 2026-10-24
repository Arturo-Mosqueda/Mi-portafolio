$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCommand) {
    throw "No encontré Python. Instala Python 3.10 o superior y vuelve a ejecutar este script."
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $nodeVersion = (& $nodeCommand.Source --version).Trim()
    if ($nodeVersion -notmatch '^v(2[0-9]|[3-9]\d)\.') {
        Write-Warning "Encontré $nodeVersion. YouTube necesita Node.js 20 o superior; Instagram seguirá disponible."
    } elseif ($nodeVersion -match '^v2[0-1]\.') {
        Write-Warning "Encontré $nodeVersion. YouTube puede funcionar, pero yt-dlp recomienda Node.js 22 o superior."
    }
} else {
    Write-Warning "No encontré Node.js. Instagram seguirá disponible; instala Node.js 20+ para YouTube."
}

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "Creando entorno aislado .venv..."
    & python -m venv .venv
}

$venvPython = Join-Path $root ".venv\Scripts\python.exe"
Write-Host "Instalando paquetes fijados desde PyPI con verificación SHA-256..."
& $venvPython -m pip install --require-hashes --only-binary=:all: --index-url https://pypi.org/simple -r requirements.lock
& $venvPython -m pip check

$defenderCandidates = @(
    (Join-Path ${env:ProgramFiles} "Windows Defender\MpCmdRun.exe"),
    (Join-Path ${env:ProgramW6432} "Windows Defender\MpCmdRun.exe")
) | Where-Object { $_ -and (Test-Path $_) }

if ($defenderCandidates.Count -gt 0) {
    Write-Host "Escaneando dependencias instaladas con Microsoft Defender..."
    & $defenderCandidates[0] -Scan -ScanType 3 -File (Join-Path $root ".venv")
    if ($LASTEXITCODE -ne 0) {
        throw "Microsoft Defender no pudo confirmar que las dependencias estén limpias."
    }
} else {
    Write-Warning "Microsoft Defender no está disponible; se mantiene la validación SHA-256 y de medios de la app."
}

Write-Host ""
Write-Host "Instalación terminada. Ejecuta .\run.ps1 para abrir Media Sprinter."


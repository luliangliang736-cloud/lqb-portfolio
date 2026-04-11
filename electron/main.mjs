import { app, BrowserWindow, ipcMain, screen, session } from 'electron';
import { execFile } from 'node:child_process';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });
const COMPANION_WIDTH = 316;
const COMPANION_HEIGHT = 430;
const COMPANION_MARGIN = 20;
const SNAP_DELAY_MS = 180;
const EDGE_VISIBLE_WIDTH = 84;
const EDGE_TRIGGER_SIZE = 30;
const EDGE_VERTICAL_PADDING = 48;
const CURSOR_WATCH_INTERVAL_MS = 180;
const DESKTOP_DATA_DIR = path.join(app.getPath('appData'), 'LQBDesktop');
const DESKTOP_CACHE_DIR = path.join(app.getPath('temp'), 'LQBDesktopCache');
const DESKTOP_DEBUG_LOG = path.join(process.cwd(), 'desktop-companion-debug.log');
const execFileAsync = promisify(execFile);
const nanoApiKey = process.env.NANO_API_KEY || '';
const nanoModel = process.env.NANO_MODEL || 'gemini-2.5-flash-image';
const nanoBaseUrl = process.env.NANO_BASE_URL || 'https://api.nanobananaapi.dev/v1/images/generate';
const nanoEditUrl = process.env.NANO_EDIT_URL || 'https://api.nanobananaapi.dev/v1/images/edit';

function debugLog(message, extra = undefined) {
  const timestamp = new Date().toISOString();
  const detail = extra === undefined ? '' : ` ${JSON.stringify(extra)}`;
  const line = `[${timestamp}] ${message}${detail}\n`;

  try {
    fs.appendFileSync(DESKTOP_DEBUG_LOG, line);
  } catch (error) {
    console.error('debugLog write failed', error);
  }

  console.log(line.trimEnd());
}

function defaultDimensions(aspectRatio = '1:1') {
  const dimensions = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '9:16': { width: 768, height: 1344 },
    '4:3': { width: 1184, height: 864 },
    '3:4': { width: 864, height: 1184 },
  };

  return dimensions[aspectRatio] ?? dimensions['1:1'];
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildMockImage(prompt) {
  const safePrompt = escapeXml(prompt || '未提供提示词');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#16141f" />
          <stop offset="45%" stop-color="#34255f" />
          <stop offset="100%" stop-color="#143f59" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="42" fill="url(#bg)" />
      <rect x="64" y="64" width="896" height="896" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
      <text x="90" y="148" fill="#fff" font-size="42" font-family="Segoe UI, Arial, sans-serif" font-weight="700">LQB Desktop 生图预览</text>
      <text x="90" y="208" fill="rgba(255,255,255,0.72)" font-size="24" font-family="Segoe UI, Arial, sans-serif">当前 Nano 接口不可用，先返回本地预览图。</text>
      <foreignObject x="90" y="280" width="844" height="580">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-size:34px;line-height:1.55;font-family:Segoe UI, Arial, sans-serif;">
          ${safePrompt}
        </div>
      </foreignObject>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function runNanoImageGeneration({
  prompt,
  operation = 'text-to-image',
  aspectRatio = '1:1',
  model = nanoModel,
  sourceImage = '',
}) {
  const trimmedPrompt = typeof prompt === 'string' ? prompt.trim() : '';

  if (!trimmedPrompt) {
    return { ok: false, error: 'Prompt is required.' };
  }

  if (!nanoApiKey) {
    return {
      ok: true,
      mode: 'mock',
      prompt: trimmedPrompt,
      operation,
      model,
      note: '当前未配置 Nano API Key，先返回本地预览图。',
      imageUrl: buildMockImage(trimmedPrompt),
      ...defaultDimensions(aspectRatio),
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${nanoApiKey}`,
      'Content-Type': 'application/json',
    };

    const targetUrl = operation === 'image-to-image' ? nanoEditUrl : nanoBaseUrl;
    const body = targetUrl.includes('nanobananaapi.dev')
      ? {
          prompt: trimmedPrompt,
          num: 1,
          model,
          image_size: aspectRatio,
          ...(operation === 'image-to-image' ? { image: sourceImage } : {}),
        }
      : {
          model,
          messages: [{ role: 'user', content: trimmedPrompt }],
          modalities: ['image', 'text'],
          image_config: {
            aspect_ratio: aspectRatio,
            image_size: '1K',
          },
        };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const raw = await response.text();
    const data = raw ? JSON.parse(raw) : {};

    if (!response.ok) {
      return { ok: false, error: data?.error?.message || data?.message || `Nano request failed: ${response.status}` };
    }

    let imageUrl;
    let note = 'Nano Banana 已返回图像结果。';

    if (targetUrl.includes('nanobananaapi.dev')) {
      if (data?.code !== 0) {
        return { ok: false, error: data?.message || 'Nano Banana API returned an error.' };
      }

      imageUrl = Array.isArray(data?.data?.url) ? data.data.url[0] : data?.data?.url;
      note = data?.message === 'ok' ? 'Nano Banana 已完成生图。' : (data?.message || note);
    } else {
      const message = data?.choices?.[0]?.message;
      imageUrl = message?.images?.[0]?.image_url?.url || message?.images?.[0]?.imageUrl?.url;
      note = message?.content || note;
    }

    if (!imageUrl) {
      return { ok: false, error: 'Nano response missing image data.' };
    }

    debugLog('nano image success', { prompt: trimmedPrompt, model, operation });
    return {
      ok: true,
      mode: 'proxy',
      prompt: trimmedPrompt,
      operation,
      model,
      note,
      imageUrl,
      ...defaultDimensions(aspectRatio),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nano image request failed.';
    debugLog('nano image failed', { message });
    return {
      ok: true,
      mode: 'mock',
      prompt: trimmedPrompt,
      operation,
      model,
      note: `当前 Nano 接口暂不可用，先返回本地预览图。\n\n${message}`,
      imageUrl: buildMockImage(trimmedPrompt),
      ...defaultDimensions(aspectRatio),
    };
  }
}

app.setPath('userData', DESKTOP_DATA_DIR);
app.setPath('sessionData', path.join(DESKTOP_DATA_DIR, 'Session'));
app.commandLine.appendSwitch('disk-cache-dir', DESKTOP_CACHE_DIR);
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.disableHardwareAcceleration();

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  debugLog('single instance lock denied; quitting');
  app.quit();
}

let companionWindow = null;
let mainWindow = null;
let companionSnapTimer = null;
let companionCursorWatcher = null;
let companionEdge = 'right';
let companionDockState = 'expanded';
let companionIsAdjusting = false;
let companionHasBeenMoved = false;
let companionChatExpanded = false;
let companionCompactBounds = null;

function resolveRendererUrl(search = '') {
  const devServerUrl = process.env.ELECTRON_RENDERER_URL;

  if (devServerUrl) {
    return `${devServerUrl}${search}`;
  }

  const distFile = path.join(__dirname, '..', 'dist', 'index.html');
  return new URL(`file://${distFile}${search}`).toString();
}

function applyWindowContent(window, search = '') {
  const targetUrl = resolveRendererUrl(search);
  debugLog('loading window content', { targetUrl, search });
  window.loadURL(targetUrl);
}

function applyCompanionContent(window) {
  const companionFile = path.join(__dirname, 'desktop.html');
  debugLog('loading companion html', { companionFile });
  window.loadFile(companionFile);
}

async function runNativeDictation(timeoutSeconds = 8) {
  const safeTimeout = Math.min(Math.max(Number(timeoutSeconds) || 8, 3), 15);
  const dictationScript = `
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Add-Type -AssemblyName System.Speech
    $culture = [System.Globalization.CultureInfo]::GetCultureInfo('zh-CN')
    $engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)
    $engine.SetInputToDefaultAudioDevice()
    $engine.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
    $result = $engine.Recognize([TimeSpan]::FromSeconds(${safeTimeout}))
    if ($null -eq $result -or [string]::IsNullOrWhiteSpace($result.Text)) {
      Write-Output '__NO_SPEECH__'
    } else {
      Write-Output $result.Text
    }
    $engine.Dispose()
  `;

  try {
    const { stdout, stderr } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      dictationScript,
    ], {
      windowsHide: true,
      encoding: 'utf8',
      timeout: (safeTimeout + 4) * 1000,
      maxBuffer: 1024 * 1024,
    });

    const text = (stdout || '').trim();
    const err = (stderr || '').trim();

    if (err) {
      debugLog('native dictation stderr', { err });
    }

    if (!text || text === '__NO_SPEECH__') {
      return { ok: false, error: 'no-speech' };
    }

    debugLog('native dictation success', { text });
    return { ok: true, text };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'dictation-failed';
    debugLog('native dictation failed', { message });
    return { ok: false, error: message };
  }
}

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: 'LQB Desktop',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  applyWindowContent(mainWindow);

  mainWindow.webContents.on('did-finish-load', () => {
    debugLog('main window finished load');
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedUrl) => {
    debugLog('main window failed load', { errorCode, errorDescription, validatedUrl });
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    debugLog('main window render process gone', details);
  });

  mainWindow.on('closed', () => {
    debugLog('main window closed');
    mainWindow = null;
  });

  return mainWindow;
}

function createCompanionWindow() {
  if (companionWindow && !companionWindow.isDestroyed()) {
    revealCompanionFromEdge();
    companionWindow.show();
    companionWindow.focus();
    return companionWindow;
  }

  const { workArea } = screen.getPrimaryDisplay();

  companionWindow = new BrowserWindow({
    width: COMPANION_WIDTH,
    height: COMPANION_HEIGHT,
    x: Math.round(workArea.x + workArea.width - COMPANION_WIDTH - 20),
    y: Math.round(workArea.y + workArea.height - COMPANION_HEIGHT - 20),
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  applyCompanionContent(companionWindow);

  companionWindow.once('ready-to-show', () => {
    debugLog('companion ready-to-show');
    companionWindow?.show();
    companionWindow?.focus();
  });

  companionWindow.webContents.on('did-finish-load', () => {
    debugLog('companion finished load');
  });

  companionWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedUrl) => {
    debugLog('companion failed load', { errorCode, errorDescription, validatedUrl });
  });

  companionWindow.webContents.on('render-process-gone', (_event, details) => {
    debugLog('companion render process gone', details);
  });

  companionWindow.on('move', () => {
    if (companionIsAdjusting) {
      return;
    }

    companionHasBeenMoved = true;

    if (companionSnapTimer) {
      clearTimeout(companionSnapTimer);
    }

    companionSnapTimer = setTimeout(() => {
      snapCompanionToEdge();
    }, SNAP_DELAY_MS);
  });

  companionWindow.on('closed', () => {
    debugLog('companion window closed');
    if (companionSnapTimer) {
      clearTimeout(companionSnapTimer);
      companionSnapTimer = null;
    }
    if (companionCursorWatcher) {
      clearInterval(companionCursorWatcher);
      companionCursorWatcher = null;
    }
    companionWindow = null;
    companionChatExpanded = false;
    companionCompactBounds = null;
  });

  startCompanionCursorWatcher();

  return companionWindow;
}

function snapCompanionToEdge() {
  if (!companionWindow || companionWindow.isDestroyed()) {
    return;
  }

  const bounds = companionWindow.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const { workArea } = display;

  const leftX = workArea.x + COMPANION_MARGIN;
  const rightX = workArea.x + workArea.width - bounds.width - COMPANION_MARGIN;
  companionEdge = Math.abs(bounds.x - leftX) < Math.abs(bounds.x - rightX) ? 'left' : 'right';

  const minY = workArea.y + COMPANION_MARGIN;
  const maxY = workArea.y + workArea.height - bounds.height - COMPANION_MARGIN;
  const targetY = Math.min(Math.max(bounds.y, minY), maxY);

  const snappedX = companionEdge === 'left' ? leftX : rightX;
  setCompanionPosition(snappedX, targetY);

  if (companionHasBeenMoved) {
    hideCompanionToEdge();
  } else {
    revealCompanionFromEdge();
  }
}

function setCompanionPosition(x, y) {
  if (!companionWindow || companionWindow.isDestroyed()) {
    return;
  }

  companionIsAdjusting = true;
  companionWindow.setPosition(Math.round(x), Math.round(y), true);
  setTimeout(() => {
    companionIsAdjusting = false;
  }, 60);
}

function hideCompanionToEdge() {
  if (!companionWindow || companionWindow.isDestroyed()) {
    return;
  }

  const bounds = companionWindow.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const { workArea } = display;

  const targetX = companionEdge === 'left'
    ? workArea.x - bounds.width + EDGE_VISIBLE_WIDTH
    : workArea.x + workArea.width - EDGE_VISIBLE_WIDTH;

  companionDockState = 'hidden';
  setCompanionPosition(targetX, bounds.y);
}

function revealCompanionFromEdge() {
  if (!companionWindow || companionWindow.isDestroyed()) {
    return;
  }

  const bounds = companionWindow.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const { workArea } = display;

  const targetX = companionEdge === 'left'
    ? workArea.x + COMPANION_MARGIN
    : workArea.x + workArea.width - bounds.width - COMPANION_MARGIN;

  companionDockState = 'expanded';
  setCompanionPosition(targetX, bounds.y);
}

function setCompanionChatExpanded(expanded) {
  if (!companionWindow || companionWindow.isDestroyed()) {
    return false;
  }

  if (expanded === companionChatExpanded) {
    return companionChatExpanded;
  }

  const currentBounds = companionWindow.getBounds();
  const display = screen.getDisplayMatching(currentBounds);
  const { workArea } = display;

  if (expanded) {
    companionCompactBounds = currentBounds;
    companionChatExpanded = true;
    companionHasBeenMoved = false;
    companionDockState = 'expanded';
    companionWindow.setResizable(false);

    const width = Math.min(820, Math.max(620, Math.round(workArea.width * 0.58)));
    const height = Math.min(640, Math.max(500, Math.round(workArea.height * 0.62)));
    const x = Math.round(workArea.x + (workArea.width - width) / 2);
    const y = Math.round(workArea.y + (workArea.height - height) / 2);

    companionIsAdjusting = true;
    companionWindow.setBounds({ x, y, width, height }, true);
    setTimeout(() => {
      companionIsAdjusting = false;
    }, 80);
    debugLog('companion expanded chat mode', { x, y, width, height });
    return companionChatExpanded;
  }

  companionChatExpanded = false;
  companionWindow.setResizable(false);
  const nextBounds = companionCompactBounds ?? {
    x: Math.round(workArea.x + workArea.width - COMPANION_WIDTH - 20),
    y: Math.round(workArea.y + workArea.height - COMPANION_HEIGHT - 20),
    width: COMPANION_WIDTH,
    height: COMPANION_HEIGHT,
  };

  companionIsAdjusting = true;
  companionWindow.setBounds(nextBounds, true);
  setTimeout(() => {
    companionIsAdjusting = false;
  }, 80);
  companionDockState = 'expanded';
  debugLog('companion restored compact mode', nextBounds);
  return companionChatExpanded;
}

function shouldRevealCompanion(cursorPoint, bounds, workArea) {
  const withinVerticalRange =
    cursorPoint.y >= bounds.y - EDGE_VERTICAL_PADDING
    && cursorPoint.y <= bounds.y + bounds.height + EDGE_VERTICAL_PADDING;

  if (!withinVerticalRange) {
    return false;
  }

  if (companionEdge === 'left') {
    return cursorPoint.x <= workArea.x + EDGE_TRIGGER_SIZE;
  }

  return cursorPoint.x >= workArea.x + workArea.width - EDGE_TRIGGER_SIZE;
}

function shouldHideCompanion(cursorPoint, bounds) {
  const outsideHorizontally =
    cursorPoint.x < bounds.x - 28 || cursorPoint.x > bounds.x + bounds.width + 28;
  const outsideVertically =
    cursorPoint.y < bounds.y - 28 || cursorPoint.y > bounds.y + bounds.height + 28;

  return outsideHorizontally || outsideVertically;
}

function startCompanionCursorWatcher() {
  if (companionCursorWatcher) {
    clearInterval(companionCursorWatcher);
  }

  companionCursorWatcher = setInterval(() => {
    if (!companionWindow || companionWindow.isDestroyed()) {
      return;
    }

    const bounds = companionWindow.getBounds();
    const display = screen.getDisplayMatching(bounds);
    const { workArea } = display;
    const cursorPoint = screen.getCursorScreenPoint();

    if (companionChatExpanded) {
      return;
    }

    if (companionDockState === 'hidden' && shouldRevealCompanion(cursorPoint, bounds, workArea)) {
      revealCompanionFromEdge();
      return;
    }

    if (companionHasBeenMoved && companionDockState === 'expanded' && shouldHideCompanion(cursorPoint, bounds)) {
      hideCompanionToEdge();
    }
  }, CURSOR_WATCH_INTERVAL_MS);
}

if (gotSingleInstanceLock) {
  app.on('second-instance', () => {
    debugLog('second instance request received');
    if (companionWindow && !companionWindow.isDestroyed()) {
      revealCompanionFromEdge();
      companionWindow.show();
      companionWindow.focus();
    } else {
      createCompanionWindow();
    }
  });

  app.whenReady().then(() => {
    debugLog('app ready');
    session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
      if (permission === 'media' || permission === 'microphone' || permission === 'audioCapture') {
        return true;
      }

      return false;
    });

    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      if (permission === 'media' || permission === 'microphone' || permission === 'audioCapture') {
        debugLog('granted media permission', { permission });
        callback(true);
        return;
      }

      callback(false);
    });

    if (typeof session.defaultSession.setDevicePermissionHandler === 'function') {
      session.defaultSession.setDevicePermissionHandler((details) => {
        const allowed = details.deviceType === 'audioCapture' || details.deviceType === 'videoCapture';
        if (allowed) {
          debugLog('granted device permission', { deviceType: details.deviceType, origin: details.origin });
        }
        return allowed;
      });
    }

    createCompanionWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createCompanionWindow();
      }
    });
  });
}

ipcMain.handle('desktop:open-main-app', async () => {
  debugLog('ipc open main app');
  const window = createMainWindow();
  if (!window.isVisible()) {
    window.show();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
});

ipcMain.handle('desktop:close-companion', async () => {
  debugLog('ipc close companion');
  if (companionWindow && !companionWindow.isDestroyed()) {
    companionWindow.close();
  }
});

ipcMain.handle('desktop:dictate', async (_event, timeoutSeconds) => {
  debugLog('ipc dictate request', { timeoutSeconds });
  return runNativeDictation(timeoutSeconds);
});

ipcMain.handle('desktop:generate-image', async (_event, payload) => {
  debugLog('ipc generate image request', {
    prompt: typeof payload?.prompt === 'string' ? payload.prompt.slice(0, 80) : '',
    operation: payload?.operation,
    model: payload?.model,
  });
  return runNanoImageGeneration(payload ?? {});
});

ipcMain.handle('desktop:set-chat-expanded', async (_event, expanded) => {
  debugLog('ipc set chat expanded', { expanded });
  return { expanded: setCompanionChatExpanded(Boolean(expanded)) };
});

process.on('uncaughtException', (error) => {
  debugLog('uncaught exception', {
    message: error.message,
    stack: error.stack,
  });
});

process.on('unhandledRejection', (reason) => {
  debugLog('unhandled rejection', {
    reason: reason instanceof Error ? { message: reason.message, stack: reason.stack } : reason,
  });
});

app.on('before-quit', () => {
  debugLog('app before-quit');
});

app.on('will-quit', () => {
  debugLog('app will-quit');
});

app.on('window-all-closed', () => {
  debugLog('window-all-closed', { platform: process.platform });
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

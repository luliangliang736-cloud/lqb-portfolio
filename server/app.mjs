import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const app = express();
const port = Number(process.env.NANO_PORT || process.env.PORT || 8787);
const nanoApiKey = process.env.NANO_API_KEY || '';
const nanoModel = process.env.NANO_MODEL || 'gemini-2.5-flash-image';
const nanoBaseUrl = process.env.NANO_BASE_URL || 'https://api.nanobananaapi.dev/v1/images/generate';
const nanoEditUrl = process.env.NANO_EDIT_URL || 'https://api.nanobananaapi.dev/v1/images/edit';
const storageDir = process.env.NANO_STORAGE_DIR || path.join(rootDir, 'server', 'storage');
const historyFile = path.join(storageDir, 'nano-history.json');

app.use(express.json({ limit: '20mb' }));

function defaultDimensions(aspectRatio = '1:1') {
  const dimensions = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '9:16': { width: 768, height: 1344 },
    '4:3': { width: 1184, height: 864 },
    '3:4': { width: 864, height: 1184 },
    '2:3': { width: 832, height: 1248 },
    '3:2': { width: 1248, height: 832 },
    '4:5': { width: 896, height: 1152 },
    '5:4': { width: 1152, height: 896 },
    '21:9': { width: 1536, height: 672 },
    '1:4': { width: 512, height: 2048 },
    '4:1': { width: 2048, height: 512 },
    '1:8': { width: 512, height: 4096 },
    '8:1': { width: 4096, height: 512 },
  };

  return dimensions[aspectRatio] ?? dimensions['1:1'];
}

async function ensureStorage() {
  await fs.mkdir(storageDir, { recursive: true });

  try {
    await fs.access(historyFile);
  } catch {
    await fs.writeFile(historyFile, '[]', 'utf8');
  }
}

async function readHistory() {
  await ensureStorage();
  const raw = await fs.readFile(historyFile, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeHistory(items) {
  await ensureStorage();
  await fs.writeFile(historyFile, JSON.stringify(items, null, 2), 'utf8');
}

async function appendHistoryItem(item) {
  const items = await readHistory();
  items.unshift(item);
  await writeHistory(items.slice(0, 200));
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    provider: nanoBaseUrl.includes('nanobananaapi.dev') ? 'nanobananaapi' : nanoBaseUrl.includes('openrouter.ai') ? 'openrouter' : 'custom',
    model: nanoModel,
    configured: Boolean(nanoApiKey),
    baseUrl: nanoBaseUrl,
  });
});

app.get('/api/nano-history', async (_req, res) => {
  try {
    const items = await readHistory();
    res.json({ items });
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Failed to read Nano history.');
  }
});

app.post('/api/nano-image', async (req, res) => {
  if (!nanoApiKey) {
    res.status(500).send('Nano API key is missing. Add NANO_API_KEY to your local env file.');
    return;
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  const aspectRatio = typeof req.body?.aspectRatio === 'string' ? req.body.aspectRatio : '1:1';
  const imageSize = typeof req.body?.imageSize === 'string' ? req.body.imageSize : '1K';
  const operation = req.body?.operation === 'image-to-image' ? 'image-to-image' : 'text-to-image';
  const sourceImage = typeof req.body?.sourceImage === 'string' ? req.body.sourceImage : '';
  const selectedModel = typeof req.body?.model === 'string' ? req.body.model : nanoModel;

  if (!prompt) {
    res.status(400).send('Prompt is required.');
    return;
  }

  if (operation === 'image-to-image' && !sourceImage) {
    res.status(400).send('Source image is required for image-to-image.');
    return;
  }

  try {
    const headers = {
      Authorization: `Bearer ${nanoApiKey}`,
      'Content-Type': 'application/json',
    };

    if (nanoBaseUrl.includes('openrouter.ai')) {
      headers['HTTP-Referer'] = 'http://localhost:5173';
      headers['X-Title'] = 'digital-human';
    }

    const targetUrl = operation === 'image-to-image' ? nanoEditUrl : nanoBaseUrl;

    const requestBody = targetUrl.includes('nanobananaapi.dev')
      ? {
          prompt,
          num: 1,
          model: selectedModel,
          image_size: aspectRatio,
          ...(operation === 'image-to-image' ? { image: sourceImage } : {}),
        }
      : {
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          modalities: ['image', 'text'],
          image_config: {
            aspect_ratio: aspectRatio,
            image_size: imageSize,
          },
        };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const raw = await response.text();
    const data = raw ? JSON.parse(raw) : {};

    if (!response.ok) {
      const message = data?.error?.message || data?.message || `Nano upstream request failed: ${response.status}`;
      res.status(response.status).send(message);
      return;
    }

    let imageUrl;
    let note = 'Nano Banana 已返回图像结果。';

    if (targetUrl.includes('nanobananaapi.dev')) {
      if (data?.code !== 0) {
        res.status(502).send(data?.message || 'Nano Banana API returned an error.');
        return;
      }

      imageUrl = Array.isArray(data?.data?.url) ? data.data.url[0] : data?.data?.url;
      note = data?.message === 'ok' ? 'Nano Banana 已完成生图。' : (data?.message || note);
    } else {
      const message = data?.choices?.[0]?.message;
      imageUrl =
        message?.images?.[0]?.image_url?.url ||
        message?.images?.[0]?.imageUrl?.url;
      note = message?.content || note;
    }

    if (!imageUrl) {
      res.status(502).send('Nano upstream returned no image data.');
      return;
    }

    const dimensions = defaultDimensions(aspectRatio);
    const historyItem = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      prompt,
      operation,
      model: selectedModel,
      imageUrl,
      width: dimensions.width,
      height: dimensions.height,
      note: operation === 'image-to-image' ? 'Nano Banana 已完成图生图。' : note,
      hasSourceImage: Boolean(sourceImage),
    };

    await appendHistoryItem(historyItem);

    res.json({
      ...historyItem,
    });
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : 'Nano image proxy failed.');
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Nano proxy listening on http://localhost:${port}`);
});

import type { NanoModelId } from '../types/chat';

export interface NanoImageResult {
  imageUrl: string;
  mode: 'mock' | 'proxy';
  prompt: string;
  width: number;
  height: number;
  note: string;
  operation: 'text-to-image' | 'image-to-image';
  model: NanoModelId;
}

export interface NanoGenerateOptions {
  prompt: string;
  operation?: 'text-to-image' | 'image-to-image';
  sourceImage?: string;
  aspectRatio?: string;
  model?: NanoModelId;
}

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;
const NANO_PROXY_URL = import.meta.env.VITE_NANO_PROXY_URL || '/api/nano-image';
const URBANIST_STACK = "'Urbanist', Arial, sans-serif";

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapLines(text: string, maxChars = 16) {
  const lines: string[] = [];

  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.slice(i, i + maxChars));
  }

  return lines.slice(0, 3);
}

function buildMockImage(prompt: string) {
  const safePrompt = escapeXml(prompt);
  const lines = wrapLines(prompt);
  const lineMarkup = lines
    .map(
      (line, index) =>
        `<text x="72" y="${620 + index * 44}" fill="rgba(255,255,255,0.82)" font-size="30" font-family="${URBANIST_STACK}">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${DEFAULT_WIDTH}" height="${DEFAULT_HEIGHT}" viewBox="0 0 ${DEFAULT_WIDTH} ${DEFAULT_HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#15131f" />
          <stop offset="50%" stop-color="#362969" />
          <stop offset="100%" stop-color="#0f4d67" />
        </linearGradient>
        <radialGradient id="glowA" cx="20%" cy="20%" r="60%">
          <stop offset="0%" stop-color="rgba(124,106,255,0.95)" />
          <stop offset="100%" stop-color="rgba(124,106,255,0)" />
        </radialGradient>
        <radialGradient id="glowB" cx="80%" cy="30%" r="50%">
          <stop offset="0%" stop-color="rgba(31,212,255,0.7)" />
          <stop offset="100%" stop-color="rgba(31,212,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" rx="40" />
      <circle cx="220" cy="220" r="240" fill="url(#glowA)" />
      <circle cx="760" cy="260" r="220" fill="url(#glowB)" />
      <rect x="64" y="64" width="896" height="896" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      <text x="72" y="120" fill="white" font-size="44" font-weight="700" font-family="${URBANIST_STACK}">Nano Banana 预览</text>
      <text x="72" y="172" fill="rgba(255,255,255,0.72)" font-size="24" font-family="${URBANIST_STACK}">当前未配置真实接口，先展示聊天生图卡片与结果流。</text>
      <text x="72" y="260" fill="rgba(255,255,255,0.92)" font-size="26" font-family="${URBANIST_STACK}">Prompt</text>
      <foreignObject x="72" y="292" width="880" height="250">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgba(255,255,255,0.86); font-size: 34px; line-height: 1.45; font-family: ${URBANIST_STACK};">
          ${safePrompt}
        </div>
      </foreignObject>
      <text x="72" y="560" fill="rgba(255,255,255,0.6)" font-size="22" font-family="${URBANIST_STACK}">生成结果将来可由后端代理替换</text>
      ${lineMarkup}
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function generateNanoImage({
  prompt,
  operation = 'text-to-image',
  sourceImage,
  aspectRatio = '1:1',
  model = 'gemini-2.5-flash-image',
}: NanoGenerateOptions): Promise<NanoImageResult> {
  let response: Response;

  try {
    response = await fetch(NANO_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        operation,
        sourceImage,
        model,
      }),
    });
  } catch {
    // Fall through to local mock mode when the proxy is unavailable.
    await new Promise((resolve) => setTimeout(resolve, 1400));

    return {
      imageUrl: buildMockImage(prompt),
      mode: 'mock',
      prompt,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      note: operation === 'image-to-image'
        ? '当前为本地演示模式。图生图已进入聊天流程，但本地 Nano 代理当前不可用。'
        : '当前为本地演示模式。本地 Nano 代理当前不可用。',
      operation,
      model,
    };
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Nano proxy request failed: ${response.status}`);
  }

  const data = await response.json() as Partial<NanoImageResult> & { imageUrl?: string; url?: string };
  const imageUrl = data.imageUrl ?? data.url;

  if (!imageUrl) {
    throw new Error('Nano proxy response missing imageUrl');
  }

  return {
    imageUrl,
    mode: 'proxy',
    prompt,
    width: data.width ?? DEFAULT_WIDTH,
    height: data.height ?? DEFAULT_HEIGHT,
    note: data.note ?? 'Nano Banana 已通过代理返回结果。',
    operation,
    model: data.model ?? model,
  };
}

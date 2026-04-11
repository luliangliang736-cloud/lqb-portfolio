import type { NanoModelId } from '../types/chat';

export const NANO_MODELS: { id: NanoModelId; label: string; description: string }[] = [
  { id: 'gemini-2.5-flash-image', label: 'Flash 标准', description: '速度快，成本低' },
  { id: 'gemini-2.5-flash-image-hd', label: 'Flash HD', description: '更高清，适合精修' },
  { id: 'gemini-3.1-flash-image-preview', label: '3.1 Flash 1K', description: '质量更稳，平衡速度' },
  { id: 'gemini-3.1-flash-image-preview-2k', label: '3.1 Flash 2K', description: '更高分辨率输出' },
  { id: 'gemini-3-pro-image-preview', label: '3 Pro', description: '质量优先，生成更细腻' },
];

export function getNanoModelLabel(model?: string) {
  return NANO_MODELS.find((item) => item.id === model)?.label ?? model ?? '未指定模型';
}

export function getNanoModelDescription(model?: string) {
  return NANO_MODELS.find((item) => item.id === model)?.description ?? '';
}

export function getNanoOperationLabel(operation?: string) {
  return operation === 'image-to-image' ? '图生图' : '文生图';
}

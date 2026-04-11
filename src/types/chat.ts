export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  prompt?: string;
  width?: number;
  height?: number;
  purpose?: 'input' | 'result';
}

export type MessageKind = 'text' | 'image-result';

export type NanoModelId =
  | 'gemini-2.5-flash-image'
  | 'gemini-2.5-flash-image-hd'
  | 'gemini-3.1-flash-image-preview'
  | 'gemini-3.1-flash-image-preview-2k'
  | 'gemini-3-pro-image-preview';

export interface NanoHistoryItem {
  id: string;
  createdAt: string;
  prompt: string;
  operation: 'text-to-image' | 'image-to-image';
  model: NanoModelId;
  imageUrl: string;
  width: number;
  height: number;
  note?: string;
  hasSourceImage?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  status?: 'sending' | 'delivered' | 'streaming';
  kind?: MessageKind;
  meta?: {
    provider?: 'nano-banana';
    mode?: 'mock' | 'proxy';
    prompt?: string;
    operation?: 'text-to-image' | 'image-to-image';
    model?: NanoModelId;
  };
}

export type AgentStatus = 'online' | 'thinking' | 'idle';

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  agentStatus: AgentStatus;
}

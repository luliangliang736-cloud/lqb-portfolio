export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  status?: 'sending' | 'delivered' | 'streaming';
}

export type AgentStatus = 'online' | 'thinking' | 'idle';

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  agentStatus: AgentStatus;
}

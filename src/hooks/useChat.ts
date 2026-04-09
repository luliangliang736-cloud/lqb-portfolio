import { useState, useCallback, useRef } from 'react';
import type { Message, AgentStatus } from '../types/chat';

const GREETINGS: Record<string, string> = {
  morning: '早上好！我是 Kaya，设计部0号员工。今天需要我帮你做什么设计吗？',
  afternoon: '下午好！我是 Kaya，随时准备为你处理设计任务。',
  evening: '晚上好！我是 Kaya，有什么设计需求可以交给我。',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS.morning;
  if (hour < 18) return GREETINGS.afternoon;
  return GREETINGS.evening;
}

const MOCK_RESPONSES: Record<string, string> = {
  '海报': '好的，我来为你制作海报。请告诉我：\n\n1. 海报的主题是什么？\n2. 需要什么尺寸？（如 A4、社媒正方形 1080x1080）\n3. 有没有品牌色或风格偏好？\n\n提供这些信息后，我会立即开始设计。',
  'banner': '收到！Banner 设计我很擅长。请提供以下信息：\n\n1. 投放平台（网站首页 / APP / 社媒）\n2. 文案内容\n3. 是否需要包含产品图？\n\n我会根据品牌规范快速生成。',
  '社媒': '社交媒体设计是我的常规任务之一。我可以帮你制作：\n\n• Instagram / Facebook 帖子\n• Story / Reels 封面\n• 活动宣传图\n\n请告诉我具体需求和平台。',
  '品牌': '品牌相关设计，我可以处理：\n\n• 企业文化海报\n• 品牌宣传物料\n• VI 标准应用\n\n请提供品牌指南或参考，我会严格按照规范执行。',
};

function getMockResponse(input: string): string {
  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (input.includes(keyword)) return response;
  }
  return `收到你的需求："${input}"\n\n我正在分析任务内容，稍后会给你一个详细的设计方案。如果有参考图片或具体要求，可以随时补充。`;
}

let messageIdCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: generateId(),
      role: 'assistant',
      content: getGreeting(),
      timestamp: new Date(),
      status: 'delivered',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('online');
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setAgentStatus('thinking');

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    const responseText = getMockResponse(content);
    const delay = 800 + Math.random() * 1200;

    typingTimerRef.current = setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        status: 'delivered',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      setAgentStatus('online');
    }, delay);
  }, []);

  return { messages, isTyping, agentStatus, sendMessage };
}

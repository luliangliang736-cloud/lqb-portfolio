import { useState, useCallback, useRef } from 'react';
import type { Attachment, Message, AgentStatus, NanoModelId } from '../types/chat';
import { generateNanoImage } from '../services/nanoImage';

const GREETINGS: Record<string, string> = {
  morning: '早上好！我是 LQB，设计部0号员工。今天需要我帮你做什么设计吗？',
  afternoon: '下午好！我是 LQB，随时准备为你处理设计任务。',
  evening: '晚上好！我是 LQB，有什么设计需求可以交给我。',
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

export interface ChatSubmitPayload {
  content: string;
  operation?: 'text-to-image' | 'image-to-image';
  model?: NanoModelId;
  sourceImage?: {
    url: string;
    name: string;
  };
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
      content: `${getGreeting()}\n\n现在可以直接在对话框里使用 Nano Banana：\n• 文生图：输入提示词直接生成\n• 图生图：切到图生图模块，上传参考图后再描述你想改成什么`,
      timestamp: new Date(),
      status: 'delivered',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('online');
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const sendMessage = useCallback(async ({
    content,
    operation = 'text-to-image',
    model = 'gemini-2.5-flash-image',
    sourceImage,
  }: ChatSubmitPayload) => {
    const userAttachments: Attachment[] | undefined = sourceImage
      ? [
          {
            type: 'image',
            url: sourceImage.url,
            name: sourceImage.name,
            purpose: 'input',
          },
        ]
      : undefined;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'delivered',
      attachments: userAttachments,
      meta: {
        provider: 'nano-banana',
        operation,
        model,
      },
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setAgentStatus('thinking');

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    if (operation === 'text-to-image' || operation === 'image-to-image') {
      try {
        const result = await generateNanoImage({
          prompt: content,
          operation,
          sourceImage: sourceImage?.url,
          model,
        });
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          kind: 'image-result',
          content: result.note,
          timestamp: new Date(),
          status: 'delivered',
          attachments: [
            {
              type: 'image',
              url: result.imageUrl,
              name: 'nano-banana-result.png',
              prompt: result.prompt,
              width: result.width,
              height: result.height,
              purpose: 'result',
            },
          ],
          meta: {
            provider: 'nano-banana',
            mode: result.mode,
            prompt: result.prompt,
            operation: result.operation,
            model: result.model,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `Nano Banana ${operation === 'image-to-image' ? '图生图' : '文生图'}暂时失败了。\n\n${error instanceof Error ? error.message : '请稍后重试。'}`,
          timestamp: new Date(),
          status: 'delivered',
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsTyping(false);
      setAgentStatus('online');
      return;
    }

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

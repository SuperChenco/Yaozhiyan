import type { Member, FloatWindowState } from "@/types";

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: "deepseek",
    name: "DeepSeek",
    avatar: "D",
    url: "https://chat.deepseek.com",
    color: "#4D6BFE",
  },
  {
    id: "doubao",
    name: "豆包",
    avatar: "豆",
    url: "https://www.doubao.com/chat",
    color: "#7C3AED",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    avatar: "G",
    url: "https://chat.openai.com",
    color: "#10A37F",
  },
  {
    id: "gemini",
    name: "Gemini",
    avatar: "Gm",
    url: "https://gemini.google.com",
    color: "#4285F4",
  },
  {
    id: "grok",
    name: "Grok",
    avatar: "X",
    url: "https://grok.x.ai",
    color: "#1DA1F2",
  },
];

// 默认悬浮框位置：基于 1920x1080，聊天窗口左侧占 460px
export function getDefaultFloatWindows(): Record<string, FloatWindowState> {
  const baseW = 430;
  const baseH = 290;
  const gap = 16;
  const startX = 480;
  const col2X = startX + baseW + gap;
  return {
    deepseek: {
      memberId: "deepseek",
      x: startX,
      y: 16,
      width: baseW,
      height: baseH,
      minimized: false,
      zIndex: 10,
    },
    doubao: {
      memberId: "doubao",
      x: col2X,
      y: 16,
      width: baseW,
      height: baseH,
      minimized: false,
      zIndex: 11,
    },
    chatgpt: {
      memberId: "chatgpt",
      x: startX,
      y: 16 + baseH + gap,
      width: baseW,
      height: baseH,
      minimized: false,
      zIndex: 12,
    },
    gemini: {
      memberId: "gemini",
      x: col2X,
      y: 16 + baseH + gap,
      width: baseW,
      height: baseH,
      minimized: false,
      zIndex: 13,
    },
    grok: {
      memberId: "grok",
      x: startX,
      y: 16 + (baseH + gap) * 2,
      width: baseW,
      height: baseH,
      minimized: false,
      zIndex: 14,
    },
  };
}

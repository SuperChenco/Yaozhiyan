import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Member, Message, FloatWindowState } from "@/types";
import { DEFAULT_MEMBERS, getDefaultFloatWindows } from "@/data/members";

interface ChatState {
  members: Member[];
  messages: Message[];
  floatWindows: Record<string, FloatWindowState>;
  configModalOpen: boolean;
  highlightedMembers: string[];
  maxZIndex: number;

  sendMessage: (input: {
    type: "text" | "image";
    content: string;
    mentionedIds?: string[];
  }) => void;
  postAsMember: (memberId: string, content: string) => void;
  updateMemberUrl: (id: string, url: string) => void;
  resetUrls: () => void;
  setConfigModalOpen: (open: boolean) => void;
  updateFloatWindow: (id: string, patch: Partial<FloatWindowState>) => void;
  highlightMember: (id: string) => void;
  clearHighlight: (id: string) => void;
  bringToFront: (id: string) => void;
  toggleMinimize: (id: string) => void;
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const WELCOME: Message = {
  id: "welcome",
  senderId: "system",
  type: "text",
  content:
    "欢迎来到「AI智囊团」群聊！你是群主，可以 @ 任意成员与其对话。在右侧悬浮框内与 AI 对话后，点击悬浮框顶部的「发到群聊」即可把回复带回来。",
  timestamp: Date.now(),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      members: DEFAULT_MEMBERS,
      messages: [WELCOME],
      floatWindows: getDefaultFloatWindows(),
      configModalOpen: false,
      highlightedMembers: [],
      maxZIndex: 20,

      sendMessage: ({ type, content, mentionedIds }) => {
        const msg: Message = {
          id: genId(),
          senderId: "me",
          type,
          content,
          mentionedIds,
          timestamp: Date.now(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
        if (mentionedIds && mentionedIds.length > 0) {
          mentionedIds.forEach((id) => get().highlightMember(id));
        }
      },

      postAsMember: (memberId, content) => {
        const msg: Message = {
          id: genId(),
          senderId: memberId,
          type: "text",
          content,
          timestamp: Date.now(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
      },

      updateMemberUrl: (id, url) => {
        set((s) => ({
          members: s.members.map((m) => (m.id === id ? { ...m, url } : m)),
        }));
      },

      resetUrls: () => {
        set((s) => ({
          members: s.members.map((m) => {
            const def = DEFAULT_MEMBERS.find((d) => d.id === m.id);
            return def ? { ...m, url: def.url } : m;
          }),
        }));
      },

      setConfigModalOpen: (open) => set({ configModalOpen: open }),

      updateFloatWindow: (id, patch) => {
        set((s) => ({
          floatWindows: {
            ...s.floatWindows,
            [id]: { ...s.floatWindows[id], ...patch },
          },
        }));
      },

      highlightMember: (id) => {
        set((s) => ({
          highlightedMembers: s.highlightedMembers.includes(id)
            ? s.highlightedMembers
            : [...s.highlightedMembers, id],
        }));
      },

      clearHighlight: (id) => {
        set((s) => ({
          highlightedMembers: s.highlightedMembers.filter((m) => m !== id),
        }));
      },

      bringToFront: (id) => {
        const z = get().maxZIndex + 1;
        set((s) => ({
          maxZIndex: z,
          floatWindows: {
            ...s.floatWindows,
            [id]: { ...s.floatWindows[id], zIndex: z },
          },
        }));
      },

      toggleMinimize: (id) => {
        set((s) => ({
          floatWindows: {
            ...s.floatWindows,
            [id]: {
              ...s.floatWindows[id],
              minimized: !s.floatWindows[id].minimized,
            },
          },
        }));
      },
    }),
    {
      name: "ai-group-chat",
      partialize: (state) => ({
        members: state.members,
        floatWindows: state.floatWindows,
        messages: state.messages
          .slice(-60)
          .map((m) => (m.type === "image" ? { ...m, content: "" } : m)),
      }),
    }
  )
);

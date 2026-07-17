import { Users, Settings } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import Avatar from "@/components/Avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const members = useChatStore((s) => s.members);
  const setConfigModalOpen = useChatStore((s) => s.setConfigModalOpen);

  return (
    <div className="flex flex-col h-full w-[460px] shrink-0 bg-wechat-darker border-r border-white/5 relative z-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-white/50" />
          <span className="font-medium text-white/90">AI智囊团</span>
          <span className="text-xs text-white/40">(6 人)</span>
        </div>
        <button
          onClick={() => setConfigModalOpen(true)}
          className="p-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
          title="AI 网址设置"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 overflow-x-auto scroll-thin">
        <div className="flex items-center gap-1 shrink-0">
          <Avatar color="#07C160" label="我" size={26} />
          <span className="text-xs text-white/40">群主</span>
        </div>
        <span className="text-white/15 shrink-0">·</span>
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-1 shrink-0">
            <Avatar color={m.color} label={m.avatar} size={26} />
            <span className="text-xs text-white/60">{m.name}</span>
          </div>
        ))}
      </div>

      <MessageList />
      <MessageInput />
    </div>
  );
}

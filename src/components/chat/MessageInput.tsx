import { useRef, useState } from "react";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import type { Member } from "@/types";
import MentionPicker from "./MentionPicker";

export default function MessageInput() {
  const members = useChatStore((s) => s.members);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setText(v);
    // 末尾输入 @ 弹出选择器
    if (v.endsWith("@")) {
      setShowPicker(true);
    } else if (showPicker && !v.endsWith("@")) {
      setShowPicker(false);
    }
  };

  const pickMember = (m: Member) => {
    setText((t) => t.replace(/@$/, `@${m.name} `));
    setMentionedIds((ids) => [...new Set([...ids, m.id])]);
    setShowPicker(false);
    taRef.current?.focus();
  };

  const send = () => {
    if (!text.trim()) return;
    sendMessage({
      type: "text",
      content: text.trim(),
      mentionedIds,
    });
    setText("");
    setMentionedIds([]);
    setShowPicker(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片过大（>2MB），请选小图，避免本地存储溢出。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({ type: "image", content: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="relative px-3 py-3 border-t border-white/5 bg-wechat-darker/80">
      {showPicker && <MentionPicker members={members} onPick={pickMember} />}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
          title="发送图片"
        >
          <ImageIcon size={20} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onImage}
        />
        <textarea
          ref={taRef}
          value={text}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="输入消息，@ 可提及成员，Enter 发送"
          className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm text-white/90 placeholder-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-wechat-green/50 max-h-28 scroll-thin"
        />
        <button
          onClick={send}
          className="p-2.5 rounded-lg bg-wechat-green text-white hover:brightness-110 transition-all disabled:opacity-40"
          disabled={!text.trim()}
          title="发送"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

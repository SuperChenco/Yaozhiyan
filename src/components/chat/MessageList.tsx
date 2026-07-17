import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import MessageBubble from "./MessageBubble";

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const members = useChatStore((s) => s.members);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scroll-thin px-3 py-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          sender={members.find((mem) => mem.id === m.senderId)}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}

import type { Message, Member } from "@/types";
import Avatar from "@/components/Avatar";

interface Props {
  message: Message;
  sender?: Member;
}

function renderText(text: string) {
  const parts = text.split(/(@[^\s@]+)/g);
  return parts.map((p, i) =>
    p.startsWith("@") ? (
      <span key={i} className="text-wechat-green font-medium">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function MessageBubble({ message, sender }: Props) {
  if (message.senderId === "system") {
    return (
      <div className="flex justify-center my-3 animate-slide-in">
        <span className="text-xs text-white/40 px-3 py-1 rounded-full bg-white/5 text-center max-w-[80%]">
          {message.content}
        </span>
      </div>
    );
  }

  const isMe = message.senderId === "me";
  const time = new Date(message.timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isMe) {
    return (
      <div className="flex justify-end gap-2 mb-4 animate-slide-in">
        <div className="flex flex-col items-end max-w-[70%]">
          <span className="text-xs text-white/40 mb-1 mr-1">我 · {time}</span>
          <div className="bg-wechat-green text-white px-3 py-2 rounded-2xl rounded-tr-md break-words">
            {message.type === "image" ? (
              <img
                src={message.content}
                alt="图片"
                className="max-w-[240px] max-h-[240px] rounded-lg"
              />
            ) : (
              <span className="text-sm leading-relaxed whitespace-pre-wrap">
                {renderText(message.content)}
              </span>
            )}
          </div>
        </div>
        <Avatar color="#07C160" label="我" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-4 animate-slide-in">
      <Avatar color={sender?.color ?? "#666"} label={sender?.avatar ?? "?"} />
      <div className="flex flex-col max-w-[70%]">
        <span className="text-xs text-white/40 mb-1 ml-1">
          {sender?.name} · {time}
        </span>
        <div className="bg-white text-zinc-800 px-3 py-2 rounded-2xl rounded-tl-md break-words">
          {message.type === "image" ? (
            <img
              src={message.content}
              alt="图片"
              className="max-w-[240px] max-h-[240px] rounded-lg"
            />
          ) : (
            <span className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderText(message.content)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { X, RotateCcw, ExternalLink } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { DEFAULT_MEMBERS } from "@/data/members";
import Avatar from "@/components/Avatar";

export default function UrlConfigModal() {
  const open = useChatStore((s) => s.configModalOpen);
  const setOpen = useChatStore((s) => s.setConfigModalOpen);
  const members = useChatStore((s) => s.members);
  const updateMemberUrl = useChatStore((s) => s.updateMemberUrl);
  const resetUrls = useChatStore((s) => s.resetUrls);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (!open) return null;

  const getDraft = (id: string) =>
    drafts[id] ?? members.find((m) => m.id === id)?.url ?? "";

  const save = (id: string) => {
    updateMemberUrl(id, getDraft(id).trim());
    setDrafts((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-pop-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[520px] max-w-[92vw] max-h-[86vh] glass rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-base font-medium text-white/90">AI 网址设置</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={resetUrls}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
              title="恢复默认网址"
            >
              <RotateCcw size={13} /> 恢复默认
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3">
          {members.map((m) => {
            const def = DEFAULT_MEMBERS.find((d) => d.id === m.id);
            const isDefault = def ? m.url === def.url : true;
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <Avatar color={m.color} label={m.avatar} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-white/90">{m.name}</span>
                    {!isDefault && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                        已自定义
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={getDraft(m.id)}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [m.id]: e.target.value }))
                      }
                      placeholder={m.url}
                      className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-wechat-green/50"
                    />
                    <button
                      onClick={() => save(m.id)}
                      className="px-3 rounded-lg bg-wechat-green text-white text-xs hover:brightness-110"
                    >
                      保存
                    </button>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 rounded-lg bg-white/5 text-white/50 hover:text-white/90 flex items-center"
                      title="在新窗口打开"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-white/30 leading-relaxed px-1">
            提示：部分 AI（如 ChatGPT、Gemini）禁止被嵌入，会显示兜底页。
            可将网址替换为允许嵌入的移动版/镜像站，例如 m.chatgpt.com。
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import {
  Minus,
  ExternalLink,
  Send,
  RefreshCw,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import type { Member, FloatWindowState } from "@/types";
import Avatar from "@/components/Avatar";

interface Props {
  member: Member;
  state: FloatWindowState;
}

export default function AIFloatWindow({ member, state }: Props) {
  const updateFloatWindow = useChatStore((s) => s.updateFloatWindow);
  const bringToFront = useChatStore((s) => s.bringToFront);
  const toggleMinimize = useChatStore((s) => s.toggleMinimize);
  const highlightedMembers = useChatStore((s) => s.highlightedMembers);
  const clearHighlight = useChatStore((s) => s.clearHighlight);
  const postAsMember = useChatStore((s) => s.postAsMember);

  const highlighted = highlightedMembers.includes(member.id);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(member.url);
  const [iframeKey, setIframeKey] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (state.minimized) return;
    setLoading(true);
    setLoadFailed(false);
    timerRef.current = window.setTimeout(() => {
      setLoadFailed(true);
      setLoading(false);
    }, 4000);
    return () => window.clearTimeout(timerRef.current);
  }, [member.url, iframeKey, state.minimized]);

  useEffect(() => {
    if (highlighted) {
      const t = window.setTimeout(() => clearHighlight(member.id), 3700);
      return () => window.clearTimeout(t);
    }
  }, [highlighted, member.id, clearHighlight]);

  const onLoad = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setLoading(false);
    setLoadFailed(false);
  };

  const sendToChat = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        postAsMember(member.id, text.trim());
      } else {
        alert("剪贴板为空，请先在 AI 网页里复制回复内容。");
      }
    } catch {
      alert("无法读取剪贴板，请手动复制后粘贴到群聊输入框。");
    }
  };

  const saveUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    useChatStore.getState().updateMemberUrl(member.id, u);
    setEditingUrl(false);
    setIframeKey((k) => k + 1);
  };

  if (state.minimized) {
    return (
      <button
        onClick={() => {
          toggleMinimize(member.id);
          bringToFront(member.id);
        }}
        className="absolute glass rounded-lg border border-white/10 shadow-xl flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
        style={{ left: state.x, top: state.y, zIndex: state.zIndex }}
      >
        <Avatar color={member.color} label={member.avatar} size={24} />
        <span className="text-sm text-white/90">{member.name}</span>
        <span className="text-xs text-white/30">已最小化</span>
      </button>
    );
  }

  return (
    <Rnd
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(_, d) => updateFloatWindow(member.id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref) =>
        updateFloatWindow(member.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }
      minWidth={300}
      minHeight={180}
      bounds="parent"
      style={{ zIndex: state.zIndex }}
      onMouseDown={() => bringToFront(member.id)}
      enableResizing
    >
      <div
        className={cn(
          "flex flex-col h-full glass rounded-xl border overflow-hidden shadow-2xl",
          highlighted
            ? "border-wechat-green animate-highlight-pulse"
            : "border-white/10"
        )}
      >
        <div
          className="flex items-center justify-between px-2.5 py-2 border-b border-white/5 cursor-move"
          onDoubleClick={() => toggleMinimize(member.id)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar color={member.color} label={member.avatar} size={24} />
            <span className="text-sm font-medium text-white/90 truncate">
              {member.name}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={sendToChat}
              className="p-1.5 rounded-md text-wechat-green hover:bg-wechat-green/10 transition-colors"
              title="读取剪贴板并以该成员身份发到群聊"
            >
              <Send size={14} />
            </button>
            <button
              onClick={() => setEditingUrl((v) => !v)}
              className={cn(
                "p-1.5 rounded-md hover:bg-white/5 transition-colors",
                editingUrl ? "text-wechat-green" : "text-white/40"
              )}
              title="编辑网址"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="p-1.5 rounded-md text-white/40 hover:bg-white/5 transition-colors"
              title="刷新"
            >
              <RefreshCw size={14} />
            </button>
            <a
              href={member.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md text-white/40 hover:bg-white/5 transition-colors block"
              title="在新标签页打开"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => toggleMinimize(member.id)}
              className="p-1.5 rounded-md text-white/40 hover:bg-white/5 transition-colors"
              title="最小化"
            >
              <Minus size={14} />
            </button>
          </div>
        </div>

        {editingUrl ? (
          <div className="flex-1 flex flex-col justify-center gap-2 p-3 bg-wechat-darker">
            <label className="text-xs text-white/40">
              AI 网址（可换千问等）
            </label>
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-wechat-green/50"
              placeholder="https://..."
            />
            <div className="flex gap-2">
              <button
                onClick={saveUrl}
                className="flex-1 flex items-center justify-center gap-1 bg-wechat-green text-white rounded-lg py-2 text-sm hover:brightness-110"
              >
                <Check size={14} /> 保存并加载
              </button>
              <button
                onClick={() => {
                  setEditingUrl(false);
                  setUrlDraft(member.url);
                }}
                className="px-3 rounded-lg bg-white/5 text-white/60 py-2 text-sm hover:bg-white/10 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 bg-white">
            {loading && !loadFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-wechat-darker text-white/50">
                <RefreshCw size={20} className="animate-spin" />
                <span className="text-xs">正在加载 {member.name}…</span>
              </div>
            )}
            {loadFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-wechat-darker p-4 text-center">
                <Avatar color={member.color} label={member.avatar} size={40} />
                <div>
                  <p className="text-sm text-white/80 mb-1">
                    {member.name} 无法嵌入
                  </p>
                  <p className="text-xs text-white/40 max-w-[260px]">
                    该网站禁止被框架嵌入（X-Frame-Options）。可编辑网址更换，或在新标签页打开。
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUrl(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-white/80 text-xs hover:bg-white/10"
                  >
                    编辑网址
                  </button>
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-wechat-green text-white text-xs hover:brightness-110 flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> 新窗口打开
                  </a>
                </div>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={member.url}
              onLoad={onLoad}
              className="w-full h-full border-0"
              title={member.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </Rnd>
  );
}

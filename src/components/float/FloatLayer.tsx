import { useChatStore } from "@/store/useChatStore";
import AIFloatWindow from "./AIFloatWindow";

export default function FloatLayer() {
  const members = useChatStore((s) => s.members);
  const floatWindows = useChatStore((s) => s.floatWindows);

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-[#0d1117]">
      {members.map((m) => {
        const state = floatWindows[m.id];
        if (!state) return null;
        return <AIFloatWindow key={m.id} member={m} state={state} />;
      })}
    </div>
  );
}

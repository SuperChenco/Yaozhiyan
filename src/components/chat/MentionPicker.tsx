import type { Member } from "@/types";
import Avatar from "@/components/Avatar";

interface Props {
  members: Member[];
  onPick: (m: Member) => void;
}

export default function MentionPicker({ members, onPick }: Props) {
  return (
    <div className="absolute bottom-full left-2 mb-2 w-48 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-pop-in z-50">
      <div className="px-3 py-2 text-xs text-white/40 border-b border-white/5">
        @ 提及成员
      </div>
      <div className="max-h-60 overflow-y-auto scroll-thin">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => onPick(m)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left"
          >
            <Avatar color={m.color} label={m.avatar} size={28} />
            <span className="text-sm text-white/90">{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

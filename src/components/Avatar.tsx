import { cn } from "@/lib/utils";

interface Props {
  color: string;
  label: string;
  size?: number;
  className?: string;
}

export default function Avatar({ color, label, size = 36, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-semibold shrink-0 select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.4,
      }}
    >
      {label}
    </div>
  );
}

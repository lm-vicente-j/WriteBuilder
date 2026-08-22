import type { ReactNode } from "react";

const BASE_BTN = "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium tracking-wide transition-all duration-150 border outline-none cursor-pointer pointer-events-auto focus-visible:ring-2 focus-visible:ring-amber-700/50";

const INACTIVE_BTN = `${BASE_BTN} bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60`;
const ACTIVE_BTN = `${BASE_BTN} bg-zinc-800/90 border-zinc-700 text-zinc-100 shadow-inner`;

export function ToolButton({
  title,
  active = false,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={active ? ACTIVE_BTN : INACTIVE_BTN}
    >
      {children}
    </button>
  );
}
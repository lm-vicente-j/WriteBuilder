"use client";

import { usePathname } from "next/navigation";

import { useUIStore } from "@/store/uiStore";

import { WriteTools } from "./WriteTools";
import { TimelineTools } from "./TimelineTools";

export default function TopToolbar() {
  const pathname = usePathname();
  const showNumbering = useUIStore((s) => s.showNumbering);
  const setShowNumbering = useUIStore((s) => s.setShowNumbering);
  const snapToGrid = useUIStore((s) => s.snapToGrid);
  const setSnapToGrid = useUIStore((s) => s.setSnapToGrid);

  if (pathname === "/" || pathname === "/app/settings") return null;

  return (
    <div className="relative z-30 isolate flex h-11 w-full shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950 px-5 pointer-events-auto">
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate text-[12px] font-medium text-zinc-400">
          untitled
        </span>
        <span className="text-[10px] tracking-wider text-zinc-600 uppercase">
          Draft
        </span>
      </div>

      <div className="relative z-30 flex items-center gap-1.5">
        {pathname === "/app/write" && (
          <WriteTools showNumbering={showNumbering} setShowNumbering={setShowNumbering} />
        )}

        {pathname === "/app/timeline" && (
          <TimelineTools snapToGrid={snapToGrid} setSnapToGrid={setSnapToGrid}/>
        )}
      </div>
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import {
  PilcrowIcon,
  TagsIcon,
  PlusIcon,
  LayoutGridIcon,
  FilterIcon,
  MaximizeIcon,
  MagnetIcon,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import type { ReactNode } from "react";

const BASE_BTN =
  "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium tracking-wide transition-all duration-150 border outline-none cursor-pointer pointer-events-auto focus-visible:ring-2 focus-visible:ring-amber-700/50";
const INACTIVE_BTN = `${BASE_BTN} bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60`;
const ACTIVE_BTN = `${BASE_BTN} bg-zinc-800/90 border-zinc-700 text-zinc-100 shadow-inner`;

function ToolButton({
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

export default function TopToolbar() {
  const pathname = usePathname();
  const showNumbering = useUIStore((s) => s.showNumbering);
  const setShowNumbering = useUIStore((s) => s.setShowNumbering);
  const snapToGrid = useUIStore((s) => s.snapToGrid);
  const setSnapToGrid = useUIStore((s) => s.setSnapToGrid);

  if (pathname === "/" || pathname === "/settings") return null;

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
        {pathname === "/write" && (
          <>
            <ToolButton
              title="Mostrar / ocultar números de línea"
              active={showNumbering}
              onClick={() => setShowNumbering(!showNumbering)}
            >
              <PilcrowIcon size={13} strokeWidth={1.75} />
              <span>Líneas</span>
            </ToolButton>
            <ToolButton
              title="Etiquetas"
              onClick={() => console.log("Abrir panel de tagging")}
            >
              <TagsIcon size={13} strokeWidth={1.75} />
              <span>Tagging</span>
            </ToolButton>
          </>
        )}

        {pathname === "/timeline" && (
          <>
            <ToolButton
              title="Añadir evento"
              onClick={() => console.log("Add Event")}
            >
              <PlusIcon size={13} strokeWidth={1.75} />
              <span>Add Event</span>
            </ToolButton>
            <ToolButton
              title="Auto layout"
              onClick={() => console.log("Auto layout")}
            >
              <LayoutGridIcon size={13} strokeWidth={1.75} />
              <span>Auto layout</span>
            </ToolButton>
            <ToolButton
              title="Mostrar / ocultar filtros"
              onClick={() => console.log("Toggle filters")}
            >
              <FilterIcon size={13} strokeWidth={1.75} />
              <span>Filters</span>
            </ToolButton>
            <ToolButton
              title="Ajustar a pantalla"
              onClick={() => console.log("Fit to screen")}
            >
              <MaximizeIcon size={13} strokeWidth={1.75} />
              <span>Fit</span>
            </ToolButton>
            <ToolButton
              title="Snap to grid"
              active={snapToGrid}
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <MagnetIcon size={13} strokeWidth={1.75} />
              <span>Snap</span>
            </ToolButton>
          </>
        )}
      </div>
    </div>
  );
}
"use client";
import { usePathname } from "next/navigation";
import { LucideIcon, PlusIcon, SaveIcon, UndoIcon, PlayIcon, FilterIcon, PilcrowIcon } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { JSX } from "react";



export default function TopToolbar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/settings") return null;

  const {
    setShowNumbering,
    showNumbering,
    snapToGrid,
    setSnapToGrid
  } = useUIStore();

  const toolsByPath: Record<string, JSX.Element[]> = {
    "/write": [
      <button key="toggle-button"
        onClick={() => setShowNumbering(!showNumbering)}
        title="Toggle line numbers"
        className={`
              text-xs px-2.5 py-1 rounded border transition-all duration-150
              ${showNumbering
            ? "bg-neutral-700 border-neutral-600 text-neutral-200"
            : "bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600"
          }
            `}
      >
        ¶
      </button>,
      <button key="tag-button" className={`text-xs px-2.5 py-1 rounded border transition-all duration-150bg-neutral-700 border-neutral-600 text-neutral-200`}>
        Tagging
      </button>
    ],
    "/timeline": [
      <button key="event-button" className={`cursor-pointer text-xs px-2.5 py-1 rounded border transition-all duration-150bg-neutral-700 bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 `}>
        Add Event
      </button>,
      <button key="auto-layout-button" className={`cursor-pointer text-xs px-2.5 py-1 rounded border transition-all duration-150bg-neutral-700 bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 `}>
        Auto layout
      </button>,
      <button key="filter-buttons" className={`cursor-pointer text-xs px-2.5 py-1 rounded border transition-all duration-150bg-neutral-700 bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 `}>
        Show hide filters
      </button>,
      <button key="fit-button" className={`cursor-pointer text-xs px-2.5 py-1 rounded border transition-all duration-150bg-neutral-700 bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 `}>
        Fit to screen
      </button>,
      <button key="snap-button" onClick={() => setSnapToGrid(!snapToGrid)} className={`cursor-pointer
              text-xs px-2.5 py-1 rounded border transition-all duration-150
              ${snapToGrid
            ? "bg-neutral-700 border-neutral-600 text-neutral-200"
            : "bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600"
          }
            `}>
        Snap to grid
      </button>

    ],
  };

  const tools = toolsByPath[pathname] ?? [];

  return (
    <div className="w-full flex items-center gap-2 px-4 h-10 border-b border-neutral-800 bg-neutral-900 shrink-0">
      <span className="text-neutral-400 text-xs pl-2 border-l border-neutral-700">
        untitled
      </span>

      {tools}


    </div>
  );
}
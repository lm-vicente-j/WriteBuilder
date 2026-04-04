"use client";
import { usePathname } from "next/navigation";
import { LucideIcon, PlusIcon, SaveIcon, UndoIcon, PlayIcon, FilterIcon, PilcrowIcon } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { JSX } from "react";



export default function TopToolbar() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const {
    setShowNumbering,
    showNumbering
  } = useUIStore();

  const toolsByPath: Record<string, JSX.Element[]> = {
    "/write": [
          <button
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
          </button>
    ],
    "/timeline": [
    ],
  };

  const tools = toolsByPath[pathname] ?? [];

  return (
    <div className="w-full flex items-center gap-2 px-4 py-2  border-b border-neutral-800 bg-neutral-900 shrink-0">
      <span className="text-neutral-400 text-xs pl-2 border-l border-neutral-700">
        untitled
      </span>

      {tools}


    </div>
  );
}
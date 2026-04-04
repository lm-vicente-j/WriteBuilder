"use client";

import { useUIStore } from "@/store/uiStore";
import { useState, useRef, useCallback } from "react";

export default function Editor() {
  const [content, setContent] = useState("");
  const {showNumbering, setShowNumbering} = useUIStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  const lines = content.split("\n");
  const lineCount = Math.max(lines.length, 1);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && numbersRef.current) {
      numbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;



  return (
    <div className="flex flex-col h-screen bg-neutral-950 font-mono text-sm text-neutral-100">


      <main className="flex flex-1 pl-40 overflow-hidden">

        {showNumbering && (
          <div
            ref={numbersRef}
            aria-hidden="true"
            className="
              select-none overflow-hidden shrink-0
              w-12 pt-4 pb-4
              text-right pr-3
              text-neutral-600 text-xs leading-6
              border-r border-neutral-800 bg-neutral-900/60
            "
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="h-6">{i + 1}</div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          autoComplete="off"
          placeholder="Start typing…"
          className="
            flex-1 resize-none outline-none
            bg-transparent text-neutral-100
            px-5 pt-4 pb-4
            text-sm leading-6
            caret-sky-400
            placeholder:text-neutral-700
            selection:bg-sky-500/30
          "
        />
      </main>

      {/* Status bar */}
      <footer className="
        flex items-center justify-between
        px-4 h-7 shrink-0
        border-t border-neutral-800 bg-neutral-900
        text-neutral-500 text-xs
      ">
        <div className="flex items-center gap-4">
          <span>
            Ln <span className="text-neutral-300">{lineCount}</span>
          </span>
          <span>
            Words <span className="text-neutral-300">{wordCount}</span>
          </span>
          <span>
            Chars <span className="text-neutral-300">{charCount}</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useUIStore } from "@/store/uiStore";
import { useState, useRef, useCallback } from "react";

const FONT_SIZE = 15;
const LINE_HEIGHT = 1.75;
const LINE_BOX = FONT_SIZE * LINE_HEIGHT;
const PAD_Y = 16;
const PAD_BOTTOM = 40;

export default function Editor() {
  const [content, setContent] = useState("");
  const { showNumbering } = useUIStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  const lineCount = Math.max(content.split("\n").length, 1);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && numbersRef.current) {
      numbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <main className="relative flex min-h-0 flex-1 overflow-hidden pl-28 pr-6">
        <div className="flex h-full min-h-0 min-w-0 w-full">
          {showNumbering && (
            <div
              ref={numbersRef}
              aria-hidden="true"
              className="w-10 shrink-0 select-none overflow-hidden border-r border-zinc-800/60 bg-zinc-900/30 pr-2.5 text-right text-[11px] font-medium text-zinc-500 tabular-nums"
              style={{ paddingTop: PAD_Y, paddingBottom: PAD_BOTTOM }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-end"
                  style={{ height: LINE_BOX }}
                >
                  {i + 1}
                </div>
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
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Empieza a escribir…"
            className="h-full min-w-0 flex-1 resize-none bg-transparent text-zinc-100 caret-amber-600/90 outline-none placeholder:text-zinc-600 selection:bg-amber-900/40 selection:text-zinc-50"
            style={{
              fontFamily:
                "var(--font-serif, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif)",
              fontSize: FONT_SIZE,
              lineHeight: `${LINE_BOX}px`,
              paddingTop: PAD_Y,
              paddingBottom: PAD_BOTTOM,
              paddingLeft: showNumbering ? 14 : 16,
              paddingRight: 16,
            }}
          />
        </div>
      </main>

      <footer className="flex h-8 shrink-0 items-center justify-between border-t border-zinc-800/80 bg-zinc-950 px-6 text-[11px] tracking-wide text-zinc-500">
        <div className="flex items-center gap-5">
          <span>
            Ln <span className="text-zinc-300 tabular-nums">{lineCount}</span>
          </span>
          <span>
            Words <span className="text-zinc-300 tabular-nums">{wordCount}</span>
          </span>
          <span>
            Chars <span className="text-zinc-300 tabular-nums">{charCount}</span>
          </span>
        </div>
        <div className="text-zinc-600">
          {content.length === 0 ? "Listo para escribir" : "Escribiendo…"}
        </div>
      </footer>
    </div>
  );
}
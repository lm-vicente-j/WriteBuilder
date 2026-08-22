"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  GitFork, 
  FileText, 
  BookOpen, 
  BookMarked, 
  CircleHelp 
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"timeline" | "write">("timeline");
  const [selectedNode, setSelectedNode] = useState<string>("node-1");
  const [prose, setProse] = useState(
    "The rain broke against the arched glass of the observatory, drumming a rhythm that drowned out the hum of the city below. Kael pressed his palm against the copper console.\n\nThe timeline sequence was already unspooling: twelve minutes before the archives ignited, seven before the signal reached the outer rim."
  );

  const roles = [
    "Novelists",
    "Mangakas",
    "Screenwriters",
    "Storytellers",
    "Worldbuilders",
    "Game Writers"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseDelay = 1800;

    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const nodes = [
    { 
      id: "node-1", 
      title: "Act I: Inciting Incident", 
      x: 20, 
      y: 85, 
      w: 155, 
      h: 64, 
      chapter: "Chapter 1",
      sample: "The rain broke against the arched glass of the observatory, drumming a rhythm that drowned out the hum of the city below. Kael pressed his palm against the copper console.\n\nThe timeline sequence was already unspooling: twelve minutes before the archives ignited, seven before the signal reached the outer rim."
    },
    { 
      id: "node-2", 
      title: "Act II: Turning Point", 
      x: 235, 
      y: 25, 
      w: 155, 
      h: 64, 
      chapter: "Chapter 4",
      sample: "Seline stood at the edge of the suspended platform, her cipher-blade unholstered. The council's seal had been breached from within.\n\n'If you trigger the sequence now,' she warned, 'you sever the temporal bridge for every sector beyond the perimeter.'"
    },
    { 
      id: "node-3", 
      title: "Act II: The Descent", 
      x: 235, 
      y: 145, 
      w: 155, 
      h: 64, 
      chapter: "Chapter 6",
      sample: "Deep within the lower conduits, the energy surge manifested as localized gravity fractures. Loose bolts drifted upward like embers in reverse.\n\nKael calibrated the dampener field, watching the chronometer tick down by milliseconds."
    },
    { 
      id: "node-4", 
      title: "Act III: The Climax", 
      x: 450, 
      y: 85, 
      w: 155, 
      h: 64, 
      chapter: "Chapter 9",
      sample: "Light flooded the fractured chamber as the celestial beacon aligned. Every alternate thread dissolved into a single present.\n\nThere was no going back to the old world. The architecture of history had been rewritten."
    }
  ];

  const edges = [
    { from: "node-1", to: "node-2" },
    { from: "node-1", to: "node-3" },
    { from: "node-2", to: "node-4" },
    { from: "node-3", to: "node-4" }
  ];

  const handleSelectNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    const n = nodes.find((item) => item.id === nodeId);
    if (n) {
      setProse(n.sample);
    }
  };

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];
  const wordCount = prose.trim() ? prose.trim().split(/\s+/).length : 0;
  const lineCount = Math.max(prose.split("\n").length, 1);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-zinc-100 font-mono text-sm antialiased flex flex-col justify-between">
      {/* 
      THESIS: WriteBuilder is the simplest creative workspace combining a 2D node-based plot timeline with a distraction-free manuscript editor.
      OWN-WORLD: Minimalist darkroom aesthetic directly referencing the app's UI: obsidian zinc (#09090b), amber accent (#f59e0b), monospace UI, serif prose.
      STORY: Writers see the actual app tools—Timeline Node Canvas and Prose Editor—with authentic connected bezier edges and header navigation.
      FIRST VIEWPORT: Clean title, tagline, open source navigation with icons, direct CTA, and live interactive node/write studio preview.
      FORM: Ultra-simple authentic app reference; seed key a8c36a4a.
      FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
      */}

      {/* Header */}
      <header className="w-full border-b border-zinc-800/80 bg-zinc-950 px-6 py-3.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-zinc-100 hover:text-amber-400 transition-colors">
            WriteBuilder
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono">
            <Link 
              href="/docs" 
              className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded transition-colors"
            >
              <BookOpen size={13} className="text-zinc-400" />
              <span>Docs</span>
            </Link>
            <Link 
              href="/user-guide" 
              className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded transition-colors"
            >
              <BookMarked size={13} className="text-zinc-400" />
              <span>User Guide</span>
            </Link>
            <Link 
              href="/faq" 
              className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded transition-colors"
            >
              <CircleHelp size={13} className="text-zinc-400" />
              <span>FAQ</span>
            </Link>
            <a 
              href="https://github.com/lm-vicente-j/WriteBuilder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded transition-colors"
            >
              <svg
                className="h-3.5 w-3.5 fill-current text-zinc-400"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
            <Link
              href="/app"
              className="ml-2 flex items-center gap-1.5 rounded border border-amber-600/40 bg-amber-500/10 px-3 py-1.5 text-xs font-mono text-amber-300 transition-all hover:bg-amber-500 hover:text-amber-950"
            >
              <span>Open App</span>
              <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero & Interactive Showcase */}
      <main className="mx-auto max-w-5xl px-6 py-12 flex-1 flex flex-col justify-center w-full">
        
        {/* Title & Tagline */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs font-mono text-zinc-400 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Built for</span>
            <span className="font-semibold text-amber-400 min-w-[100px] text-left inline-block">
              {displayText}
              <span className="inline-block w-1.5 h-3 bg-amber-400 ml-0.5 animate-pulse align-middle" />
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
            Visual plot timeline. <span className="text-amber-400">Pure prose.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Organize chronological story beats with an interactive node graph, then draft your manuscript in a distraction-free writing environment.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/app"
              className="flex items-center gap-2 rounded bg-amber-500 px-5 py-2 text-xs font-mono font-bold text-amber-950 transition-all hover:bg-amber-400 hover:scale-105"
            >
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Studio Interactive Preview */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 shadow-2xl overflow-hidden">
          
          {/* Top Bar (matching TopToolbar) */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-zinc-200">untitled</span>
              <span className="text-zinc-600 uppercase text-xs">Draft</span>
            </div>

            {/* Tab switch */}
            <div className="flex items-center rounded border border-zinc-800 bg-zinc-900 p-0.5">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === "timeline"
                    ? "bg-zinc-800 text-amber-400 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <GitFork size={12} />
                <span>Timeline</span>
              </button>
              <button
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === "write"
                    ? "bg-zinc-800 text-amber-400 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FileText size={12} />
                <span>Write</span>
              </button>
            </div>
          </div>

          {/* Canvas or Editor Area */}
          <div className="min-h-[300px] sm:min-h-[340px] bg-zinc-950 relative flex flex-col justify-between">
            
            {/* View 1: Connected 2D Node Canvas */}
            {activeTab === "timeline" && (
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between relative overflow-hidden select-none">
                {/* Dot grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#71717a_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* 2D Canvas Container with perfectly aligned SVG & Nodes */}
                <div className="relative w-full h-[240px] overflow-hidden my-auto">
                  
                  {/* SVG Connecting Edges */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                    {edges.map((e, idx) => {
                      const fromN = nodes.find((n) => n.id === e.from)!;
                      const toN = nodes.find((n) => n.id === e.to)!;
                      
                      // Node 1 right port -> Node 2 left port
                      const startX = fromN.x + fromN.w;
                      const startY = fromN.y + fromN.h / 2;
                      const endX = toN.x;
                      const endY = toN.y + toN.h / 2;
                      const cpX = (startX + endX) / 2;
                      const isSelected = selectedNode === e.from || selectedNode === e.to;

                      return (
                        <g key={idx}>
                          <path
                            d={`M ${startX} ${startY} C ${cpX} ${startY}, ${cpX} ${endY}, ${endX} ${endY}`}
                            fill="none"
                            stroke={isSelected ? "#f59e0b" : "#52525b"}
                            strokeWidth={isSelected ? "2.5" : "1.75"}
                            strokeDasharray={isSelected ? undefined : "4 3"}
                            className="transition-all duration-200"
                          />
                          {/* Visible Port Junction Dots */}
                          <circle cx={startX} cy={startY} r="3" fill={isSelected ? "#f59e0b" : "#71717a"} />
                          <circle cx={endX} cy={endY} r="3" fill={isSelected ? "#f59e0b" : "#71717a"} />
                        </g>
                      );
                    })}
                  </svg>

                  {/* 2D Nodes */}
                  <div className="relative z-10 h-full w-full">
                    {nodes.map((node) => {
                      const isSelected = selectedNode === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => handleSelectNode(node.id)}
                          style={{
                            position: "absolute",
                            left: `${node.x}px`,
                            top: `${node.y}px`,
                            width: `${node.w}px`,
                            height: `${node.h}px`
                          }}
                          className={`cursor-pointer rounded border p-2.5 transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-amber-500 bg-zinc-900 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]"
                              : "border-zinc-700 bg-zinc-900/90 hover:border-zinc-500"
                          }`}
                        >
                          {/* Port handles */}
                          <div className={
                            isSelected 
                              ? "absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-amber-500 bg-amber-500 text-amber-950 font-bold text-xs flex items-center justify-center font-mono" 
                              : "absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-zinc-600 bg-zinc-800 text-amber-300 text-xs flex items-center justify-center font-mono"
                          }>
                            +
                          </div>
                          
                          <div className="text-xs font-semibold text-zinc-100 truncate">{node.title}</div>
                          <div className="text-xs text-amber-500">{node.chapter}</div>
                          
                          <div className={
                            isSelected 
                              ? "absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-amber-500 bg-amber-500 text-amber-950 font-bold text-xs flex items-center justify-center font-mono" 
                              : "absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-zinc-600 bg-zinc-800 text-amber-300 text-xs flex items-center justify-center font-mono"
                          }>
                            +
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
                  <span>Selected Node: <strong className="text-amber-400">{activeNodeData.title}</strong></span>
                  <Link href="/app/timeline" className="text-amber-400 hover:underline">
                    Open Timeline Canvas →
                  </Link>
                </div>
              </div>
            )}

            {/* View 2: Write Prose Editor */}
            {activeTab === "write" && (
              <div className="p-6 flex-1 flex flex-col justify-between font-serif">
                <div className="flex gap-4">
                  <div className="flex flex-col text-right font-mono text-xs text-zinc-600 select-none pr-3 border-r border-zinc-800 leading-relaxed">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={prose}
                    onChange={(e) => setProse(e.target.value)}
                    className="w-full flex-1 resize-none bg-transparent text-sm sm:text-base leading-relaxed text-zinc-200 outline-none selection:bg-zinc-800 selection:text-zinc-100 placeholder:text-zinc-600"
                    rows={6}
                  />
                </div>

                {/* Bottom Bar (matching Editor footer) */}
                <div className="mt-4 pt-2 border-t border-zinc-800 font-mono text-xs text-zinc-500 flex justify-between items-center">
                  <div className="flex gap-4">
                    <span>Ln <span className="text-zinc-300">{lineCount}</span></span>
                    <span>Words <span className="text-zinc-300">{wordCount}</span></span>
                    <span>Chars <span className="text-zinc-300">{prose.length}</span></span>
                  </div>
                  <div className="text-zinc-600">
                    {prose.length === 0 ? "Listo para escribir" : "Escribiendo…"}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 2 Core Features */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-amber-500 font-bold mb-1">/timeline</div>
            <div className="text-zinc-200 font-semibold mb-1">2D Plot Node Canvas</div>
            <p className="text-zinc-400 font-sans text-xs">
              Connect story beats, chapters, and multi-thread arcs on an interactive grid.
            </p>
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-amber-500 font-bold mb-1">/write</div>
            <div className="text-zinc-200 font-semibold mb-1">Distraction-Free Editor</div>
            <p className="text-zinc-400 font-sans text-xs">
              Focus on prose with calibrated serif typography, line numbers, and live telemetry.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-zinc-950 px-6 py-4 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-3">
          <span>WriteBuilder · Open Source Creative Suite</span>
          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <Link href="/docs" className="hover:text-zinc-100">Docs</Link>
            <Link href="/user-guide" className="hover:text-zinc-100">User Guide</Link>
            <Link href="/faq" className="hover:text-zinc-100">FAQ</Link>
            <a href="https://github.com/lm-vicente-j/WriteBuilder" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100">GitHub</a>
            <Link href="/app" className="hover:text-amber-400">Studio</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

import { useEffect, useRef } from "react";
import TerminalLine from "./TerminalLine";

export default function MemoryPanel({ memory = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [memory]);

  return (
    <div className="flex flex-col h-full bg-[#050810] border-l border-brand-border overflow-hidden">
      <div className="p-3 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-muted">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          Memory Log
        </div>
        <div className="text-xs text-brand-muted font-mono bg-brand-mutedBg px-2 py-0.5 rounded">
          {memory.length} entries
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-0.5 scroll-smooth"
      >
        {memory.length === 0 ? (
          <div className="text-brand-muted text-xs font-mono italic text-center mt-10">
            Waiting for agent activity...
          </div>
        ) : (
          memory.map((entry, i) => (
            <TerminalLine key={i} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "motion/react";

export default function CodeView({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-brand-muted font-mono bg-brand-bg">
        No code generated yet...
      </div>
    );
  }

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0d1117] overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="text-xs font-mono text-brand-muted bg-[#21262d] px-2 py-1 rounded">javascript</div>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded bg-transparent hover:bg-[#21262d] text-brand-muted hover:text-brand-text transition-colors"
        >
          {copied ? <Check size={16} className="text-brand-primary" /> : <Copy size={16} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="font-mono text-sm leading-relaxed text-[#c9d1d9] flex">
          <div className="flex flex-col text-right pr-4 shrink-0 text-[#484f58] border-r border-[#30363d] mr-4 user-select-none select-none">
            {lines.map((_, i) => (
              <span key={i + 1}>{i + 1}</span>
            ))}
          </div>
          <div className="flex flex-col min-w-0">
            {lines.map((line, i) => (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: Math.min(i * 0.01, 1) }}
                key={i} 
                className="whitespace-pre-wrap break-all"
              >
                {line || ' '}
              </motion.span>
            ))}
          </div>
        </pre>
      </div>
    </div>
  );
}

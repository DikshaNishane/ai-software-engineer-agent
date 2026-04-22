import { motion } from "motion/react";

export default function TerminalLine({ entry }) {
  const date = new Date(entry.timestamp);
  const timeStr = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  const typeColors = {
    system: "text-brand-accent",
    plan: "text-purple-400",
    code: "text-brand-primary",
    test: "text-yellow-400",
    debug: "text-orange-400",
    success: "text-brand-primary",
    error: "text-brand-destructive"
  };
  
  const color = typeColors[entry.type] || "text-brand-text";
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="font-mono text-xs mb-1.5 leading-relaxed break-words"
    >
      <span className="text-brand-muted shrink-0 mr-3">{timeStr}</span>
      <span className={`${color} shrink-0 mr-3 font-semibold uppercase w-12 inline-block`}>{entry.type}</span>
      <span className="text-gray-300">{entry.content}</span>
    </motion.div>
  );
}

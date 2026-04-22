import { Clock, RotateCcw } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ProjectHeader({ project, elapsedTime, onReset }) {
  if (!project) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="bg-brand-card border-b border-brand-border p-4 flex items-center justify-between z-10 sticky top-0">
      <div className="flex flex-col max-w-[60%]">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-xl font-mono font-bold text-white truncate">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <div className="text-sm font-mono text-brand-muted truncate" title={project.requirement}>
          {project.requirement}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-brand-muted font-mono bg-brand-bg px-3 py-1.5 rounded-lg border border-brand-border">
          <Clock size={16} />
          <span>{formatTime(elapsedTime)}</span>
        </div>
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-brand-bg hover:bg-brand-mutedBg text-white rounded-lg border border-brand-border transition-colors text-sm font-semibold"
        >
          <RotateCcw size={16} />
          New Project
        </button>
      </div>
    </div>
  );
}

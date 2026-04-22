import { motion } from "motion/react";
import StatusBadge from "./StatusBadge";

export default function TaskQueuePanel({ tasks = [], activeTaskId, onSelectTask }) {
  const completedCount = tasks.filter(t => t.status === 'complete').length;

  return (
    <div className="flex flex-col h-full border-r border-brand-border bg-[#050810]">
      <div className="p-3 border-b border-brand-border flex flex-col gap-1 bg-brand-bg/50">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold tracking-widest uppercase text-brand-muted">Task Queue</div>
          <div className="text-xs font-mono text-brand-primary">{completedCount}/{tasks.length} COMPLETE</div>
        </div>
        {tasks.length > 0 && (
          <div className="w-full bg-brand-mutedBg h-1.5 rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-brand-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {tasks.map((task) => {
          const isActive = activeTaskId === task.id;
          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                isActive 
                  ? "bg-brand-card border-brand-accent/50 shadow-[0_0_15px_rgba(0,212,255,0.1)]" 
                  : "bg-brand-bg border-brand-border hover:border-brand-muted"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono font-bold text-sm text-brand-text truncate pr-2">{task.title}</div>
                {task.debug_iterations > 0 && (
                  <div className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-[10px] font-bold shrink-0">
                    {task.debug_iterations}x FIX
                  </div>
                )}
              </div>
              <div className="text-xs text-brand-muted font-mono line-clamp-2 mb-3 leading-relaxed">
                {task.description}
              </div>
              <StatusBadge status={task.status} />
            </button>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center text-brand-muted p-6 font-mono text-sm">
            Agent is generating tasks...
          </div>
        )}
      </div>
    </div>
  );
}

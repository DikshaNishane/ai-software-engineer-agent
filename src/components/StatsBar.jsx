import { ListTodo, CheckCircle2, Bug, RefreshCcw } from "lucide-react";

export default function StatsBar({ tasks = [], totalIterations = 0 }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'complete').length;
  const debuggingTasks = tasks.filter(t => t.status === 'debugging').length;
  
  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: ListTodo, color: "text-brand-accent" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "text-brand-primary" },
    { label: "Debugging", value: debuggingTasks, icon: Bug, color: "text-orange-400" },
    { label: "Total Iterations", value: totalIterations, icon: RefreshCcw, color: "text-purple-400" }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-brand-card border border-brand-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-brand-muted text-xs font-semibold tracking-wider uppercase mb-1">{stat.label}</div>
              <div className="text-2xl font-mono font-bold text-brand-text">{stat.value}</div>
            </div>
            <div className={`p-3 rounded-md bg-brand-mutedBg ${stat.color}`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

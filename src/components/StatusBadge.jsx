import { Clock, Code2, FlaskConical, Bug, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function StatusBadge({ status }) {
  const config = {
    planning: { icon: Clock, color: "text-brand-accent", bg: "bg-brand-accent/10", label: "Planning" },
    coding: { icon: Code2, color: "text-brand-primary", bg: "bg-brand-primary/10", label: "Coding", spin: true },
    testing: { icon: FlaskConical, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Testing" },
    debugging: { icon: Bug, color: "text-orange-400", bg: "bg-orange-400/10", label: "Debugging" },
    complete: { icon: CheckCircle2, color: "text-brand-primary", bg: "bg-brand-primary/10", label: "Complete" },
    failed: { icon: XCircle, color: "text-brand-destructive", bg: "bg-brand-destructive/10", label: "Failed" },
  };

  const current = config[status] || config.planning;
  const Icon = current.icon;

  return (
    <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium border border-white/5 ${current.bg} ${current.color}`}>
      {current.spin ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Icon size={14} />
        </motion.div>
      ) : (
        <Icon size={14} />
      )}
      <span className="uppercase tracking-wider">{current.label}</span>
    </div>
  );
}

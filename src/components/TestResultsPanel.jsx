import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function TestResultsPanel({ results, errors = [], passed = false, hasRun = false }) {
  if (!hasRun) {
    return (
      <div className="h-full flex items-center justify-center text-brand-muted font-mono bg-brand-bg">
        Tests have not run yet...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg overflow-hidden p-6 gap-6 overflow-y-auto">
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-6 rounded-xl border flex items-center gap-4 ${
          passed 
            ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
            : 'bg-brand-destructive/10 border-brand-destructive/30 text-brand-destructive'
        }`}
      >
        {passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        <div>
          <h2 className="text-xl font-bold">{passed ? 'All Tests Passed' : 'Tests Failed'}</h2>
          <p className="opacity-80 mt-1">{passed ? 'The code meets all requirements.' : 'The agent needs to debug the issues below.'}</p>
        </div>
      </motion.div>

      {results && (
        <div className="space-y-2">
          <div className="uppercase tracking-widest text-xs font-bold text-brand-muted">Simulator Output</div>
          <div className="p-4 bg-brand-card rounded-lg border border-brand-border font-mono text-sm text-brand-text whitespace-pre-wrap">
            {results}
          </div>
        </div>
      )}

      {errors && errors.length > 0 && (
        <div className="space-y-2">
          <div className="uppercase tracking-widest text-xs font-bold text-brand-muted text-brand-destructive">Error Trace</div>
          <div className="space-y-3">
            {errors.map((err, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="p-3 bg-[#1f0e13] border border-[#3e1b25] rounded text-[#ff7b72] font-mono text-sm break-words whitespace-pre-wrap"
              >
                {err}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

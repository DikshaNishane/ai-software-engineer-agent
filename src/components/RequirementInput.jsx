import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, RefreshCcw } from "lucide-react";

export default function RequirementInput({ onSubmit, isLoading }) {
  const [title, setTitle] = useState("");
  const [requirement, setRequirement] = useState("");

  const examples = [
    { title: "Todo App", req: "Build a todo app with add, delete, mark complete" },
    { title: "Calculator", req: "Build a calculator with basic math operations" },
    { title: "Weather App", req: "Build a weather dashboard with city search" },
    { title: "Chat UI", req: "Build a real-time chat interface with rooms" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && requirement.trim() && !isLoading) {
      onSubmit({ title, requirement });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto w-full pt-16"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-primary/20 shadow-[0_0_30px_rgba(16,240,144,0.15)]">
          <Sparkles className="text-brand-primary" size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-white tracking-tight">New Project</h1>
        <p className="text-brand-muted text-lg">Describe your software requirement and let the agent build it</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-brand-muted uppercase">Project Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., User Authentication System"
            className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3.5 text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary transition-colors font-mono"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-brand-muted uppercase">Requirement</label>
          <textarea 
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe what you want the agent to build in detail..."
            className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-4 text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary transition-colors h-40 resize-none font-mono"
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading || !title.trim() || !requirement.trim()}
          className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,240,144,0.2)] hover:shadow-[0_0_30px_rgba(16,240,144,0.3)]"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <RefreshCcw size={20} />
            </motion.div>
          ) : (
            <>
              <Sparkles size={20} />
              Launch Agent
            </>
          )}
        </button>
      </form>

      <div className="mt-12">
        <div className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-4">Quick Examples</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTitle(ex.title);
                setRequirement(ex.req);
              }}
              disabled={isLoading}
              className="text-left p-4 rounded-xl border border-brand-border bg-brand-card hover:border-brand-accent/50 transition-colors group flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-brand-text mb-1">{ex.title}</div>
                <div className="text-xs text-brand-muted font-mono">{ex.req}</div>
              </div>
              <ArrowRight size={16} className="text-brand-muted group-hover:text-brand-accent transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Ensure RefreshCcw is imported if used (Wait, let me just add it above if not there - ah I missed importing RefreshCcw in RequirementInput. Let me change that)

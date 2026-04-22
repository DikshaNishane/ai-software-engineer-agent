import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Folder, ListTodo, Bug, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { ProjectDB } from "../lib/storage";
import StatusBadge from "../components/StatusBadge";
import { motion } from "motion/react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(ProjectDB.list());
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm("Delete this project?")) {
      ProjectDB.delete(id);
      setProjects(ProjectDB.list());
    }
  };

  const totalProjects = projects.length;
  const totalTasksBuilt = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const totalDebugs = projects.reduce((acc, p) => acc + (p.total_iterations || 0), 0);
  const completedProjects = projects.filter(p => p.status === 'complete').length;

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto flex flex-col pt-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-brand-primary/10 border border-brand-primary/30 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,240,144,0.1)]">
            <Bot size={32} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Engineer Agent</h1>
            <p className="font-mono text-xs text-brand-muted uppercase tracking-widest mt-1">Autonomous code generation & self-debugging</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/workspace')} 
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-bg px-6 py-3 rounded-xl font-bold font-mono tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(16,240,144,0.2)] hover:shadow-[0_0_25px_rgba(16,240,144,0.3)] transition-all"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 flex-shrink-0">
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
          <Folder size={24} className="text-brand-accent p-0.5" />
          <div>
            <div className="text-2xl font-black font-mono">{totalProjects}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Projects</div>
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
          <ListTodo size={24} className="text-brand-primary p-0.5" />
          <div>
            <div className="text-2xl font-black font-mono">{totalTasksBuilt}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Tasks Built</div>
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
          <Bug size={24} className="text-brand-destructive p-0.5" />
          <div>
            <div className="text-2xl font-black font-mono">{totalDebugs}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Debug Iterations</div>
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-center gap-4 shadow-lg shadow-black/20">
          <CheckCircle2 size={24} className="text-brand-primary p-0.5" />
          <div>
            <div className="text-2xl font-black font-mono">{completedProjects}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Completed</div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Recent Projects</h2>
          <span className="font-mono text-xs text-brand-muted">{projects.length} total</span>
        </div>
        
        {projects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-brand-card/50 rounded-2xl border border-brand-border border-dashed">
            <div className="w-16 h-16 bg-brand-mutedBg rounded-2xl flex items-center justify-center mb-6 border border-brand-border text-brand-muted">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
            <p className="text-brand-muted font-mono text-sm max-w-sm mb-8">Start by creating your first autonomous project</p>
            <button 
              onClick={() => navigate('/workspace')} 
              className="bg-brand-mutedBg hover:bg-[#25344a] text-white border border-brand-border px-5 py-2.5 rounded-lg font-mono text-sm tracking-wide transition-colors flex items-center gap-2"
            >
              <Bot size={16} className="text-brand-accent"/>
              Create First Project
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {projects.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={p.id}
                onClick={() => navigate(`/workspace?id=${p.id}`)}
                className="bg-brand-card hover:bg-[#11192e] cursor-pointer border border-brand-border rounded-xl p-5 transition-all group hover:border-brand-accent/50 shadow-lg shadow-black/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-white font-mono tracking-tight">{p.title}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, p.id)}
                    className="p-2 -mt-1 -mr-1 rounded-md text-brand-muted hover:text-brand-destructive hover:bg-brand-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-brand-muted font-mono text-sm line-clamp-2 leading-relaxed mb-4">
                  {p.requirement}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-mono text-brand-muted tracking-wide font-medium">
                  <div className="flex items-center gap-1.5 border border-brand-border/50 bg-brand-mutedBg px-2 py-1 rounded">
                    <ListTodo size={14} className="text-brand-primary" />
                    <span>{p.tasks?.length || 0} tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-brand-border/50 bg-brand-mutedBg px-2 py-1 rounded">
                    <Clock size={14} className="text-brand-accent" />
                    <span>{new Date(p.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add Clock to imports above

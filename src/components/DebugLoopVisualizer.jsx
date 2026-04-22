import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function DebugLoopVisualizer({ currentStage, iterations, isFailed }) {
  const stages = [
    { id: 'plan', label: 'Plan' },
    { id: 'code', label: 'Code' },
    { id: 'test', label: 'Test' },
    { id: 'debug', label: 'Fix' }
  ];

  const getStageIndex = () => {
    switch(currentStage) {
      case 'planning': return 0;
      case 'coding': return 1;
      case 'testing': return 2;
      case 'debugging': return 3;
      case 'complete': return 4;
      case 'failed': return -1;
      default: return -1;
    }
  };

  const activeIndex = getStageIndex();
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-brand-bg relative">
      
      {/* Visualizer Circle */}
      <div className="relative w-64 h-64 flex flex-col items-center justify-center rounded-full border-2 border-brand-border bg-brand-card shadow-xl overflow-hidden">
        
        {/* Spinning indicator if active */}
        {activeIndex >= 0 && activeIndex < 4 && (
          <motion.div 
            className="absolute inset-0 border-t-2 border-brand-primary rounded-full z-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Orbit dots for stages */}
        {stages.map((stage, i) => {
          const rotation = i * 90;
          const isActive = activeIndex === i;
          const isPast = activeIndex > i;
          
          return (
            <div 
              key={stage.id}
              className="absolute w-full h-full pb-64 z-10"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 
                  ${isActive ? 'bg-brand-primary border-brand-primary shadow-[0_0_15px_#10f090] scale-125' : 
                    isPast ? 'bg-[#10f090]/50 border-[#10f090]/50' : 'bg-brand-bg border-brand-border'}
                `} 
              />
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-bold
                ${isActive ? 'text-brand-text' : isPast ? 'text-[#10f090]/70' : 'text-brand-muted'}
              `} style={{ transform: `rotate(-${rotation}deg)` }}>
                {stage.label}
              </div>
            </div>
          );
        })}

        {/* Center Loop Count */}
        <div className="z-10 flex flex-col items-center justify-center bg-brand-bg w-40 h-40 rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
          {activeIndex === 4 ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-brand-primary">
               <CheckCircle2 size={48} />
               <div className="text-xs font-mono font-bold mt-2 text-center uppercase tracking-widest">Complete</div>
            </motion.div>
          ) : isFailed ? (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-brand-destructive">
               <XCircle size={48} />
               <div className="text-xs font-mono font-bold mt-2 text-center uppercase tracking-widest">Failed</div>
            </motion.div>
          ) : (
            <>
              <div className="text-5xl font-mono font-black text-brand-text">
                {iterations || 1}
              </div>
              <div className="text-xs text-brand-muted uppercase tracking-widest font-bold mt-1">Iteration</div>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}

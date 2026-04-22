import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAgentLoop from "../hooks/useAgentLoop";

import RequirementInput from "../components/RequirementInput";
import ProjectHeader from "../components/ProjectHeader";
import TaskQueuePanel from "../components/TaskQueuePanel";
import MemoryPanel from "../components/MemoryPanel";
import CodeView from "../components/CodeView";
import TestResultsPanel from "../components/TestResultsPanel";
import DebugLoopVisualizer from "../components/DebugLoopVisualizer";
import StatsBar from "../components/StatsBar";

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const navigate = useNavigate();
  
  const {
    project,
    isRunning,
    elapsedTime,
    activeTaskId,
    setActiveTaskId,
    runAgent,
    reset
  } = useAgentLoop(projectId);

  const [activeTab, setActiveTab] = useState("code");

  // Keep active task selection in sync if agent is running
  useEffect(() => {
    if (isRunning && activeTaskId && !project?.tasks?.find(t => t.id === activeTaskId)) {
       // if we changed activeTask but it's not present... wait activeTaskId is maintained in hook
    }
  }, [isRunning, activeTaskId]);

  const handleStart = async ({ title, requirement }) => {
    await runAgent(title, requirement);
  };

  const handleReset = () => {
    reset();
    navigate('/workspace');
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
        <RequirementInput onSubmit={handleStart} isLoading={isRunning} />
      </div>
    );
  }

  const activeTask = project.tasks.find(t => t.id === activeTaskId) || project.tasks[0];

  return (
    <div className="h-screen w-full bg-brand-bg flex flex-col overflow-hidden text-brand-text">
      
      {/* Header */}
      <ProjectHeader 
        project={project} 
        elapsedTime={elapsedTime} 
        onReset={handleReset} 
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Task Queue */}
        <div className="w-[300px] shrink-0">
          <TaskQueuePanel 
            tasks={project.tasks} 
            activeTaskId={activeTaskId} 
            onSelectTask={setActiveTaskId}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 p-2 bg-[#050810] border-b border-brand-border">
            {['code', 'tests', 'debug loop', 'final output'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-mono tracking-wide capitalize transition-colors ${
                  activeTab === tab 
                    ? "bg-brand-mutedBg text-brand-text border border-brand-border" 
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-bg select-none"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'code' && (
              <CodeView code={activeTask?.code || ''} />
            )}
            
            {activeTab === 'tests' && (
              <TestResultsPanel 
                results={activeTask?.test_results} 
                errors={activeTask?.errors} 
                passed={activeTask?.status === 'complete' || activeTask?.status === 'failed'} 
                hasRun={activeTask?.status !== 'queued' && activeTask?.status !== 'coding'}
              />
            )}
            
            {activeTab === 'debug loop' && (
              <DebugLoopVisualizer 
                currentStage={activeTask?.status} 
                iterations={activeTask?.debug_iterations} 
                isFailed={activeTask?.status === 'failed'}
              />
            )}

            {activeTab === 'final output' && (
              <CodeView code={project.final_code || '// Generating final codebase component structure...'} />
            )}
          </div>

          {/* Bottom Stats area */}
          <div className="bg-[#050810] border-t border-brand-border p-4">
            <StatsBar tasks={project.tasks} totalIterations={project.total_iterations} />
          </div>

        </div>

        {/* Right Sidebar: Memory Log */}
        <div className="w-[320px] shrink-0">
          <MemoryPanel memory={project.memory_log} />
        </div>

      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from "react";
import { invokeLLM } from "../lib/gemini";
import { ProjectDB } from "../lib/storage";

export default function useAgentLoop(initialProjectId = null) {
  const [project, setProject] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const timerRef = useRef(null);
  const isExecutingRef = useRef(false);

  // Load project on mount or when id changes
  useEffect(() => {
    if (initialProjectId) {
      const p = ProjectDB.get(initialProjectId);
      if (p) {
        setProject(p);
      }
    }
  }, [initialProjectId]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const updateProject = useCallback((updater) => {
    setProject(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      ProjectDB.update(next.id, next);
      return next;
    });
  }, []);

  const addMemory = useCallback((type, content) => {
    updateProject(prev => ({
      ...prev,
      memory_log: [...prev.memory_log, { timestamp: new Date().toISOString(), type, content }]
    }));
  }, [updateProject]);

  const updateTask = useCallback((taskId, updates) => {
    updateProject(prev => {
      const newTasks = prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
      return { ...prev, tasks: newTasks };
    });
  }, [updateProject]);

  const runAgent = async (title, requirement) => {
    if (isExecutingRef.current) return;
    
    isExecutingRef.current = true;
    setIsRunning(true);
    setElapsedTime(0);

    let proj;
    try {
      // Initialize Project
      proj = ProjectDB.create({
        title,
        requirement,
        status: 'planning'
      });
      setProject(proj);
      
      addMemory("system", `Agent initialized. Analyzing requirement...`);
      addMemory("info", `Requirement: "${requirement}"`);
      addMemory("plan", "Calling Gemini for task planning...");

      // 1. PLANNING PHASE
      const planSchema = {
        type: "OBJECT",
        properties: {
          tasks: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                description: { type: "STRING" }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["tasks"]
      };

      const planResult = await invokeLLM({
        prompt: `You are an AI software engineer. Break this requirement into 3-5 development tasks: ${requirement}. Return JSON.`,
        responseJsonSchema: planSchema
      });

      const tasks = planResult.tasks.map(t => ({
        id: crypto.randomUUID(),
        title: t.title,
        description: t.description,
        status: 'queued',
        code: '',
        test_results: '',
        debug_iterations: 0,
        errors: []
      }));

      updateProject({ tasks });
      addMemory("plan", `Created ${tasks.length} tasks.`);
      proj.tasks = tasks; // update local ref

      // 2. FOR EACH TASK
      for (const t of tasks) {
        let currentTask = { ...t };
        setActiveTaskId(currentTask.id);
        addMemory("system", `Starting task: ${currentTask.title}`);
        
        // CODING PHASE
        updateTask(currentTask.id, { status: 'coding' });
        updateProject({ status: 'coding' });
        addMemory("code", "Generating code...");

        const codeResult = await invokeLLM({
          prompt: `Write clean JavaScript/React code for: ${currentTask.title}. Description: ${currentTask.description}. Context: ${requirement}. Return ONLY the valid code block, no markdown formatting if not part of code.`
        });
        
        currentTask.code = codeResult;
        updateTask(currentTask.id, { code: currentTask.code });
        addMemory("success", "Code generated.");

        // TESTING & DEBUGGING LOOP
        let passed = false;
        let iter = 0;
        
        while (!passed && iter < 5) {
          updateTask(currentTask.id, { status: 'testing' });
          updateProject({ status: 'testing' });
          addMemory("test", `Running tests (iteration ${iter + 1})...`);
          
          updateProject(p => ({ ...p, total_iterations: p.total_iterations + 1 }));
          updateTask(currentTask.id, { debug_iterations: iter });

          const testSchema = {
            type: "OBJECT",
            properties: {
              passed: { type: "BOOLEAN" },
              results: { type: "STRING" },
              errors: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["passed", "results", "errors"]
          };
          
          const testResult = await invokeLLM({
            prompt: `Review and simulate test results for this code: \n\n${currentTask.code}. \n\nReturn JSON with boolean passed, string results, and array of errors (empty if passed).`,
            responseJsonSchema: testSchema
          });

          currentTask.test_results = testResult.results;
          currentTask.errors = testResult.errors || [];
          updateTask(currentTask.id, { 
            test_results: currentTask.test_results,
            errors: currentTask.errors
          });

          if (testResult.passed) {
            passed = true;
            addMemory("success", "Tests passed!");
          } else {
            addMemory("debug", `Tests failed with ${currentTask.errors.length} errors.`);
            updateTask(currentTask.id, { status: 'debugging' });
            updateProject({ status: 'debugging' });
            
            addMemory("debug", "Generating fix...");
            const fixResult = await invokeLLM({
               prompt: `Fix this code: \n\n${currentTask.code}\n\nErrors: ${JSON.stringify(currentTask.errors)}. Return only the fixed code block.`
            });
            currentTask.code = fixResult;
            updateTask(currentTask.id, { code: currentTask.code });
            iter++;
          }
        }

        if (passed) {
          updateTask(currentTask.id, { status: 'complete' });
          addMemory("success", `Task "${currentTask.title}" completed.`);
        } else {
          updateTask(currentTask.id, { status: 'failed' });
          addMemory("error", `Task "${currentTask.title}" failed after 5 iterations.`);
          throw new Error(`Task failed: ${currentTask.title}`);
        }
      }

      // 3. FINAL ASSEMBLY
      updateProject({ status: 'coding' });
      addMemory("system", "Assembling final codebase...");
      
      // We grab latest from DB to ensure we have all code
      const currentProj = ProjectDB.get(proj.id);
      const allCode = currentProj.tasks.map(t => `/* --- ${t.title} --- */\n${t.code}`).join('\n\n');

      const finalCodeResult = await invokeLLM({
         prompt: `Combine these code modules into one cohesive final file. Return ONLY the final formatted code:\n\n${allCode}`
      });

      updateProject({ 
        status: 'complete', 
        final_code: finalCodeResult 
      });
      
      addMemory("success", "Project completed successfully.");
      setIsRunning(false);
      isExecutingRef.current = false;

    } catch (e) {
      console.error(e);
      if (proj) {
        updateProject({ status: 'failed' });
      }
      addMemory("error", `Agent execution halted: ${e.message}`);
      setIsRunning(false);
      isExecutingRef.current = false;
    }
  };

  const reset = () => {
    setProject(null);
    setIsRunning(false);
    setElapsedTime(0);
    setActiveTaskId(null);
    isExecutingRef.current = false;
  };

  return {
    project,
    isRunning,
    elapsedTime,
    activeTaskId,
    setActiveTaskId,
    runAgent,
    reset
  };
}

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Map, 
  Plus, 
  Trash2, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  Loader2, 
  Clock, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const Roadmaps: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Reset scroll of parent main layout when roadmap changes
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [activeRoadmapId, isCreating]);

  // Fetch all roadmaps
  const { data: roadmaps, isLoading: loadingList } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const res = await api.get('/api/roadmaps');
      return res.data;
    },
  });

  // Fetch details of active roadmap
  const { data: roadmapDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['roadmapDetails', activeRoadmapId],
    queryFn: async () => {
      if (!activeRoadmapId) return null;
      const res = await api.get(`/api/roadmaps/${activeRoadmapId}`);
      return res.data;
    },
    enabled: !!activeRoadmapId,
  });

  // Generate roadmap mutation
  const generateRoadmapMutation = useMutation({
    mutationFn: async (topic: string) => {
      const res = await api.post('/api/roadmaps/generate', { topic });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      setActiveRoadmapId(data.id);
      setTopicInput('');
      setIsCreating(false);
    },
  });

  // Toggle task checklist
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return api.patch(`/api/roadmaps/tasks/${taskId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapDetails', activeRoadmapId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] }); // refresh stats on change
    },
  });

  // Delete roadmap
  const deleteRoadmapMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/api/roadmaps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      if (activeRoadmapId) setActiveRoadmapId(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    generateRoadmapMutation.mutate(topicInput);
  };

  // Calculate task completions percentage
  const calculateProgress = (nodes: any[]) => {
    if (!nodes || nodes.length === 0) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    nodes.forEach(node => {
      node.tasks?.forEach((task: any) => {
        totalTasks++;
        if (task.isCompleted || task.completed) completedTasks++;
      });
    });
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
      
      {/* Sidebar - Roadmaps lists */}
      <div className="glass-card p-4 border border-slate-800 bg-slate-900/30 flex flex-col h-full md:col-span-1">
        <button
          onClick={() => { setIsCreating(true); setActiveRoadmapId(null); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-purple-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Roadmap</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {loadingList ? (
            <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto py-4" />
          ) : !roadmaps || roadmaps.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No roadmaps generated yet.</p>
          ) : (
            roadmaps.map((r: any) => (
              <div
                key={r.id}
                onClick={() => { setActiveRoadmapId(r.id); setIsCreating(false); }}
                className={`
                  flex items-center justify-between p-3 rounded-lg text-xs font-semibold cursor-pointer border transition-all group
                  ${activeRoadmapId === r.id 
                    ? 'bg-purple-600/15 border-purple-500/35 text-purple-400' 
                    : 'text-slate-350 bg-slate-950/20 border-transparent hover:text-white hover:bg-slate-800/40'}
                `}
              >
                <div className="flex items-center gap-2 truncate">
                  <Map className="w-4 h-4 shrink-0 text-purple-400" />
                  <span className="truncate">{r.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoadmapMutation.mutate(r.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Panel Detail View */}
      <div className="glass-card border border-slate-800 bg-slate-900/30 p-6 md:col-span-3 min-h-[400px] flex flex-col">
        {isCreating ? (
          /* Generation Panel form */
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full space-y-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto animate-bounce mb-3" />
              <h4 className="text-lg font-bold text-white">Generate Learning Roadmap</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Provide a career path, tech stack, or target role. PathPilot AI will model a week-by-week curriculum containing hourly suggestions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Domain/Stack</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect, FastAPI Developer"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={generateRoadmapMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-purple-600/10"
              >
                {generateRoadmapMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Compile AI Curriculum</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : !activeRoadmapId ? (
          /* Landing Empty View */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Map className="w-12 h-12 text-purple-500 animate-pulse mb-3" />
            <h4 className="text-base font-bold text-white">Select a Learning Path</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5">
              Select an existing roadmap from the sidebar or click 'New AI Roadmap' to generate a curriculum.
            </p>
          </div>
        ) : loadingDetails ? (
          /* Loading Detail View */
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
            <span className="text-xs text-slate-400">Loading syllabus data...</span>
          </div>
        ) : !roadmapDetails ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-400">Curriculum not found.</p>
          </div>
        ) : (
          /* Detail Syllabus Panel */
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Title / Description / Progress */}
            <div className="border-b border-slate-900 pb-5">
              <h3 className="text-xl font-bold text-white leading-tight">{roadmapDetails.title}</h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{roadmapDetails.description}</p>
              
              {/* Progress indicator */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progress Tracker</span>
                  <span className="text-purple-400">{calculateProgress(roadmapDetails.nodes)}% Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProgress(roadmapDetails.nodes)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Weeks list */}
            <div className="space-y-4">
              {roadmapDetails.nodes?.map((node: any) => (
                <div 
                  key={node.id}
                  className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>{node.title}</span>
                    </h5>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-850">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Module {node.weekNumber}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{node.description}</p>

                  {/* Tasks Sub list */}
                  <div className="pl-6 space-y-2 pt-2 border-t border-slate-900/60">
                    {node.tasks?.map((task: any) => (
                      <div 
                        key={task.id}
                        onClick={() => toggleTaskMutation.mutate(task.id)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/20 hover:bg-slate-900/50 border border-transparent hover:border-slate-800/40 text-xs cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {task.isCompleted || task.completed ? (
                            <CheckSquare className="w-4 h-4 text-purple-500 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-400 shrink-0" />
                          )}
                          <span className={`truncate font-medium ${task.isCompleted || task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.estimatedHours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

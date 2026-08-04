import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Flame, 
  Map, 
  FileText, 
  Compass, 
  ArrowRight,
  PlusCircle,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProgress, setNewSkillProgress] = useState(50);

  // Fetch Dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/stats');
      return res.data;
    },
  });

  // Mutate skills
  const addSkillMutation = useMutation({
    mutationFn: async (payload: { skillName: string; progressPercentage: number }) => {
      return api.post('/api/dashboard/skills', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setNewSkillName('');
      setShowAddSkill(false);
    },
  });

  // Increment Streak manually (optional dashboard feature)
  const incrementStreakMutation = useMutation({
    mutationFn: async () => {
      return api.post('/api/dashboard/streak');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkillMutation.mutate({
      skillName: newSkillName,
      progressPercentage: newSkillProgress,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get calendar date strings for rendering grid
  const activityMap = stats?.dailyActivity || {};
  const activityKeys = Object.keys(activityMap).sort();

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-slate-900 border border-slate-800/40';
      case 1: return 'bg-purple-950 border border-purple-900/30';
      case 2: return 'bg-purple-800/70 border border-purple-700/35';
      case 3: return 'bg-purple-600/80 border border-purple-500/40';
      case 4: return 'bg-purple-400 border border-purple-300/60';
      default: return 'bg-slate-900';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Card banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-purple-900/10 via-slate-900/40 to-indigo-950/15 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Welcome back, <span className="text-gradient">{stats?.fullName}</span>!
          </h2>
          <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl">
            Optimize your preparation metrics. Ready to analyze resumes, track technical targets, or chat with AI coaches?
          </p>
        </div>
        <button
          onClick={() => incrementStreakMutation.mutate()}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-md"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Sync Daily Log</span>
        </button>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning Paths</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">{stats?.totalRoadmaps}</h3>
            <p className="text-xs text-slate-500 mt-1">Generated roadmaps</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Map className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Box</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">{stats?.totalDocuments}</h3>
            <p className="text-xs text-slate-500 mt-1">Uploaded Resumes & JDs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Metrics</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">{stats?.skills?.length || 0}</h3>
            <p className="text-xs text-slate-500 mt-1">Mastered skill targets</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Study Activity Streak heatmap */}
        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-white">Platform Activity Calendar</h4>
            <span className="text-xs text-slate-500">Last 30 Days</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 gap-2.5">
            {activityKeys.map((date) => {
              const count = activityMap[date] || 0;
              return (
                <div 
                  key={date}
                  className={`w-7 h-7 rounded-md transition-all hover:scale-115 relative group cursor-pointer ${getActivityColor(count)}`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-9 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-800 shadow-xl pointer-events-none whitespace-nowrap z-20 transition-all">
                    {date}: {count} contribution{count !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-5 text-[10px] text-slate-500">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" />
            <div className="w-3.5 h-3.5 rounded bg-purple-950" />
            <div className="w-3.5 h-3.5 rounded bg-purple-800/70" />
            <div className="w-3.5 h-3.5 rounded bg-purple-600" />
            <div className="w-3.5 h-3.5 rounded bg-purple-400" />
            <span>More</span>
          </div>
        </div>

        {/* Skills Track List */}
        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white">Tracked Skills</h4>
              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="text-purple-400 hover:text-purple-300 p-1 hover:bg-purple-500/10 rounded-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            {showAddSkill && (
              <form onSubmit={handleAddSkill} className="mb-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/50 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Java"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400">Progress: {newSkillProgress}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkillProgress}
                    onChange={(e) => setNewSkillProgress(Number(e.target.value))}
                    className="flex-1 accent-purple-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-end gap-2 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSkill(false)}
                    className="px-2 py-1 border border-slate-800 text-slate-400 rounded hover:bg-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4 max-h-[170px] overflow-y-auto pr-1">
              {!stats?.skills || stats.skills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500">No skills added yet.</p>
                </div>
              ) : (
                stats.skills.map((skill: any) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{skill.skillName}</span>
                      <span className="text-slate-400 font-mono">{skill.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${skill.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl bg-slate-950/20 border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
              <Compass className="w-5 h-5" />
              <span className="text-sm">Personal Career Coaching</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stuck on choosing between frontend development, backend engineering, or mobile apps? Fire up the AI career coach to chart your trajectory.
            </p>
          </div>
          <Link 
            to="/chat" 
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold mt-4 transition-all"
          >
            <span>Start Conversation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-slate-950/20 border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">ATS Optimization sandbox</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your resume to calculate its ATS parse score, highlight tech gaps against live profiles, and secure improvement points.
            </p>
          </div>
          <Link 
            to="/resume" 
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-4 transition-all"
          >
            <span>Scan Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};

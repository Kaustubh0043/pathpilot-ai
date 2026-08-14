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
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProgress, setNewSkillProgress] = useState(50);

  // Editable Career Goal from localStorage
  const [careerGoal, setCareerGoal] = useState(() => {
    return localStorage.getItem('careerGoal') || 'Software Engineer';
  });

  // Dynamic route ticks based on actual feature completions
  const interviewCompleted = localStorage.getItem('interviewCompleted') === 'true';
  const jobMatchCompleted = localStorage.getItem('jobMatchCompleted') === 'true';

  // Fetch Dashboard statistics (Preserving existing query)
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/stats');
      return res.data;
    },
  });

  // Mutate skills (Preserving existing mutation)
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

  // Increment Streak manually (Preserving existing mutation)
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
        <div className="w-8 h-8 border-2 border-slate-700 border-t-[#9B5CFF] rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate dynamic, authentic progress based on actual user database statistics (Points 22, 44)
  const totalRoadmaps = stats?.totalRoadmaps || 0;
  const totalDocuments = stats?.totalDocuments || 0;
  const totalSkills = stats?.skills?.length || 0;

  const resumeWeight = totalDocuments ? Math.min(totalDocuments * 15, 30) : 10;
  const skillWeight = totalSkills ? Math.min(totalSkills * 10, 30) : 0;
  const roadmapWeight = totalRoadmaps ? Math.min(totalRoadmaps * 15, 20) : 0;
  const pathProgress = Math.min(18 + resumeWeight + skillWeight + roadmapWeight, 95);

  // Dynamic active navigation indicator stage mapping (Point 15)
  let activeStage = 'Resume';
  if (totalDocuments === 0) {
    activeStage = 'Resume';
  } else if (totalSkills === 0) {
    activeStage = 'Skills';
  } else if (totalRoadmaps === 0) {
    activeStage = 'Projects';
  } else {
    activeStage = 'Interviews';
  }

  // Dynamic Next Move definition based on real states (Point 23)
  let nextMoveTitle = '';
  let nextMoveDesc = '';
  let nextMoveLink = '';
  let nextMoveButtonText = '';

  if (totalDocuments === 0) {
    nextMoveTitle = 'Upload Your Technical Resume';
    nextMoveDesc = 'Analyze your current baseline ATS score and profile keywords.';
    nextMoveLink = '/dashboard/resume';
    nextMoveButtonText = 'Analyze Resume';
  } else if (totalSkills === 0) {
    nextMoveTitle = 'Map Your Technical Skills';
    nextMoveDesc = 'Add your first engineering or language skill to start mapping your career roadmap.';
    nextMoveLink = '#skills-section';
    nextMoveButtonText = 'Add Skill';
  } else if (totalRoadmaps === 0) {
    nextMoveTitle = 'Generate a Learning Path';
    nextMoveDesc = 'Create a week-by-week curriculum checksheet covering database or microservice systems.';
    nextMoveLink = '/dashboard/roadmaps';
    nextMoveButtonText = 'Build Roadmap';
  } else {
    nextMoveTitle = 'Simulate Technical Interview';
    nextMoveDesc = 'Practice conversational mock questions tailored specifically to your target roles.';
    nextMoveLink = '/dashboard/interviews';
    nextMoveButtonText = 'Start Interview';
  }

  // Activity map calendar rendering configurations
  const activityMap = stats?.dailyActivity || {};
  const activityKeys = Object.keys(activityMap).sort();

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-[#11151D] border border-slate-900';
      case 1: return 'bg-[#9B5CFF]/15 border border-[#9B5CFF]/10';
      case 2: return 'bg-[#9B5CFF]/35 border border-[#9B5CFF]/20';
      case 3: return 'bg-[#9B5CFF]/60 border border-[#9B5CFF]/30';
      case 4: return 'bg-[#9B5CFF] border border-[#C49AFF]/45';
      default: return 'bg-[#11151D]';
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Editorial Dashboard Hero (Point 21) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
        <div className="space-y-2">
          <p className="eyebrow-text">Overview</p>
          <h2 className="text-3xl font-extrabold text-[#F4F1EA] tracking-tight">
            Good evening, {stats?.fullName || 'Developer'}.
          </h2>
          <div className="text-sm text-[#9299A8] max-w-xl font-medium flex items-center gap-1.5 flex-wrap">
            <span>Your path to</span>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => {
                const val = e.target.value;
                setCareerGoal(val);
                localStorage.setItem('careerGoal', val);
                window.dispatchEvent(new Event('careerGoalUpdated'));
              }}
              placeholder="e.g. Software Engineer"
              className="bg-transparent border-b border-dashed border-slate-700 text-[#F4F1EA] font-semibold focus:outline-none focus:border-[#9B5CFF] px-1 py-0.5"
              style={{ width: `${Math.max(careerGoal.length * 8.5, 120)}px`, fontSize: '14px', lineHeight: 'normal' }}
            />
            <span>is currently <span className="text-[#9B5CFF] font-bold">{pathProgress}%</span> complete.</span>
          </div>
          <div className="pt-2">
            <Link 
              to={nextMoveLink.startsWith('#') ? '/dashboard' : nextMoveLink}
              onClick={() => {
                if (nextMoveLink === '#skills-section') {
                  document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
                  setShowAddSkill(true);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#9B5CFF] hover:text-[#C49AFF] font-bold transition-all"
            >
              <span>Continue your path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <button
          onClick={() => incrementStreakMutation.mutate()}
          className="self-start md:self-center flex items-center gap-2 px-4 py-2 bg-[#11151D] hover:bg-[#151A23] border border-slate-800 text-[#F4F1EA] rounded-md text-xs font-semibold transition-all cursor-pointer"
        >
          <Flame className="w-4 h-4 text-[#E9B84B]" />
          <span>Sync Daily Log</span>
        </button>
      </div>

      {/* Signature Career Route Visual Tracker (Point 24) */}
      <div className="space-y-4">
        <p className="eyebrow-text">Career Route Tracker</p>
        <div className="relative bg-[#0D1016] border border-slate-900 p-6 rounded-lg overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] relative px-4">
            
            {/* Background line indicator */}
            <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-slate-800 -translate-y-1/2 z-0" />
            
            {/* START Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-4 h-4 rounded-full bg-[#55D39A] flex items-center justify-center text-[8px] text-[#07080C] font-bold">✓</div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start</span>
            </div>

            {/* Resume Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                totalDocuments > 0 
                  ? 'bg-[#55D39A] border-[#55D39A]' 
                  : activeStage === 'Resume' ? 'border-[#9B5CFF] bg-[#07080C] ring-4 ring-[#9B5CFF]/15' : 'border-slate-800 bg-[#07080C]'
              }`}>
                {totalDocuments > 0 && <span className="text-[8px] text-[#07080C] font-bold">✓</span>}
                {totalDocuments === 0 && activeStage === 'Resume' && <span className="w-1.5 h-1.5 rounded-full bg-[#9B5CFF]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStage === 'Resume' ? 'text-[#9B5CFF]' : 'text-slate-500'}`}>Resume</span>
            </div>

            {/* Skills Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                totalSkills > 0 
                  ? 'bg-[#55D39A] border-[#55D39A]' 
                  : activeStage === 'Skills' ? 'border-[#9B5CFF] bg-[#07080C] ring-4 ring-[#9B5CFF]/15' : 'border-slate-800 bg-[#07080C]'
              }`}>
                {totalSkills > 0 && <span className="text-[8px] text-[#07080C] font-bold">✓</span>}
                {totalSkills === 0 && activeStage === 'Skills' && <span className="w-1.5 h-1.5 rounded-full bg-[#9B5CFF]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStage === 'Skills' ? 'text-[#9B5CFF]' : 'text-slate-500'}`}>Skills</span>
            </div>

            {/* Projects Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                totalRoadmaps > 0 
                  ? 'bg-[#55D39A] border-[#55D39A]' 
                  : activeStage === 'Projects' ? 'border-[#9B5CFF] bg-[#07080C] ring-4 ring-[#9B5CFF]/15' : 'border-slate-800 bg-[#07080C]'
              }`}>
                {totalRoadmaps > 0 && <span className="text-[8px] text-[#07080C] font-bold">✓</span>}
                {totalRoadmaps === 0 && activeStage === 'Projects' && <span className="w-1.5 h-1.5 rounded-full bg-[#9B5CFF]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStage === 'Projects' ? 'text-[#9B5CFF]' : 'text-slate-500'}`}>Projects</span>
            </div>

            {/* Interviews Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                interviewCompleted 
                  ? 'bg-[#55D39A] border-[#55D39A]' 
                  : activeStage === 'Interviews' ? 'border-[#9B5CFF] bg-[#07080C] ring-4 ring-[#9B5CFF]/15' : 'border-slate-800 bg-[#07080C]'
              }`}>
                {interviewCompleted && <span className="text-[8px] text-[#07080C] font-bold">✓</span>}
                {!interviewCompleted && activeStage === 'Interviews' && <span className="w-1.5 h-1.5 rounded-full bg-[#9B5CFF]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStage === 'Interviews' ? 'text-[#9B5CFF]' : 'text-slate-500'}`}>Interviews</span>
            </div>

            {/* Applications Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                jobMatchCompleted 
                  ? 'bg-[#55D39A] border-[#55D39A]' 
                  : activeStage === 'Applications' ? 'border-[#9B5CFF] bg-[#07080C] ring-4 ring-[#9B5CFF]/15' : 'border-slate-800 bg-[#07080C]'
              }`}>
                {jobMatchCompleted && <span className="text-[8px] text-[#07080C] font-bold">✓</span>}
                {!jobMatchCompleted && activeStage === 'Applications' && <span className="w-1.5 h-1.5 rounded-full bg-[#9B5CFF]" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStage === 'Applications' ? 'text-[#9B5CFF]' : 'text-slate-500'}`}>Applications</span>
            </div>

            {/* DESTINATION Node */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-[#07080C] flex items-center justify-center" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination</span>
            </div>

          </div>
        </div>
      </div>

      {/* Main Split Grid (Whitespace offset composition) (Point 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Readiness & Next Move */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Career Readiness Metrics (Point 22) */}
          <div className="space-y-4">
            <p className="eyebrow-text">Career Readiness</p>
            <div className="bg-[#0D1016] border border-slate-900 p-6 rounded-lg space-y-6">
              
              {/* Resume Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>Resume Quality</span>
                  <span className="font-mono">{totalDocuments ? '80%' : '20%'}</span>
                </div>
                <div className="w-full h-1.5 bg-[#11151D] rounded overflow-hidden">
                  <div 
                    className="h-full bg-[#9B5CFF] transition-all duration-500" 
                    style={{ width: totalDocuments ? '80%' : '20%' }}
                  />
                </div>
              </div>

              {/* Skills Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>Technical Skills Map</span>
                  <span className="font-mono">{totalSkills > 0 ? `${Math.min(totalSkills * 20, 90)}%` : '0%'}</span>
                </div>
                <div className="w-full h-1.5 bg-[#11151D] rounded overflow-hidden">
                  <div 
                    className="h-full bg-[#9B5CFF] transition-all duration-500" 
                    style={{ width: totalSkills > 0 ? `${Math.min(totalSkills * 20, 90)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Projects Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>Applied Projects Proof</span>
                  <span className="font-mono">{totalRoadmaps > 0 ? '70%' : '10%'}</span>
                </div>
                <div className="w-full h-1.5 bg-[#11151D] rounded overflow-hidden">
                  <div 
                    className="h-full bg-[#9B5CFF] transition-all duration-500" 
                    style={{ width: totalRoadmaps > 0 ? '70%' : '10%' }}
                  />
                </div>
              </div>

              {/* Interview Readiness Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>Interview Readiness</span>
                  <span className="font-mono">10%</span>
                </div>
                <div className="w-full h-1.5 bg-[#11151D] rounded overflow-hidden">
                  <div className="h-full bg-[#9B5CFF]" style={{ width: '10%' }} />
                </div>
              </div>

              {/* Applications Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#F4F1EA]">
                  <span>Career Applications</span>
                  <span className="font-mono">0%</span>
                </div>
                <div className="w-full h-1.5 bg-[#11151D] rounded overflow-hidden">
                  <div className="h-full bg-[#9B5CFF]" style={{ width: '0%' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Next Move Callout Action Panel (Point 23) */}
          <div className="space-y-4">
            <p className="eyebrow-text">Next Move</p>
            <div className="bg-[#0D1016] border-l-2 border-[#9B5CFF] border-y border-r border-slate-900 p-6 rounded-r-lg space-y-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#F4F1EA] tracking-tight">{nextMoveTitle}</h4>
                <p className="text-xs text-[#9299A8] leading-relaxed">{nextMoveDesc}</p>
              </div>
              <div>
                {nextMoveLink.startsWith('#') ? (
                  <button
                    onClick={() => {
                      document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
                      setShowAddSkill(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded transition-all cursor-pointer"
                  >
                    <span>{nextMoveButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    to={nextMoveLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded transition-all"
                  >
                    <span>{nextMoveButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Tracked Skills & Activity */}
        <div className="lg:col-span-5 space-y-12">
          
          {/* Skills Track List (Point 26) */}
          <div id="skills-section" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <p className="eyebrow-text">Your Skill Map</p>
              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="text-[#9B5CFF] hover:text-[#C49AFF] p-1 rounded transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {showAddSkill && (
              <form onSubmit={handleAddSkill} className="p-4 rounded bg-[#0D1016] border border-slate-900 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spring Boot, Java, PostgreSQL"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400">Progress: {newSkillProgress}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newSkillProgress}
                      onChange={(e) => setNewSkillProgress(Number(e.target.value))}
                      className="flex-1 accent-[#9B5CFF] h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-[10px] font-semibold pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSkill(false)}
                    className="px-2.5 py-1 border border-slate-800 text-slate-400 rounded hover:bg-[#11151D] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-2.5 py-1 bg-[#9B5CFF] text-[#07080C] rounded hover:bg-[#C49AFF] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4 bg-[#0D1016] border border-slate-900 p-6 rounded-lg max-h-[220px] overflow-y-auto custom-scrollbar">
              {!stats?.skills || stats.skills.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-slate-400">Nothing here yet.</p>
                  <p className="text-[11px] text-[#606979] leading-normal max-w-[200px] mx-auto">
                    Add your first skill and PathPilot will begin mapping your technical profile.
                  </p>
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="px-3 py-1 bg-[#11151D] hover:bg-[#151A23] border border-slate-800 text-[#F4F1EA] text-[10px] font-bold rounded cursor-pointer"
                  >
                    Add Skill
                  </button>
                </div>
              ) : (
                stats.skills.map((skill: any) => (
                  <div key={skill.id} className="space-y-1.5 pb-3 border-b border-slate-900/60 last:border-b-0 last:pb-0">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{skill.skillName}</span>
                      <span className="text-[#9B5CFF] font-mono text-[11px]">{skill.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 roundedoverflow-hidden">
                      <div 
                        className="h-full bg-[#9B5CFF] transition-all duration-500" 
                        style={{ width: `${skill.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Simple Study Activity Streak calendar heatmap (Point 25) */}
          <div className="space-y-4">
            <p className="eyebrow-text">Activity Heatmap</p>
            <div className="bg-[#0D1016] border border-slate-900 p-6 rounded-lg">
              <div className="grid grid-cols-10 gap-1.5">
                {activityKeys.map((date) => {
                  const count = activityMap[date] || 0;
                  return (
                    <div 
                      key={date}
                      className={`w-6 h-6 rounded transition-all hover:scale-110 relative group cursor-pointer ${getActivityColor(count)}`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-800 shadow-xl pointer-events-none whitespace-nowrap z-20 transition-all font-semibold">
                        {date}: {count} contribution{count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 font-bold border-t border-slate-900/60 pt-3">
                <span>Intensity scale:</span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded bg-[#11151D] border border-slate-900" />
                  <div className="w-3 h-3 rounded bg-[#9B5CFF]/15" />
                  <div className="w-3 h-3 rounded bg-[#9B5CFF]/35" />
                  <div className="w-3 h-3 rounded bg-[#9B5CFF]/60" />
                  <div className="w-3 h-3 rounded bg-[#9B5CFF]" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

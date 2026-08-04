import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Sparkles, 
  Loader2, 
  GitBranch, 
  BookOpen, 
  Terminal,
  HelpCircle
} from 'lucide-react';

export const JdMatch: React.FC = () => {
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<any>(null);

  // Fetch resumes list
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/api/documents');
      return res.data;
    },
  });

  const resumes = documents?.filter((d: any) => d.fileType === 'RESUME') || [];

  // Match Job Description mutation
  const matchJdMutation = useMutation({
    mutationFn: async (payload: { resumeId: string; jdText: string }) => {
      const res = await api.post(`/api/documents/${payload.resumeId}/compare-jd`, {
        jdText: payload.jdText,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !jdText.trim()) return;
    matchJdMutation.mutate({
      resumeId: selectedResumeId,
      jdText,
    });
  };

  const getMatchColor = (percent: number) => {
    if (percent >= 75) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (percent >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Input panel Form */}
      <div className="glass-card p-6 border border-slate-800 bg-slate-900/30">
        <h4 className="text-base font-bold text-white mb-4">Job Description Matcher</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Resume Selector */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Resume Profile</label>
              <select
                required
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-600"
              >
                <option value="">-- Choose Profile --</option>
                {resumes.map((doc: any) => (
                  <option key={doc.id} value={doc.id}>{doc.filename}</option>
                ))}
              </select>
            </div>

            {/* Hint message */}
            <div className="md:col-span-2 text-xs text-slate-400 pb-2">
              PathPilot will compare the selected resume content against the job description to calculate fit compatibility and recommend targeted tech learning nodes.
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Job Description</label>
            <textarea
              required
              rows={6}
              placeholder="Paste the complete job description details, role criteria, tech stacks..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all font-sans leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={matchJdMutation.isPending || !selectedResumeId || !jdText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-purple-600/10"
          >
            {matchJdMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Tech Compatibility Match</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results panel Display */}
      {result && (
        <div className="glass-card border border-slate-800 bg-slate-900/30 p-6 space-y-6 animate-fade-in">
          
          {/* Header Match Ratio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/30 border border-slate-850">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skill Compatibility Ratio</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-extrabold px-3 py-1 rounded-lg border ${getMatchColor(result.match_percentage)}`}>
                  {result.match_percentage}%
                </span>
                <span className="text-sm text-slate-400 font-medium">compatibility fit</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              The ATS mapping engine has calculated a match of {result.match_percentage}%. Read the gap reports below to optimize alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Missing Technologies */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Missing Stacks & Technologies</span>
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.missing_technologies?.map((tech: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <GitBranch className="w-4 h-4 text-amber-500" />
                <span>Core Skill Gap Bulletins</span>
              </h5>
              <ul className="space-y-2">
                {result.skill_gap_analysis?.map((gap: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-350 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Path */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Skill Recovery Pathways</span>
              </h5>
              <ul className="space-y-2">
                {result.recommended_learning_path?.map((path: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-350 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0 mt-1.5" />
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Topics */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Recommended Mock Prep Topics</span>
              </h5>
              <ul className="space-y-2">
                {result.interview_prep_topics?.map((topic: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-350 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

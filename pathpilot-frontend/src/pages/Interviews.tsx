import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  Loader2, 
  Award,
  ArrowRight
} from 'lucide-react';

export const Interviews: React.FC = () => {
  const [roleInput, setRoleInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [expectedPoints, setExpectedPoints] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);

  // Generate question mutation
  const generateQuestionMutation = useMutation({
    mutationFn: async (role: string) => {
      const res = await api.post('/api/ai/interview/generate', { role });
      return res.data;
    },
    onSuccess: (data) => {
      setCurrentQuestion(data.question);
      setExpectedPoints(data.expected_points);
      setEvaluation(null);
      setUserAnswer('');
    },
  });

  // Evaluate answer mutation
  const evaluateAnswerMutation = useMutation({
    mutationFn: async (payload: { question: string; answer: string }) => {
      const res = await api.post('/api/ai/interview/evaluate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      setEvaluation(data);
    },
  });

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    generateQuestionMutation.mutate(roleInput);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentQuestion) return;
    evaluateAnswerMutation.mutate({
      question: currentQuestion,
      answer: userAnswer,
    });
  };

  const handleNext = () => {
    generateQuestionMutation.mutate(roleInput);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Role configuration bar */}
      {!currentQuestion ? (
        <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 max-w-xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <HelpCircle className="w-12 h-12 text-purple-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">AI Mock Interview Simulator</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Simulate high-pressure technical or HR discussions. Input your target role and PathPilot will serve questions, analyze your replies, and assign score benchmarks.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <input
              type="text"
              required
              placeholder="e.g. Senior Java Spring Boot Developer, HR Freshers Panel"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all text-center"
            />
            <button
              type="submit"
              disabled={generateQuestionMutation.isPending || !roleInput.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10"
            >
              {generateQuestionMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Initiate Interview Session</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Active Interview Viewport */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left Panel - Question & Answer Area */}
          <div className="space-y-6 md:col-span-3">
            
            {/* The Question */}
            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30 space-y-3">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interviewer Question</span>
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            {/* Answer Input Area */}
            {!evaluation && (
              <div className="glass-card p-5 border border-slate-800 bg-slate-900/30">
                <form onSubmit={handleEvaluate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Technical Answer</label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Compose your structural explanation, system designs, or programmatic solutions..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(null)}
                      className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-400 rounded-lg cursor-pointer"
                    >
                      Exit Session
                    </button>
                    
                    <button
                      type="submit"
                      disabled={evaluateAnswerMutation.isPending || !userAnswer.trim()}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/10"
                    >
                      {evaluateAnswerMutation.isPending ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Answer for AI Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Active Evaluation Panel */}
            {evaluation && (
              <div className="glass-card p-5 border border-slate-800 bg-slate-900/30 space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400" />
                    <span>Answer Evaluation Report</span>
                  </h5>
                  
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black px-2.5 py-0.5 rounded-lg border ${getScoreColor(evaluation.score)}`}>
                      {evaluation.score}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">/100 score</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">AI Critic Feedback</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 p-3 rounded-lg border border-slate-900/60">
                    {evaluation.feedback}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">AI Recommendation Model Answer</span>
                  <p className="text-xs text-slate-350 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950 p-4 rounded-lg border border-slate-850">
                    {evaluation.model_answer}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentQuestion(null)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-900 text-xs font-semibold text-slate-400 rounded-lg cursor-pointer"
                  >
                    Close Session
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={generateQuestionMutation.isPending}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-lg shadow-purple-600/10"
                  >
                    <span>Fetch Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Panel - Evaluator Context / Expected criteria */}
          <div className="space-y-6 md:col-span-2">
            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30 space-y-4">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Interviewer Target Criteria</span>
              </h5>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                To maximize your rating score, verify that your answer addresses these key domain concepts:
              </p>
              
              <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-850 text-xs text-slate-300 font-medium font-sans leading-relaxed">
                {expectedPoints || "Initiate interview to view targeted key topics."}
              </div>
            </div>

            <div className="glass-card p-5 border border-slate-850 bg-slate-950/20 text-xs text-slate-500 leading-relaxed">
              <strong>Coaching Tip:</strong> Be precise. Elaborate on performance trade-offs, architecture selections, and production failure recoveries rather than just explaining definitions.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

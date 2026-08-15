import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Loader2, 
  ArrowRight,
  HelpCircle,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Award
} from 'lucide-react';

export const Interviews: React.FC = () => {
  const [roleInput, setRoleInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [expectedPoints, setExpectedPoints] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  
  // Track current question number in simulation session (Point 33)
  const [questionIndex, setQuestionIndex] = useState(1);

  // Generate question mutation (Preserving existing logic)
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

  // Evaluate answer mutation (Preserving existing logic)
  const evaluateAnswerMutation = useMutation({
    mutationFn: async (payload: { question: string; answer: string }) => {
      const res = await api.post('/api/ai/interview/evaluate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      setEvaluation(data);
      localStorage.setItem('interviewCompleted', 'true');
    },
  });

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    setQuestionIndex(1);
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
    setQuestionIndex(prev => prev + 1);
    generateQuestionMutation.mutate(roleInput);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#55D39A]';
    if (score >= 60) return 'text-[#E9B84B]';
    return 'text-[#FF6577]';
  };

  return (
    <div className="space-y-12">
      
      {/* Title Header (Point 33) */}
      <div className="space-y-2">
        <p className="eyebrow-text">Prepare / 05</p>
        <h3 className="text-2xl font-extrabold text-[#F4F1EA] tracking-tight">Practice the conversation before it matters</h3>
        <p className="text-xs text-[#9299A8] leading-relaxed max-w-xl">
          Simulate high-pressure technical mock interviews. Input your target engineering role or stack parameters to generate interactive question sets.
        </p>
      </div>

      {/* Role configuration form (Point 33) */}
      {!currentQuestion ? (
        <div className="bg-[#0D1016] border border-slate-900 p-8 rounded-lg max-w-lg mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <div className="p-3 bg-[#11151D] border border-slate-900 rounded-lg w-fit mx-auto">
              <HelpCircle className="w-8 h-8 text-[#9B5CFF]" />
            </div>
            <h4 className="text-base font-bold text-[#F4F1EA]">Mock Interview Coach</h4>
            <p className="text-xs text-[#9299A8] leading-relaxed max-w-sm mx-auto">
              Enter your target role and VertexPath will generate tailored interview questions, evaluate your feedback structure, and assign scoring grades.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Role / Core Stack</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Java Spring Boot Developer, AWS Engineer"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full text-xs text-center"
              />
            </div>
            <button
              type="submit"
              disabled={generateQuestionMutation.isPending || !roleInput.trim()}
              className="w-full py-2.5 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {generateQuestionMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Start interview →</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Active Interview Viewport (Point 33) */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-up-header">
          
          {/* Left Panel: Question & Response (No nested cards) */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Immersive Question Header */}
            <div className="space-y-3 pb-6 border-b border-slate-900">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9B5CFF]">
                <span>QUESTION {String(questionIndex).padStart(2, '0')} / 10</span>
                <span className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timed simulator</span>
                </span>
              </div>
              <p className="text-base font-extrabold text-[#F4F1EA] leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            {/* Answer Input Area */}
            {!evaluation && (
              <div className="space-y-4">
                <form onSubmit={handleEvaluate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Technical Response</label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Compose your structural explanation, system architecture patterns, or algorithmic examples..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(null)}
                      className="flex items-center gap-1 px-4 py-2 border border-slate-900 text-slate-500 hover:text-[#FF6577] text-xs font-bold rounded cursor-pointer transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Exit Session</span>
                    </button>
                    
                    <button
                      type="submit"
                      disabled={evaluateAnswerMutation.isPending || !userAnswer.trim()}
                      className="px-5 py-2.5 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {evaluateAnswerMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Submit answer →</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Active Evaluation Panel */}
            {evaluation && (
              <div className="space-y-6 animate-fade-in border-t border-slate-900 pt-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h5 className="text-xs font-bold text-[#F4F1EA] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#55D39A]" />
                    <span>Answer Evaluation Report</span>
                  </h5>
                  
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold tracking-tight ${getScoreColor(evaluation.score)}`}>
                      {evaluation.score}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Score</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Critic Feedback</span>
                  <p className="text-xs text-[#9299A8] leading-relaxed bg-[#0D1016] p-4 rounded border border-slate-900">
                    {evaluation.feedback}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Reference Answer</span>
                  <pre className="p-4 overflow-auto font-mono text-[11px] text-[#cbd5e1] leading-relaxed select-text bg-[#07080C] border border-slate-900 rounded max-h-[250px] custom-scrollbar">
                    <code>{evaluation.model_answer}</code>
                  </pre>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentQuestion(null)}
                    className="px-4 py-2 border border-slate-900 text-slate-500 hover:text-slate-200 text-xs font-bold rounded cursor-pointer"
                  >
                    Close Session
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={generateQuestionMutation.isPending}
                    className="flex items-center gap-1 px-5 py-2.5 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
                  >
                    <span>Next question →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Panel: Criteria & Coaching Tips */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#0D1016] border border-slate-900 p-6 rounded-lg space-y-4">
              <h5 className="text-xs font-bold text-[#F4F1EA] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
                <Award className="w-4.5 h-4.5 text-[#9B5CFF]" />
                <span>Target Evaluation Criteria</span>
              </h5>
              
              <p className="text-xs text-[#9299A8] leading-relaxed">
                To optimize score grades, address these architectural system design and programming terms:
              </p>
              
              <div className="p-4 rounded bg-[#07080C] border border-slate-900 text-xs text-[#9299A8] font-mono leading-relaxed select-text">
                {expectedPoints || "Start mock session to map targeted topics."}
              </div>
            </div>

            <div className="bg-[#0D1016]/40 border border-slate-900 p-6 rounded text-xs text-slate-500 leading-relaxed">
              <strong>Coach Note:</strong> Answer structure is key. Frame responses utilizing the STAR technique, clarifying context, constraints, outcomes, and code specifics.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

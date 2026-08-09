import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, AlertCircle, RefreshCw, KeyRound, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [code, setCode] = useState('');
  
  // Terms & Privacy Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'terms' | 'privacy'>('terms');

  const openModal = (tab: 'terms' | 'privacy') => {
    setActiveModalTab(tab);
    setShowTermsModal(true);
  };
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, signup, verifyCode, resendCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation for Signup
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your entries.');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms & Conditions to create an account.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        const res = await signup(email, password, fullName);
        if (res?.requiresVerification) {
          setIsVerify(true);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message;
      if (errMsg === 'ACCOUNT_NOT_VERIFIED') {
        setError('Your account is not verified yet. Please enter the verification code sent to your email.');
        setIsVerify(true);
      } else {
        setError(
          err.response?.data?.message || 
          (err.response?.data && typeof err.response.data === 'object' ? Object.values(err.response.data)[0] : null) ||
          'Authentication failed. Please verify your inputs.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await verifyCode(email, code);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      await resendCode(email);
      setSuccessMsg('A new 6-digit verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }

    setLoading(true);

    // Mock/Simulate reset request
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`A password reset link has been simulated & sent to ${email}`);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Animated Glowing Orbs & Cyber Grid Backdrop */}
      <div className="aurora-container">
        <div className="cyber-grid" />
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
        <div className="aurora-orb aurora-4" />
        {/* Glow Particles */}
        <div className="glow-particle animate-pulse-slow top-[15%] left-[20%] w-1.5 h-1.5 bg-purple-500/35" />
        <div className="glow-particle animate-pulse-fast top-[45%] left-[80%] w-1 h-1 bg-indigo-400/30" />
        <div className="glow-particle animate-pulse-slow top-[75%] left-[15%] w-2 h-2 bg-cyan-400/20" />
        <div className="glow-particle animate-pulse-fast top-[35%] left-[65%] w-1 h-1 bg-pink-500/25" />
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-2xl bg-purple-600/10 border border-purple-500/20 shadow-lg shadow-purple-500/5">
              <Compass className="w-9 h-9 text-purple-400 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
              PathPilot<span className="text-purple-400">.AI</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs text-center font-medium max-w-xs">
            AI-powered ecosystem for career development and optimization
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Auth Panels */}
        {isVerify ? (
          /* Verification Screen */
          <div className="premium-glass-card p-8 md:p-10 shadow-2xl relative animated-gradient-border">
            <div className="flex items-center gap-3 mb-6 text-purple-400">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <KeyRound className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Verify Your Account</h2>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm backdrop-blur-md">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm backdrop-blur-md">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              We've sent a 6-digit verification code to <strong className="text-slate-200">{email}</strong>. Please enter it below.
            </p>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-black text-xl py-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-800/80 disabled:text-slate-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Activate Account</span>
                )}
              </button>

              <div className="flex justify-between items-center text-xs mt-6 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => { setIsVerify(false); setError(null); setSuccessMsg(null); }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        ) : isForgotPassword ? (
          /* Forgot Password Screen */
          <div className="premium-glass-card p-8 md:p-10 shadow-2xl relative animated-gradient-border">
            <div className="flex items-center gap-3 mb-6 text-purple-400">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Compass className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm backdrop-blur-md">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm backdrop-blur-md">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Enter your email address below and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-sm transition-all shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-purple-850/80 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>

              <div className="flex items-center justify-center text-xs mt-6 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Login/Signup Screen */
          <div className="premium-glass-card p-8 md:p-10 shadow-2xl relative animated-gradient-border">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-800/60 mb-6">
              <button
                onClick={() => { setIsLogin(true); setError(null); setSuccessMsg(null); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  isLogin ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); setSuccessMsg(null); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  !isLogin ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm backdrop-blur-md">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm backdrop-blur-md">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                /* FULL NAME (Signup only) */
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-sm transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-sm transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-sm transition-all shadow-inner"
                  />
                </div>
              </div>

              {!isLogin && (
                /* CONFIRM PASSWORD (Signup only) */
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-950/40 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-1 focus:outline-none text-sm transition-all shadow-inner ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' 
                          : 'border-slate-800/80 focus:border-purple-500 focus:ring-purple-500'
                      }`}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}

              {!isLogin && (
                /* TERMS AND CONDITIONS CHECKBOX (Signup only) */
                <div className="flex items-start gap-3 mt-4 pt-1">
                  <div className="relative flex items-center h-5">
                    <input
                      id="agreeTerms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800/80 bg-slate-950/40 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="agreeTerms" className="text-xs text-slate-400 leading-normal select-none">
                    I agree to the{' '}
                    <span 
                      onClick={() => openModal('terms')} 
                      className="text-purple-400 font-bold hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      Terms of Service
                    </span>
                    {' '}and{' '}
                    <span 
                      onClick={() => openModal('privacy')} 
                      className="text-purple-400 font-bold hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </span>.
                  </label>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || (!isLogin && password !== confirmPassword)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-purple-800/40 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="premium-glass-card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animated-gradient-border z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveModalTab('terms')}
                  className={`text-base font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeModalTab === 'terms' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActiveModalTab('privacy')}
                  className={`text-base font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeModalTab === 'privacy' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Privacy Policy
                </button>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white font-semibold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed custom-scrollbar">
              {activeModalTab === 'terms' ? (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-base">1. Acceptance of Terms</h3>
                  <p>
                    Welcome to PathPilot.AI. By accessing or using our platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
                  </p>
                  <h3 className="text-white font-bold text-base">2. Description of Service</h3>
                  <p>
                    PathPilot.AI is an AI-powered career development ecosystem designed to assist students and professionals with roadmap creation, resume optimization, mock interviews, and RAG context question answering. AI suggestions are generated by large language models and are intended solely for educational and development purposes.
                  </p>
                  <h3 className="text-white font-bold text-base">3. User Obligations & Account</h3>
                  <p>
                    You agree to provide true, accurate, and complete information during registration. You are responsible for keeping your account password secure and for all activities that occur under your account.
                  </p>
                  <h3 className="text-white font-bold text-base">4. Disclaimer of Warranties</h3>
                  <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE". PATHPILOT.AI MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF AI-GENERATED CHECKLISTS, FEEDBACK, OR ROADMAPS.
                  </p>
                  <h3 className="text-white font-bold text-base">5. Modifications to Service</h3>
                  <p>
                    We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-base">1. Information We Collect</h3>
                  <p>
                    We collect personal information that you provide to us directly, such as your name, email address, password hash, and files/resumes you upload to the ATS analyzer or RAG context database.
                  </p>
                  <h3 className="text-white font-bold text-base">2. How We Use Your Information</h3>
                  <p>
                    We use the information collected to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maintain and personalize your career dashboard.</li>
                    <li>Generate tailored syllabus roadmaps and simulate developer sandboxes.</li>
                    <li>Analyze resumes and crosscheck tech stack alignment.</li>
                    <li>Verify account status using email-delivered verification codes.</li>
                  </ul>
                  <h3 className="text-white font-bold text-base">3. Data Sharing & Third-Party APIs</h3>
                  <p>
                    We use the Google Gemini API and local vector storage to implement AI features. Uploaded resumes and context files are indexed and processed using these services. We do not sell or trade your personal data.
                  </p>
                  <h3 className="text-white font-bold text-base">4. Security Measures</h3>
                  <p>
                    We use modern industry-standard security protocols, including JSON Web Tokens (JWT) for session authorization and password hashing, to guard your personal information.
                  </p>
                  <h3 className="text-white font-bold text-base">5. Cookies & Tracking</h3>
                  <p>
                    We utilize local storage keys (such as auth token and user profile indicators) to store session state and keep you logged in.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800/60 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-purple-600/10 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


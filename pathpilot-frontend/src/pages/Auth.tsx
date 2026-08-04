import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, AlertCircle, RefreshCw, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, signup, verifyCode, resendCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        const res = await signup(email, password, fullName);
        if (res?.requiresVerification) {
          setIsVerify(true);
        } else {
          navigate('/');
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
      navigate('/');
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

  return (
    <div className="relative min-h-screen bg-[#07080d] text-slate-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Glow Orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-purple-900/20 top-[-200px] left-[-200px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-indigo-950/20 bottom-[-200px] right-[-200px]" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-10 h-10 text-purple-500 animate-spin-slow" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
              PathPilot<span className="text-purple-500">.AI</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm text-center">
            AI-powered ecosystem for career development and optimization
          </p>
        </div>

        {/* Auth Panel Card */}
        {isVerify ? (
          /* Verification Screen */
          <div className="glass-card p-8 bg-slate-900/40 border border-slate-800/80 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-purple-400">
              <KeyRound className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold text-white">Verify Your Account</h2>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Please enter the 6-digit verification code sent to <strong className="text-slate-200">{email}</strong>.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-extrabold text-lg py-3 bg-slate-950/60 border border-slate-850/80 rounded-lg text-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Activate Account</span>
                )}
              </button>

              <div className="flex justify-between items-center text-xs mt-6">
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
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Login/Signup Screen */
          <div className="glass-card p-8 bg-slate-900/40 border border-slate-800/80 shadow-2xl">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-800/80 mb-6">
              <button
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-all ${
                  isLogin ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-all ${
                  !isLogin ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-850/80 rounded-lg text-slate-200 placeholder-slate-500 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-850/80 rounded-lg text-slate-200 placeholder-slate-500 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-850/80 rounded-lg text-slate-200 placeholder-slate-500 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-purple-800/80 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
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
    </div>
  );
};

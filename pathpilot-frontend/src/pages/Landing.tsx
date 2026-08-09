import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  Flame, 
  MessageSquare, 
  FileText, 
  FileCheck, 
  Map, 
  Terminal, 
  UserCheck, 
  ArrowRight, 
  UploadCloud, 
  CheckCircle, 
  ArrowUpRight 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'terms' | 'privacy'>('terms');

  const openModal = (tab: 'terms' | 'privacy') => {
    setActiveModalTab(tab);
    setShowTermsModal(true);
  };

  const services = [
    {
      name: 'AI Career Coach',
      desc: 'Interact with a role-trained career mentor for targeted guidance, resume strategy, and software engineering questions.',
      icon: MessageSquare,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    },
    {
      name: 'ATS Resume Analyzer',
      desc: 'Get your compatibility score for tech positions, detect stack keywords gap, and generate immediate format revisions.',
      icon: FileText,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    },
    {
      name: 'Job Description Matcher',
      desc: 'Compare target job requirements directly against your profile to evaluate structural overlap and preparation recommendations.',
      icon: FileCheck,
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      name: 'AI Syllabus Roadmaps',
      desc: 'Generate custom week-by-week developer syllabus curricula complete with detailed hourly checklists.',
      icon: Map,
      color: 'from-indigo-500/20 to-pink-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      name: 'Developer Sandbox',
      desc: 'Simulate target folders, databases, and REST schemas instantly to scaffold structural backend mock designs.',
      icon: Terminal,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      name: 'Interview Simulator',
      desc: 'Simulate technical or HR screenings, evaluate code or speech inputs, and grade replies with precise score matrices.',
      icon: UserCheck,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 flex flex-col overflow-hidden selection:bg-purple-600/30 selection:text-purple-200">
      {/* Animated Glowing Orbs & Grid Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="auth-bg-grid absolute inset-0 z-0" />
        <div className="glow-orb-premium orb-violet w-[700px] h-[700px] -top-[10%] -left-[10%] opacity-20" />
        <div className="glow-orb-premium orb-indigo w-[800px] h-[800px] bottom-[10%] -right-[15%] opacity-25" />
        <div className="glow-orb-premium orb-cyan w-[500px] h-[500px] top-[30%] left-[25%] opacity-15" />
      </div>

      {/* Global Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/60 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
            <Compass className="w-6 h-6 text-purple-400 animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PathPilot<span className="text-purple-400">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#features" className="hover:text-white transition-colors">RAG Technology</a>
          <a href="#gamification" className="hover:text-white transition-colors">Streaks</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer animate-fade-in"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center flex flex-col items-center">
        {/* Glow Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform v2.0 - Fully Integrated AI Core</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white max-w-4xl">
          Navigate Your Tech Career with <span className="text-gradient">AI Precision</span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-medium">
          Accelerate your growth using an all-in-one ecosystem fueled by Retrieval-Augmented Generation (RAG) and Google Gemini. Match ATS parameters, generate checklisted syllabi, and simulate interactive coding interviews.
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl font-bold text-base transition-all shadow-xl shadow-purple-600/10 cursor-pointer"
            >
              <span>Access Your Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl font-bold text-base transition-all shadow-xl shadow-purple-600/10 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#services"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-base transition-all cursor-pointer"
              >
                <span>Explore Features</span>
              </a>
            </>
          )}
        </div>

        {/* Immersive Dashboard Mock Visual */}
        <div className="mt-16 w-full relative group">
          <div className="absolute inset-0 -m-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="premium-glass-card p-4 border border-slate-800/80 relative rounded-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
            {/* Mock Visual Grid Elements */}
            <div className="absolute inset-0 bg-[#0c0d1b]/80 flex flex-col">
              {/* Header Bar */}
              <div className="h-10 border-b border-slate-800/80 flex items-center px-4 justify-between bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Mock Dashboard</span>
                </div>
              </div>
              {/* Layout Content */}
              <div className="flex-1 grid grid-cols-4 p-4 gap-4 text-left">
                {/* Left navigation column */}
                <div className="col-span-1 border border-slate-850 bg-slate-900/10 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-purple-500/10 border border-purple-500/20 rounded-md" />
                    <div className="h-4 w-full bg-slate-800/40 rounded-md" />
                    <div className="h-4 w-full bg-slate-800/40 rounded-md" />
                    <div className="h-4 w-4/5 bg-slate-800/40 rounded-md" />
                  </div>
                  <div className="h-6 w-full bg-slate-850 rounded-md border border-slate-800/40" />
                </div>
                {/* Main center elements */}
                <div className="col-span-3 grid grid-rows-3 gap-4">
                  <div className="row-span-1 grid grid-cols-3 gap-4">
                    <div className="border border-slate-850 bg-slate-900/15 rounded-xl p-3 flex flex-col justify-between">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">ATS Score</p>
                      <p className="text-xl font-bold text-emerald-400">84%</p>
                    </div>
                    <div className="border border-slate-850 bg-slate-900/15 rounded-xl p-3 flex flex-col justify-between">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Interview Prep</p>
                      <p className="text-xl font-bold text-purple-400">Perfect</p>
                    </div>
                    <div className="border border-slate-850 bg-slate-900/15 rounded-xl p-3 flex flex-col justify-between">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Streak Count</p>
                      <p className="text-xl font-bold text-amber-500 flex items-center gap-1">
                        <Flame className="w-5 h-5 fill-amber-500/15" />
                        <span>12 Days</span>
                      </p>
                    </div>
                  </div>
                  <div className="row-span-2 border border-slate-850 bg-slate-900/15 rounded-xl p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-purple-400 font-bold uppercase">AI Coach Insights</p>
                      <p className="text-xs text-slate-400 leading-normal">
                        "Your resume shows strong alignments in TypeScript, but lacks database architecture credentials. I recommend generating the SQL learning roadmap."
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-purple-600/20 border border-purple-500/30 rounded-md" />
                      <div className="h-6 w-24 bg-slate-800/40 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 bg-slate-950/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">Complete Suite of Features</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            PathPilot.AI integrates the essential tools needed to review profile gaps, practice scenarios, and coordinate technical syllabi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="premium-glass-card p-6 flex flex-col justify-between border border-slate-850/80 cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} border shadow-inner`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{service.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{service.desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                <span>Access Tool</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight RAG Capability */}
      <section id="features" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-semibold">
              RAG Knowledge Bases
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Chat Directly With Your Course Materials
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload custom lecture files, research PDFs, or slide presentation directories. PathPilot indexes them inside a local vector database (ChromaDB) to anchor Career Coach chat logic strictly to your provided documents.
            </p>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Upload `.pdf`, `.docx`, and `.pptx` documents</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span>ChromaDB vector embedding generation</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Contextual Q&A without data leakages</span>
              </li>
            </ul>
          </div>

          {/* Interactive RAG Box Visual */}
          <div className="premium-glass-card p-8 border border-slate-800/80 bg-[#090b16]/70 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Index Study Material</p>
              <div className="border border-dashed border-slate-850 hover:border-purple-500/50 bg-slate-950/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-bold mb-1">Click to Upload Document</p>
                <p className="text-[10px] text-slate-500">PDF, DOCX, PPTX up to 10MB</p>
              </div>
            </div>
            <div className="border-t border-slate-850 mt-6 pt-4 flex justify-between items-center text-xs">
              <span className="text-slate-400">Embedding model: <strong className="text-slate-300">Gemini-Embed</strong></span>
              <span className="text-teal-400 font-bold">RAG Engine: Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Tracker Callout */}
      <section id="gamification" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 bg-slate-950/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Calendar visual */}
          <div className="premium-glass-card p-6 border border-slate-850/80 bg-[#090b16]/70 lg:order-last">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Streak Tracker & Milestones</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Activity calendar</span>
            </div>
            
            {/* Mock Contribution Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 48 }).map((_, i) => {
                  let opacity = 'bg-slate-900';
                  if (i % 5 === 0) opacity = 'bg-purple-600/30';
                  if (i % 7 === 0) opacity = 'bg-purple-600/60';
                  if (i % 11 === 0) opacity = 'bg-purple-500';
                  return <div key={i} className={`aspect-square rounded-[3px] ${opacity} transition-colors hover:scale-110`} />;
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 font-bold">
                <span>Less Active</span>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-900" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-600/30" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-600/60" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-purple-500" />
                </div>
                <span>More Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              Habits & Retention
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Build Daily Habits with Gamified Metrics
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stay consistent on your learning path. Track your streak count, earn activity multipliers, and check off syllabus roadmaps. PathPilot.AI maps your daily progress in developer style.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-black text-white">12 Days</p>
                <p className="text-xs text-slate-500">Average Active Streak</p>
              </div>
              <div className="border-l border-slate-800 pl-8">
                <p className="text-2xl font-black text-white">4.8×</p>
                <p className="text-xs text-slate-500">Higher Success Consistency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner CTA */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="premium-glass-card p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden animated-gradient-border">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-50" />
          <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">Start Optimizing Your Career Today</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 relative z-10">
            Sign up for a free account, generate your roadmap, index your notes, and simulate mock interviews.
          </p>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-purple-600/10 relative z-10 cursor-pointer"
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
          </button>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900/60 bg-slate-950/40 py-10 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-400">PathPilot.AI</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <span 
              onClick={() => openModal('terms')} 
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </span>
            <span 
              onClick={() => openModal('privacy')} 
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </span>
          </div>
        </div>
      </footer>

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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
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
  ArrowLeft,
  UploadCloud, 
  CheckCircle, 
  ArrowUpRight,
  Mail,
  Phone,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Play
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Terms & Privacy Modals
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'terms' | 'privacy'>('terms');

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Video Showcase Modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalTab, setModalTab] = useState<'video' | 'tour'>('video');
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    {
      title: "Consistency Trackers & Habit Loops",
      description: "Monitor daily consistency, targets, and github-like activity grid heatmaps to lock in coding routine habits.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <span className="text-sm font-bold text-white">Daily Target Streak</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Active Streak</span>
          </div>
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 flex items-center justify-center animate-spin-slow">
              <span className="text-2xl font-black text-white">12 Days</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-xs">You are in the top 5% of active programmers this week!</p>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900 pt-3">
            <span>Progress checklist: 42%</span>
            <span className="text-purple-400 font-bold">1200 XP Earned</span>
          </div>
        </div>
      )
    },
    {
      title: "Interactive AI Career Mentorship",
      description: "Chat with a virtual career coach trained in target role guidelines, code formatting, and job interview preparation.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-white">Active Coaching Chat</span>
          </div>
          <div className="flex-1 py-4 space-y-4 overflow-y-auto max-h-[160px] text-xs">
            <div className="flex justify-end">
              <div className="bg-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%]">
                How do I improve my backend keyword score?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-850 text-slate-350 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%] leading-relaxed">
                Detail database schema updates and query optimization patterns directly. Avoid generalized bullet descriptions.
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-3 flex gap-2">
            <input disabled placeholder="Ask Career Coach..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 text-[11px] outline-none" />
            <button disabled className="bg-purple-600 px-3 py-1 rounded-xl text-[11px] font-bold">Send</button>
          </div>
        </div>
      )
    },
    {
      title: "Keyword & ATS Profile Reviewer",
      description: "Submit technical profiles or resumes to review alignment, pinpoint missing tools, and view structural suggestions.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-sm font-bold text-white">ATS Keyword Analyzer</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Match: 84%</span>
          </div>
          <div className="py-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Keyword densities (TypeScript, React)</span>
              <span className="text-emerald-400 font-bold">Optimal</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400">Database Sharding details</span>
              <span className="text-rose-400 font-bold">Missing</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5">
              <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>
          <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-400 leading-normal">
            <strong className="text-white">Recommendation:</strong> Add SQL details or database migration patterns to increase matching keywords.
          </div>
        </div>
      )
    },
    {
      title: "Checklisted Curriculum Syllabi",
      description: "Formulate step-by-step syllabus checksheets covering languages, frameworks, or database system designs.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-sm font-bold text-white">Syllabus: System Architecture</span>
            <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">4 Weeks</span>
          </div>
          <div className="py-3 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <input type="checkbox" defaultChecked className="mt-1" disabled />
              <div className="space-y-0.5">
                <p className="font-bold text-slate-200 text-xs">Week 1: Horizontal Scaling</p>
                <p className="text-[10px] text-slate-500">Understand load balancers, DNS routing rules, and stateless layers.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" disabled />
              <div className="space-y-0.5">
                <p className="font-bold text-slate-200 text-xs">Week 2: Database Replication</p>
                <p className="text-[10px] text-slate-500">Practice replica sets, failovers, and write routing rules.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] text-slate-500">
            <span>Checklist steps: 12 Tasks</span>
            <span className="text-emerald-400 font-bold">1 Week Done</span>
          </div>
        </div>
      )
    },
    {
      title: "Scaffold APIs & Database Schemas",
      description: "Quickly export relational sql tables, file directory structures, and boilerplate REST controller paths.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-sm font-bold text-white font-mono">Sandbox: Spring Rest</span>
            <span className="text-[10px] text-slate-400">Boilerplate</span>
          </div>
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 font-mono text-[10px] text-slate-400 overflow-x-auto my-2 max-h-[140px] custom-scrollbar">
            <span className="text-purple-400">@RestController</span><br/>
            <span className="text-purple-400">@RequestMapping</span>(<span className="text-teal-400">"/api/users"</span>)<br/>
            <span className="text-blue-400">public class</span> <span className="text-yellow-400">UserController</span> &#123;<br/>
            &nbsp;&nbsp;<span className="text-purple-400">@PostMapping</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// scaffolded endpoints</span><br/>
            &#125;
          </div>
          <div className="border-t border-slate-900 pt-2 flex justify-between items-center text-[10px] text-slate-500">
            <span>Schema: PostgreSQL</span>
            <span className="text-purple-400 font-bold">Export Code</span>
          </div>
        </div>
      )
    },
    {
      title: "Rigorous Technical Mock Screenings",
      description: "Test coding or speech answers in simulated tech screens. Thin, ambiguous answers are graded strictly.",
      preview: (
        <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-6 h-full flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-sm font-bold text-white">Google L4 Mock Interview</span>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">Strict Grade</span>
          </div>
          <div className="py-3 space-y-1.5 text-xs">
            <p className="text-slate-400 font-medium">Explain heap building complexity.</p>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-slate-500 text-[10px]">
              Your Answer: "It takes O(N) because we run heapify."
            </div>
            <p className="text-rose-400 font-bold text-[10px]">
              ⚠️ Score: 4/10. Include geometric convergence proofs.
            </p>
          </div>
          <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 flex justify-between">
            <span>Completed in 2.1s</span>
            <span className="text-purple-400 font-bold">Retry</span>
          </div>
        </div>
      )
    }
  ];

  const openModal = (tab: 'terms' | 'privacy') => {
    setActiveModalTab(tab);
    setShowTermsModal(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess(null);
    setContactError(null);

    try {
      await api.post('/api/auth/contact', {
        name: contactName,
        email: contactEmail,
        message: contactMessage
      });
      setContactSuccess('Your message has been sent successfully to the developer inbox!');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      setContactError(
        err.response?.data?.message || 
        'Failed to send message. Please verify your inputs and try again.'
      );
    } finally {
      setContactLoading(false);
    }
  };

  const services = [
    {
      name: 'AI Career Coach',
      desc: 'Ask your personal tech mentor anything from mock salary negotiations to code optimization and general interview prep.',
      icon: MessageSquare,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    },
    {
      name: 'ATS Resume Review',
      desc: 'Upload your resume to calculate keyword alignment for developer roles and generate immediate structural text updates.',
      icon: FileText,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    },
    {
      name: 'Job Description Matcher',
      desc: 'Paste a target job posting to analyze stack mismatches, structural gaps, and recommendations to prepare before applying.',
      icon: FileCheck,
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      name: 'Syllabus Roadmaps',
      desc: 'Build customized learning curricula covering languages, frameworks, or system designs, checklisted by week and hour.',
      icon: Map,
      color: 'from-indigo-500/20 to-pink-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      name: 'Developer Sandbox',
      desc: 'Generate ready-to-use directory structures, SQL schemas, and REST endpoint structures based on your stack requirements.',
      icon: Terminal,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      name: 'Interview Simulator',
      desc: 'Practice customized mock screens with grading algorithms. Lazy or generic answers get strict marks to push you to improve.',
      icon: UserCheck,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    },
  ];

  const faqs = [
    {
      q: 'How does the ATS Resume Analyzer score my profile?',
      a: 'The analyzer processes your uploaded document, extracts key technical stacks, and runs crosschecks against a curated database of core industry job requirements. It evaluates match scores and drafts specific line-by-line recommendations.'
    },
    {
      q: 'What is the RAG Context tool?',
      a: 'RAG (Retrieval-Augmented Generation) allows you to index your own local files (PDF lectures, study notes, slide decks). The Career Coach references this data directly during conversations to answer questions based only on your uploads.'
    },
    {
      q: 'How does the Developer Sandbox work?',
      a: 'When you specify your target features and tech stacks, the AI generator maps out modular file trees, database relational schemas (SQL/NoSQL), and controller endpoint boilerplate structures to jumpstart your development sandbox.'
    },
    {
      q: 'Why are interview mock scores strict?',
      a: 'To prepare you for actual screenings, the AI interviewer checks response completeness. Lax, short, or ambiguous answers are graded stringently to encourage comprehensive explanations of technical problems.'
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col overflow-hidden selection:bg-purple-600/30 selection:text-purple-200">
      {/* Animated Glowing Orbs & Cyber Grid Backdrop */}
      <div className="aurora-container">
        <div className="cyber-grid" />
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
        <div className="aurora-orb aurora-4" />
        {/* Scanning Cyber Beams */}
        <div className="grid-beam beam-1" />
        <div className="grid-beam-v beam-2" />
        <div className="grid-beam-v beam-3" />
        {/* Glow Particles */}
        <div className="glow-particle animate-pulse-slow top-[12%] left-[18%] w-1.5 h-1.5 bg-purple-500/35" />
        <div className="glow-particle animate-pulse-fast top-[38%] left-[75%] w-1 h-1 bg-indigo-400/30" />
        <div className="glow-particle animate-pulse-slow top-[65%] left-[12%] w-2 h-2 bg-cyan-400/20" />
        <div className="glow-particle animate-pulse-fast top-[28%] left-[60%] w-1 h-1 bg-pink-500/25" />
        <div className="glow-particle animate-pulse-slow top-[80%] left-[45%] w-1.5 h-1.5 bg-purple-400/20" />
      </div>

      {/* Global Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/60 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <Compass className="w-6 h-6 text-purple-400 animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PathPilot<span className="text-purple-400">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#features" className="hover:text-white transition-colors">RAG Uploads</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer"
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
          <span>Complete Technical Career Sandbox</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white max-w-4xl">
          Build Your Coding Career with <span className="text-gradient">AI Precision</span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-medium">
          Accelerate your readiness using an organic suite of developer tools. Match resume stacks, index lecture PDFs in vector databases, compile checklisted roadmaps, and practice mock screenings.
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

        {/* Dynamic Guided Tour Showcase Card (Replacing the static / video frames) */}
        <div className="mt-16 w-full relative group max-w-4xl mx-auto z-20">
          <div className="absolute inset-0 -m-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity" />
          <div className="premium-glass-card border border-slate-850/80 relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#0a0b16]/80 flex flex-col justify-between shadow-2xl">
            {/* Visual Laptop Header Bar */}
            <div className="h-11 border-b border-slate-800/70 flex items-center px-4 justify-between bg-slate-950/60 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Interactive Platform Tour</span>
              </div>
            </div>

            {/* Visual Showcase Content Grid */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-center overflow-hidden">
              {/* Left explanation block */}
              <div className="md:col-span-2 space-y-4 text-left">
                <div className="inline-flex px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                  Module {tourStep + 1} of {tourSteps.length}
                </div>
                <h3 className="text-base font-black text-white leading-tight">{tourSteps[tourStep].title}</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">{tourSteps[tourStep].description}</p>
                
                {/* Navigation Buttons */}
                <div className="flex gap-2 pt-1.5">
                  <button
                    onClick={() => setTourStep(prev => Math.max(0, prev - 1))}
                    disabled={tourStep === 0}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTourStep(prev => Math.min(tourSteps.length - 1, prev + 1))}
                    disabled={tourStep === tourSteps.length - 1}
                    className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[10px] cursor-pointer"
                  >
                    <span>Next Feature</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right visual mock preview */}
              <div className="md:col-span-3 h-full max-h-[250px] flex items-center justify-center">
                <div className="w-full h-full max-w-sm">
                  {tourSteps[tourStep].preview}
                </div>
              </div>
            </div>

            {/* Visual Indicators Footer */}
            <div className="p-4 border-t border-slate-850 bg-slate-950/20 flex justify-center gap-1.5">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setTourStep(idx)}
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                    tourStep === idx ? 'bg-purple-500 w-3' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
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
              Consistency Focus
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Build Continuous Habits with Gamified Metrics
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stay consistent on your learning path. Track your streak count, earn activity milestones, and complete checklisted roadmaps. PathPilot.AI maps your daily progress in clean, developer style calendars.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-black text-white">12 Days</p>
                <p className="text-xs text-slate-500">Average Active Streak</p>
              </div>
              <div className="border-l border-slate-800 pl-8">
                <p className="text-2xl font-black text-white">4.8×</p>
                <p className="text-xs text-slate-500">Higher Learning Consistency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center mb-12">
          <div className="inline-flex p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-3">
            Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="premium-glass-card border border-slate-850/80 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-purple-400 transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-slate-500 text-lg">{activeFaq === index ? '−' : '+'}</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeFaq === index ? 'max-h-40 border-t border-slate-850/60 p-5' : 'max-h-0'
                }`}
              >
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Feedback Form Section */}
      <section id="contact" className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="premium-glass-card p-8 md:p-10 border border-slate-850/80 shadow-2xl relative animated-gradient-border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">Contact & Send Feedback</h2>
            <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
              Have questions, issues, or suggestions? Submit your feedback here to forward it directly to the developer's inbox.
            </p>
          </div>

          {contactSuccess && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs backdrop-blur-md">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{contactSuccess}</span>
            </div>
          )}

          {contactError && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{contactError}</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-xs transition-all"
                />
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-xs transition-all"
                />
              </div>
            </div>
            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write your suggestions, questions, or general feedback here..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-xs transition-all resize-none"
              />
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={contactLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-purple-800/40 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/10 cursor-pointer mt-6"
            >
              {contactLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <span>Submit Message</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Global Footer (Enhanced multi-column layout) */}
      <footer className="relative z-10 w-full border-t border-slate-900/60 bg-slate-950/40 py-12 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4 col-span-1">
            <div className="flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-purple-400" />
              <span className="text-base font-bold text-white tracking-tight">PathPilotAI</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              AI-powered ecosystem designed to map syllabus guidelines, perform ATS analyzer parsing, and simulate mock technical interviews.
            </p>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>+91 8805565585</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>pathpilot.ai.info@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 col-span-1">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Services</a></li>
              <li><a href="#features" className="hover:text-purple-400 transition-colors">RAG Indexes</a></li>
              <li><a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact us</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Developer */}
          <div className="space-y-3 col-span-1">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Contact Developer</h4>
            <div className="space-y-2.5">
              <p className="font-semibold text-white text-[11px]">Kaustubh Jadhav</p>
              <div className="flex gap-3 text-slate-500">
                <a 
                  href="https://www.linkedin.com/in/kaustubh-jadhav-6a2216248/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors p-1 rounded-lg bg-slate-900/80 border border-slate-850 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a 
                  href="https://github.com/Kaustubh0043" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors p-1 rounded-lg bg-slate-900/80 border border-slate-850 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/kaustubhh.jadhav/?hl=en" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors p-1 rounded-lg bg-slate-900/80 border border-slate-850 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Legals */}
          <div className="space-y-3 col-span-1">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">Legal Framework</h4>
            <div className="space-y-2 text-slate-500 font-medium flex flex-col">
              <span 
                onClick={() => openModal('terms')} 
                className="hover:text-purple-400 transition-colors cursor-pointer"
              >
                Terms of Service
              </span>
              <span 
                onClick={() => openModal('privacy')} 
                className="hover:text-purple-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[10px] font-bold">
          <span>PathPilot.AI is an independent carrier preparation platform.</span>
          <span>© {new Date().getFullYear()} PathPilotAI. All Rights Reserved.</span>
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

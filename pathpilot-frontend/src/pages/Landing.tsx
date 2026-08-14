import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Mail,
  Phone,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Terms & Privacy Modals (Preserving existing logic)
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'terms' | 'privacy'>('terms');

  // Contact Form states (Preserving existing logic)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // FAQ Accordion State (Preserving existing logic)
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const openModal = (tab: 'terms' | 'privacy') => {
    setActiveModalTab(tab);
    setShowTermsModal(true);
  };

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
    <div className="relative min-h-screen text-[#F4F1EA] flex flex-col overflow-hidden selection:bg-[#9B5CFF]/30 selection:text-[#C49AFF] bg-[#07080C]">
      
      {/* Navbar (Clean details, Point 28) */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900 bg-[#07080C]/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1.5 rounded bg-[#9B5CFF]/10 border border-[#9B5CFF]/20">
            <Compass className="w-5 h-5 text-[#9B5CFF]" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#F4F1EA] font-display">
            PATHPILOT
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <a href="#problem" className="hover:text-[#F4F1EA] transition-colors">01 / The Problem</a>
          <a href="#narrative" className="hover:text-[#F4F1EA] transition-colors">02 / Narrative</a>
          <a href="#faq" className="hover:text-[#F4F1EA] transition-colors">03 / FAQ</a>
          <a href="#contact" className="hover:text-[#F4F1EA] transition-colors">04 / Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-4 py-2 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section (Points 16, 19, 24) */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Statement Title Casing (Point 3, 16) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <p className="eyebrow-text">SaaS / Career OS</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight font-display text-[#F4F1EA]">
            YOUR CAREER ISN'T A STRAIGHT LINE.
          </h1>
          <p className="text-sm text-[#9299A8] leading-relaxed max-w-lg font-medium">
            PathPilot helps you find the next step. Optimize baseline resume scores, check off learning path chapters, build custom database architectures, and prepare mock interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-1.5 px-5 py-3 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="flex items-center justify-center gap-1.5 px-5 py-3 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
                >
                  <span>Build my path →</span>
                </button>
                <a
                  href="#narrative"
                  className="flex items-center justify-center gap-1.5 px-5 py-3 bg-[#11151D] hover:bg-[#151A23] border border-slate-900 text-[#F4F1EA] text-xs font-bold rounded"
                >
                  <span>Explore PathPilot</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Drawing Route Animation Visual (Point 16, 19, 24) */}
        <div className="lg:col-span-5 bg-[#0D1016] border border-slate-900 p-8 rounded-lg space-y-6 select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono font-bold text-slate-600">
            SYSTEM // SIMULATOR
          </div>
          
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Career Route</span>
            
            <div className="flex flex-col gap-6 relative pl-4 border-l border-slate-800">
              
              {/* Node 1 */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-[#55D39A]" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#F4F1EA]">YOU</p>
                  <p className="text-[10px] text-slate-500">Starting Point</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-[#55D39A]" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#F4F1EA]">Resume Scored</p>
                  <p className="text-[10px] text-[#55D39A]">ATS Complete</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-[#9B5CFF] ring-4 ring-[#9B5CFF]/15" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#F4F1EA]">Skills Map</p>
                  <p className="text-[10px] text-[#9B5CFF]">Active Checkpoint (Spring Boot)</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-550">Project Blueprint</p>
                  <p className="text-[10px] text-slate-600">Scaffolding Sandbox</p>
                </div>
              </div>

              {/* Node 5 */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-550">Interview Coach</p>
                  <p className="text-[10px] text-slate-600">Simulations</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Chapter Storytelling Sections (Point 17, 18) */}
      <section id="problem" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="space-y-4 max-w-xl text-left">
          <p className="eyebrow-text">01 — The Problem</p>
          <h2 className="text-2xl font-extrabold text-[#F4F1EA] tracking-tight">The developer journey is fragmented.</h2>
          <p className="text-xs text-[#9299A8] leading-relaxed">
            Most platforms serve single courses or isolated coding challenges. PathPilot links everything together under a single cohesive Career Operating System—guiding you from uploaded resumes directly to checklisted paths and mock prep modules.
          </p>
        </div>
      </section>

      {/* Chapters Feature Narrative */}
      <section id="narrative" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-10 space-y-16">
        
        {/* Chapter 02 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-900/60">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">02 — STARTING POINT</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Resume Analyzer</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Upload your resume profile to scan technical keyword densities. PathPilot extracts key frameworks and generates structured checksheet suggestions to fix presentation weaknesses.
            </p>
          </div>
        </div>

        {/* Chapter 03 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-900/60">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">03 — FIND THE GAPS</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Job Matcher</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Paste target job descriptions to analyze fit compatibility. The engine checks framework alignments, reveals missing technologies, and models recovery roadmaps.
            </p>
          </div>
        </div>

        {/* Chapter 04 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-900/60">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">04 — BUILD THE PATH</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Learning Paths</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Build customized curricula checksheets covering target systems. Progress through week-by-week syllabi chapters to systematically check off learning objectives.
            </p>
          </div>
        </div>

        {/* Chapter 05 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-900/60">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">05 — BUILD PROOF</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Project Architect</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Generate directory structures, SQL designs, and endpoint boilerplate files to scaffold code solutions, providing direct portfolio proof of your technical skills.
            </p>
          </div>
        </div>

        {/* Chapter 06 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-900/60">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">06 — PREPARE</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Interview Coach</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Simulate high-pressure technical mock interviews. Ambiguous or brief replies get graded strictly, pushing you to refine descriptions and prove core technical concepts.
            </p>
          </div>
        </div>

        {/* Chapter 07 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono text-xs font-bold text-[#9B5CFF]">07 — DESTINATION</p>
            <h3 className="text-base font-extrabold text-[#F4F1EA] uppercase">Career Coach Q&A</h3>
          </div>
          <div className="md:col-span-8 text-xs text-[#9299A8] leading-relaxed space-y-3">
            <p>
              Ask your personal tech mentor preparation questions. Backed by ChromaDB retrieval bases, get answers drawn directly from your study materials or PDFs.
            </p>
          </div>
        </div>

      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="space-y-4 mb-12 text-left">
          <p className="eyebrow-text">Syllabus / Guide</p>
          <h2 className="text-2xl font-extrabold text-[#F4F1EA] tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#0D1016] border border-slate-900 rounded overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-[#F4F1EA] hover:text-[#9B5CFF] transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-slate-500 font-mono text-sm">{activeFaq === index ? '−' : '+'}</span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeFaq === index ? 'max-h-40 border-t border-slate-900/60 p-5' : 'max-h-0'
                }`}
              >
                <p className="text-xs text-[#9299A8] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="bg-[#0D1016] border border-slate-900 p-8 rounded-lg space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-[#F4F1EA]">Contact & Send Feedback</h2>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Have questions, issues, or suggestions? Submit your feedback here to forward it directly to the developer's inbox.
            </p>
          </div>

          {contactSuccess && (
            <div className="p-3.5 rounded bg-[#55D39A]/10 border border-[#55D39A]/20 text-[#55D39A] text-xs">
              <span>{contactSuccess}</span>
            </div>
          )}

          {contactError && (
            <div className="p-3.5 rounded bg-[#FF6577]/10 border border-[#FF6577]/20 text-[#FF6577] text-xs">
              <span>{contactError}</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write your suggestions or feedback here..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full text-xs"
              />
            </div>
            
            <button
              type="submit"
              disabled={contactLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] rounded text-xs font-bold transition-all cursor-pointer mt-4"
            >
              {contactLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Submit Message</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-[#0D1016]/40 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-1 text-left">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#9B5CFF]" />
              <span className="text-sm font-bold text-[#F4F1EA] tracking-tight font-display">PathPilot</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-655">
              Interactive career preparation operating system designed to map syllabus guidelines, perform ATS checks, and simulate mock screenings.
            </p>
            <div className="space-y-1.5 text-[11px] font-medium text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#9B5CFF]" />
                <span>+91 8805565585</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9B5CFF]" />
                <span>pathpilot.ai.info@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 col-span-1 text-left">
            <h4 className="font-bold text-[#F4F1EA] uppercase text-[10px] tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#problem" className="hover:text-white transition-colors">The Problem</a></li>
              <li><a href="#narrative" className="hover:text-white transition-colors">Narrative Chapters</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact us</a></li>
            </ul>
          </div>

          <div className="space-y-3 col-span-1 text-left">
            <h4 className="font-bold text-[#F4F1EA] uppercase text-[10px] tracking-wider">Contact Developer</h4>
            <div className="space-y-2">
              <p className="font-bold text-[#F4F1EA]">Kaustubh Jadhav</p>
              <div className="flex gap-2.5">
                <a 
                  href="https://www.linkedin.com/in/kaustubh-jadhav-6a2216248/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded bg-[#07080C] border border-slate-900 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a 
                  href="https://github.com/Kaustubh0043" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded bg-[#07080C] border border-slate-900 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/kaustubhh.jadhav/?hl=en" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded bg-[#07080C] border border-slate-900 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3 col-span-1 text-left">
            <h4 className="font-bold text-[#F4F1EA] uppercase text-[10px] tracking-wider">Legal Framework</h4>
            <div className="space-y-2 font-medium flex flex-col">
              <span 
                onClick={() => openModal('terms')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </span>
              <span 
                onClick={() => openModal('privacy')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-600 text-[10px] font-bold">
          <span>PathPilot is an independent career preparation platform.</span>
          <span>© {new Date().getFullYear()} PathPilot. All Rights Reserved.</span>
        </div>
      </footer>

      {/* Terms & Privacy Modal (Preserving logic, styling as outline) */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1016] border border-slate-900 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-lg z-50 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-900 bg-[#11151D]/30">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveModalTab('terms')}
                  className={`text-xs font-bold pb-1 uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeModalTab === 'terms' ? 'border-[#9B5CFF] text-[#F4F1EA]' : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActiveModalTab('privacy')}
                  className={`text-xs font-bold pb-1 uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeModalTab === 'privacy' ? 'border-[#9B5CFF] text-[#F4F1EA]' : 'border-transparent text-slate-500 hover:text-slate-355'
                  }`}
                >
                  Privacy Policy
                </button>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#9299A8] leading-relaxed custom-scrollbar">
              {activeModalTab === 'terms' ? (
                <div className="space-y-4">
                  <h3 className="text-[#F4F1EA] font-bold text-sm">1. Acceptance of Terms</h3>
                  <p>
                    Welcome to PathPilot. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
                  </p>
                  <h3 className="text-[#F4F1EA] font-bold text-sm">2. Description of Service</h3>
                  <p>
                    PathPilot is a career development ecosystem designed to assist users with roadmaps, resume score evaluation, mock interviews, and reference context question answering. AI suggestions are generated by LLMs and are intended solely for educational purposes.
                  </p>
                  <h3 className="text-[#F4F1EA] font-bold text-sm">3. User Obligations & Account</h3>
                  <p>
                    You agree to provide true, accurate, and complete information during registration. You are responsible for keeping your account password secure.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-[#F4F1EA] font-bold text-sm">1. Information We Collect</h3>
                  <p>
                    We collect personal information that you provide directly, such as your name, email address, password hash, and files/resumes you upload to the platform.
                  </p>
                  <h3 className="text-[#F4F1EA] font-bold text-sm">2. How We Use Your Information</h3>
                  <p>
                    We use information to maintain your career dashboard, generate roadmaps, and review resumes.
                  </p>
                  <h3 className="text-[#F4F1EA] font-bold text-sm">3. Data Sharing & Third-Party APIs</h3>
                  <p>
                    We use the Google Gemini API and local vector storage to implement AI features. Resumes and context files are indexed and processed using these services. We do not sell your personal data.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-900 flex justify-end bg-[#11151D]/20">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-[#9B5CFF] hover:bg-[#C49AFF] text-[#07080C] text-xs font-bold rounded cursor-pointer"
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

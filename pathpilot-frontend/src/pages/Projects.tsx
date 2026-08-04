import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Terminal, 
  Database, 
  Cpu, 
  FolderTree, 
  Loader2, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export const Projects: React.FC = () => {
  const [stackInput, setStackInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Generate project design mutation
  const generateProjectMutation = useMutation({
    mutationFn: async (stack: string) => {
      const res = await api.post('/api/ai/project', { stack });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stackInput.trim()) return;
    generateProjectMutation.mutate(stackInput);
  };

  const copyText = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Input query bar */}
      <div className="glass-card p-6 border border-slate-800 bg-slate-900/30">
        <h4 className="text-base font-bold text-white mb-3">AI Project Architect Sandbox</h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Provide a stack definition or specific idea (e.g. 'NextJS, Tailwind and PostgreSQL ecommerce app'). PathPilot AI will model directory layouts, relational schemas, and API routes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. React Native, Spring Boot, ChromaDB, FastAPI..."
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={generateProjectMutation.isPending || !stackInput.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10"
          >
            {generateProjectMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Architecture</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results grid */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Ideas & Architectural Suggestion */}
          <div className="glass-card p-6 border border-slate-800 bg-slate-900/30 md:col-span-2">
            <h5 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2 mb-3">
              <Cpu className="w-4.5 h-4.5 text-purple-400" />
              <span>Project Concept & Overview</span>
            </h5>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              {result.ideas}
            </p>
          </div>

          {/* Folder Structure */}
          <div className="glass-card border border-slate-800 bg-slate-900/30 flex flex-col h-[350px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-850 bg-slate-950/20">
              <h5 className="text-xs font-bold text-slate-250 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-purple-400" />
                <span>Directory Blueprint</span>
              </h5>
              <button 
                onClick={() => copyText(result.folder_structure, 'folder')}
                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSection === 'folder' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-auto flex-1 font-mono text-xs text-purple-300/90 leading-relaxed select-text bg-slate-950/30">
              <code>{result.folder_structure}</code>
            </pre>
          </div>

          {/* API Suggestions */}
          <div className="glass-card border border-slate-800 bg-slate-900/30 flex flex-col h-[350px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-850 bg-slate-950/20">
              <h5 className="text-xs font-bold text-slate-250 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>API Endpoint Specifications</span>
              </h5>
              <button 
                onClick={() => copyText(result.api_suggestions, 'api')}
                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSection === 'api' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-auto flex-1 font-mono text-xs text-slate-200/90 leading-relaxed select-text bg-slate-950/30">
              <code>{result.api_suggestions}</code>
            </pre>
          </div>

          {/* Database Schema model */}
          <div className="glass-card border border-slate-800 bg-slate-900/30 flex flex-col h-[350px] md:col-span-2">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-850 bg-slate-950/20">
              <h5 className="text-xs font-bold text-slate-250 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Database DBML/SQL Design</span>
              </h5>
              <button 
                onClick={() => copyText(result.database_design, 'db')}
                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSection === 'db' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-auto flex-1 font-mono text-xs text-amber-250/90 leading-relaxed select-text bg-slate-950/30">
              <code>{result.database_design}</code>
            </pre>
          </div>

        </div>
      )}

    </div>
  );
};

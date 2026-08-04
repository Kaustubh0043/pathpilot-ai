import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Upload, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Loader2,
  FileCheck,
  Send,
  BookOpen,
  FolderOpen
} from 'lucide-react';

export const Resume: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ats' | 'rag'>('ats');
  
  // ATS Resume State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // RAG State
  const [ragFile, setRagFile] = useState<File | null>(null);
  const [ragUploading, setRagUploading] = useState(false);
  const [ragQuery, setRagQuery] = useState('');
  const [ragThread, setRagThread] = useState<Array<{ sender: 'USER' | 'AI'; content: string; sources?: string[] }>>([]);

  // Fetch documents list
  const { data: documents, isLoading: loadingDocs } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/api/documents');
      return res.data;
    },
  });

  const resumes = documents?.filter((d: any) => d.fileType === 'RESUME') || [];
  const ragDocs = documents?.filter((d: any) => d.fileType === 'RAG_DOC') || [];

  // Fetch active resume analysis details
  const { data: analysis, isLoading: loadingAnalysis } = useQuery({
    queryKey: ['resumeAnalysis', activeDocId],
    queryFn: async () => {
      if (!activeDocId) return null;
      const res = await api.post(`/api/documents/${activeDocId}/analyze`);
      return res.data;
    },
    enabled: !!activeDocId,
  });

  // Delete document mutation
  const deleteDocMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (activeDocId) setActiveDocId(null);
    },
  });

  // RAG query mutation
  const ragQueryMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await api.post('/api/documents/rag-query', { query });
      return res.data;
    },
    onSuccess: (data) => {
      setRagThread(prev => [...prev, {
        sender: 'AI',
        content: data.answer,
        sources: data.sources
      }]);
      setRagQuery('');
    },
  });

  // Handle Resume Upload
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileType', 'RESUME');

    try {
      const res = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setSelectedFile(null);
      setActiveDocId(res.data.id);
    } catch (err) {
      console.error('File upload failed', err);
      alert('Could not upload file.');
    } finally {
      setUploading(false);
    }
  };

  // Handle RAG Context Upload
  const handleRagUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragFile) return;

    setRagUploading(true);
    const formData = new FormData();
    formData.append('file', ragFile);
    formData.append('fileType', 'RAG_DOC');

    try {
      await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setRagFile(null);
    } catch (err) {
      console.error('RAG File upload failed', err);
      alert('Could not upload context file.');
    } finally {
      setRagUploading(false);
    }
  };

  const handleSendRagQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim() || ragQueryMutation.isPending) return;

    const userMsg = ragQuery;
    setRagThread(prev => [...prev, { sender: 'USER', content: userMsg }]);
    ragQueryMutation.mutate(userMsg);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Tabs */}
      <div className="flex border-b border-slate-850">
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex items-center gap-2 pb-3 px-6 text-sm font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'ats' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4.5 h-4.5" />
          <span>ATS Resume Analyzer</span>
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`flex items-center gap-2 pb-3 px-6 text-sm font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'rag' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>RAG Document Q&A Sandbox</span>
        </button>
      </div>

      {activeTab === 'ats' ? (
        /* ATS RESUME ANALYZER TAB CONTENT */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Left panel - Upload & List */}
          <div className="space-y-6 md:col-span-1">
            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30">
              <h4 className="text-sm font-bold text-white mb-3">Upload Resume</h4>
              <form onSubmit={handleResumeUpload} className="space-y-4">
                <div className="border border-dashed border-slate-850 hover:border-purple-500/50 rounded-xl p-6 text-center transition-all bg-slate-950/40 relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 mx-auto transition-colors" />
                  <p className="text-xs text-slate-300 font-semibold mt-3">
                    {selectedFile ? selectedFile.name : 'Click or Drag PDF/DOCX'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PDF or Word templates only</p>
                </div>
                {selectedFile && (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Upload & Evaluate</span>}
                  </button>
                )}
              </form>
            </div>

            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30">
              <h4 className="text-sm font-bold text-white mb-3">Processed Resumes</h4>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {loadingDocs ? (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto py-4" />
                ) : resumes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No resumes uploaded yet.</p>
                ) : (
                  resumes.map((doc: any) => (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDocId(doc.id)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group
                        ${activeDocId === doc.id 
                          ? 'bg-purple-600/15 border-purple-500/35 text-purple-400' 
                          : 'text-slate-350 bg-slate-950/20 border-transparent hover:text-white hover:bg-slate-800/40'}
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="w-4 h-4 shrink-0 text-purple-400" />
                        <span className="text-xs font-semibold truncate">{doc.filename}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocMutation.mutate(doc.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right panel - Analysis details */}
          <div className="glass-card border border-slate-800 bg-slate-900/30 p-6 md:col-span-2 min-h-[400px] flex flex-col">
            {!activeDocId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-purple-500 animate-pulse mb-3" />
                <h4 className="text-base font-bold text-white">ATS Scorer & Advisor</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1.5">
                  Select a resume to evaluate missing keywords, parse capabilities, and read improvement blueprints.
                </p>
              </div>
            ) : loadingAnalysis ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
                <span className="text-xs text-slate-400">Parsing profiles...</span>
              </div>
            ) : !analysis ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <HelpCircle className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-xs text-slate-400">Unable to load evaluation details.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/30 border border-slate-850">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ATS Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-extrabold px-3 py-1 rounded-lg border ${getScoreColor(analysis.ats_score)}`}>
                        {analysis.ats_score}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                    <strong>AI Overview:</strong> {analysis.summary}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Missing Skills & Keywords</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_skills?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Improvement Blueprints</span>
                  </h5>
                  <ul className="space-y-2">
                    {analysis.improvement_suggestions?.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-slate-350 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/15 text-xs text-slate-350 leading-relaxed">
                  <strong>Evaluator Review:</strong> {analysis.feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RAG DOCUMENT Q&A TAB CONTENT */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Left panel - Upload Context & Document List */}
          <div className="space-y-6 md:col-span-1">
            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30">
              <h4 className="text-sm font-bold text-white mb-3">Upload RAG Context File</h4>
              <form onSubmit={handleRagUpload} className="space-y-4">
                <div className="border border-dashed border-slate-850 hover:border-purple-500/50 rounded-xl p-6 text-center transition-all bg-slate-950/40 relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.pptx,.txt"
                    onChange={(e) => e.target.files && setRagFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 mx-auto transition-colors" />
                  <p className="text-xs text-slate-300 font-semibold mt-3">
                    {ragFile ? ragFile.name : 'Drag Context Files (PDF, Word, PPT)'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Chunked & embedded automatically</p>
                </div>
                {ragFile && (
                  <button
                    type="submit"
                    disabled={ragUploading}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    {ragUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Index in ChromaDB</span>}
                  </button>
                )}
              </form>
            </div>

            <div className="glass-card p-5 border border-slate-800 bg-slate-900/30">
              <h4 className="text-sm font-bold text-white mb-3">Active Context Files</h4>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {loadingDocs ? (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto py-4" />
                ) : ragDocs.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No reference files indexed.</p>
                ) : (
                  ragDocs.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-transparent bg-slate-950/20 text-slate-350 hover:text-white"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FolderOpen className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span className="text-xs font-semibold truncate">{doc.filename}</span>
                      </div>
                      <button
                        onClick={() => deleteDocMutation.mutate(doc.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right panel - Interactive RAG Q&A Console */}
          <div className="glass-card border border-slate-800 bg-slate-900/30 p-6 md:col-span-2 min-h-[400px] flex flex-col justify-between overflow-hidden">
            
            {/* QA Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {ragThread.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-cyan-500 animate-pulse mb-3" />
                  <h4 className="text-base font-bold text-white">Ask your Context Files</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    PathPilot will answer questions strictly using facts pulled from files inside ChromaDB.
                  </p>
                </div>
              ) : (
                ragThread.map((msg, idx) => {
                  const isUser = msg.sender === 'USER';
                  return (
                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`
                        max-w-[85%] rounded-xl p-4 text-xs leading-relaxed border
                        ${isUser 
                          ? 'bg-purple-650/15 border-purple-500/20 text-slate-200 rounded-tr-none' 
                          : 'bg-slate-950/40 border-slate-900 rounded-tl-none text-slate-300'}
                      `}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                        
                        {/* Source citations */}
                        {!isUser && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-900/60 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Citations:</span>
                            {msg.sources.map((src, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 font-semibold font-mono">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pending query animation */}
              {ragQueryMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl rounded-tl-none p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-[10px] text-slate-400 font-semibold">Retrieving facts & synthesizing answers...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Query Form Input */}
            <form onSubmit={handleSendRagQuery} className="flex gap-2 border-t border-slate-900 pt-4 bg-slate-950/10">
              <input
                type="text"
                required
                disabled={ragQueryMutation.isPending || ragDocs.length === 0}
                placeholder={ragDocs.length === 0 ? "Upload reference context documents to activate search..." : "Ask context documents..."}
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all"
              />
              <button
                type="submit"
                disabled={!ragQuery.trim() || ragQueryMutation.isPending || ragDocs.length === 0}
                className="px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-900 disabled:text-slate-650 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md shadow-purple-600/10"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

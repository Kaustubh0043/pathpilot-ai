import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  MessageSquare, 
  Send, 
  Terminal, 
  User, 
  Plus, 
  Trash2, 
  Bot, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';

export const Chat: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  const { data: conversations, isLoading: loadingConvs } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/api/chat/conversations');
      return res.data;
    },
  });

  // Fetch messages of active conversation
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', activeConvId],
    queryFn: async () => {
      if (!activeConvId) return [];
      const res = await api.get(`/api/chat/conversations/${activeConvId}/messages`);
      return res.data;
    },
    enabled: !!activeConvId,
  });

  // Create conversation mutation
  const createConvMutation = useMutation({
    mutationFn: async (title: string) => {
      return api.post('/api/chat/conversations', { title });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConvId(res.data.id);
      setNewChatTitle('');
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (payload: { convId: string; content: string }) => {
      return api.post(`/api/chat/conversations/${payload.convId}/messages`, { content: payload.content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeConvId] });
      setInputText('');
    },
  });

  // Delete conversation
  const deleteConvMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/api/chat/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (activeConvId) {
        setActiveConvId(null);
      }
    },
  });

  // Auto-scroll to chat bottom
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);

  // Set default active conversation if none selected
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;
    createConvMutation.mutate(newChatTitle);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({
      convId: activeConvId,
      content: inputText,
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const parseInlineFormatting = (text: string) => {
    // Split by ** to find bold sections
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Odd indices are bold
      if (index % 2 !== 0) {
        return (
          <strong 
            key={index} 
            className="font-extrabold text-white bg-purple-500/10 px-1 py-0.5 rounded border border-purple-500/20"
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const parseMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      const trimmed = line.trim();

      // Handle horizontal rule
      if (trimmed === '---') {
        return <hr key={lineIndex} className="border-slate-800/80 my-4" />;
      }

      // Handle Headings
      if (trimmed.startsWith('#### ')) {
        return (
          <h6 key={lineIndex} className="text-xs font-bold text-slate-200 mt-3 mb-1.5 uppercase tracking-wider">
            {parseInlineFormatting(trimmed.substring(5))}
          </h6>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h5 key={lineIndex} className="text-sm font-black text-white mt-4 mb-2">
            {parseInlineFormatting(trimmed.substring(4))}
          </h5>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h4 key={lineIndex} className="text-base font-black text-purple-400 mt-5 mb-2.5">
            {parseInlineFormatting(trimmed.substring(3))}
          </h4>
        );
      }

      // Handle Bullet Lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={lineIndex} className="list-disc ml-5 my-1 text-slate-350 leading-relaxed text-sm">
            {parseInlineFormatting(trimmed.substring(2))}
          </li>
        );
      }

      // Handle empty lines (add space)
      if (trimmed === '') {
        return <div key={lineIndex} className="h-2" />;
      }

      // Normal text paragraph
      return (
        <p key={lineIndex} className="text-slate-300 leading-relaxed text-sm my-1">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  // Custom function to render text and format code block sections cleanly
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split('```');
    return parts.map((part, index) => {
      // Odd indices are code blocks
      if (index % 2 !== 0) {
        // Extract language and code content
        const lines = part.split('\n');
        const firstLine = lines[0].trim();
        const codeLang = ['javascript', 'typescript', 'html', 'css', 'java', 'python', 'bash', 'json'].includes(firstLine) 
          ? firstLine 
          : 'code';
        const codeText = codeLang !== 'code' ? lines.slice(1).join('\n') : part;
        const blockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-850 text-slate-400">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-purple-400">
                <Terminal className="w-3.5 h-3.5" />
                {codeLang}
              </span>
              <button 
                onClick={() => copyToClipboard(codeText, blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-200"><code>{codeText.trim()}</code></pre>
          </div>
        );
      }
      
      // Render standard paragraph text, parsing headers, lists, and bold markdown
      return (
        <span key={index} className="block space-y-1">
          {parseMarkdownText(part)}
        </span>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-10rem)] min-h-[500px]">
      
      {/* Sidebar Panel - Conversation List (Hidden on Mobile) */}
      <div className="hidden md:flex glass-card p-4 border border-slate-800 bg-slate-900/30 flex-col h-full md:col-span-1">
        
        {/* Create Chat */}
        <form onSubmit={handleCreateChat} className="flex gap-2 mb-4">
          <input
            type="text"
            required
            placeholder="New chat title..."
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600"
          />
          <button 
            type="submit" 
            className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cursor-pointer shadow-lg shadow-purple-600/10"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {loadingConvs ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto" />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-500">No chats initiated yet.</p>
            </div>
          ) : (
            conversations.map((conv: any) => (
              <div 
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`
                  flex items-center justify-between p-3 rounded-lg text-xs font-semibold cursor-pointer border transition-all group
                  ${activeConvId === conv.id 
                    ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent'}
                `}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConvMutation.mutate(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Terminal - Full Width on Mobile like ChatGPT */}
      <div className="border-0 bg-transparent md:border md:border-slate-800 md:bg-slate-900/30 md:glass-card flex flex-col h-full md:col-span-3 overflow-hidden">
        
        {/* Mobile Conversation Selector Header */}
        <div className="md:hidden p-3 border-b border-slate-900 flex items-center justify-between gap-3 bg-slate-950/40">
          <select
            value={activeConvId || ''}
            onChange={(e) => setActiveConvId(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-3 text-xs text-slate-350 font-semibold focus:outline-none focus:border-purple-600"
          >
            {conversations && conversations.length > 0 ? (
              conversations.map((conv: any) => (
                <option key={conv.id} value={conv.id}>{conv.title}</option>
              ))
            ) : (
              <option value="">No Active Chats</option>
            )}
          </select>
          <button
            type="button"
            onClick={() => {
              const title = prompt("Enter new chat title:");
              if (title && title.trim()) {
                createConvMutation.mutate(title.trim());
              }
            }}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
          >
            + New Chat
          </button>
        </div>

        {/* Messages viewport */}
        <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {!activeConvId ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-12 h-12 text-purple-500 animate-bounce mb-3" />
              <h4 className="text-base font-bold text-white">PathPilot Career Coach</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a conversation history from the sidebar or click '+' to begin mapping details.
              </p>
            </div>
          ) : loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-10 h-10 text-purple-500 mb-2" />
              <h5 className="text-sm font-semibold text-slate-300">Start the conversation</h5>
              <p className="text-xs text-slate-500 mt-1">Ask questions about preparation targets, resumes, stack selections, etc.</p>
            </div>
          ) : (
            messages.map((msg: any) => {
              const isAi = msg.sender.toUpperCase() === 'AI';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 sm:gap-4 items-start ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Left Side AI Avatar */}
                  {isAi && (
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`
                    max-w-[92%] md:max-w-[80%] rounded-2xl p-3 sm:p-4 text-slate-150 border
                    ${isAi 
                      ? 'bg-slate-950/20 border-slate-900 rounded-tl-none shadow-sm' 
                      : 'bg-purple-600/15 border-purple-500/20 text-slate-200 rounded-tr-none shadow-lg shadow-purple-600/5'}
                  `}>
                    {renderMessageContent(msg.content, msg.id)}
                  </div>

                  {/* Right Side User Avatar */}
                  {!isAi && (
                    <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Pending response loader */}
          {sendMessageMutation.isPending && (
            <div className="flex gap-2.5 sm:gap-4 items-start justify-start">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/20 border border-slate-900 rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span className="text-xs text-slate-400 font-medium">PathPilot is thinking...</span>
              </div>
            </div>
          )}


        </div>

        {/* Input Form Bar */}
        {activeConvId && (
          <div className="p-3 sm:p-4 border-t border-slate-900 bg-slate-950/30">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                required
                disabled={sendMessageMutation.isPending}
                placeholder="Ask PathPilot AI coaching tips..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 pl-4 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || sendMessageMutation.isPending}
                className="px-4 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-purple-600/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};

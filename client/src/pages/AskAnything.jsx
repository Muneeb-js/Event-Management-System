import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// Render markdown-lite: bold, bullet points, line breaks
const renderMessage = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold text: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return (
        <li key={i} className="ml-4 list-disc">
          {parts}
        </li>
      );
    }

    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="mb-1">{parts}</p>;
  });
};

const SUGGESTED_QUESTIONS = [
  "What events are coming up this month?",
  "How many students are registered?",
  "Who organizes the most events?",
  "Tell me about the AI Summit event",
  "Which events can I join right now?",
  "List all workshop events",
];

const AskAnything = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello${user ? `, ${user.fullName.split(' ')[0]}` : ''}! 👋 I'm the **UEMS Assistant**, your AI-powered guide to everything happening on campus.\n\nI have live access to all events, students, teachers, and platform data. Ask me anything — from upcoming workshops to event organizers to registration details.\n\nHow can I help you today?`,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Build history excluding the initial assistant greeting for the API call
    const historyForApi = newMessages.slice(1, -1); // skip greeting, skip the new user msg

    try {
      const res = await axios.post(`${config.API_BASE_URL}/chat`, {
        message: messageText,
        history: historyForApi,
      });

      const assistantMessage = {
        role: 'assistant',
        content: res.data.data.reply,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to get a response. Please try again.';
      toast.error(errorMsg);
      // Show error in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error**: ${errorMsg}`,
        isError: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! I'm still here to help. What would you like to know about UEMS?`,
    }]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-[1000px] w-full mx-auto px-4 py-6 gap-4">

        {/* Messages Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '500px', maxHeight: '65vh' }}>
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">UEMS Assistant · Online</span>
            </div>
            <button
              onClick={clearChat}
              className="text-[10px] font-bold text-gray-400 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-[#FFD700] text-[#0A2540]'
                    : msg.isError
                    ? 'bg-red-100 text-red-600'
                    : 'bg-[#0A2540] text-white'
                }`}>
                  {msg.role === 'user'
                    ? (user?.fullName?.charAt(0) || 'U')
                    : msg.isError ? '!' : 'AI'
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-lg px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0A2540] text-white rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-sm'
                    : 'bg-[#F8F9FA] text-[#0A2540] border border-gray-100 rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant'
                    ? <div className="space-y-0.5">{renderMessage(msg.content)}</div>
                    : <p>{msg.content}</p>
                  }
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0A2540] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
                <div className="bg-[#F8F9FA] border border-gray-100 rounded-lg rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-[11px] font-medium text-[#0A2540] rounded-full hover:border-[#0A2540] hover:bg-[#0A2540] hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden focus-within:border-[#0A2540] transition-colors">
          <div className="flex items-end gap-3 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about events, schedules, teachers, students..."
              rows={2}
              disabled={loading}
              className="flex-1 resize-none text-[13px] text-[#0A2540] placeholder-gray-300 bg-transparent focus:outline-none leading-relaxed disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-[#0A2540] text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <div className="px-3 pb-2 flex items-center justify-between">
            <p className="text-[9px] text-gray-300 uppercase tracking-widest">
              Press Enter to send · Shift+Enter for new line
            </p>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest">
              Gemini 1.5 Flash · Live Data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAnything;

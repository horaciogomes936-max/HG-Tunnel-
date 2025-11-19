import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { sendSupportMessage } from '../services/geminiService';
import { ChatMessage, Language, ConnectionStatus } from '../types';

interface SupportChatProps {
  lang: Language;
  status: ConnectionStatus;
  translations: any;
}

export const SupportChat: React.FC<SupportChatProps> = ({ lang, status, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `Current User Status: ${status}. Language: ${lang}.`;
    const replyText = await sendSupportMessage(userMsg.text, context);

    setMessages(prev => [...prev, { role: 'model', text: replyText }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-cyan-600 hover:bg-cyan-500 p-3 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
      >
        <Icons.MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 w-80 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col h-96">
      {/* Header */}
      <div className="bg-slate-900 p-3 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-bold text-sm">{translations[lang].support}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800/50">
        {messages.length === 0 && (
            <p className="text-center text-slate-500 text-xs mt-10">
                HG AI Assistant<br/>Powered by Gemini
            </p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-2 rounded-lg text-xs text-slate-400">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 bg-slate-900 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={translations[lang].supportPlaceholder}
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
        />
        <button 
            onClick={handleSend} 
            disabled={isLoading}
            className="p-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          <Icons.Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
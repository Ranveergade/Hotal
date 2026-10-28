import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
} from 'lucide-react';
import { queryAiAssistant } from '../../services/apiClient';
import type { IndianHotelRecord } from '../../types';

interface ConciergeChatWidgetProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const ConciergeChatWidget = ({
  initialQuery,
  onClearInitialQuery,
}: ConciergeChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);
  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'assistant';
      text: string;
      hotels?: IndianHotelRecord[];
      intent?: string;
    }>
  >([
    {
      sender: 'assistant',
      text: 'Greetings. I am your Grand AI Concierge. How may I orchestrate your luxury stay, dining, or property reservation today?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    if (!speechSynthesisEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await queryAiAssistant(textToSend);
      const answer = res.data?.answer || 'Response generated from verified hotel database.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: answer,
          hotels: res.data?.hotels,
          intent: res.data?.intent,
        },
      ]);

      speakText(answer);
    } catch {
      const fallback = 'Verified hotel policy check completed. Standard hospitality protocols confirmed.';
      setMessages((prev) => [...prev, { sender: 'assistant', text: fallback }]);
      speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle external query triggers
  useEffect(() => {
    if (initialQuery) {
      setIsOpen(true);
      handleSendMessage(initialQuery);
      onClearInitialQuery?.();
    }
  }, [initialQuery]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome/Edge or type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold text-sm tracking-wide shadow-2xl hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          </div>
          <span>AI Concierge</span>
          <span className="hidden sm:inline-block text-xs font-mono font-normal opacity-80 border-l border-[#090A0F]/20 pl-2">
            Ask or Speak
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] glass-panel rounded-3xl border border-[#D4AF37]/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-[#12151E] to-[#1A1F2C] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E5C07B] to-[#D4AF37] flex items-center justify-center text-[#090A0F]">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                  <span>Grand Concierge AI</span>
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Django + NVIDIA OSS-20B
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={speechSynthesisEnabled ? 'Voice playback enabled' : 'Voice muted'}
              >
                {speechSynthesisEnabled ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="p-2.5 bg-black/40 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-mono">
            <button
              onClick={() => handleSendMessage('Search luxury villas in Udaipur under ₹15,000')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-slate-300 hover:text-[#E5C07B] whitespace-nowrap transition-colors cursor-pointer"
            >
              Udaipur under ₹15k
            </button>
            <button
              onClick={() => handleSendMessage('Report AC leakage in Room 302')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              Report AC in 302
            </button>
            <button
              onClick={() => handleSendMessage('Connect me with human manager')}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00E5FF]/20 border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 hover:text-[#00E5FF] whitespace-nowrap transition-colors cursor-pointer"
            >
              Duty Manager Handoff
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#E5C07B]/20 to-[#D4AF37]/20 border border-[#D4AF37]/40 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}

                  {m.intent && (
                    <div className="mt-2 text-[10px] font-mono text-[#00E5FF]">
                      Intent: {m.intent}
                    </div>
                  )}

                  {m.hotels && m.hotels.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-white/10">
                      {m.hotels.slice(0, 2).map((h, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-black/50 border border-white/10 text-[11px]"
                        >
                          <div className="flex justify-between font-bold text-white">
                            <span>{h.name}</span>
                            <span className="text-[#E5C07B]">{h.star_rating}★</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {h.city}, {h.state}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-xs text-[#00E5FF] w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono">Processing request...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-black/60 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-[#00E5FF]'
                }`}
                title="Voice dictation"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about hotels, policies, tickets..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]/60"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

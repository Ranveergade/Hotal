import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
  Building,
  MapPin,
  Star,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Ticket,
} from 'lucide-react';
import { queryAiAssistant } from '../../services/apiClient';
import type { IndianHotelRecord } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  hotels?: IndianHotelRecord[];
  matchedCity?: string | null;
  matchedFacility?: string | null;
  intent?: string;
  actionStatus?: string;
  ticket?: {
    id?: string | number;
    title?: string;
    department?: string;
    status?: string;
  };
  isError?: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'Hotels with Pool in Mumbai', query: 'Show me luxury hotels with a swimming pool in Mumbai' },
  { label: 'Palace Resort in Udaipur', query: 'Recommend a royal heritage palace stay in Udaipur with spa' },
  { label: 'Delhi Diplomatic Stays', query: 'Which 5-star hotels are located in Chanakyapuri New Delhi?' },
  { label: 'Late Checkout Policy', query: 'What is the standard policy regarding late checkout and luggage holding?' },
];

export const ConciergeDesk = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Greetings. I am Grand Concierge AI Assistant, grounded strictly in internal hotel databases and verified standard operating procedures. You may type or use speech recognition to query hotel properties and service policies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Detect Speech Recognition Support
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setVoiceSupported(true);
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak your guest inquiry clearly.');
      };

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        setVoiceNotice(`Speech recognition error: ${event.error || 'Access denied'}`);
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      rec.onend = () => {
        setIsListening(false);
        setVoiceNotice('Voice captured. You may review and edit text before sending.');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognitionRef.current = rec;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setVoiceNotice('Speech recognition Web API is not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        setVoiceNotice(`Microphone error: ${err.message || 'Cannot activate'}`);
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!window.speechSynthesis) {
      setVoiceNotice('SpeechSynthesis is not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await queryAiAssistant(text);

      if (response.data && !response.data.error) {
        const assistantMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: response.data.answer || 'No recommendation could be generated for this request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hotels: response.data.hotels,
          matchedCity: response.data.matched_city,
          matchedFacility: response.data.matched_facility,
          intent: response.data.intent,
          actionStatus: response.data.action_status,
          ticket: response.data.ticket,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errText =
          response.error || response.data?.error || 'Failed to receive response from backend.';
        setErrorMessage(errText);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'assistant',
            text: `[Backend Standby]: ${errText}. The Django server is offline at http://localhost:8000. In live mode, requests execute against POST /api/ai-assistant/ (NVIDIA OSS-20B).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Unknown network failure';
      setErrorMessage(errText);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `[Network Standby]: Unable to reach POST /api/ai-assistant/. Verify that the backend server is running on port 8000.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'init-fresh',
        sender: 'assistant',
        text: 'Session history cleared. How may I assist your guests today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-8">
      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Grounded AI Concierge
            </span>
            <span className="text-xs font-mono text-slate-500">
              POST /api/ai-assistant/
            </span>
            {voiceSupported && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Voice Enabled
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Guest Assistant &amp; Knowledge Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time natural language query resolution constrained to internal hotel databases. With browser voice dictation and speech readout.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          title="Clear session history"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Curated Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sample.query)}
              disabled={isLoading}
              className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 text-slate-700 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Status Banner */}
      {voiceNotice && (
        <div className="mb-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2 font-medium">
          <Mic className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 overflow-y-auto min-h-[440px] max-h-[620px] flex flex-col gap-4 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-semibold text-slate-400">
              <span>{msg.sender === 'user' ? 'Operator / Guest' : 'Grand AI Concierge'}</span>
              <span>•</span>
              <span className="font-normal">{msg.timestamp}</span>

              {msg.sender === 'assistant' && !msg.isError && (
                <button
                  onClick={() => handleSpeak(msg.id, msg.text)}
                  className={`p-1 transition-colors cursor-pointer text-slate-400 hover:text-indigo-600 ${
                    speakingMessageId === msg.id ? 'text-indigo-600' : ''
                  }`}
                  title={speakingMessageId === msg.id ? 'Stop speaking' : 'Read aloud with speech synthesis'}
                >
                  {speakingMessageId === msg.id ? (
                    <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            <div
              className={`max-w-2xl p-4 text-sm leading-relaxed rounded-2xl shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : msg.isError
                  ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-tl-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Matched Metadata & Intent */}
              {(msg.matchedCity || msg.matchedFacility || msg.intent || msg.actionStatus) && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-2 text-xs">
                  {msg.intent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase">
                      Intent: {msg.intent}
                    </span>
                  )}
                  {msg.matchedCity && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-600" />
                      City: {msg.matchedCity}
                    </span>
                  )}
                  {msg.matchedFacility && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Amenity: {msg.matchedFacility}
                    </span>
                  )}
                </div>
              )}

              {/* Proposed Ticket */}
              {msg.ticket && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-indigo-600 flex-none" />
                  <div>
                    <strong>Proposed Ticket #{msg.ticket.id}:</strong> {msg.ticket.title} ({msg.ticket.department})
                  </div>
                </div>
              )}

              {/* Verified SQLite Hotels Returned */}
              {msg.hotels && msg.hotels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Verified Properties ({msg.hotels.length} Found):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.hotels.map((h, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900">{h.name}</h4>
                          {h.star_rating > 0 && (
                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {h.star_rating}★
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px] font-medium mt-0.5">
                          {h.city}, {h.state}
                        </div>
                        {h.description && (
                          <p className="text-slate-600 line-clamp-2 mt-1.5 text-[11px] leading-relaxed">
                            {h.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-fit text-xs font-semibold text-indigo-600">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Querying NVIDIA OSS-20B &amp; Local SQLite Database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about hotel policies, room requests, or properties in any Indian city..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs transition-all"
        />

        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
          }`}
          title={isListening ? 'Stop recording voice' : 'Dictate with browser speech recognition'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Operational Disclaimer */}
      <div className="mt-3 text-xs text-slate-400 flex items-center justify-between font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Strict SOP Grounding // NVIDIA OSS-20B &amp; Web Speech API
        </span>
        {errorMessage && (
          <span className="text-amber-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Backend standby
          </span>
        )}
      </div>
    </div>
  );
};

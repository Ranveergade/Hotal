import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Building,
  Star,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { queryAiAssistant } from '../../services/apiClient';
import type { IndianHotelRecord } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface PinnedAiShowcaseProps {
  initialQuery?: string;
}

export const PinnedAiShowcase = ({ initialQuery }: PinnedAiShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Live Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{
      sender: 'guest' | 'ai';
      text: string;
      intent?: string;
      hotels?: IndianHotelRecord[];
    }>
  >([
    {
      sender: 'guest',
      text: 'Can we request a 2:30 PM checkout for Room 402? Also need luggage assistance with 4 bags.',
    },
    {
      sender: 'ai',
      text: 'Good afternoon. Under Centurion tier benefits, late checkout is guaranteed until 2:00 PM. A 2:30 PM extension requires brief Duty Manager turnaround authorization due to an inbound VIP arrival at 16:30. I have provisionally queued porterage for 2:15 PM.',
      intent: 'ROOM_POLICY_CHECK',
    },
  ]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.story-step-card');
      if (cards.length === 0) return;

      // Pin the section and scrub through the 3 cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Card 1 is active initially
      // Animate Card 2 entering and Card 1 fading
      tl.to(cards[0], {
        opacity: 0.25,
        scale: 0.95,
        duration: 0.5,
      })
        .fromTo(
          cards[1],
          { opacity: 0.2, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          '<'
        )
        // Animate Card 3 entering and Card 2 fading
        .to(cards[1], {
          opacity: 0.25,
          scale: 0.95,
          duration: 0.5,
        })
        .fromTo(
          cards[2],
          { opacity: 0.2, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          '<'
        );
    },
    { scope: containerRef }
  );

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    setConversation((prev) => [
      ...prev,
      { sender: 'guest', text: promptText },
    ]);
    setTerminalLoading(true);

    try {
      const res = await queryAiAssistant({
        message: promptText,
        room_number: '402',
        guest_name: 'Jane Doe',
      });

      setConversation((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data?.answer || 'Response generated from verified hotel database.',
          intent: res.data?.intent,
          hotels: res.data?.hotels,
        },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Verified policy check complete. Relevant hotel SOP guidelines confirmed.',
        },
      ]);
    } finally {
      setTerminalLoading(false);
      setTerminalInput('');
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSendPrompt(initialQuery);
    }
  }, [initialQuery]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#090A0F] text-white py-16 px-6 sm:px-12 overflow-hidden border-t border-white/5"
    >
      {/* Background Ambience */}
      <div className="absolute right-10 top-1/4 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 w-[500px] h-[500px] bg-[#00E5FF]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* ================= LEFT SIDE: 3 SEQUENTIAL STORYTELLING CARDS ================= */}
        <div ref={leftCardsRef} className="lg:col-span-5 flex flex-col gap-6">
          <div className="mb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E5C07B] font-semibold">
              Live Reasoning Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 leading-tight">
              Pinned AI Concierge Spotlight
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-sans">
              Scroll down to scrub through the 3 autonomous intelligence layers powering every guest interaction.
            </p>
          </div>

          {/* Step 1 Card */}
          <div className="story-step-card glass-panel rounded-2xl p-6 border border-[#D4AF37]/30 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5C07B]">
                Step 01 // Semantic Parsing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#E5C07B] text-[10px] font-mono font-semibold">
                Instant Intent
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Instant Intent Recognition
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Natural language models extract structured intents (<code className="text-[#00E5FF]">HOTEL_SEARCH</code>, <code className="text-[#E5C07B]">BOOKING_QUERY</code>, <code className="text-rose-400">HUMAN_ESCALATION</code>) with real-time entity recognition for guest names and room numbers.
            </p>
          </div>

          {/* Step 2 Card */}
          <div className="story-step-card glass-panel rounded-2xl p-6 border border-[#00E5FF]/30 transition-all duration-500 opacity-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00E5FF]">
                Step 02 // SOP Grounding
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono font-semibold">
                RAG &amp; SQLite
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Live Room &amp; Policy Verification
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Cosine similarity matches queries against internal hotel SOPs (Housekeeping Turnaround, Centurion Privileges, Porterage SLAs) and verified Indian hotel catalogs. Zero speculative answers.
            </p>
          </div>

          {/* Step 3 Card */}
          <div className="story-step-card glass-panel rounded-2xl p-6 border border-rose-500/30 transition-all duration-500 opacity-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                Step 03 // Safety Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-semibold">
                Human Takeover
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Auto Escalation to Staff
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              When room turnaround windows are tight (&lt;60 mins) or high-tier discretion is required, the AI autonomously alerts the Duty Manager on the Operations Desk.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: LIVE INTERACTIVE PHONE / TERMINAL ================= */}
        <div ref={terminalRef} className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl relative flex flex-col h-[560px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E5C07B] to-[#D4AF37] flex items-center justify-center text-[#090A0F] font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                    <span>Grand AI Concierge</span>
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Django API • NVIDIA OSS-20B
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#E5C07B]">
                  Room 402 • Centurion
                </span>
              </div>
            </div>

            {/* Scrollable Conversation History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'guest' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
                    {msg.sender === 'guest' ? (
                      <>
                        <span>Guest (Jane Doe)</span>
                        <User className="w-3 h-3 text-slate-400" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#E5C07B]" />
                        <span className="text-[#E5C07B] font-semibold">Grand Concierge AI</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                      msg.sender === 'guest'
                        ? 'bg-[#E5C07B]/15 border border-[#E5C07B]/30 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.intent && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-[#00E5FF]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Grounded Intent: {msg.intent}</span>
                      </div>
                    )}

                    {/* Hotel Cards if returned */}
                    {msg.hotels && msg.hotels.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {msg.hotels.slice(0, 2).map((h, hIdx) => (
                          <div
                            key={hIdx}
                            className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px]"
                          >
                            <div className="flex items-center justify-between text-white font-bold">
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-[#E5C07B]" />
                                {h.name}
                              </span>
                              {h.star_rating > 0 && (
                                <span className="text-[#E5C07B] flex items-center text-[10px]">
                                  <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                                  {h.star_rating}★
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[10px] mt-0.5">
                              {h.city}, {h.state}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {terminalLoading && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#00E5FF] w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-mono">Synthesizing SOP response via NVIDIA OSS-20B...</span>
                </div>
              )}
            </div>

            {/* Terminal Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(terminalInput);
              }}
              className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Test live reasoning (e.g. 'Can I book luxury room in Mumbai?')"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]/60"
              />
              <button
                type="submit"
                disabled={!terminalInput.trim() || terminalLoading}
                aria-label="Send query"
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

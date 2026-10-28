import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Compass, Shield, Mic, Search } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onSearchQuery: (query: string) => void;
  onOpenOperations: () => void;
}

export const HeroSection = ({ onSearchQuery, onOpenOperations }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const promptBarRef = useRef<HTMLDivElement>(null);
  const [promptInput, setPromptInput] = useState('');

  useGSAP(
    () => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      })
        .from('.hero-title-line', {
          y: 70,
          opacity: 0,
          duration: 1.1,
          stagger: 0.15,
        }, '-=0.5')
        .from('.hero-subtitle', {
          y: 30,
          opacity: 0,
          duration: 0.9,
        }, '-=0.6')
        .from('.hero-cta-group', {
          y: 20,
          opacity: 0,
          duration: 0.8,
        }, '-=0.6')
        .from('.floating-card', {
          scale: 0.85,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'back.out(1.4)',
        }, '-=0.7');

      // 2. Parallax Floating Cards Float animation
      gsap.to('.float-left', {
        y: -18,
        rotation: -2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.float-right', {
        y: 20,
        rotation: 2,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 3. ScrollTrigger: Pin Hero & Scale Down Background
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (heroContentRef.current) {
            gsap.set(heroContentRef.current, {
              scale: 1 - progress * 0.08,
              filter: `blur(${progress * 6}px)`,
              opacity: 1 - progress * 0.4,
            });
          }
          if (promptBarRef.current) {
            // Dock prompt bar downwards
            gsap.set(promptBarRef.current, {
              y: progress * 40,
              scale: 1 + progress * 0.04,
            });
          }
        },
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onSearchQuery(promptInput);
    setPromptInput('');
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-[#090A0F] pt-28 pb-12 px-6 sm:px-12"
    >
      {/* Background Radial Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-[#00E5FF]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Content */}
      <div
        ref={heroContentRef}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-6 will-change-transform"
      >
        {/* Pill Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xl mb-6 shadow-lg shadow-[#D4AF37]/5">
          <Sparkles className="w-4 h-4 text-[#E5C07B]" />
          <span className="text-xs font-mono tracking-widest uppercase text-[#E5C07B] font-semibold">
            NVIDIA AI Powered • Autonomous Hospitality
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-white leading-[1.05] uppercase">
          <span className="hero-title-line block">The Future of</span>
          <span className="hero-title-line block gold-gradient-text drop-shadow-2xl">
            Hospitality
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-sans font-light leading-relaxed mt-6">
          An ultra-luxurious autonomous workforce. Multi-turn AI Concierge, verified RAG standard operating procedures, and instant human safety takeover.
        </p>

        {/* CTAs */}
        <div className="hero-cta-group flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => onSearchQuery('Show me luxury heritage hotels with swimming pool in Udaipur')}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] hover:from-[#FFF2BC] hover:to-[#E5C07B] text-[#090A0F] font-semibold text-sm tracking-wide shadow-xl shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Explore Curated Stays</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenOperations}
            className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#00E5FF]/50 backdrop-blur-xl font-medium text-sm tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-[#00E5FF]/10"
          >
            <Shield className="w-4 h-4 text-[#00E5FF]" />
            <span>Staff Operations Hub</span>
          </button>
        </div>
      </div>

      {/* Parallax Floating Hotel Cards */}
      <div className="floating-card float-left hidden xl:block absolute left-8 top-1/3 w-72 glass-panel rounded-2xl p-4 pointer-events-none z-10 border border-[#D4AF37]/20 shadow-2xl">
        <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-[#12151E] to-[#1E2333] relative overflow-hidden flex items-end p-3 border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
          <div className="relative z-10">
            <span className="text-[10px] font-mono text-[#E5C07B] uppercase tracking-wider font-semibold block">
              VIP Tier 1 • Centurion
            </span>
            <div className="text-white text-xs font-serif font-bold">Taj Lake Palace Suite</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>AI Room Audit</span>
          <span className="text-[#00E5FF] font-semibold">100% Grounded</span>
        </div>
      </div>

      <div className="floating-card float-right hidden xl:block absolute right-8 top-2/5 w-76 glass-panel rounded-2xl p-4 pointer-events-none z-10 border border-[#00E5FF]/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-[#00E5FF] font-semibold tracking-wider">
              Autonomous Dispatch
            </div>
            <div className="text-white text-xs font-medium">Luggage Porterage Confirmed</div>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
          SLA Target: 8 mins • Dispatched to Concierge Stefan
        </div>
      </div>

      {/* Docked AI Command Prompt Bar */}
      <div
        ref={promptBarRef}
        className="relative z-20 w-full max-w-2xl mx-auto mt-10 transition-transform duration-300"
      >
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center glass-panel rounded-2xl p-2 pl-4 border border-[#D4AF37]/30 shadow-2xl focus-within:border-[#00E5FF]/60 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all"
        >
          <Search className="w-5 h-5 text-[#E5C07B] mr-3 flex-none" />
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask AI Concierge: 'Luxury sea-facing villa in Mumbai under ₹25k' or 'Room 402 AC fix'..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onSearchQuery('Show me luxury heritage hotels with swimming pool in Udaipur')}
            aria-label="Use voice dictation"
            className="p-2.5 rounded-xl text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <span>Query</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs font-mono text-slate-400">
          <span className="text-slate-500 text-[11px]">Popular:</span>
          <button
            onClick={() => onSearchQuery('Luxury heritage hotels in Udaipur with spa')}
            className="hover:text-[#E5C07B] transition-colors underline underline-offset-2 decoration-white/20 cursor-pointer"
          >
            Udaipur Palace Stays
          </button>
          <span>•</span>
          <button
            onClick={() => onSearchQuery('5-star hotels in Mumbai with sea view')}
            className="hover:text-[#E5C07B] transition-colors underline underline-offset-2 decoration-white/20 cursor-pointer"
          >
            Mumbai Sea View
          </button>
          <span>•</span>
          <button
            onClick={() => onSearchQuery('Report water leak in Room 304')}
            className="hover:text-[#00E5FF] transition-colors underline underline-offset-2 decoration-white/20 cursor-pointer"
          >
            Service Ticket Demo
          </button>
        </div>
      </div>
    </section>
  );
};


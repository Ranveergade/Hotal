import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Ticket,
  Clock,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StackedFeatureCardsProps {
  onOpenOperations: () => void;
}

export const StackedFeatureCards = ({ onOpenOperations }: StackedFeatureCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.stacked-card');
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        // Skip last card from pinning
        if (index === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: 'top top+=90',
          end: 'bottom top+=90',
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(card, {
              scale: 1 - progress * 0.08,
              opacity: 1 - progress * 0.4,
              filter: `blur(${progress * 6}px)`,
            });
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#090A0F] text-white py-24 px-6 sm:px-12 border-t border-white/5"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto mb-16 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E5C07B] font-semibold">
          Autonomous Architecture
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-2">
          The Operations Engine
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-3">
          Layered intelligence stack handling triage, automatic ticket creation, and staff dispatch synchronization.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-24">
        {/* ================= CARD 1: SMART INTENT ROUTER ================= */}
        <div className="stacked-card glass-panel rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C07B] text-xs font-mono font-bold uppercase">
                  Engine Layer 01
                </span>
                <span className="text-xs font-mono text-slate-400">Classify &amp; Resolve</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Smart Intent Router
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E5C07B]">
              <Compass className="w-8 h-8" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
                Directly maps guest voice and text inputs into 4 deterministic runtime pipelines. Speculative and hallucinated responses are strictly blocked by schema validation.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#00E5FF] font-bold">HOTEL_SEARCH</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">SQLite 38.5MB Catalog</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#E5C07B] font-bold">BOOKING_QUERY</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Rates, GST &amp; Tariffs</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-amber-400 font-bold">CREATE_SUPPORT_TICKET</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Auto Housekeeping/Maintenance</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-rose-400 font-bold">HUMAN_ESCALATION</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Duty Manager Laurent Desk</div>
                </div>
              </div>
            </div>

            <div className="bg-black/60 rounded-2xl p-5 border border-white/10 font-mono text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10 text-[11px]">
                <span>ROUTER METRICS</span>
                <span className="text-[#00E5FF]">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Latency:</span>
                <span className="text-white font-bold">42ms</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence Floor:</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="flex justify-between">
                <span>SOP Citation RAG:</span>
                <span className="text-[#E5C07B] font-bold">Enforced</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: INSTANT SUPPORT TICKET GENERATION ================= */}
        <div className="stacked-card glass-panel rounded-3xl p-8 sm:p-12 border border-[#00E5FF]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold uppercase">
                  Engine Layer 02
                </span>
                <span className="text-xs font-mono text-slate-400">Autonomous Intake</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Instant Support Ticket Generation
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
              <Ticket className="w-8 h-8" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
                Whenever a guest reports an in-room anomaly or requests specialized service, the AI assistant creates a structured support ticket with priority rating, department assignment, and SLA deadline.
              </p>

              {/* Priority Rating Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  LOW (24h)
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  MEDIUM (4h)
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  HIGH (60m)
                </span>
                <span className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">
                  URGENT (&lt;15m)
                </span>
              </div>
            </div>

            <div className="bg-black/60 rounded-2xl p-5 border border-white/10 text-xs font-mono space-y-3">
              <div className="text-[11px] font-bold text-[#00E5FF] uppercase flex items-center justify-between pb-2 border-b border-white/10">
                <span>Sample Ticket Generated</span>
                <span>#TKT-8492</span>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500 block text-[10px]">SUBJECT:</span>
                HVAC Chilled Water Calibration (Room 402)
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Department:</span>
                <span className="text-white">Engineering / Maintenance</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dispatched SLA:</span>
                <span className="text-rose-400 font-bold">12 minutes remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 3: STAFF AUTO-DISPATCH & CRM SYNC ================= */}
        <div className="stacked-card glass-panel rounded-3xl p-8 sm:p-12 border border-[#E5C07B]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5C07B]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#E5C07B]/15 border border-[#E5C07B]/30 text-[#E5C07B] text-xs font-mono font-bold uppercase">
                  Engine Layer 03
                </span>
                <span className="text-xs font-mono text-slate-400">PMS &amp; Duty Roster</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Staff Auto-Dispatch &amp; CRM Sync
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-[#E5C07B]/10 border border-[#E5C07B]/30 text-[#E5C07B]">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
                Approved actions notify shift personnel instantly on their terminals. Luggage handling, housekeeping turnarounds, and VIP arrival protocols are updated in real-time.
              </p>

              <button
                onClick={onOpenOperations}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
              >
                <span>Launch Staff Operations Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black/60 rounded-2xl p-5 border border-white/10 text-xs font-mono space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10 text-[11px]">
                <span>LIVE DISPATCH PIPELINE</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Porter Stefan K.:</span>
                <span className="text-[#E5C07B]">Assigned (4 bags, Room 402)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Housekeeping Wing B:</span>
                <span className="text-slate-300">Turnaround alerted for 15:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duty Manager Laurent:</span>
                <span className="text-emerald-400">Supervisor Station Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

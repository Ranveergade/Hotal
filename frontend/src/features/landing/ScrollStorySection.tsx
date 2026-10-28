import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  FileCheck2,
  Cpu,
  UserCheck,
  CheckSquare,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface StageData {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
}

const STAGES: StageData[] = [
  {
    number: '01',
    title: 'Guest Intake',
    subtitle: 'Conversational Front-Desk Multi-Channel Ingestion',
    description:
      'Natural guest inquiries arrive from in-suite tablets, guest messaging, or front-desk terminals. The Grand Concierge ingests the raw request, categorizes guest sentiment, and matches room profile credentials instantly.',
    bulletPoints: [
      'Multi-channel ingestion (In-Suite iPad, WhatsApp, Voice)',
      'Instant PMS room & loyalty tier identification (Centurion, Royal Patron)',
      'Automated intent tagging and sentiment classification',
    ],
  },
  {
    number: '02',
    title: 'Knowledge Verification',
    subtitle: 'Zero-Hallucination SOP & Constraint Retrieval',
    description:
      'Before formulating any response or committing staff, the workforce queries verified hotel databases and Standard Operating Procedures. If internal policies disallow or constrain the request, the conflict is flagged immediately.',
    bulletPoints: [
      'Grounded retrieval against verified hotel databases',
      'Strict constraint checking: Housekeeping turnaround window vs late departure',
      'Immutable citation generation linked to specific SOP paragraphs',
    ],
  },
  {
    number: '03',
    title: 'Action Formulation',
    subtitle: 'Policy-Compliant Proposal & Ticket Drafting',
    description:
      'The AI synthesizes a personalized guest compromise grounded in verified availability. Rather than refusing the guest, it formulates an elegant alternative with accompanying operational service tickets.',
    bulletPoints: [
      'Structured compromise generation (e.g. 2:00 PM checkout + salon hospitality)',
      'Automated draft task generation for porterage and housekeeping crews',
      'Confidence scoring based on SOP compliance margins',
    ],
  },
  {
    number: '04',
    title: 'Human Supervision',
    subtitle: 'Duty Manager Discretion & Fast Action Protocols',
    description:
      'When operational conflicts or VIP thresholds are triggered, autonomous action halts. The case routes to the Duty Manager supervision desk with one-click approval protocols and full situational context.',
    bulletPoints: [
      'One-click supervisor approval chips for expedited shift decisions',
      'Emergency takeover hotkey (Cmd/Ctrl + Shift + T) for immediate operator command',
      'Full decision audit log preserving manager signature and rationale',
    ],
  },
  {
    number: '05',
    title: 'Service Coordination',
    subtitle: 'Autonomous Dispatch & SLA Execution',
    description:
      'Once authorized, tasks dispatch to specific departmental pools (Bell Desk, Housekeeping, Valet). SLAs are tracked live with countdown timers, ensuring flawless guest execution before arrival or departure.',
    bulletPoints: [
      'Dynamic SLA tracking (e.g. 15-minute baggage handling guarantee)',
      'Cross-departmental synchronization between front desk and housekeeping crews',
      'Full resolution confirmation delivered back to the guest terminal',
    ],
  },
];

export const ScrollStorySection = ({ onEnterOperations }: { onEnterOperations: () => void }) => {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stageRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStage(index);
            }
          });
        },
        {
          rootMargin: '-30% 0px -40% 0px',
          threshold: 0.1,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 bg-linen-200/50 border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-burgundy/10 text-burgundy font-bold border border-burgundy/20">
              The Operational Thread
            </span>
            <span className="text-[11px] font-mono text-sand-500 uppercase">
              5-Stage Coordinated Lifecycle
            </span>
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl font-bold text-sand-900 leading-tight">
            How The Grand Concierge Orchestrates Every Operational Moment.
          </h2>
          <p className="text-sm sm:text-base text-sand-600 font-body mt-4 leading-relaxed">
            From the instant a guest sends an inquiry to the physical delivery of porterage services, observe how verified knowledge, AI reasoning, and human discretion unify hotel shifts.
          </p>
        </div>

        {/* Desktop Layout: Sticky Left/Right Preview + Narrative Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          {/* Narrative Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-24 py-8">
            {STAGES.map((stage, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  stageRefs.current[idx] = el;
                }}
                className={`transition-all duration-300 p-6 sm:p-8 border ${
                  activeStage === idx
                    ? 'bg-white border-burgundy shadow-xs'
                    : 'bg-linen-100/60 border-hairline opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-burgundy tracking-widest">
                    STAGE {stage.number} // 05
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeStage === idx ? 'bg-burgundy animate-pulse' : 'bg-sand-300'
                    }`}
                  ></span>
                </div>

                <h3 className="font-headline text-2xl font-bold text-sand-900 mb-1">
                  {stage.title}
                </h3>
                <div className="text-xs font-mono uppercase text-sand-500 tracking-wider mb-4">
                  {stage.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-sand-700 leading-relaxed font-body mb-6">
                  {stage.description}
                </p>

                <div className="space-y-2 border-t border-hairline/70 pt-4">
                  {stage.bulletPoints.map((bp, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs font-body text-sand-800">
                      <span className="text-burgundy font-bold text-sm leading-none mt-0.5">•</span>
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Interactive Preview Column (6 cols on Desktop) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 h-auto">
            <div className="bg-white border border-hairline shadow-md p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
              {/* Preview Masthead */}
              <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-sand-900">
                    Active Operational Window // Room 402
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-burgundy/10 text-burgundy px-2 py-0.5 font-bold border border-burgundy/20">
                  {STAGES[activeStage].title} Preview
                </span>
              </div>

              {/* Dynamic Screen Representation Based on Active Stage */}
              <div className="flex-1 flex flex-col justify-center">
                {activeStage === 0 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="text-[10px] font-mono uppercase text-sand-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-burgundy" />
                      <span>Guest Terminal Intake (In-Suite iPad)</span>
                    </div>
                    <div className="p-4 bg-linen-100 border border-hairline text-xs font-body text-sand-900 leading-relaxed">
                      &quot;Hello, our meeting tomorrow was postponed. Can we request a 2:30 PM checkout instead of noon? Also need porter assistance with 4 bags at 2:15 PM.&quot;
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-sand-700">
                      <div className="p-2.5 bg-linen-50 border border-hairline">
                        <span className="text-sand-400 block text-[9px]">GUEST</span>
                        <strong>Jane Doe</strong> (Amex Centurion)
                      </div>
                      <div className="p-2.5 bg-linen-50 border border-hairline">
                        <span className="text-sand-400 block text-[9px]">STAY</span>
                        Room 402 • Grand Suite
                      </div>
                    </div>
                  </div>
                )}

                {activeStage === 1 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="text-[10px] font-mono uppercase text-sand-500 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-burgundy" />
                      <span>SOP Policy Citations &amp; PMS Telemetry</span>
                    </div>
                    <div className="p-4 bg-amber-50/70 border border-amber-300 text-xs font-mono text-amber-950">
                      <div className="font-bold mb-1">Turnaround Window Alert // Room 402</div>
                      <div>Standard 12:00 PM checkout. Next arrival (VIP #8920) arriving at 17:00 PM. Housekeeping requires minimum 2.5 hours turnaround. 2:30 PM departure creates 30m buffer shortfall.</div>
                    </div>
                    <div className="p-3 bg-linen-50 border border-hairline text-[11px] font-mono text-sand-800">
                      <span className="text-burgundy font-bold">Citation:</span> SOP-204 § 4.2 Discretionary Late Checkout &amp; Complimentary Luggage Holding SLA.
                    </div>
                  </div>
                )}

                {activeStage === 2 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="text-[10px] font-mono uppercase text-sand-500 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-burgundy" />
                      <span>Autonomous AI Compromise Formulation</span>
                    </div>
                    <div className="p-4 bg-burgundy/5 border border-burgundy/20 text-xs font-body text-sand-900 leading-relaxed">
                      &quot;We are delighted to extend your suite checkout until <strong>2:00 PM</strong> on a complimentary basis to honor your Centurion loyalty. For your four bags, our Senior Bellman will arrive at 2:00 PM to transfer your luggage directly to the Executive Vault.&quot;
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono p-2.5 bg-linen-100 border border-hairline">
                      <span>Formulated Confidence:</span>
                      <strong className="text-emerald-800 font-bold">88% (SOP-Aligned)</strong>
                    </div>
                  </div>
                )}

                {activeStage === 3 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="text-[10px] font-mono uppercase text-sand-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-burgundy" />
                      <span>Duty Manager Supervision Desk</span>
                    </div>
                    <div className="p-4 bg-white border border-burgundy text-xs font-body text-sand-900">
                      <div className="font-headline font-bold text-sm mb-1 text-sand-900">
                        Authorization Requested: M. Laurent
                      </div>
                      <p className="text-xs text-sand-600 mb-3">
                        Approve 2:00 PM departure compromise + dispatch luggage porterage team for 4 bags.
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-burgundy text-white text-[10px] font-mono uppercase font-bold">
                          1-Click Protocol Approved
                        </span>
                        <span className="text-[10px] font-mono text-sand-500">
                          Hotkeys: Cmd + Enter
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStage === 4 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="text-[10px] font-mono uppercase text-sand-500 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Service Task Dispatch &amp; SLA Tracking</span>
                    </div>
                    <div className="p-4 bg-linen-50 border border-hairline text-xs font-mono text-sand-900 space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-hairline">
                        <span className="font-bold text-burgundy">#TSK-1092</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          DISPATCHED
                        </span>
                      </div>
                      <div className="font-sans text-xs font-bold">
                        VIP Luggage Porterage (4 Pieces)
                      </div>
                      <div className="text-[11px] text-sand-600">
                        Assigned: Jean-Luc (Senior Bellman)
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold pt-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA Target: Completed within 15 mins</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Footer CTA */}
              <div className="pt-6 border-t border-hairline mt-6 flex items-center justify-between">
                <div className="text-[10px] font-mono text-sand-500">
                  Grounded in The Grand Concierge Engine
                </div>
                <button
                  onClick={onEnterOperations}
                  className="px-4 py-2 bg-linen-200 hover:bg-burgundy hover:text-white border border-hairline text-sand-900 text-xs font-label uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Cockpit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

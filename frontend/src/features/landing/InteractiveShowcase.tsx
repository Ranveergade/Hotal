import { useState } from 'react';
import {
  Layers,
  Sparkles,
  Search,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  MapPin,
} from 'lucide-react';

type ShowcaseTab = 'cockpit' | 'concierge' | 'search' | 'services' | 'handoff';

interface TabItem {
  id: ShowcaseTab;
  label: string;
  icon: typeof Layers;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'cockpit',
    label: 'Operations Cockpit',
    icon: Layers,
    description: '3-column supervisory desk for shift duty managers and operations supervisors.',
  },
  {
    id: 'concierge',
    label: 'AI Concierge Desk',
    icon: Sparkles,
    description: 'Natural-language guest interaction powered by POST /api/ai-assistant/ and voice dictation.',
  },
  {
    id: 'search',
    label: 'Property Intelligence',
    icon: Search,
    description: 'Audited exploration of the 38.5MB Indian luxury hotel dataset and SQLite records.',
  },
  {
    id: 'services',
    label: 'Service Task Dispatch',
    icon: CheckSquare,
    description: 'Operational dispatching for Housekeeping, Maintenance, Luggage, and Valet pools.',
  },
  {
    id: 'handoff',
    label: 'Human Handoff & Matrix',
    icon: ShieldAlert,
    description: 'Discretionary protocol approvals, escalation reasons, and duty manager audit logging.',
  },
];

export const InteractiveShowcase = ({ onEnterOperations }: { onEnterOperations: () => void }) => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('cockpit');

  return (
    <section id="platform" className="py-24 bg-linen-100 border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Masthead */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-burgundy/10 text-burgundy font-bold border border-burgundy/20">
            Unified Workforce Architecture
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-bold text-sand-900 mt-3 leading-tight">
            One Coordinated Workspace.<br />Multiple Operational Perspectives.
          </h2>
          <p className="text-xs sm:text-sm text-sand-600 font-body mt-3 max-w-xl mx-auto leading-relaxed">
            Switch between modules below to inspect how each role—from front-desk agents to executive housekeepers and duty managers—operates within the platform.
          </p>
        </div>

        {/* Tab Selectors Strip */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-linen-200/80 border border-hairline">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-label uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-white text-sand-900 font-bold border-hairline shadow-2xs'
                      : 'bg-transparent text-sand-600 hover:text-sand-900 border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-burgundy' : 'text-sand-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase Interactive Window */}
        <div className="bg-white border border-hairline shadow-md overflow-hidden max-w-5xl mx-auto">
          {/* Window Header */}
          <div className="px-6 py-3.5 bg-linen-50 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sand-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-sand-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-sand-300"></span>
              </div>
              <span className="text-[11px] font-mono text-sand-600 border-l border-hairline pl-3">
                {TABS.find((t) => t.id === activeTab)?.description}
              </span>
            </div>

            <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-900 px-2 py-0.5 border border-amber-300 font-bold">
              Product Preview Mode
            </span>
          </div>

          {/* Window Content */}
          <div className="p-6 sm:p-8 min-h-[380px] bg-linen-100/50 flex flex-col justify-center">
            {activeTab === 'cockpit' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
                <div className="p-4 bg-white border border-hairline">
                  <div className="text-[10px] font-mono uppercase text-sand-500 mb-1">Triage Stream</div>
                  <div className="font-bold text-sm text-sand-900">Room 402 • Jane Doe</div>
                  <div className="text-[11px] text-burgundy font-mono font-semibold mt-1">High Priority Escalation</div>
                  <div className="text-xs text-sand-600 mt-2 line-clamp-2">Late checkout conflict with incoming VIP turnaround.</div>
                </div>
                <div className="p-4 bg-white border border-hairline md:col-span-2">
                  <div className="text-[10px] font-mono uppercase text-sand-500 mb-1">Verification Matrix</div>
                  <div className="text-xs font-mono text-sand-800 bg-linen-50 p-2 border border-hairline">
                    SOP-204 § 4.2 VIP Late Checkout Discretion Citation Verified
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-burgundy text-white text-[10px] font-mono uppercase font-bold">
                      Approve 2:00 PM Compromise
                    </span>
                    <span className="px-2.5 py-1 bg-linen-100 text-sand-800 text-[10px] font-mono uppercase border border-hairline">
                      Dispatch Porter
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'concierge' && (
              <div className="max-w-2xl mx-auto w-full space-y-3 animate-fade-in-up">
                <div className="p-3 bg-linen-200 text-xs font-body text-sand-900 w-fit ml-auto">
                  &quot;Show me luxury heritage hotels with swimming pool in Udaipur.&quot;
                </div>
                <div className="p-4 bg-white border border-hairline text-xs font-body text-sand-900 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-sand-500">
                    <span className="text-burgundy font-bold">THE GRAND CONCIERGE AI</span>
                    <span>NVIDIA OSS-20B • Grounded</span>
                  </div>
                  <p>
                    I have located verified luxury properties matching your preference in Udaipur, including <strong>The Oberoi Udaivilas</strong> on the banks of Lake Pichola with semi-private pool suites.
                  </p>
                  <div className="p-2 bg-linen-50 border border-hairline text-[11px] font-mono text-sand-700">
                    Database Match: Udaipur • Star: 5★ • Rating: 4.95/5
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
                <div className="p-4 bg-white border border-hairline">
                  <div className="flex justify-between items-start">
                    <div className="font-headline font-bold text-sm">The Taj Mahal Palace &amp; Tower</div>
                    <span className="text-xs font-mono font-bold text-burgundy">5★</span>
                  </div>
                  <div className="text-xs text-sand-600 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sand-400" /> Colaba, Mumbai
                  </div>
                  <div className="mt-2 text-[10px] font-mono bg-linen-50 p-1.5 border border-hairline text-sand-800">
                    Facilities: Free Wi-Fi | Pool | Spa | Fine Dining
                  </div>
                </div>
                <div className="p-4 bg-white border border-hairline">
                  <div className="flex justify-between items-start">
                    <div className="font-headline font-bold text-sm">The Leela Palace New Delhi</div>
                    <span className="text-xs font-mono font-bold text-burgundy">5★</span>
                  </div>
                  <div className="text-xs text-sand-600 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sand-400" /> Chanakyapuri, New Delhi
                  </div>
                  <div className="mt-2 text-[10px] font-mono bg-linen-50 p-1.5 border border-hairline text-sand-800">
                    Facilities: Rooftop Infinity Pool | ESPA Spa | Butler
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white border border-hairline p-4 space-y-3 animate-fade-in-up text-xs font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-hairline">
                  <span className="font-bold text-sand-900">#TSK-1092 Luggage Porterage</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px]">IN PROGRESS</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-sand-700">
                  <div>Room: <strong>Room 402</strong></div>
                  <div>Dept: <strong>Luggage &amp; Porter</strong></div>
                  <div>SLA: <strong className="text-emerald-800">15m Target</strong></div>
                </div>
                <div className="text-[11px] text-sand-600 bg-linen-50 p-2 border border-hairline font-sans">
                  Assigned Staff: Jean-Luc (Senior Bellman) • Secure vault storage until 18:00.
                </div>
              </div>
            )}

            {activeTab === 'handoff' && (
              <div className="p-5 bg-white border border-hairline space-y-3 animate-fade-in-up">
                <div className="flex justify-between items-center pb-2 border-b border-hairline text-xs font-mono">
                  <span className="font-bold text-burgundy">Incident Review #ESC-402</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[10px]">PENDING APPROVAL</span>
                </div>
                <div className="text-xs text-sand-900 font-body">
                  Guest Jane Doe (Centurion) requested 2:30 PM departure. Conflicts with incoming VIP turn-down.
                </div>
                <div className="p-2.5 bg-burgundy/5 border border-burgundy/20 text-xs font-body text-burgundy-900 font-semibold">
                  AI Recommendation: Authorize 2:00 PM Compromise + Executive Salon Hospitality.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1 bg-burgundy text-white text-[10px] font-mono uppercase font-bold">
                    Authorize Protocol (M. Laurent)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Window Footer Action */}
          <div className="px-6 py-4 bg-linen-50 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-mono text-sand-600 text-center sm:text-left">
              Ready to operate shift workflows with live hotel data?
            </span>
            <button
              onClick={onEnterOperations}
              className="px-6 py-2.5 bg-burgundy hover:bg-burgundy-900 text-white font-label uppercase text-xs font-bold tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:opacity-95"
            >
              <span>Launch Operations Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

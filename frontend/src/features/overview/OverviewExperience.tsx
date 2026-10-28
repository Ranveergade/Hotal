import {
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { OperationalThread } from './OperationalThread';

interface OverviewExperienceProps {
  onEnterCockpit: () => void;
  backendConnected: boolean;
  backendStatusText: string;
}

export const OverviewExperience = ({
  onEnterCockpit,
  backendConnected,
  backendStatusText,
}: OverviewExperienceProps) => {
  return (
    <div className="w-full bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* ================= SECTION 1: ARRIVAL / INTRODUCTION ================= */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/60 rounded-full text-indigo-700 text-xs font-mono font-medium">
            <Building className="w-3.5 h-3.5" />
            <span>The Grand Concierge Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mt-1">
            Autonomous Hotel Operations with Enforced Human Safety.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mt-2">
            A premium operations workspace for duty managers and front-desk supervisors.
            Supervise autonomous AI concierge interactions, verify hotel policy evidence, dispatch service tasks, and intervene instantaneously.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              onClick={onEnterCockpit}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>Enter Operations Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono text-slate-600 flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              <span className="font-medium text-slate-700">{backendStatusText}</span>
            </div>
          </div>
        </div>

        {/* Runtime Operational Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-slate-200">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-medium">Autonomous Resolution</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">94.2%</div>
            <div className="text-xs text-slate-500 mt-1">SOP-Constrained Accuracy</div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-medium">Shift Triage Queue</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">18 Cases</div>
            <div className="text-xs text-rose-600 font-medium mt-1">3 Require Action</div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-medium">Verified Knowledge Base</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">100%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Zero Hallucination Policy</div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-medium">PMS Synchronization</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">Active</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">Opera Gateway Demo</div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: THE OPERATIONAL THREAD ================= */}
      <OperationalThread />

      {/* ================= SECTION 3: THE 4 OPERATIONAL PILLARS ================= */}
      <section className="px-6 sm:px-12 py-20 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-semibold">
            Core Modules
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Engineered for Duty Managers &amp; Front-Desk Supervisors
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Purpose-built components for real hotel operational workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: AI Concierge */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-indigo-600 font-semibold">
                  Pillar 01 // Autonomous Guest Desk
                </span>
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                AI Concierge with Verified Policy Citations
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Answers guest inquiries regarding checkout extensions, room amenities, and hotel policies in natural language. Every response is strictly linked to internal SOP citations.
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
              Live Backend: <code className="text-indigo-600 font-bold">POST /api/ai-assistant/</code> (NVIDIA OSS-20B).
            </div>
          </div>

          {/* Pillar 2: Human Takeover */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-rose-600 font-semibold">
                  Pillar 02 // Safety Intervention
                </span>
                <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Context-Aware Human Takeover &amp; Fast Protocols
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                When turnaround constraints or guest complaints emerge, the AI autonomously pauses and escalates to Duty Manager Laurent. One-click protocol chips expedite approvals.
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
              Hotkeys: <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded font-bold shadow-2xs">Cmd + Enter</kbd> triggers instant takeover.
            </div>
          </div>

          {/* Pillar 3: Service Task Dispatch */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-emerald-600 font-semibold">
                  Pillar 03 // Service Dispatch
                </span>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Operational Dispatch &amp; Staff Tasking
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Automatic generation of porterage tickets, housekeeping shift adjustments, and maintenance diagnostics. Tracks assigned staff, execution deadlines, and SLAs.
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
              SLA Guarantee: Luggage handling dispatched within 8 minutes of guest departure.
            </div>
          </div>

          {/* Pillar 4: Catalog & Reservations */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-blue-600 font-semibold">
                  Pillar 04 // Property Discovery
                </span>
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Search className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Hotel Catalog &amp; Regional Property Intelligence
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Direct querying of the 38.5MB local hotel dataset. Access facility checklists, room classifications, star ratings, and geographical property telemetry.
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
              Data Reality: Connected to <code className="text-slate-900 font-bold">GET /api/indian-hotels/</code>.
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: CALL TO ACTION ================= */}
      <section className="bg-slate-900 py-16 px-6 sm:px-12 text-center text-white">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Shift Supervision Active</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Open the Operations Cockpit
          </h2>
          <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
            Review active guest incidents, monitor AI confidence scores, and take control of hotel operations.
          </p>
          <button
            onClick={onEnterCockpit}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Enter Cockpit Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { MessageSquare, BookOpen, Sparkles, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

interface Stage {
  id: string;
  step: string;
  title: string;
  category: string;
  description: string;
  evidence: string;
  icon: React.ReactNode;
}

const STAGES: Stage[] = [
  {
    id: 'inquiry',
    step: '01',
    title: 'Guest Inquiry Ingestion',
    category: 'MULTILINGUAL INTAKE',
    description: 'In-suite iPad, mobile app, and SMS queries are received with guest stay metadata and loyalty tier privileges.',
    evidence: 'Inbound: Jane Doe (Centurion) • Room 402 • "2:30 PM checkout & 4 bags porterage"',
    icon: <MessageSquare className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'knowledge',
    step: '02',
    title: 'Verified Knowledge Retrieval',
    category: 'RAG SEMANTIC SEARCH',
    description: 'Cosine similarity query against hotel SOP articles and benefits matrices ensures answers are grounded in hotel rules.',
    evidence: 'Matched: Housekeeping Policy Sec. 4.2 & Centurion Hospitality Matrix 2024',
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'generation',
    step: '03',
    title: 'Constrained AI Concierge Reply',
    category: 'NVIDIA OSS-20B SYNTHESIS',
    description: 'AI constructs polite, accurate responses containing only verifiable information. Speculative answers are prohibited.',
    evidence: 'Automated 2:00 PM confirmation drafted; 2:30 PM extension flagged for manager turnaround verification',
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 'oversight',
    step: '04',
    title: 'Human Safety Oversight',
    category: 'SUPERVISOR INTERVENTION',
    description: 'Tight turnaround windows, high-tier guest requests, and complaints automatically pause autonomy for duty manager review.',
    evidence: 'Alert: Incoming VIP arrival at 16:30 leaves 90m turnaround window. Dispatched to M. Laurent',
    icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
  },
  {
    id: 'action',
    step: '05',
    title: 'Service Dispatch & Audit',
    category: 'PMS SYNCHRONIZATION',
    description: 'Approved actions trigger immediate staff dispatch tickets (porterage, turn-down reassignments) and PMS status updates.',
    evidence: 'Porter Stefan K. alerted for 14:15 dispatch. Opera Cloud booking state updated',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
];

export const OperationalThread: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('inquiry');

  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div className="w-full bg-slate-900 text-white py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-mono font-medium mb-3">
              Operational Traceability
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The Verifiable Operations Thread
            </h3>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            From arrival inquiry to dispatch execution: trace how verified hotel knowledge grounds autonomous AI responses and enforces manager safety oversight.
          </p>
        </div>

        {/* Responsive Stage Navigation Thread */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          {STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                    STAGE {stage.step}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                    {stage.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold text-white leading-snug">
                  {stage.title}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
                  {stage.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80 mb-5">
            <div>
              <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                Stage {activeStage.step} • {activeStage.category}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeStage.title}
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 rounded-lg text-xs font-mono">
              <span>Status: Enforced &amp; Audited</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <p className="text-base text-slate-300 leading-relaxed mb-6 max-w-3xl">
            {activeStage.description}
          </p>

          <div className="bg-slate-900/90 rounded-xl border border-slate-700/60 p-4 font-mono text-xs">
            <span className="text-slate-500 uppercase text-[10px] tracking-wider block mb-1.5 font-semibold">
              Live Audit Trace Record:
            </span>
            <span className="text-indigo-200 font-medium">{activeStage.evidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

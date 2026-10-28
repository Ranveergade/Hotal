import { useState } from 'react';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';
import { DEMO_ESCALATIONS } from '../../services/mockData';
import type { HumanEscalation } from '../../types';

export const HumanHandoffDesk = () => {
  const [escalations, setEscalations] = useState<HumanEscalation[]>(DEMO_ESCALATIONS);
  const [selectedId, setSelectedId] = useState<string>(escalations[0]?.id || 'ESC-402');
  const [managerNotes, setManagerNotes] = useState<string>('');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  const activeEscalation = escalations.find((e) => e.id === selectedId) || escalations[0];

  const handleDecision = (decision: 'Approved' | 'Modified' | 'Rejected') => {
    if (!activeEscalation) return;

    const note = managerNotes.trim() || `Supervisor decision logged as ${decision}.`;

    setEscalations((prev) =>
      prev.map((item) =>
        item.id === activeEscalation.id
          ? {
              ...item,
              status: decision,
              reviewedBy: 'M. Laurent (Duty Manager)',
              reviewNotes: note,
            }
          : item
      )
    );

    setDecisionFeedback(`Decision recorded: ${decision}. Audit log updated.`);
    setManagerNotes('');
    setTimeout(() => setDecisionFeedback(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Supervision Protocol
            </span>
            <span className="text-xs font-mono text-slate-500">
              Duty Manager Review Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Human Handoff &amp; Discretionary Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate guest cases where autonomous AI confidence dipped below policy threshold or VIP operational constraints require human sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs self-start sm:self-auto text-xs">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Supervisor: <strong>M. Laurent</strong></span>
        </div>
      </div>

      {/* Operational Notice */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 flex-none mt-0.5" />
        <div>
          <strong>Human Oversight Integrity:</strong> AI suggestions never execute consequential bookings, VIP room moves, or monetary compromises without manager authorization. All decisions generate immutable audit citations.
        </div>
      </div>

      {/* Two Column Layout: Escalation Queue & Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Escalations Queue (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Pending Escalations Queue ({escalations.length} Cases)
          </div>

          {escalations.map((esc) => (
            <div
              key={esc.id}
              onClick={() => setSelectedId(esc.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedId === esc.id
                  ? 'bg-indigo-50/50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">
                  {esc.roomNumber} • {esc.guestName}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    esc.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : esc.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {esc.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 line-clamp-2 mb-2">
                {esc.reason}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
                <span>Tier: {esc.guestTier.split('(')[0].trim()}</span>
                <span className="flex items-center gap-1 text-indigo-600 font-bold">
                  <Sparkles className="w-3 h-3" />
                  AI Conf: {esc.aiConfidence}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Case Review & Action Studio (7 cols) */}
        {activeEscalation && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Case Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Incident Review #{activeEscalation.id}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {activeEscalation.roomNumber} — {activeEscalation.guestName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Loyalty Status: <strong className="text-slate-800">{activeEscalation.guestTier}</strong>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400">
                  <div>Timestamp</div>
                  <div className="font-bold text-slate-800">{activeEscalation.timestamp}</div>
                </div>
              </div>

              {/* Conflict Trigger */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Escalation Trigger &amp; Conflict
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {activeEscalation.reason}
                </div>
              </div>

              {/* SOP Reference */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  Grounded Hotel Standard Operating Procedure (SOP)
                </span>
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs font-mono text-indigo-950">
                  {activeEscalation.policyRef}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Autonomous AI Recommendation
                </span>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                  {activeEscalation.recommendedAction}
                </div>
              </div>

              {/* Notes Input */}
              <div className="mb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Duty Manager Rationale &amp; Protocol Override Notes
                </label>
                <textarea
                  rows={2}
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="Record supervisor discretion note, guest compensatory gesture, or specific dispatch instructions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 resize-none"
                ></textarea>
              </div>

              {decisionFeedback && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>{decisionFeedback}</span>
                </div>
              )}
            </div>

            {/* Decision Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Action tagged with operator signature: <strong className="text-slate-800">M. Laurent</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecision('Rejected')}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>

                <button
                  onClick={() => handleDecision('Modified')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Modify Action
                </button>

                <button
                  onClick={() => handleDecision('Approved')}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Authorize Protocol</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

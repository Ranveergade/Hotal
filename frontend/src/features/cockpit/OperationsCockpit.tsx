import { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Send,
  Check,
  ShieldCheck,
} from 'lucide-react';
import type { TriageIncident, ConciergeMessage } from '../../types';
import { queryAiAssistant } from '../../services/apiClient';

interface OperationsCockpitProps {
  incidents: TriageIncident[];
  backendConnected: boolean;
  takeoverActive: boolean;
  onToggleTakeover: () => void;
}

export const OperationsCockpit = ({
  incidents,
  backendConnected,
  takeoverActive,
  onToggleTakeover,
}: OperationsCockpitProps) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || 'inc-402');
  const [filterCategory, setFilterCategory] = useState<'all' | 'escalation' | 'vip' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [managerInputText, setManagerInputText] = useState<string>('');
  const [localIncidents, setLocalIncidents] = useState<TriageIncident[]>(incidents);
  const [isSubmittingToAi, setIsSubmittingToAi] = useState<boolean>(false);

  const activeIncident = localIncidents.find((inc) => inc.id === selectedIncidentId) || localIncidents[0];

  // Filtering
  const filteredIncidents = localIncidents.filter((inc) => {
    const matchesFilter = filterCategory === 'all' || inc.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      inc.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Manager Direct Reply or AI prompt
  const handleSendMessage = async () => {
    if (!managerInputText.trim()) return;

    const newMsg: ConciergeMessage = {
      id: `msg-mgr-${Date.now()}`,
      sender: takeoverActive ? 'manager' : 'guest',
      senderName: takeoverActive ? 'M. Laurent (Duty Mgr)' : activeIncident.guestName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: managerInputText.trim(),
      channel: takeoverActive ? 'Manager Console Takeover' : 'In-Suite iPad',
    };

    const updatedIncidents = localIncidents.map((inc) => {
      if (inc.id === activeIncident.id) {
        return {
          ...inc,
          messages: [...inc.messages, newMsg],
        };
      }
      return inc;
    });

    setLocalIncidents(updatedIncidents);
    const sentText = managerInputText.trim();
    setManagerInputText('');

    if (!takeoverActive && backendConnected) {
      setIsSubmittingToAi(true);
      try {
        const response = await queryAiAssistant(sentText);
        if (response.data && response.data.answer) {
          const aiReply: ConciergeMessage = {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            senderName: 'Grand AI Concierge (NVIDIA OSS-20B)',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: response.data.answer,
            isAutomated: true,
            policyCitation: {
              sopSection: 'Live Knowledge Catalog Query',
              verifiedDocument: `Matched: ${response.data.matched_city || 'Regional Policy'}`,
            },
          };
          setLocalIncidents((prev) =>
            prev.map((inc) =>
              inc.id === activeIncident.id ? { ...inc, messages: [...inc.messages, aiReply] } : inc
            )
          );
        }
      } catch (err) {
        console.warn('AI query failed, remaining on local message:', err);
      } finally {
        setIsSubmittingToAi(false);
      }
    }
  };

  // One-click Fast Protocol Handler
  const handleApplyProtocol = (protocolAction: string) => {
    const protocolMsg: ConciergeMessage = {
      id: `msg-proto-${Date.now()}`,
      sender: 'manager',
      senderName: 'M. Laurent (Executive Order)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `[PROTOCOL EXECUTED]: ${protocolAction}`,
    };

    setLocalIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === activeIncident.id) {
          return {
            ...inc,
            status: 'dispatched',
            messages: [...inc.messages, protocolMsg],
          };
        }
        return inc;
      })
    );
  };

  // Toggle Service Task status
  const handleToggleTask = (taskId: string) => {
    setLocalIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === activeIncident.id) {
          return {
            ...inc,
            serviceTasks: inc.serviceTasks.map((t) =>
              t.id === taskId
                ? { ...t, status: t.status === 'completed' ? 'ready' : 'completed' }
                : t
            ),
          };
        }
        return inc;
      })
    );
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-100/70 p-4 sm:p-6 gap-5 min-h-[calc(100vh-4rem)]">
      {/* ================= COLUMN 1: INCIDENT TRIAGE QUEUE (320px) ================= */}
      <div className="w-full lg:w-80 flex-none flex flex-col bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        {/* Search & Category Filter */}
        <div className="pb-3 border-b border-slate-100 mb-3 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room, guest, title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(['all', 'escalation', 'vip', 'maintenance'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All (5)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredIncidents.map((incident) => {
            const isSelected = incident.id === activeIncident.id;
            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{incident.roomNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        incident.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : incident.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {incident.priority}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{incident.elapsedTime}</span>
                </div>

                <div className="text-xs font-bold text-slate-800">{incident.guestName}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                  {incident.title}
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px]">
                  <span className="font-semibold text-slate-500 uppercase">{incident.sentiment}</span>
                  <span className="font-bold text-indigo-600">
                    {incident.aiConfidence}% AI Conf.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COLUMN 2: ACTIVE TRANSCRIPT & ACTION MATRIX (FLEX-1) ================= */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        {/* Stream Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
                Session #{activeIncident.id.toUpperCase()} // {activeIncident.roomNumber}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  takeoverActive ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {takeoverActive ? 'MANUAL TAKEOVER' : 'AUTONOMOUS ACTIVE'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-semibold text-slate-800">{activeIncident.guestName}</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">{activeIncident.guestTier}</span>
              <span>•</span>
              <span>{activeIncident.stayDates}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-bold uppercase">AI Evaluation</div>
              <div className="text-sm font-extrabold text-emerald-600">
                {activeIncident.aiConfidence}% SOP Aligned
              </div>
            </div>

            <button
              onClick={onToggleTakeover}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                takeoverActive
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {takeoverActive ? 'Release Takeover' : 'Take Control'}
            </button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 bg-slate-50/50 rounded-xl border border-slate-100">
          {activeIncident.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'guest'
                  ? 'items-start'
                  : msg.sender === 'manager'
                  ? 'items-end'
                  : 'items-end'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-semibold text-slate-500">
                <span>{msg.senderName}</span>
                <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                {msg.channel && <span className="text-slate-400">({msg.channel})</span>}
              </div>

              <div
                className={`max-w-xl p-4 text-sm leading-relaxed rounded-2xl shadow-2xs ${
                  msg.sender === 'guest'
                    ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    : msg.sender === 'manager'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-indigo-50 border border-indigo-100 text-slate-900 rounded-tr-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* SOP Policy Citation Attached */}
                {msg.policyCitation && (
                  <div className="mt-3 pt-3 border-t border-indigo-200/60 text-xs font-medium text-indigo-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-none mt-0.5" />
                    <div>
                      <div className="font-bold text-[11px] uppercase tracking-wider text-indigo-700">
                        {msg.policyCitation.sopSection}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {msg.policyCitation.verifiedDocument}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Verification Audit Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-none mt-0.5" />
            <div>
              <span className="font-bold">VERIFICATION AUDIT MATRIX:</span> Verified against Housekeeping policy sec. 4.2 &amp; Centurion Hospitality Matrix. Constraint: Next arrival (VIP #8920) arriving at 17:00 PM.
            </div>
          </div>
        </div>

        {/* Fast Action Protocol Chips */}
        <div className="pb-3 border-b border-slate-100 mb-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            One-Click Supervisor Fast Protocols:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                handleApplyProtocol(
                  'Approved 2:00 PM Compromise Late Checkout + Dispatched Executive Porterage.'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve 2:00 PM Checkout</span>
            </button>

            <button
              onClick={() =>
                handleApplyProtocol(
                  'Offer Luggage Holding SLA + Complimentary Grand Salon Refreshments.'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Offer Luggage Holding SLA</span>
            </button>

            <button
              onClick={() =>
                handleApplyProtocol(
                  'Escalate to Front Desk Duty Captain for Personal In-Suite Concierge Greeting.'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Escalate to Duty Captain</span>
            </button>
          </div>
        </div>

        {/* Command Composer */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={managerInputText}
            onChange={(e) => setManagerInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              takeoverActive
                ? 'Type supervisor response directly to guest terminal...'
                : 'Send message or prompt to AI assistant...'
            }
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />

          <button
            onClick={handleSendMessage}
            disabled={!managerInputText.trim() || isSubmittingToAi}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{takeoverActive ? 'Send' : 'Submit'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= COLUMN 3: TELEMETRY & DISPATCHED TASKS (360px) ================= */}
      <div className="w-full lg:w-90 flex-none flex flex-col gap-4">
        {/* Room Telemetry Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              {activeIncident.roomNumber} Telemetry
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              PMS SYNCHRONIZED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Room Category:</span>
              <span className="font-bold text-slate-800">{activeIncident.roomType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Wing / Level:</span>
              <span className="font-bold text-slate-800">{activeIncident.roomTelemetry.wing}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Keycards Active:</span>
              <span className="font-bold text-slate-800">
                {activeIncident.roomTelemetry.activeKeys} Keys
              </span>
            </div>

            {/* Inbound Arrival Alert */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 mt-3">
              <div className="font-bold text-[11px] uppercase tracking-wider text-amber-800 mb-1">
                Next Inbound Arrival: 17:00 Today
              </div>
              <div className="font-semibold text-xs">
                {activeIncident.roomTelemetry.nextArrival.guestName}
              </div>
              <div className="text-[11px] text-amber-800/80 mt-0.5">
                Ref {activeIncident.roomTelemetry.nextArrival.bookingRef} • Turnaround required:{' '}
                {activeIncident.roomTelemetry.nextArrival.minTurnaroundMins}m
              </div>
            </div>
          </div>
        </div>

        {/* Verified SOP Citations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Verified Knowledge Base
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SQLite Grounded</span>
          </div>

          <div className="space-y-2.5">
            {activeIncident.policyCitations.map((pol, pIdx) => (
              <div key={pIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>{pol.title}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                  {pol.excerpt}
                </p>
              </div>
            ))}
          </div>

          {/* Operational Tasks Checklist */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Service Tasks Dispatched:
            </div>
            <div className="space-y-2">
              {activeIncident.serviceTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold">{task.title}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Assigned: {task.assignedStaff} • {task.note}
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

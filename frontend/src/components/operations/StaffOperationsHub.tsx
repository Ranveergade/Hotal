import { useState } from 'react';
import {
  ShieldAlert,
  Bot,
  Search,
  CheckSquare,
  Users,
  Calendar,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { OperationsCockpit } from '../../features/cockpit';
import { ConciergeDesk } from '../../features/concierge';
import { HotelSearch } from '../../features/search';
import { ServiceDispatcher } from '../../features/services';
import { HumanHandoffDesk } from '../../features/handoff';
import { ReservationDesk } from '../../features/booking';
import { PaymentFolioDesk } from '../../features/payments';
import type { TriageIncident } from '../../types';

interface StaffOperationsHubProps {
  incidents: TriageIncident[];
  backendConnected: boolean;
  takeoverActive: boolean;
  onToggleTakeover: () => void;
  onBackToGuest: () => void;
}

export const StaffOperationsHub = ({
  incidents,
  backendConnected,
  takeoverActive,
  onToggleTakeover,
  onBackToGuest,
}: StaffOperationsHubProps) => {
  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'concierge' | 'search' | 'services' | 'handoff' | 'booking' | 'payments'
  >('cockpit');

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col pt-18">
      {/* Sub-Header / Ops Tab Navigation */}
      <div className="bg-[#12151E]/90 border-b border-white/10 px-4 sm:px-8 py-3 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToGuest}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C07B] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Shift Operations</span>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden md:inline-block">
              Station 04 • Duty Manager Laurent
            </span>
          </div>

          {/* Module Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('cockpit')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cockpit'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Triage Cockpit</span>
            </button>

            <button
              onClick={() => setActiveTab('concierge')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'concierge'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Hotel Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Service Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab('handoff')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'handoff'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Human Handoff</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservations</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Guest Folio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Operations Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'cockpit' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <OperationsCockpit
              incidents={incidents}
              backendConnected={backendConnected}
              takeoverActive={takeoverActive}
              onToggleTakeover={onToggleTakeover}
            />
          </div>
        )}

        {activeTab === 'concierge' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <ConciergeDesk />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <HotelSearch />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <ServiceDispatcher />
          </div>
        )}

        {activeTab === 'handoff' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <HumanHandoffDesk />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <ReservationDesk />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-[#12151E] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl">
            <PaymentFolioDesk />
          </div>
        )}
      </main>
    </div>
  );
};

import {
  Layers,
  Sparkles,
  Search,
  CheckSquare,
  ShieldAlert,
  Calendar,
  Receipt,
  Radio,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import type { ApplicationViewMode } from '../../types';

interface NavbarProps {
  currentMode: ApplicationViewMode;
  onModeChange: (mode: ApplicationViewMode) => void;
  backendConnected: boolean;
  backendStatusText: string;
  onEmergencyTakeover?: () => void;
  onReturnToPublic?: () => void;
}

interface NavItem {
  id: ApplicationViewMode;
  label: string;
  icon: typeof Layers;
  hotkey: string;
  badge?: string;
}

const MODULES: NavItem[] = [
  { id: 'cockpit', label: 'Triage Cockpit', icon: Layers, hotkey: '1' },
  { id: 'concierge', label: 'AI Concierge', icon: Sparkles, hotkey: '2', badge: 'LIVE API' },
  { id: 'search', label: 'Hotel Search', icon: Search, hotkey: '3', badge: 'SQLITE' },
  { id: 'services', label: 'Service Tasks', icon: CheckSquare, hotkey: '4' },
  { id: 'handoff', label: 'Human Handoff', icon: ShieldAlert, hotkey: '5' },
  { id: 'booking', label: 'Reservations', icon: Calendar, hotkey: '6', badge: 'DEMO' },
  { id: 'payments', label: 'Guest Folio', icon: Receipt, hotkey: '7', badge: 'DEMO' },
  { id: 'overview', label: 'System Story', icon: Compass, hotkey: '8' },
];

export const Navbar = ({
  currentMode,
  onModeChange,
  backendConnected,
  backendStatusText,
  onEmergencyTakeover,
  onReturnToPublic,
}: NavbarProps) => {
  return (
    <header className="bg-white border-b border-slate-200 w-full flex-none z-30 select-none shadow-2xs">
      {/* Top Header Row */}
      <div className="flex justify-between items-center w-full px-6 sm:px-8 h-16 border-b border-slate-100">
        {/* Left: Brand & Return */}
        <div className="flex items-center gap-4">
          {onReturnToPublic && (
            <button
              onClick={onReturnToPublic}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              GC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                Grand<span className="text-indigo-600">Concierge</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Operations Shift Console (14:00 - 22:00)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Backend Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status Pill */}
          <div
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border ${
              backendConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={backendStatusText}
          >
            {backendConnected ? (
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
            <span className="font-semibold">
              {backendConnected ? 'Backend Live' : 'Backend Standby (Fixtures)'}
            </span>
          </div>

          {/* Emergency Takeover Button */}
          <button
            onClick={onEmergencyTakeover}
            className="px-4 py-1.5 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            title="Trigger emergency manager takeover [Cmd/Ctrl + Shift + T]"
          >
            <span className="w-2 h-2 rounded-full bg-rose-200 animate-ping"></span>
            <span className="hidden sm:inline">Emergency Takeover</span>
            <span className="sm:hidden">Takeover</span>
          </button>

          {/* Duty Manager Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              ML
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900">M. Laurent</div>
              <div className="text-[10px] text-slate-500 font-medium">Duty Manager #04</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Segmented Tab Strip */}
      <nav className="flex items-center px-6 sm:px-8 bg-slate-50/80 overflow-x-auto scrollbar-none py-2 gap-1.5">
        {MODULES.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title={`${item.label} [Cmd/Ctrl + ${item.hotkey}]`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badge === 'LIVE API'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

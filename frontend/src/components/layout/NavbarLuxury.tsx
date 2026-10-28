import { Sparkles, Shield, Compass, Bed } from 'lucide-react';

interface NavbarLuxuryProps {
  currentView: 'guest' | 'operations';
  onSwitchView: (view: 'guest' | 'operations') => void;
  backendConnected: boolean;
  onOpenAiDrawer: () => void;
}

export const NavbarLuxury = ({
  currentView,
  onSwitchView,
  backendConnected,
  onOpenAiDrawer,
}: NavbarLuxuryProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 bg-[#090A0F]/85 backdrop-blur-xl border-b border-white/8 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Monogram */}
        <div
          onClick={() => onSwitchView('guest')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E5C07B] to-[#D4AF37] flex items-center justify-center text-[#090A0F] font-serif font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            G
          </div>
          <div>
            <div className="font-serif font-bold text-sm sm:text-base tracking-widest text-white uppercase flex items-center gap-1.5">
              <span>The Grand Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-[#E5C07B] tracking-wider uppercase">
              Boutique AI Workforce
            </div>
          </div>
        </div>

        {/* Center Nav Anchors (when on guest view) */}
        {currentView === 'guest' ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a
              href="#suites"
              className="hover:text-[#E5C07B] transition-colors flex items-center gap-1.5"
            >
              <Bed className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Suites Gallery</span>
            </a>
            <a
              href="#ai-spotlight"
              className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>AI Spotlight</span>
            </a>
            <a
              href="#operations-engine"
              className="hover:text-[#E5C07B] transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Operations Engine</span>
            </a>
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Staff Operations Station Online • M. Laurent</span>
          </div>
        )}

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span>{backendConnected ? 'Django Live' : 'Standby'}</span>
          </div>

          {/* Quick AI Trigger */}
          {currentView === 'guest' && (
            <button
              onClick={onOpenAiDrawer}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#00E5FF] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          )}

          {/* View Toggle Button */}
          <button
            onClick={() => onSwitchView(currentView === 'guest' ? 'operations' : 'guest')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              currentView === 'guest'
                ? 'bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] text-[#090A0F] hover:opacity-90'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            {currentView === 'guest' ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Staff Operations Hub</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" />
                <span>Guest Experience</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

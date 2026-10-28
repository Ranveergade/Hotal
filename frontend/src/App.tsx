import { useState, useEffect, useCallback } from 'react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { NavbarLuxury } from './components/layout/NavbarLuxury';
import { HeroSection } from './components/landing/HeroSection';
import { PinnedAiShowcase } from './components/landing/PinnedAiShowcase';
import { HorizontalRoomsGallery } from './components/landing/HorizontalRoomsGallery';
import { StackedFeatureCards } from './components/landing/StackedFeatureCards';
import { ConciergeChatWidget } from './components/concierge/ConciergeChatWidget';
import { StaffOperationsHub } from './components/operations/StaffOperationsHub';
import { DEMO_TRIAGE_INCIDENTS } from './services/mockData';
import { checkBackendHealth } from './services/apiClient';
import type { IndianHotelRecord } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'guest' | 'operations'>(() => {
    return window.location.pathname.startsWith('/operations') ? 'operations' : 'guest';
  });

  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [takeoverActive, setTakeoverActive] = useState<boolean>(false);
  const [aiDrawerQuery, setAiDrawerQuery] = useState<string | undefined>(undefined);

  // Sync with browser URL / popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(window.location.pathname.startsWith('/operations') ? 'operations' : 'guest');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSwitchView = useCallback((view: 'guest' | 'operations') => {
    setCurrentView(view);
    const newPath = view === 'operations' ? '/operations' : '/';
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Poll backend health status
  const probeBackend = useCallback(async () => {
    try {
      const health = await checkBackendHealth();
      setBackendConnected(health.isConnected);
    } catch {
      setBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    probeBackend();
    const interval = setInterval(probeBackend, 20000);
    return () => clearInterval(interval);
  }, [probeBackend]);

  const handleSelectHotelForBooking = (hotel: IndianHotelRecord) => {
    // Open chat widget with pre-filled booking inquiry for this hotel
    setAiDrawerQuery(`I would like to reserve a luxury suite at ${hotel.name} in ${hotel.city}. Please check live tariffs and policy perks.`);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 antialiased selection:bg-[#D4AF37]/30 selection:text-[#E5C07B]">
      {/* Top Luxury Navigation */}
      <NavbarLuxury
        currentView={currentView}
        onSwitchView={handleSwitchView}
        backendConnected={backendConnected}
        onOpenAiDrawer={() => setAiDrawerQuery('Show me luxury suites with mountain or lake view')}
      />

      {currentView === 'guest' ? (
        <SmoothScrollProvider>
          <main className="w-full">
            {/* Section A: Hero with Parallax & Scrub Zoom */}
            <HeroSection
              onSearchQuery={(q) => setAiDrawerQuery(q)}
              onOpenOperations={() => handleSwitchView('operations')}
            />

            {/* Section B: Horizontal Curated Suites Showcase (gsap.com/scroll pan) */}
            <div id="suites">
              <HorizontalRoomsGallery
                onSelectHotelForBooking={handleSelectHotelForBooking}
              />
            </div>

            {/* Section C: Pinned AI Spotlight Showcase (pin: true, scrub: 1) */}
            <div id="ai-spotlight">
              <PinnedAiShowcase />
            </div>

            {/* Section D: The Operations Engine (Stacking cards on scroll) */}
            <div id="operations-engine">
              <StackedFeatureCards
                onOpenOperations={() => handleSwitchView('operations')}
              />
            </div>

            {/* Luxury Footer */}
            <footer className="w-full bg-[#06070B] border-t border-white/5 py-12 px-6 sm:px-12 text-center text-xs font-mono text-slate-500">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span className="text-white font-serif font-bold uppercase tracking-wider">
                    The Grand Concierge
                  </span>
                  <span>• Boutique Midnight Architecture</span>
                </div>
                <div>
                  Connected to Django REST + NVIDIA OSS-20B • Lenis &amp; GSAP ScrollTrigger
                </div>
              </div>
            </footer>
          </main>
        </SmoothScrollProvider>
      ) : (
        /* Staff Operations Hub View */
        <StaffOperationsHub
          incidents={DEMO_TRIAGE_INCIDENTS}
          backendConnected={backendConnected}
          takeoverActive={takeoverActive}
          onToggleTakeover={() => setTakeoverActive((prev) => !prev)}
          onBackToGuest={() => handleSwitchView('guest')}
        />
      )}

      {/* Persistent Floating AI Concierge Drawer / Modal (Present across all views) */}
      <ConciergeChatWidget
        initialQuery={aiDrawerQuery}
        onClearInitialQuery={() => setAiDrawerQuery(undefined)}
      />
    </div>
  );
}

export default App;

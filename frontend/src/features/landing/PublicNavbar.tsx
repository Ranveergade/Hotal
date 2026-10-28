import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';

interface PublicNavbarProps {
  onEnterOperations: () => void;
}

export const PublicNavbar = ({ onEnterOperations }: PublicNavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAnchor = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-linen-100/95 backdrop-blur-md border-b border-hairline py-3.5 shadow-2xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col text-left cursor-pointer"
          >
            <span className="font-headline text-lg sm:text-xl font-bold tracking-widest uppercase text-sand-900 group-hover:text-burgundy transition-colors">
              The Grand Concierge
            </span>
            <span className="text-[9px] font-mono tracking-widest text-sand-600 uppercase">
              AI Hotel Operations Workforce
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-label uppercase tracking-widest text-sand-700">
          <button
            onClick={() => scrollToAnchor('product')}
            className="hover:text-burgundy transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => scrollToAnchor('capabilities')}
            className="hover:text-burgundy transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToAnchor('how-it-works')}
            className="hover:text-burgundy transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToAnchor('security')}
            className="hover:text-burgundy transition-colors cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Safety &amp; Trust</span>
          </button>
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={() => scrollToAnchor('platform')}
            className="px-4 py-2 text-xs font-label uppercase tracking-wider text-sand-800 hover:text-burgundy transition-colors cursor-pointer"
          >
            Explore Platform
          </button>

          <button
            onClick={onEnterOperations}
            className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-900 text-white font-label uppercase text-xs font-bold tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:opacity-95"
          >
            <span>Enter Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onEnterOperations}
            className="px-3 py-1.5 bg-burgundy text-white text-[11px] font-label uppercase font-bold tracking-wider"
          >
            Cockpit
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-sand-800 hover:text-burgundy cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-linen-100 border-b border-hairline px-6 py-6 flex flex-col gap-4 text-xs font-label uppercase tracking-wider text-sand-800">
          <button
            onClick={() => scrollToAnchor('product')}
            className="text-left py-2 border-b border-hairline/60"
          >
            Product Introduction
          </button>
          <button
            onClick={() => scrollToAnchor('capabilities')}
            className="text-left py-2 border-b border-hairline/60"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToAnchor('how-it-works')}
            className="text-left py-2 border-b border-hairline/60"
          >
            How It Works (Operational Thread)
          </button>
          <button
            onClick={() => scrollToAnchor('platform')}
            className="text-left py-2 border-b border-hairline/60"
          >
            Platform Preview
          </button>
          <button
            onClick={() => scrollToAnchor('security')}
            className="text-left py-2 border-b border-hairline/60"
          >
            Safety, Grounding &amp; Trust
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onEnterOperations();
            }}
            className="w-full py-3 bg-burgundy text-white font-bold text-center tracking-widest mt-2"
          >
            Enter Operations Workspace
          </button>
        </div>
      )}
    </header>
  );
};


import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEMO_VERIFIED_HOTELS } from '../../services/mockData';
import type { IndianHotelRecord } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalRoomsGalleryProps {
  onSelectHotelForBooking: (hotel: IndianHotelRecord) => void;
}

const LUXURY_SUITES = [
  {
    ...DEMO_VERIFIED_HOTELS[0],
    suiteTitle: 'Royal Lake Palace Grand Suite',
    pricePerNight: '₹34,500',
    tag: 'HERITAGE PALACE • LAKE VIEW',
    features: ['Private Butler', 'Lake Pichola Panoramic Terrace', 'Marble Plunge Pool'],
    bgGradient: 'from-amber-950/40 via-amber-900/20 to-black/60',
  },
  {
    ...DEMO_VERIFIED_HOTELS[1],
    suiteTitle: 'Presidential Ocean Penthouse',
    pricePerNight: '₹28,000',
    tag: 'MARINE DRIVE • ARABIAN SEA',
    features: ['24/7 Sommelier', 'Private Helipad Access', 'Centurion Lounge Access'],
    bgGradient: 'from-blue-950/40 via-slate-900/30 to-black/60',
  },
  {
    ...DEMO_VERIFIED_HOTELS[2],
    suiteTitle: 'Imperial Diplomatic Residence',
    pricePerNight: '₹31,000',
    tag: 'DIPLOMATIC ENCLAVE • CHANAKYAPURI',
    features: ['Soundproof Boardroom', 'Private Chef Pantry', 'BMW 7-Series Chauffeur'],
    bgGradient: 'from-emerald-950/40 via-slate-900/30 to-black/60',
  },
  {
    ...DEMO_VERIFIED_HOTELS[3],
    suiteTitle: 'Maharaja Royal Chola Pavillion',
    pricePerNight: '₹22,500',
    tag: 'GUINDY REGAL ESTATE • SPRAWLING 1200 SQ.FT',
    features: ['Kaya Kalp Spa Pass', 'Grand Ballroom Access', 'Gold Leaf Ceiling Decor'],
    bgGradient: 'from-amber-950/40 via-stone-900/30 to-black/60',
  },
  {
    name: 'Rambagh Palace Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    star_rating: 5,
    address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
    description: 'Former residence of the Maharaja of Jaipur, featuring opulent peacocks on manicured gardens and regal royal dining.',
    suiteTitle: 'Sukh Niwas Regal Royal Suite',
    pricePerNight: '₹42,000',
    tag: 'ROYAL RESIDENCE • HERITAGE ARCHITECTURE',
    features: ['Historic Royal Antiques', 'Private Garden Courtyard', 'Royal Carriage Welcome'],
    bgGradient: 'from-yellow-950/40 via-amber-950/20 to-black/60',
  },
];

export const HorizontalRoomsGallery = ({
  onSelectHotelForBooking,
}: HorizontalRoomsGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#090A0F] text-white flex flex-col justify-between py-10 border-t border-white/5"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="px-8 sm:px-16 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#E5C07B] text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Horizontal Curated Showcase (GSAP Pan)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Curated Heritage &amp; Luxury Suites
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-md">
          Scroll down vertically to navigate horizontally across verified luxury Indian inventory with real-time AI reservation availability.
        </p>
      </div>

      {/* Horizontal Pan Track */}
      <div
        ref={trackRef}
        className="flex gap-8 px-8 sm:px-16 w-max h-[68vh] items-center z-10 will-change-transform"
      >
        {LUXURY_SUITES.map((suite, idx) => (
          <div
            key={idx}
            className="group w-[360px] sm:w-[420px] h-[520px] rounded-3xl glass-panel p-6 flex flex-col justify-between border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
          >
            {/* Background Gradient & Pattern */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${suite.bgGradient} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

            {/* Card Top: Badges & City */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[#E5C07B] font-semibold">
                  {suite.tag}
                </span>
                <div className="flex items-center gap-1 text-[#E5C07B] text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{suite.star_rating}★</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-[#00E5FF]" />
                <span>
                  {suite.city}, {suite.state}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug group-hover:text-[#E5C07B] transition-colors">
                {suite.suiteTitle}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {suite.description}
              </p>
            </div>

            {/* Card Middle: Key Luxury Features */}
            <div className="relative z-10 space-y-2 py-4 border-y border-white/10 my-2">
              {suite.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF] flex-none" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Card Bottom: Pricing & AI Reserve Button */}
            <div className="relative z-10">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Starting Tariff
                  </span>
                  <div className="text-2xl font-serif font-bold gold-gradient-text">
                    {suite.pricePerNight}
                    <span className="text-xs font-sans text-slate-400 font-normal"> / night</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Instant Bookable
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectHotelForBooking(suite as any)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#D4AF37] hover:from-[#FFF2BC] hover:to-[#E5C07B] text-[#090A0F] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/15 group-hover:scale-[1.02]"
              >
                <span>Book via AI Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pan indicator */}
      <div className="px-8 sm:px-16 pb-2 text-xs font-mono text-slate-500 flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
        <span>Scrub indicator: Drag or scroll down to explore 5 curated properties</span>
      </div>
    </section>
  );
};

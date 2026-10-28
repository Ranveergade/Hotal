import { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Send,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  CheckSquare,
  ShieldAlert,
  Calendar,
  CreditCard,
  MapPin,
  Star,
} from 'lucide-react';
import { queryAiAssistant } from '../../services/apiClient';
import { DEMO_VERIFIED_HOTELS } from '../../services/mockData';
import type { IndianHotelRecord } from '../../types';

interface LandingPageProps {
  onEnterOperations: () => void;
}

const SAMPLE_QUESTIONS = [
  'Show me luxury heritage hotels with swimming pool in Udaipur',
  'Recommend 5-star properties in Mumbai with sea view and butler service',
  'What is the standard policy regarding late checkout and luggage holding?',
  'Find hotels with spa and fine dining in New Delhi',
];

export const LandingPage = ({ onEnterOperations }: LandingPageProps) => {
  const [demoQuery, setDemoQuery] = useState('');
  const [demoAnswer, setDemoAnswer] = useState<string | null>(
    'I have located verified luxury properties in Udaipur matching your request. The Oberoi Udaivilas features premier suites with direct semi-private pool access on the historic banks of Lake Pichola. All recommendations are grounded strictly in internal hotel databases.'
  );
  const [demoHotels, setDemoHotels] = useState<IndianHotelRecord[]>(DEMO_VERIFIED_HOTELS.slice(0, 2));
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selectedCity, setSelectedCity] = useState<'All' | 'Mumbai' | 'Udaipur' | 'New Delhi' | 'Chennai'>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredHotels = DEMO_VERIFIED_HOTELS.filter((h) => {
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesQuery =
      searchFilter === '' ||
      h.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      h.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
      h.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCity && matchesQuery;
  });

  const handleRunQuery = async (queryText?: string) => {
    const q = (queryText || demoQuery).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setDemoAnswer(null);

    try {
      const res = await queryAiAssistant(q);
      if (res.data && !res.data.error) {
        setDemoAnswer(res.data.answer || 'Query processed against internal hotel database.');
        if (res.data.hotels && res.data.hotels.length > 0) {
          setDemoHotels(res.data.hotels.slice(0, 2));
        }
      } else {
        setDemoAnswer(
          `[Backend Standby]: The local Django backend on http://localhost:8000 is currently in standby. In live mode, this query passes through POST /api/ai-assistant/ (NVIDIA OSS-20B) with verified SQLite property retrieval.`
        );
      }
    } catch {
      setDemoAnswer(
        `[Network Standby]: Unable to reach POST /api/ai-assistant/. Displaying verified offline hotel catalog.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Browser speech recognition Web API is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setDemoQuery(text);
        handleRunQuery(text);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    }
  };

  const handleToggleSpeech = () => {
    if (!window.speechSynthesis || !demoAnswer) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(demoAnswer);
      u.rate = 0.95;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* ================= MODERN STICKY NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                Grand<span className="text-indigo-600">Concierge</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                AI Hotel Operations Workforce
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#demo" className="hover:text-indigo-600 transition-colors">
              Live AI Demo
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Platform Features
            </a>
            <a href="#directory" className="hover:text-indigo-600 transition-colors">
              Hotel Directory
            </a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">
              Operational Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterOperations}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Launch Operations App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Next-Generation Autonomous Hospitality Workforce</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Autonomous AI for Modern{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900">
              Hotel Operations
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 font-normal mt-6 max-w-2xl mx-auto leading-relaxed">
            Orchestrate natural guest inquiries, verified hotel knowledge, housekeeping turnaround constraints, and duty manager approvals in one unified platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={onEnterOperations}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Shift Operations Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#demo"
              className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 shadow-xs transition-all hover:border-slate-300"
            >
              Try Live Playground ↓
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucination</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">100% Grounded</div>
              <div className="text-xs text-slate-500 mt-1">Direct SQLite property &amp; SOP citations</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>SLA Dispatch</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">&lt; 15 Mins</div>
              <div className="text-xs text-slate-500 mt-1">Automatic staff luggage &amp; turn-down tasking</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Human Discretion</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">1-Click Sign-Off</div>
              <div className="text-xs text-slate-500 mt-1">Duty Manager override for VIP turnaround conflicts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE LIVE CONCIERGE DEMO ================= */}
      <section id="demo" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Demo Intro Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Interactive Playground</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Test the Grounded AI Concierge in Real Time.
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Type an inquiry or click the microphone to dictate with browser speech recognition. Queries connect directly to Ranveer&apos;s verified <code className="text-indigo-600 font-mono font-semibold">POST /api/ai-assistant/</code> backend.
              </p>

              {/* Sample Queries */}
              <div className="mt-6 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Sample Prompts (Click to Run):
                </div>
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDemoQuery(q);
                      handleRunQuery(q);
                    }}
                    className="w-full text-left p-3 text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50/60 hover:text-indigo-900 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs hover:border-indigo-200"
                  >
                    &quot;{q}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Sandbox Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Grand AI Concierge Desk
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Model: NVIDIA OSS-20B</span>
              </div>

              {/* Response Bubble */}
              <div className="min-h-[160px] p-5 rounded-xl bg-slate-50 border border-slate-100 text-sm leading-relaxed text-slate-800">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium py-12">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Querying verified SQLite database &amp; AI assistant...</span>
                  </div>
                ) : demoAnswer ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        Assistant Response
                      </span>
                      <button
                        onClick={handleToggleSpeech}
                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Read aloud using speech synthesis"
                      >
                        {speaking ? <VolumeX className="w-4 h-4 text-indigo-600" /> : <Volume2 className="w-4 h-4" />}
                        <span>{speaking ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap">{demoAnswer}</p>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Select a sample prompt above or dictate your request.</span>
                )}
              </div>

              {/* Verified Property Cards Returned */}
              {demoHotels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-2.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Verified Hotel Database Records:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoHotels.map((h, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5 font-medium">
                          {h.city}, {h.state} • {h.star_rating}★
                        </div>
                        <div className="text-slate-600 line-clamp-2 mt-1 text-[11px] leading-relaxed">
                          {h.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunQuery();
                }}
                className="mt-5 flex gap-2"
              >
                <input
                  type="text"
                  value={demoQuery}
                  onChange={(e) => setDemoQuery(e.target.value)}
                  placeholder="Ask a question or describe guest requirements..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />

                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={isListening ? 'Stop recording voice' : 'Dictate with browser speech recognition'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !demoQuery.trim()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM CAPABILITIES (6 MODERN CARDS) ================= */}
      <section id="features" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Real Hotel Operations.
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Every module addresses a distinct operational responsibility during active hotel shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Concierge &amp; Voice Desk</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Handles guest inquiries with browser voice dictation and natural language generation, grounded strictly in internal hotel databases and policies.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center gap-1.5 cursor-pointer hover:text-indigo-800"
            >
              <span>Explore Concierge Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Hotel Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct query access to the 38.5MB Indian luxury hotel catalog. Filter by city, classification, star ratings, and listed amenities with SQLite integrity.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-blue-600 flex items-center gap-1.5 cursor-pointer hover:text-blue-800"
            >
              <span>Open Hotel Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Service Task Dispatcher</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Coordinate housekeeping turn-downs, luggage porterage, and maintenance with dynamic target SLA countdowns and staff assignment tags.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 flex items-center gap-1.5 cursor-pointer hover:text-emerald-800"
            >
              <span>Manage Service Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Human Handoff &amp; Discretion</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Duty Manager sign-off queue for VIP turnaround conflicts. 1-click protocol chips authorize concessions with permanent manager audit signatures.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-amber-600 flex items-center gap-1.5 cursor-pointer hover:text-amber-800"
            >
              <span>Review Escalations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reservation Intake Simulation</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Demonstrates front-office guest booking, stay-duration calculations, and tariff estimation with explicit disclosure of simulation status.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-purple-600 flex items-center gap-1.5 cursor-pointer hover:text-purple-800"
            >
              <span>Test Reservation Intake</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Guest Folio &amp; Settlement</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Itemized accommodation tariffs, dining charges, and spa session auditing for departing guests. Clearly marked simulated settlement without storing card numbers.
              </p>
            </div>
            <button
              onClick={onEnterOperations}
              className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-rose-600 flex items-center gap-1.5 cursor-pointer hover:text-rose-800"
            >
              <span>Audit Guest Folio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= HOTEL DIRECTORY EXPLORER ================= */}
      <section id="directory" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Verified Properties
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Indian Luxury Heritage Catalog
            </h2>
          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Mumbai', 'Udaipur', 'New Delhi', 'Chennai'] as const).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="mb-6">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search hotel name, amenity, or palace classification..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs"
          />
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {hotel.hotel_type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{hotel.star_rating}★</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{hotel.city}, {hotel.state}</span>
                </div>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {hotel.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400 font-mono text-[11px]">SQLite Verified</span>
                <button
                  onClick={onEnterOperations}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKFLOW VISUALIZATION ================= */}
      <section id="workflow" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            Operational Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The Workforce Coordinates Shifts
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <div className="font-bold text-sm text-slate-900">Guest Intake</div>
            <div className="text-xs text-slate-500 mt-1">Multi-channel voice, tablet &amp; terminal inquiry ingestion.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <div className="font-bold text-sm text-slate-900">SOP Verification</div>
            <div className="text-xs text-slate-500 mt-1">Constraint checking against housekeeping turn-around windows.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <div className="font-bold text-sm text-slate-900">Action Formulation</div>
            <div className="text-xs text-slate-500 mt-1">AI formulates personalized policy-compliant compromise.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center mx-auto mb-3">
              4
            </div>
            <div className="font-bold text-sm text-slate-900">Human Discretion</div>
            <div className="text-xs text-slate-500 mt-1">Duty Manager authorizes with 1-click protocol chip.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center mx-auto mb-3">
              5
            </div>
            <div className="font-bold text-sm text-slate-900">Task Dispatch</div>
            <div className="text-xs text-slate-500 mt-1">Dispatches porter &amp; housekeeping teams with SLA countdown.</div>
          </div>
        </div>
      </section>

      {/* ================= HIGH-IMPACT FINAL CTA & FOOTER ================= */}
      <section className="py-20 px-6 sm:px-8 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-semibold mb-4">
            <span>Ready for Shift Operations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Transform Your Hotel Workforce Today.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Experience verified AI coordination across guest conversations, housekeeping constraints, and shift manager supervision.
          </p>

          <div className="mt-8">
            <button
              onClick={onEnterOperations}
              className="px-9 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <span>Launch Operations Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 sm:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>
            <span className="font-bold text-slate-800">GrandConcierge</span> • Autonomous AI Hotel Operations Workforce
          </div>
          <div className="flex items-center gap-6">
            <a href="#demo" className="hover:text-indigo-600">AI Demo</a>
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#directory" className="hover:text-indigo-600">Directory</a>
            <button onClick={onEnterOperations} className="text-indigo-600 font-bold hover:underline cursor-pointer">
              Launch App →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

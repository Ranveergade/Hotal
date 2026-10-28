import { useState } from 'react';
import {
  CheckCircle,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DEMO_RESERVATIONS } from '../../services/mockData';
import type { ReservationIntake } from '../../types';

export const ReservationDesk = () => {
  const [reservations, setReservations] = useState<ReservationIntake[]>(DEMO_RESERVATIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomType, setRoomType] = useState('Grand Deluxe Suite');
  const [checkIn, setCheckIn] = useState('2026-11-20');
  const [checkOut, setCheckOut] = useState('2026-11-24');
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  // Calculate Nights
  const getCalculatedNights = () => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
    } catch {
      return 1;
    }
  };

  const nights = getCalculatedNights();
  const roomRates: Record<string, number> = {
    'Grand Deluxe Suite': 45000,
    'Royal Palace Suite': 75000,
    'Presidential Diplomatic Suite': 95000,
  };
  const ratePerNight = roomRates[roomType] || 45000;
  const totalEstimated = ratePerNight * nights;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReservation: ReservationIntake = {
        id: `RES-${Math.floor(8000 + Math.random() * 1000)}`,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim() || '+91 (Not Provided)',
        roomType,
        checkIn,
        checkOut,
        nightsCount: nights,
        guestsCount,
        specialRequests: specialRequests.trim() || 'No special requests noted.',
        estimatedRatePerNight: ratePerNight,
        totalEstimatedAmount: totalEstimated,
        status: 'Submitted For Verification',
        createdTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isSimulatedDemo: true,
      };

      setReservations((prev) => [newReservation, ...prev]);
      setIsSubmitting(false);
      setIsSuccess(true);

      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setSpecialRequests('');

      setTimeout(() => setIsSuccess(false), 5000);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Front Office Intake
            </span>
            <span className="text-xs font-mono text-slate-500">
              Reservation Simulation Workflow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Reservation &amp; Guest Intake
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Process prospective guest bookings, calculate estimated suite tariffs, and prepare front-desk arrival packets.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>PMS Live Booking: <strong>SIMULATED DEMO</strong></span>
        </div>
      </div>

      {/* Operational Notice */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 flex-none mt-0.5" />
        <div>
          <strong>Operational Notice:</strong> No live transactional Property Management System (PMS) API is integrated. Submitting this form demonstrates front-office guest intake and tariff calculation within local session memory. <strong>No live room inventory hold or credit card charge is executed.</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reservation Intake Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Guest Intake &amp; Stay Parameters
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sir Alistair Sterling"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. sterling@consulate.org"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 / International"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Number of Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Room Category
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                >
                  <option value="Grand Deluxe Suite">Grand Deluxe Suite (₹45,000/nt)</option>
                  <option value="Royal Palace Suite">Royal Palace Suite (₹75,000/nt)</option>
                  <option value="Presidential Diplomatic Suite">Presidential Diplomatic Suite (₹95,000/nt)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Arrival Date (Check-in 15:00)
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Departure Date (Check-out 12:00)
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Special Requests
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="High floor preference, feather-free hypoallergenic pillows, dietary restrictions, airport transfer..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            {/* Tariff Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Selected Suite:</span>
                <span className="font-bold text-slate-900">{roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Stay Duration:</span>
                <span>{nights} Night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Nightly Tariff:</span>
                <span>₹{ratePerNight.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-indigo-700">
                <span>Estimated Stay Total:</span>
                <span>₹{totalEstimated.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Simulated intake recorded. Added to front-desk arrival queue below.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Simulating Intake...' : 'Submit Simulated Reservation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Existing Reservations Queue (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Simulated Reservation Folios ({reservations.length})
          </div>

          {reservations.map((res) => (
            <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {res.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                    {res.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">
                  {res.guestName}
                </h4>
                <div className="text-xs text-indigo-600 font-semibold mt-0.5">
                  {res.roomType}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">
                  Dates: {res.checkIn} → {res.checkOut} ({res.nightsCount} nights)
                </div>

                {res.specialRequests && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {res.specialRequests}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Estimated Tariff:</span>
                <span className="font-extrabold text-indigo-700">₹{res.totalEstimatedAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

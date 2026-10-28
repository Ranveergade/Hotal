import { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Receipt,
  Download,
  Info,
  Calendar,
  Building2,
  User,
  ShieldCheck,
} from 'lucide-react';
import { DEMO_GUEST_FOLIO } from '../../services/mockData';
import type { GuestFolio, FolioChargeItem } from '../../types';

export const PaymentFolioDesk = () => {
  const [folio, setFolio] = useState<GuestFolio>(DEMO_GUEST_FOLIO);
  const [settlementMethod, setSettlementMethod] = useState<'Centurion_Card' | 'Corporate_Direct_Bill' | 'Cash_Deposit'>('Centurion_Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settledFeedback, setSettledFeedback] = useState<string | null>(null);

  const handleSimulateSettlement = () => {
    if (folio.balanceDue <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const balanceToPay = folio.balanceDue;
      const paymentItem: FolioChargeItem = {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().substring(0, 10),
        category: 'Taxes & Luxury Cess',
        description: `Simulated Payment (${settlementMethod.replace(/_/g, ' ')})`,
        amount: -balanceToPay,
        currency: 'INR',
        status: 'Settled',
      };

      setFolio((prev) => ({
        ...prev,
        charges: [...prev.charges, paymentItem],
        totalPaid: prev.totalPaid + balanceToPay,
        balanceDue: 0,
      }));

      setIsProcessing(false);
      setSettledFeedback(
        `Simulated settlement authorized for ₹${balanceToPay.toLocaleString('en-IN')}. Folio marked as Zero Balance.`
      );
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full border border-indigo-200/60">
              Cashier &amp; Settlement
            </span>
            <span className="text-xs font-mono text-slate-400">
              Folio Audit Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Guest Folio &amp; Financial Settlement
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Audit itemized in-room dining, spa sessions, accommodation tariffs, and luxury cess before final departure folio closure.
          </p>
        </div>

        <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-mono text-slate-600">
            Folio: <strong className="text-slate-900 font-bold">{folio.folioNumber}</strong>
          </span>
        </div>
      </div>

      {/* Critical Integration Disclaimer */}
      <div className="mb-6 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-amber-600 flex-none mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-950">Payment Gateway Demonstration:</strong> No live payment gateway (Stripe, Razorpay, or Merchant Terminal) is configured. This interface demonstrates front-desk folio auditing and simulated departure settlement. <span className="font-medium">No real funds or credit card details are collected, charged, or stored.</span>
        </div>
      </div>

      {/* Folio Metadata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Guest Name</div>
            <div className="font-semibold text-slate-900 text-sm mt-0.5">{folio.guestName}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Room Number</div>
            <div className="font-bold text-indigo-600 text-sm mt-0.5">{folio.roomNumber}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Check-in Date</div>
            <div className="text-slate-700 text-sm font-medium mt-0.5">{folio.checkInDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Check-out Date</div>
            <div className="text-slate-700 text-sm font-medium mt-0.5">{folio.checkOutDate}</div>
          </div>
        </div>
      </div>

      {/* Itemized Folio Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">
            Itemized Stay Charges &amp; Incidental Services
          </span>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Currency: INR (₹)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-5">Ref Code</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {folio.charges.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs text-slate-400">{item.id}</td>
                  <td className="py-3 px-5 font-mono text-xs text-slate-600">{item.date}</td>
                  <td className="py-3 px-5 font-mono text-xs text-slate-700">{item.category}</td>
                  <td className="py-3 px-5 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                        item.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-5 text-right font-mono font-bold ${
                      item.amount < 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {item.amount < 0
                      ? `-₹${Math.abs(item.amount).toLocaleString('en-IN')}`
                      : `₹${item.amount.toLocaleString('en-IN')}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="bg-slate-50/80 p-5 border-t border-slate-100 flex flex-col items-end gap-1.5 font-mono text-xs">
          <div className="flex justify-between w-72 text-slate-500">
            <span>Total Charges:</span>
            <span className="text-slate-700 font-medium">₹{folio.totalBilled.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between w-72 text-emerald-700">
            <span>Payments / Advance Paid:</span>
            <span className="font-medium">₹{folio.totalPaid.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between w-72 text-sm font-bold text-slate-900 pt-3 border-t border-slate-200 mt-1">
            <span>Outstanding Balance:</span>
            <span className={folio.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}>
              ₹{folio.balanceDue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Settlement Action Area */}
      {folio.balanceDue > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Simulate Departure Settlement
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Select the designated payment instrument on file to simulate zero-balance check-out settlement.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-slate-500">Protocol:</span>
              <select
                value={settlementMethod}
                onChange={(e) => setSettlementMethod(e.target.value as any)}
                aria-label="Payment Protocol"
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Centurion_Card">Amex Centurion (Card on File ****1004)</option>
                <option value="Corporate_Direct_Bill">Corporate Direct Folio Billing</option>
                <option value="Cash_Deposit">Cashier Front Desk Counter</option>
              </select>
            </div>

            <button
              onClick={handleSimulateSettlement}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Settlement...' : 'Authorize Simulated Settlement'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-mono flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-none" />
            <div>
              <span className="font-bold block text-emerald-950">Folio Fully Settled</span>
              <span className="text-emerald-800 text-[11px]">Zero balance due. Guest departure receipt cleared for delivery.</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Folio</span>
          </button>
        </div>
      )}

      {settledFeedback && (
        <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-xs font-mono text-emerald-800 flex items-center gap-2 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-none" />
          <span>{settledFeedback}</span>
        </div>
      )}
    </div>
  );
};

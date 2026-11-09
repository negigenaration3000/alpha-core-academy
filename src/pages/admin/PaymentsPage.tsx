import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  DollarSign,
  CheckCircle,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Filter,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Booking, PaymentMethod, PaymentStatus } from '../../types/bus';

export const PaymentsPage: React.FC = () => {
  const { bookings, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedForRefund, setSelectedForRefund] = useState<Booking | null>(null);
  const [refundReason, setRefundReason] = useState('Customer cancellation request');

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForRefund) return;

    try {
      store.cancelBooking(selectedForRefund.id, refundReason);
      setSelectedForRefund(null);
      showToast('Refund Processed', `Refund issued for Booking #${selectedForRefund.booking_reference}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const filteredPayments = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(q) ||
      b.passenger_name.toLowerCase().includes(q) ||
      b.passenger_phone.includes(q);
    const matchesMethod = methodFilter === 'all' || b.payment_method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const bkashVolume = bookings
    .filter((b) => b.payment_method === 'bkash' && b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const cashVolume = bookings
    .filter((b) => b.payment_method === 'counter_cash' && b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const refundVolume = bookings
    .filter((b) => b.payment_status === 'refunded')
    .reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-[#10B981]" />
          Payment Transactions & Settlements
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Settlement ledger, bKash & Nagad merchant logs, counter cash reconciliations, and refund processing.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Total Collected Revenue</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {totalCollected.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-[#FF991F] block flex items-center gap-1.5">
            bKash & Nagad Mobile Pay
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {bkashVolume.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-[#38A5FF] block flex items-center gap-1.5">
            Counter Cash Collections
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {cashVolume.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-purple-400 block flex items-center gap-1.5">
            Processed Refunds
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {refundVolume.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by reference, passenger, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981] w-full md:w-auto"
        >
          <option value="all">All Payment Channels</option>
          <option value="bkash">bKash Merchant</option>
          <option value="nagad">Nagad Online</option>
          <option value="card">Visa / Mastercard</option>
          <option value="counter_cash">Counter Cash</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Transaction Reference</th>
                <th className="py-3.5 px-4 font-bold">Passenger</th>
                <th className="py-3.5 px-4 font-bold">Channel</th>
                <th className="py-3.5 px-4 font-bold">Date & Time</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#38A5FF] block">
                      TXN-{p.id.replace('bkg-', '').padStart(8, '0')}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Booking #{p.booking_reference}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{p.passenger_name}</div>
                    <span className="text-[10px] text-[#94A3B8]">{p.passenger_phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#0C1730] border border-[#263B5C] font-semibold uppercase text-[10px] text-white">
                      {p.payment_method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {p.departure_date}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">
                    ৳ {p.total_amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        p.payment_status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : p.payment_status === 'refunded'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.payment_status === 'paid' && (
                      <button
                        onClick={() => setSelectedForRefund(p)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#FF991F] hover:bg-[#17294A] rounded-lg border border-[#263B5C] transition-colors inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Refund</span>
                      </button>
                    )}
                    {p.payment_status === 'refunded' && (
                      <span className="text-[10px] text-purple-400 font-semibold italic">Refund Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROCESS REFUND MODAL */}
      {selectedForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedForRefund(null)} />
          <div className="relative w-full max-w-md bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#FF991F]" />
                <h3 className="text-base font-bold text-white">Process Ticket Refund</h3>
              </div>
              <button onClick={() => setSelectedForRefund(null)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-[#0C1730] border border-[#263B5C] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Booking Ref:</span>
                  <span className="font-bold text-white">{selectedForRefund.booking_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Passenger:</span>
                  <span className="font-bold text-white">{selectedForRefund.passenger_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Refund Amount:</span>
                  <span className="font-extrabold text-[#10B981]">৳ {selectedForRefund.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Cancellation / Refund Reason</label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setSelectedForRefund(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Authorize & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

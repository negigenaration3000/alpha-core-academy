import React, { useState } from 'react';
import {
  Search,
  Ticket,
  Printer,
  XCircle,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Phone,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Booking } from '../../types/bus';

export const MyBookingsPage: React.FC = () => {
  const { bookings, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Input Required', 'Please enter your ticket reference (BBB-2026-XXX) or mobile number', 'error');
      return;
    }
    setSearched(true);
  };

  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchedBookings = searched
    ? bookings.filter(
        (b) =>
          b.booking_reference.toLowerCase() === cleanQuery ||
          b.passenger_phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
          b.passenger_name.toLowerCase().includes(cleanQuery)
      )
    : bookings.slice(0, 3); // Show recent sample bookings before searching

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this ticket? An 85% refund will be processed.')) {
      try {
        const cancelled = store.cancelBooking(bookingId, 'Customer online cancellation');
        setSelectedBooking(null);
        showToast('Ticket Cancelled', `Booking #${cancelled.booking_reference} cancelled successfully`, 'info');
      } catch (err: any) {
        showToast('Cancellation Failed', err.message, 'error');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Manage Your Bookings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
          Retrieve your digital E-Tickets, check live departure status, print boarding passes, or request ticket cancellation.
        </p>
      </div>

      {/* Ticket Lookup Box */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 shadow-card max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Booking Reference (e.g. BBB-2026-842) or Mobile Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-xs font-semibold text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-2xl shadow-lg transition-all"
          >
            Find My Ticket
          </button>
        </form>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white px-1">
          {searched ? `Found Tickets (${matchedBookings.length})` : 'Recent Journeys'}
        </h3>

        {matchedBookings.length === 0 ? (
          <div className="p-12 text-center bg-[#111F3B] border border-[#263B5C] rounded-3xl">
            <Ticket className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-40" />
            <h4 className="text-sm font-bold text-white">No bookings found for "{searchQuery}"</h4>
            <p className="text-xs text-[#94A3B8] mt-1">Please double check your 10-digit mobile number or booking reference.</p>
          </div>
        ) : (
          matchedBookings.map((bkg) => (
            <div
              key={bkg.id}
              className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1677FF]/50 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#38A5FF] bg-[#0C1730] px-2.5 py-1 rounded-lg border border-[#263B5C]">
                    {bkg.booking_reference}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      bkg.booking_status === 'confirmed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : bkg.booking_status === 'cancelled'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {bkg.booking_status}
                  </span>
                </div>

                <div className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{bkg.origin}</span>
                  <ArrowRight className="w-4 h-4 text-[#1677FF]" />
                  <span>{bkg.destination}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38A5FF]" />
                    {bkg.departure_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FF991F]" />
                    {bkg.departure_time}
                  </span>
                  <span>Passenger: <strong className="text-white">{bkg.passenger_name}</strong></span>
                  <span>Seats: <strong className="text-white">{bkg.seats.join(', ')}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#263B5C]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-[#94A3B8] block">Amount Paid</span>
                  <span className="text-xl font-black text-white">৳ {bkg.total_amount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBooking(bkg)}
                    className="px-3.5 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
                  </button>

                  {bkg.booking_status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(bkg.id)}
                      className="px-3 py-2 bg-[#17294A] hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl border border-[#263B5C] transition-all"
                      title="Cancel Ticket"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* E-TICKET POPUP */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm no-print" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-3xl shadow-2xl p-6 z-10 animate-slide-up print-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C] no-print">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#38A5FF]" />
                <h3 className="text-base font-bold text-white">Official Passenger E-Ticket</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ticket</span>
                </button>
                <button onClick={() => setSelectedBooking(null)} className="text-[#94A3B8] hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ticket body */}
            <div className="mt-4 p-5 rounded-2xl bg-[#080F22] border-2 border-dashed border-[#263B5C] text-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#263B5C] pb-3">
                <div className="flex items-center gap-2.5">
                  <img src="/images/bus-bus-baba-logo.jpg" alt="Logo" className="w-9 h-9 object-cover rounded-lg" />
                  <div>
                    <h4 className="text-sm font-black text-white">BUS BUS BABA</h4>
                    <span className="text-[10px] text-[#94A3B8]">Baba Express Transport Ltd.</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#FF991F] block">
                    {selectedBooking.booking_reference}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedBooking.booking_status}</span>
                </div>
              </div>

              <div className="bg-[#111F3B] p-3.5 rounded-xl border border-[#263B5C]">
                <div className="text-sm font-extrabold text-white">{selectedBooking.route_title}</div>
                <div className="text-xs text-[#94A3B8] mt-1 flex justify-between">
                  <span>Coach: {selectedBooking.bus_name}</span>
                  <span>{selectedBooking.departure_time} ({selectedBooking.departure_date})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Passenger Name</span>
                  <span className="font-bold text-white">{selectedBooking.passenger_name}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Contact Phone</span>
                  <span className="font-mono font-bold text-white">{selectedBooking.passenger_phone}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Boarding Point</span>
                  <span className="font-medium text-white">{selectedBooking.boarding_point}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Dropping Point</span>
                  <span className="font-medium text-white">{selectedBooking.dropping_point}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#263B5C] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Reserved Seats:</span>
                  <div className="flex gap-1.5 mt-0.5">
                    {selectedBooking.seats.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#1677FF] text-white font-mono text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#94A3B8] block">Total Amount</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    ৳ {selectedBooking.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

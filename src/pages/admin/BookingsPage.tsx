import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  XCircle,
  CheckCircle,
  Clock,
  Phone,
  User,
  X,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Booking, BookingStatus, PaymentStatus } from '../../types/bus';

export const BookingsPage: React.FC = () => {
  const { bookings, schedules, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Counter Booking Form
  const [manualForm, setManualForm] = useState({
    schedule_id: schedules[0]?.id || '',
    passenger_name: '',
    passenger_phone: '+880 17',
    passenger_email: '',
    seats: 'B3, B4',
    boarding_point: 'Sayedabad Terminal',
    dropping_point: 'Dampara Bus Stand',
    payment_method: 'counter_cash' as const,
  });

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.passenger_name || !manualForm.passenger_phone) {
      showToast('Validation Error', 'Passenger name and phone are required', 'error');
      return;
    }

    const seatList = manualForm.seats
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    try {
      const bkg = store.createBooking({
        schedule_id: manualForm.schedule_id,
        passenger_name: manualForm.passenger_name,
        passenger_phone: manualForm.passenger_phone,
        passenger_email: manualForm.passenger_email,
        boarding_point: manualForm.boarding_point,
        dropping_point: manualForm.dropping_point,
        seats: seatList,
        payment_method: manualForm.payment_method,
      });
      setIsManualModalOpen(false);
      setSelectedBooking(bkg);
      showToast('Ticket Issued', `Booking reference: ${bkg.booking_reference}`, 'success');
    } catch (err: any) {
      showToast('Booking Failed', err.message || 'Cannot reserve selected seats', 'error');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Cancel this booking and release seats back to the schedule?')) {
      try {
        const cancelled = store.cancelBooking(bookingId, 'Customer requested counter cancellation');
        setSelectedBooking(null);
        showToast('Booking Cancelled', `Reference ${cancelled.booking_reference} marked as cancelled`, 'info');
      } catch (err: any) {
        showToast('Error', err.message, 'error');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(q) ||
      b.passenger_name.toLowerCase().includes(q) ||
      b.passenger_phone.includes(q) ||
      b.route_title.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-[#1677FF]" />
            Ticket Bookings & Reservations
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Complete transaction ledger, counter ticketing, passenger seat manifests, and E-Tickets.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Counter Booking</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket reference (BBB-2026-XXX), passenger name, phone number, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF] w-full md:w-auto"
        >
          <option value="all">All Booking Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bookings Ledger Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Booking Ref</th>
                <th className="py-3.5 px-4 font-bold">Passenger Details</th>
                <th className="py-3.5 px-4 font-bold">Journey Route</th>
                <th className="py-3.5 px-4 font-bold">Departure</th>
                <th className="py-3.5 px-4 font-bold">Seats</th>
                <th className="py-3.5 px-4 font-bold">Total Fare</th>
                <th className="py-3.5 px-4 font-bold">Payment</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredBookings.map((bkg) => (
                <tr key={bkg.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      onClick={() => setSelectedBooking(bkg)}
                      className="font-mono font-bold text-[#38A5FF] hover:underline cursor-pointer block"
                    >
                      {bkg.booking_reference}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">{bkg.payment_method.toUpperCase()}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{bkg.passenger_name}</div>
                    <span className="text-[11px] text-[#94A3B8] font-mono">{bkg.passenger_phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{bkg.route_title}</span>
                    <span className="text-[10px] text-[#94A3B8]">{bkg.bus_name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white font-medium block">{bkg.departure_date}</span>
                    <span className="text-[11px] text-[#FF991F] font-bold">{bkg.departure_time}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {bkg.seats.map((seat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#17294A] border border-[#263B5C] font-mono text-[11px] font-bold text-white"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ৳ {bkg.total_amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        bkg.payment_status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : bkg.payment_status === 'refunded'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {bkg.payment_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
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
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(bkg)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#38A5FF] hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="View / Print E-Ticket"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {bkg.booking_status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(bkg.id)}
                          className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE E-TICKET MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm no-print" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up print-card">
            {/* Modal Controls */}
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

            {/* Ticket Printable Body */}
            <div className="mt-4 p-5 rounded-2xl bg-[#080F22] border-2 border-dashed border-[#263B5C] text-white space-y-4">
              {/* Brand Header */}
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
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">CONFIRMED TICKET</span>
                </div>
              </div>

              {/* Journey Route */}
              <div className="bg-[#111F3B] p-3.5 rounded-xl border border-[#263B5C]">
                <div className="text-sm font-extrabold text-white">{selectedBooking.route_title}</div>
                <div className="text-xs text-[#94A3B8] mt-1 flex justify-between">
                  <span>Coach: {selectedBooking.bus_name}</span>
                  <span>{selectedBooking.bus_type}</span>
                </div>
                <div className="text-xs text-[#94A3B8] mt-1 flex justify-between">
                  <span>Date: {selectedBooking.departure_date}</span>
                  <span className="font-bold text-[#FF991F]">Dep: {selectedBooking.departure_time}</span>
                </div>
              </div>

              {/* Passenger & Seats Manifest */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Passenger Name</span>
                  <span className="font-bold text-white">{selectedBooking.passenger_name}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Contact Number</span>
                  <span className="font-mono font-bold text-white">{selectedBooking.passenger_phone}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Boarding Terminal</span>
                  <span className="font-medium text-white">{selectedBooking.boarding_point}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Dropping Terminal</span>
                  <span className="font-medium text-white">{selectedBooking.dropping_point}</span>
                </div>
              </div>

              {/* Seats & Payment */}
              <div className="pt-3 border-t border-[#263B5C] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Reserved Seats ({selectedBooking.total_seats}):</span>
                  <div className="flex gap-1.5 mt-0.5">
                    {selectedBooking.seats.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#1677FF] text-white font-mono text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#94A3B8] block">Total Amount Paid</span>
                  <span className="text-base font-extrabold text-[#10B981]">
                    ৳ {selectedBooking.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Simulated Barcode / Verification */}
              <div className="pt-3 border-t border-[#263B5C] flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span>Helpline: +880 9612-888999</span>
                <span className="font-mono tracking-widest text-[#38A5FF]">||| | ||||| || ||| ||||</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL COUNTER BOOKING MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-[#1677FF]" />
                <h3 className="text-base font-bold text-white">Direct Counter Booking</h3>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Select Schedule</label>
                <select
                  value={manualForm.schedule_id}
                  onChange={(e) => setManualForm({ ...manualForm, schedule_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.origin} → {s.destination} ({s.departure_time}) - {s.bus_name} (Fare: ৳{s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Passenger Full Name</label>
                  <input
                    type="text"
                    required
                    value={manualForm.passenger_name}
                    onChange={(e) => setManualForm({ ...manualForm, passenger_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Mobile (+880)</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.passenger_phone}
                    onChange={(e) => setManualForm({ ...manualForm, passenger_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Seat Numbers (e.g. A3, A4)</label>
                  <input
                    type="text"
                    required
                    value={manualForm.seats}
                    onChange={(e) => setManualForm({ ...manualForm, seats: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Payment Method</label>
                  <select
                    value={manualForm.payment_method}
                    onChange={(e) => setManualForm({ ...manualForm, payment_method: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="counter_cash">Counter Cash</option>
                    <option value="bkash">bKash QR</option>
                    <option value="nagad">Nagad</option>
                    <option value="card">POS Card</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Confirm & Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

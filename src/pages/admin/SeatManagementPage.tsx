import React, { useState } from 'react';
import {
  Armchair,
  CheckCircle,
  Clock,
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  Bus,
  RefreshCw,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { SeatItem, SeatStatus } from '../../types/bus';

export const SeatManagementPage: React.FC = () => {
  const { schedules, store } = useBabaStore();
  const { showToast } = useToast();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id || '');

  const schedule = schedules.find((s) => s.id === selectedScheduleId) || schedules[0];
  const seats = schedule ? store.getSeatsForSchedule(schedule.id) : [];

  // Local state for manually holding / releasing seats
  const [lockedSeats, setLockedSeats] = useState<Set<string>>(new Set());

  const handleSeatClick = (seat: SeatItem) => {
    if (seat.status === 'booked') {
      showToast('Booked Seat', `Seat ${seat.id} is confirmed by a passenger and cannot be toggled`, 'error');
      return;
    }

    const nextLocked = new Set(lockedSeats);
    if (nextLocked.has(seat.id)) {
      nextLocked.delete(seat.id);
      showToast('Seat Released', `Seat ${seat.id} opened for online booking`, 'info');
    } else {
      nextLocked.add(seat.id);
      showToast('Seat Reserved', `Seat ${seat.id} held for VIP / Counter reservation`, 'success');
    }
    setLockedSeats(nextLocked);
  };

  const bookedCount = seats.filter((s) => s.status === 'booked').length;
  const reservedCount = seats.filter((s) => s.status === 'reserved' || lockedSeats.has(s.id)).length;
  const availableCount = seats.length - bookedCount - reservedCount;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Armchair className="w-6 h-6 text-[#1677FF]" />
            Visual Seat Layout & Reservation Manager
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time seat occupancy matrix, VIP holds, sleeper berths, and dynamic capacity allocation.
          </p>
        </div>

        {/* Schedule Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-medium hidden sm:inline">Active Trip:</span>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="px-3.5 py-2 bg-[#111F3B] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.origin} → {s.destination} ({s.departure_time}) - {s.bus_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-xl p-4">
          <span className="text-xs text-[#94A3B8] block">Total Capacity</span>
          <span className="text-xl font-extrabold text-white mt-1 block">{seats.length} Seats</span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-xl p-4">
          <span className="text-xs text-emerald-400 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Available Seats
          </span>
          <span className="text-xl font-extrabold text-white mt-1 block">{Math.max(0, availableCount)}</span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-xl p-4">
          <span className="text-xs text-[#1677FF] block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
            Booked / Paid
          </span>
          <span className="text-xl font-extrabold text-white mt-1 block">{bookedCount}</span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-xl p-4">
          <span className="text-xs text-[#FF991F] block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF991F]" />
            VIP / Counter Hold
          </span>
          <span className="text-xl font-extrabold text-white mt-1 block">{reservedCount}</span>
        </div>
      </div>

      {/* Main Bus Cockpit & Seat Layout Canvas */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 lg:p-8 shadow-card">
        {/* Bus Header / Cabin Front */}
        <div className="max-w-md mx-auto bg-[#0C1730] border-2 border-[#263B5C] rounded-3xl p-6 relative shadow-2xl">
          {/* Driver Cabin Front */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-dashed border-[#263B5C]">
            {/* Passenger Entrance Door */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17294A] border border-[#263B5C] text-[11px] text-[#94A3B8]">
              <span>🚪 Cabin Door</span>
            </div>

            {/* Coach Title */}
            <div className="text-center">
              <span className="text-xs font-bold text-white block">{schedule?.bus_name}</span>
              <span className="text-[10px] text-[#38A5FF] font-mono">{schedule?.reg_no}</span>
            </div>

            {/* Driver Steering Wheel Seat */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17294A] border border-[#263B5C] text-xs font-bold text-white">
              <span>🛞 Driver</span>
            </div>
          </div>

          {/* Seat Grid: 2x2 or 2x1 */}
          <div className="grid grid-cols-4 gap-3 justify-items-center">
            {seats.map((seat) => {
              const isLocked = lockedSeats.has(seat.id) || seat.status === 'reserved';
              const isBooked = seat.status === 'booked';
              const isAvailable = !isBooked && !isLocked;

              return (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isBooked}
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative group ${
                    isBooked
                      ? 'bg-[#1F2937] text-gray-500 border border-gray-700 cursor-not-allowed'
                      : isLocked
                      ? 'bg-[#FF991F]/20 text-[#FF991F] border border-[#FF991F] shadow-lg shadow-orange-500/20'
                      : 'bg-[#17294A] text-white border border-[#263B5C] hover:border-[#1677FF] hover:bg-[#1677FF]/30'
                  }`}
                >
                  <Armchair className="w-4 h-4 mb-0.5" />
                  <span>{seat.id}</span>

                  {isLocked && (
                    <Lock className="w-2.5 h-2.5 text-[#FF991F] absolute top-1 right-1" />
                  )}
                  {isBooked && (
                    <span className="text-[9px] text-gray-500 block -mt-0.5 font-sans">SOLD</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Back Passenger Row Note */}
          <div className="mt-8 pt-4 border-t border-[#263B5C] text-center text-[11px] text-[#94A3B8]">
            Rear Passenger Lounge • Click any available seat to toggle VIP / Counter Hold
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-[#263B5C]/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#17294A] border border-[#263B5C]" />
            <span className="text-[#94A3B8]">Available for Public Booking</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#1F2937] border border-gray-700" />
            <span className="text-[#94A3B8]">Booked & Paid Ticket</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#FF991F]/20 border border-[#FF991F]" />
            <span className="text-[#94A3B8]">Operator / VIP Counter Hold</span>
          </div>
        </div>
      </div>
    </div>
  );
};

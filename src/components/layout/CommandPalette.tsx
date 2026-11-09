import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bus, Compass, CalendarDays, Ticket, UserCheck, X, ArrowRight } from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { buses, routes, schedules, bookings, drivers } = useBabaStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredBuses = q
    ? buses.filter(
        (b) =>
          b.bus_name.toLowerCase().includes(q) ||
          b.reg_no.toLowerCase().includes(q) ||
          b.bus_type.toLowerCase().includes(q)
      ).slice(0, 3)
    : buses.slice(0, 2);

  const filteredRoutes = q
    ? routes.filter(
        (r) =>
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.route_code.toLowerCase().includes(q)
      ).slice(0, 3)
    : routes.slice(0, 2);

  const filteredSchedules = q
    ? schedules.filter(
        (s) =>
          s.schedule_code.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.bus_name.toLowerCase().includes(q)
      ).slice(0, 3)
    : schedules.slice(0, 2);

  const filteredBookings = q
    ? bookings.filter(
        (b) =>
          b.booking_reference.toLowerCase().includes(q) ||
          b.passenger_name.toLowerCase().includes(q) ||
          b.passenger_phone.includes(q)
      ).slice(0, 3)
    : bookings.slice(0, 2);

  const filteredDrivers = q
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.license_number.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#263B5C] bg-[#0C1730]">
          <Search className="w-5 h-5 text-[#38A5FF] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buses, routes, schedules, bookings, passengers..."
            className="w-full bg-transparent text-white placeholder-[#94A3B8] text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#94A3B8] hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="ml-2 px-2 py-0.5 text-[10px] font-medium text-[#94A3B8] bg-[#17294A] border border-[#263B5C] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Buses */}
          {filteredBuses.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-[#1677FF]" /> Buses & Fleet
              </p>
              <div className="space-y-1">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => handleSelect('/admin/buses')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#17294A] rounded-xl cursor-pointer text-xs transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-[#38A5FF]">
                        {bus.bus_name}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {bus.reg_no} • {bus.bus_type} • {bus.seat_capacity} Seats
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1677FF]/15 text-[#38A5FF] border border-[#1677FF]/30">
                      {bus.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routes */}
          {filteredRoutes.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#10B981]" /> Routes
              </p>
              <div className="space-y-1">
                {filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => handleSelect('/admin/routes')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#17294A] rounded-xl cursor-pointer text-xs transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-[#10B981]">
                        {route.origin} → {route.destination}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {route.distance_km} km • {route.estimated_duration} • Fare: ৳{route.base_price}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedules */}
          {filteredSchedules.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#FF991F]" /> Schedules & Departures
              </p>
              <div className="space-y-1">
                {filteredSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    onClick={() => handleSelect('/admin/schedules')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#17294A] rounded-xl cursor-pointer text-xs transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-[#FF991F]">
                        {sch.origin} → {sch.destination} ({sch.departure_time})
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {sch.bus_name} • {sch.available_seats} seats left
                      </div>
                    </div>
                    <span className="font-bold text-[#FF991F]">৳{sch.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings */}
          {filteredBookings.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#38A5FF]" /> Bookings & Tickets
              </p>
              <div className="space-y-1">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelect('/admin/bookings')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#17294A] rounded-xl cursor-pointer text-xs transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-[#38A5FF]">
                        {b.passenger_name} ({b.booking_reference})
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {b.route_title} • Seats: {b.seats.join(', ')} • {b.passenger_phone}
                      </div>
                    </div>
                    <span className="font-bold text-[#10B981]">৳{b.total_amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drivers */}
          {filteredDrivers.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Drivers
              </p>
              <div className="space-y-1">
                {filteredDrivers.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect('/admin/drivers')}
                    className="flex items-center justify-between p-2.5 hover:bg-[#17294A] rounded-xl cursor-pointer text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">{d.name}</div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {d.license_number} • {d.phone} • Rating: {d.rating}★
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-400 uppercase font-bold">{d.employment_status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

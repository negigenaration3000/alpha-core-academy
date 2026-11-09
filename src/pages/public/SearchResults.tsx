import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import {
  Search,
  Filter,
  Bus,
  Clock,
  ArrowRight,
  Armchair,
  CheckCircle,
  Wifi,
  Zap,
  Coffee,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { Schedule, BusType } from '../../types/bus';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { schedules, routes } = useBabaStore();

  const initialFrom = searchParams.get('from') || 'Dhaka';
  const initialTo = searchParams.get('to') || 'Cox\'s Bazar';
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState(initialDate);

  // Filters state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [timeSlot, setTimeSlot] = useState<string>('all'); // all, morning, afternoon, night
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const cities = ['Dhaka', 'Chittagong', 'Cox\'s Bazar', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Bogura', 'Comilla'];

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // Route matching
      const matchesRoute =
        s.origin.toLowerCase() === fromCity.toLowerCase() &&
        s.destination.toLowerCase() === toCity.toLowerCase();

      // If user selected specific route that doesn't exist, show available schedules on similar routes
      const effectiveMatch = matchesRoute || (fromCity === 'Dhaka' && !schedules.some((x) => x.origin === fromCity && x.destination === toCity));

      // Type filter
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(s.bus_type);

      // Price filter
      const matchesPrice = s.price <= maxPrice;

      // Time slot filter
      let matchesTime = true;
      const hour = parseInt(s.departure_time.split(':')[0]) + (s.departure_time.includes('PM') && !s.departure_time.startsWith('12') ? 12 : 0);
      if (timeSlot === 'morning') matchesTime = hour >= 6 && hour < 12;
      else if (timeSlot === 'afternoon') matchesTime = hour >= 12 && hour < 18;
      else if (timeSlot === 'night') matchesTime = hour >= 18 || hour < 6;

      return effectiveMatch && matchesType && matchesPrice && matchesTime;
    });
  }, [schedules, fromCity, toCity, selectedTypes, maxPrice, timeSlot]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Top Search Modify Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-5 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">From</label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#1677FF]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">To</label>
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FF991F]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Date</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:self-end">
            <button
              onClick={() => {}}
              className="w-full py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Update Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Left Filters & Right Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-5 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#263B5C]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#38A5FF]" />
              <h3 className="text-sm font-bold text-white">Filter Coaches</h3>
            </div>
            <button
              onClick={() => {
                setSelectedTypes([]);
                setMaxPrice(1500);
                setTimeSlot('all');
              }}
              className="text-[11px] text-[#94A3B8] hover:text-white"
            >
              Reset
            </button>
          </div>

          {/* Coach Types */}
          <div>
            <span className="text-xs font-bold text-white block mb-2.5">Coach Category</span>
            <div className="space-y-2">
              {['AC Coach', 'Non-AC Coach', 'Business Class', 'Sleeper Coach', 'Economy'].map((type) => (
                <label key={type} className="flex items-center gap-2.5 text-xs text-[#94A3B8] hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="rounded bg-[#0C1730] border-[#263B5C] text-[#1677FF] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Departure Time Slots */}
          <div>
            <span className="text-xs font-bold text-white block mb-2.5">Departure Time Slot</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'all', label: 'All Times' },
                { id: 'morning', label: 'Morning (06-12)' },
                { id: 'afternoon', label: 'Afternoon (12-18)' },
                { id: 'night', label: 'Night (18-06)' },
              ].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setTimeSlot(slot.id)}
                  className={`p-2 rounded-xl text-[11px] font-semibold border transition-all ${
                    timeSlot === slot.id
                      ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-sm'
                      : 'bg-[#0C1730] border-[#263B5C] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white">Max Ticket Fare</span>
              <span className="font-bold text-[#FF991F]">৳ {maxPrice}</span>
            </div>
            <input
              type="range"
              min={350}
              max={1500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#1677FF]"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
              <span>৳ 350</span>
              <span>৳ 1,500</span>
            </div>
          </div>
        </div>

        {/* Right Schedules List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span>
              Showing <strong className="text-white">{filteredSchedules.length}</strong> available coach departures for{' '}
              <strong className="text-white">{fromCity} → {toCity}</strong>
            </span>
            <span>Date: {journeyDate}</span>
          </div>

          {filteredSchedules.length === 0 ? (
            <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-12 text-center">
              <Bus className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-white">No departures match your filter criteria</h4>
              <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing coach category filters, or selecting an alternate travel date.
              </p>
            </div>
          ) : (
            filteredSchedules.map((trip) => (
              <div
                key={trip.id}
                className="bg-[#111F3B] border border-[#263B5C] hover:border-[#1677FF]/60 rounded-3xl p-5 sm:p-6 shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Left Bus & Timing Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/bus-bus-baba-logo.jpg"
                      alt="Bus"
                      className="w-12 h-12 object-cover rounded-xl border border-[#263B5C] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-[#38A5FF] transition-colors">
                          {trip.bus_name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1677FF]/15 text-[#38A5FF] border border-[#1677FF]/30">
                          {trip.bus_type}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Baba Express Transport • Plate: {trip.reg_no}
                      </p>
                    </div>
                  </div>

                  {/* Departure -> Arrival times */}
                  <div className="grid grid-cols-3 gap-3 bg-[#0C1730] p-3.5 rounded-2xl border border-[#263B5C] text-xs">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Departure</span>
                      <span className="font-extrabold text-white text-sm">{trip.departure_time}</span>
                      <span className="text-[10px] text-[#38A5FF] block">{trip.origin}</span>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#94A3B8]">{trip.estimated_duration}</span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-0.5 w-full bg-[#263B5C]" />
                        <ArrowRight className="w-3 h-3 text-[#1677FF] shrink-0" />
                        <div className="h-0.5 w-full bg-[#263B5C]" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Direct Route</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#94A3B8] block">Arrival (Est.)</span>
                      <span className="font-extrabold text-white text-sm">{trip.arrival_time}</span>
                      <span className="text-[10px] text-[#FF991F] block">{trip.destination}</span>
                    </div>
                  </div>

                  {/* Boarding Points */}
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span className="font-semibold text-white">Boarding:</span>
                    <span className="truncate">{trip.boarding_points.join(', ')}</span>
                  </div>
                </div>

                {/* Right Fare & Action */}
                <div className="md:w-48 shrink-0 flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-[#263B5C] pt-4 md:pt-0 md:pl-6">
                  <div className="md:text-right">
                    <span className="text-[10px] text-[#94A3B8] block">Fare per Seat</span>
                    <span className="text-2xl font-black text-[#FF991F] block">৳ {trip.price}</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-0.5 block flex items-center md:justify-end gap-1">
                      <Armchair className="w-3 h-3" />
                      {trip.available_seats} Seats Available
                    </span>
                  </div>

                  {/* View Seats CTA */}
                  <button
                    onClick={() => navigate(`/book/${trip.id}`)}
                    className="w-full mt-4 px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Seats</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Ticket,
  Eye,
  X,
  Clock,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Passenger } from '../../types/bus';

export const PassengersPage: React.FC = () => {
  const { passengers, bookings, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    phone: '+880 17',
    email: '',
    address: 'Dhaka, Bangladesh',
    status: 'active' as const,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) {
      showToast('Validation Error', 'Name and mobile number are required', 'error');
      return;
    }
    store.addPassenger({
      ...formState,
      last_journey_date: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(false);
    showToast('Passenger Registered', `${formState.name} added to passenger records`, 'success');
  };

  const filteredPassengers = passengers.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const passengerTrips = selectedPassenger
    ? bookings.filter((b) => b.passenger_phone.includes(selectedPassenger.phone.slice(-8)))
    : [];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#38A5FF]" />
            Passenger Directory & Profiles
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Registered travelers, contact directory, booking history, and loyalty spending metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Passenger</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by passenger name, mobile phone number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38A5FF]"
          />
        </div>
      </div>

      {/* Passengers Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Passenger Name</th>
                <th className="py-3.5 px-4 font-bold">Contact Details</th>
                <th className="py-3.5 px-4 font-bold">Address</th>
                <th className="py-3.5 px-4 font-bold">Total Trips</th>
                <th className="py-3.5 px-4 font-bold">Lifetime Spent</th>
                <th className="py-3.5 px-4 font-bold">Last Journey</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredPassengers.map((psg) => (
                <tr key={psg.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{psg.name}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {psg.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-white font-medium">{psg.phone}</div>
                    <span className="text-[10px] text-[#94A3B8]">{psg.email || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {psg.address || 'Dhaka, Bangladesh'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {psg.total_trips} Journeys
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#FF991F]">
                    ৳ {psg.total_spent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {psg.last_journey_date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPassenger(psg)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#38A5FF] hover:bg-[#0C1730] rounded-lg transition-colors"
                      title="View Booking History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PASSENGER PROFILE & TRIP HISTORY MODAL */}
      {selectedPassenger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPassenger(null)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedPassenger.name}</h3>
                <span className="font-mono text-xs text-[#38A5FF]">{selectedPassenger.phone}</span>
              </div>
              <button onClick={() => setSelectedPassenger(null)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Total Journeys</span>
                  <span className="font-extrabold text-white mt-1 block">{selectedPassenger.total_trips} Trips</span>
                </div>
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Total Spent</span>
                  <span className="font-extrabold text-[#FF991F] mt-1 block">
                    ৳ {selectedPassenger.total_spent.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Trip Manifest History
                </h4>
                {passengerTrips.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No active bookings recorded in this session.</p>
                ) : (
                  <div className="space-y-2">
                    {passengerTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-3 rounded-xl bg-[#0C1730] border border-[#263B5C] text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white">{trip.route_title}</div>
                          <div className="text-[10px] text-[#94A3B8]">
                            Ref: {trip.booking_reference} • Seats: {trip.seats.join(', ')} • {trip.departure_date}
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400">৳{trip.total_amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER PASSENGER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#38A5FF]" />
                <h3 className="text-base font-bold text-white">Register Passenger Profile</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Passenger Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Chowdhury"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#38A5FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Mobile (+880)</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#38A5FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#38A5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">City / Address</label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#38A5FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

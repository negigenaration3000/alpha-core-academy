import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Clock,
  Bus,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Schedule, ScheduleStatus } from '../../types/bus';

export const SchedulesPage: React.FC = () => {
  const { schedules, routes, buses, drivers, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [formState, setFormState] = useState({
    route_id: routes[0]?.id || '',
    bus_id: buses[0]?.id || '',
    driver_id: drivers[0]?.id || '',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00 AM',
    arrival_time: '01:30 PM',
    price: 950,
    status: 'scheduled' as ScheduleStatus,
  });

  const openAddModal = () => {
    setEditingSchedule(null);
    setFormState({
      route_id: routes[0]?.id || '',
      bus_id: buses[0]?.id || '',
      driver_id: drivers[0]?.id || '',
      departure_date: new Date().toISOString().split('T')[0],
      departure_time: '08:00 AM',
      arrival_time: '01:30 PM',
      price: 950,
      status: 'scheduled',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sch: Schedule) => {
    setEditingSchedule(sch);
    setFormState({
      route_id: sch.route_id,
      bus_id: sch.bus_id,
      driver_id: sch.driver_id,
      departure_date: sch.departure_date,
      departure_time: sch.departure_time,
      arrival_time: sch.arrival_time,
      price: sch.price,
      status: sch.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoute = routes.find((r) => r.id === formState.route_id) || routes[0];
    const selBus = buses.find((b) => b.id === formState.bus_id) || buses[0];
    const selDriver = drivers.find((d) => d.id === formState.driver_id) || drivers[0];

    try {
      if (editingSchedule) {
        store.updateSchedule(editingSchedule.id, {
          bus_id: selBus.id,
          bus_name: selBus.bus_name,
          reg_no: selBus.reg_no,
          bus_type: selBus.bus_type,
          driver_id: selDriver.id,
          driver_name: selDriver.name,
          route_id: selRoute.id,
          origin: selRoute.origin,
          destination: selRoute.destination,
          departure_date: formState.departure_date,
          departure_time: formState.departure_time,
          arrival_time: formState.arrival_time,
          price: formState.price,
          status: formState.status,
        });
        showToast('Schedule Updated', 'Trip timing & assignments updated', 'success');
      } else {
        store.addSchedule({
          bus_id: selBus.id,
          bus_name: selBus.bus_name,
          reg_no: selBus.reg_no,
          bus_type: selBus.bus_type,
          driver_id: selDriver.id,
          driver_name: selDriver.name,
          route_id: selRoute.id,
          origin: selRoute.origin,
          destination: selRoute.destination,
          departure_date: formState.departure_date,
          departure_time: formState.departure_time,
          arrival_time: formState.arrival_time,
          estimated_duration: selRoute.estimated_duration,
          price: formState.price,
          available_seats: selBus.seat_capacity,
          total_seats: selBus.seat_capacity,
          status: formState.status,
          boarding_points: selRoute.stops.slice(0, 3),
          dropping_points: [selRoute.destination + ' Central', selRoute.destination + ' Bypass'],
        });
        showToast('Schedule Created', `Departure scheduled successfully`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast('Assignment Conflict', err.message || 'Cannot schedule trip due to conflict', 'error');
    }
  };

  const handleStatusChange = (id: string, newStatus: ScheduleStatus) => {
    store.updateSchedule(id, { status: newStatus });
    showToast('Status Updated', `Trip status changed to ${newStatus.toUpperCase()}`, 'info');
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Cancel and delete schedule ${code}?`)) {
      store.deleteSchedule(id);
      showToast('Schedule Removed', 'Trip schedule removed', 'info');
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.schedule_code.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.bus_name.toLowerCase().includes(q) ||
      s.driver_name.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Scheduled
          </span>
        );
      case 'boarding':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#1677FF]/15 text-[#38A5FF] border border-[#1677FF]/30 animate-pulse">
            Boarding Now
          </span>
        );
      case 'departed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Departed / On Way
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/15 text-gray-400 border border-gray-500/30">
            Completed
          </span>
        );
      case 'delayed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Delayed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-[#FF991F]" />
            Trip Scheduling & Dispatch
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Assign coaches and highway pilots, set departure windows, and prevent scheduling conflicts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Departure</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by trip code, route, assigned coach, or pilot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#FF991F]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F] w-full md:w-auto"
        >
          <option value="all">All Trip Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="boarding">Boarding</option>
          <option value="departed">Departed</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Schedules Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Trip Code & Route</th>
                <th className="py-3.5 px-4 font-bold">Departure Time</th>
                <th className="py-3.5 px-4 font-bold">Assigned Coach</th>
                <th className="py-3.5 px-4 font-bold">Highway Pilot</th>
                <th className="py-3.5 px-4 font-bold">Available Seats</th>
                <th className="py-3.5 px-4 font-bold">Fare</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredSchedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#38A5FF] block">
                      {sch.schedule_code}
                    </span>
                    <span className="font-bold text-white text-xs mt-0.5 block">
                      {sch.origin} → {sch.destination}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-[#FF991F]" />
                      {sch.departure_time}
                    </div>
                    <span className="text-[10px] text-[#94A3B8] block">Arrival: {sch.arrival_time}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{sch.bus_name}</div>
                    <span className="text-[10px] text-[#94A3B8]">{sch.bus_type}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {sch.driver_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${sch.available_seats < 10 ? 'text-[#FF991F]' : 'text-emerald-400'}`}>
                      {sch.available_seats}
                    </span>
                    <span className="text-[#94A3B8]"> / {sch.total_seats}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#FF991F]">
                    ৳ {sch.price}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={sch.status}
                      onChange={(e) => handleStatusChange(sch.id, e.target.value as any)}
                      className="bg-[#0C1730] border border-[#263B5C] text-xs font-semibold rounded-lg px-2 py-1 text-white focus:outline-none"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="boarding">Boarding</option>
                      <option value="departed">Departed</option>
                      <option value="delayed">Delayed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(sch)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#FF991F] hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sch.id, sch.schedule_code)}
                        className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-[#FF991F]" />
                <h3 className="text-base font-bold text-white">
                  {editingSchedule ? 'Modify Departure' : 'Schedule New Departure'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Route</label>
                <select
                  value={formState.route_id}
                  onChange={(e) => setFormState({ ...formState, route_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} (Fare: ৳{r.base_price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Coach</label>
                  <select
                    value={formState.bus_id}
                    onChange={(e) => setFormState({ ...formState, bus_id: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bus_name} ({b.bus_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Driver</label>
                  <select
                    value={formState.driver_id}
                    onChange={(e) => setFormState({ ...formState, driver_id: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.rating}★)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={formState.departure_time}
                    onChange={(e) => setFormState({ ...formState, departure_time: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Arrival Time</label>
                  <input
                    type="text"
                    required
                    placeholder="01:30 PM"
                    value={formState.arrival_time}
                    onChange={(e) => setFormState({ ...formState, arrival_time: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Ticket Fare (৳)</label>
                  <input
                    type="number"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Initial Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="boarding">Boarding</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1730] border border-[#263B5C] flex items-center gap-2.5 text-xs text-[#94A3B8]">
                <ShieldAlert className="w-4 h-4 text-[#FF991F] shrink-0" />
                <span>
                  Anti-collision guard active: System prevents overlapping schedules for the same coach or driver.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingSchedule ? 'Save Changes' : 'Confirm & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  Shield,
  Star,
  Award,
  Edit2,
  Trash2,
  X,
  Bus,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Driver } from '../../types/bus';

export const DriversPage: React.FC = () => {
  const { drivers, buses, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    license_number: '',
    license_expiry: '2028-12-31',
    address: 'Dhaka, Bangladesh',
    employment_status: 'active' as const,
    assigned_bus_id: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  const openAddModal = () => {
    setEditingDriver(null);
    setFormState({
      name: '',
      phone: '+880 1711-',
      email: '',
      license_number: 'DL-DH-',
      license_expiry: '2028-12-31',
      address: 'Dhaka, Bangladesh',
      employment_status: 'active',
      assigned_bus_id: '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormState({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      license_number: driver.license_number,
      license_expiry: driver.license_expiry,
      address: driver.address,
      employment_status: driver.employment_status,
      assigned_bus_id: driver.assigned_bus_id || '',
      avatar: driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedBus = buses.find((b) => b.id === formState.assigned_bus_id);

    if (editingDriver) {
      store.updateDriver(editingDriver.id, {
        ...formState,
        assigned_bus_reg: assignedBus?.reg_no,
      });
      showToast('Driver Updated', `${formState.name} updated successfully`, 'success');
    } else {
      store.addDriver({
        ...formState,
        assigned_bus_reg: assignedBus?.reg_no,
      });
      showToast('Driver Added', `${formState.name} registered into pilot database`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove driver "${name}"?`)) {
      store.deleteDriver(id);
      showToast('Driver Removed', `Pilot record deleted`, 'info');
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.license_number.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || d.employment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-purple-400" />
            Highway Pilots & Drivers
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Certified heavy vehicle pilots, BRTA license verification, trip history, and safety ratings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Highway Pilot</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by pilot name, license plate, or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 w-full md:w-auto"
        >
          <option value="all">All Employment Statuses</option>
          <option value="on_duty">On Duty</option>
          <option value="active">Active Standby</option>
          <option value="leave">On Leave</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Drivers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={driver.name}
                    className="w-12 h-12 object-cover rounded-2xl border border-[#263B5C] shadow-md"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                      {driver.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-white">{driver.rating}</span>
                      <span className="text-[10px] text-[#94A3B8]">({driver.total_trips} trips)</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    driver.employment_status === 'on_duty'
                      ? 'bg-[#1677FF]/15 text-[#38A5FF] border border-[#1677FF]/30'
                      : driver.employment_status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {driver.employment_status.replace('_', ' ')}
                </span>
              </div>

              {/* Pilot details */}
              <div className="my-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#0C1730] border border-[#263B5C]">
                  <span className="text-[#94A3B8] text-[11px]">BRTA License</span>
                  <span className="font-mono font-bold text-white">{driver.license_number}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#0C1730] border border-[#263B5C]">
                  <span className="text-[#94A3B8] text-[11px]">Phone</span>
                  <span className="text-white font-medium">{driver.phone}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#0C1730] border border-[#263B5C]">
                  <span className="text-[#94A3B8] text-[11px]">Assigned Coach</span>
                  <span className="text-white font-medium truncate max-w-[140px]">
                    {driver.assigned_bus_reg || 'Standby Pilot'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#263B5C] flex items-center justify-between">
              <span className="text-[10px] text-[#94A3B8]">Expires: {driver.license_expiry}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(driver)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#38A5FF] hover:bg-[#0C1730] rounded-lg transition-colors"
                  title="Edit Pilot Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(driver.id, driver.name)}
                  className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                  title="Remove Driver"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {editingDriver ? 'Edit Pilot Information' : 'Register New Highway Pilot'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Mobile Phone (+880)</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">BRTA Driving License</label>
                  <input
                    type="text"
                    required
                    value={formState.license_number}
                    onChange={(e) => setFormState({ ...formState, license_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formState.license_expiry}
                    onChange={(e) => setFormState({ ...formState, license_expiry: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Assign Coach</label>
                  <select
                    value={formState.assigned_bus_id}
                    onChange={(e) => setFormState({ ...formState, assigned_bus_id: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">None (Standby Pool)</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bus_name} ({b.reg_no})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Status</label>
                  <select
                    value={formState.employment_status}
                    onChange={(e) => setFormState({ ...formState, employment_status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="active">Active Standby</option>
                    <option value="on_duty">On Duty</option>
                    <option value="leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingDriver ? 'Save Pilot' : 'Register Pilot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

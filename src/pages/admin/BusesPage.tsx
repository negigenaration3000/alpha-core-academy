import React, { useState } from 'react';
import {
  Bus as BusIcon,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Bus, BusStatus, BusType, LayoutType } from '../../types/bus';

export const BusesPage: React.FC = () => {
  const { buses, store, drivers } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBus, setViewBus] = useState<Bus | null>(null);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    bus_name: '',
    reg_no: '',
    operator: 'Baba Express Transport',
    bus_type: 'AC Coach' as BusType,
    seat_capacity: 40,
    layout_type: '2x2' as LayoutType,
    manufacturer: 'Hino',
    model: '1J Series',
    year: 2024,
    status: 'available' as BusStatus,
    assigned_driver_id: '',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    amenities: ['Air Conditioning', 'Mineral Water', 'Charging Ports'],
  });

  const openAddModal = () => {
    setEditingBus(null);
    setFormState({
      bus_name: '',
      reg_no: '',
      operator: 'Baba Express Transport',
      bus_type: 'AC Coach',
      seat_capacity: 40,
      layout_type: '2x2',
      manufacturer: 'Hino',
      model: '1J Series',
      year: 2024,
      status: 'available',
      assigned_driver_id: '',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioning', 'Mineral Water', 'Charging Ports'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (bus: Bus) => {
    setEditingBus(bus);
    setFormState({
      bus_name: bus.bus_name,
      reg_no: bus.reg_no,
      operator: bus.operator,
      bus_type: bus.bus_type,
      seat_capacity: bus.seat_capacity,
      layout_type: bus.layout_type,
      manufacturer: bus.manufacturer,
      model: bus.model,
      year: bus.year,
      status: bus.status,
      assigned_driver_id: bus.assigned_driver_id || '',
      image_url: bus.image_url,
      amenities: bus.amenities || ['Air Conditioning'],
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedDriver = drivers.find((d) => d.id === formState.assigned_driver_id);

    if (editingBus) {
      store.updateBus(editingBus.id, {
        ...formState,
        assigned_driver_name: assignedDriver?.name,
      });
      showToast('Bus Updated', `${formState.bus_name} details updated successfully`, 'success');
    } else {
      store.addBus({
        ...formState,
        assigned_driver_name: assignedDriver?.name,
      });
      showToast('Bus Created', `${formState.bus_name} added to the fleet`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove bus "${name}" from the fleet?`)) {
      store.deleteBus(id);
      showToast('Bus Deleted', `Bus removed from registry`, 'info');
    }
  };

  const filteredBuses = buses.filter((b) => {
    const matchesSearch =
      b.bus_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesType = typeFilter === 'all' || b.bus_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: BusStatus) => {
    switch (status) {
      case 'on_trip':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-[#1677FF]/15 text-[#38A5FF] border border-[#1677FF]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
            On Trip
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FF991F]/15 text-[#FF991F] border border-[#FF991F]/30">
            <Wrench className="w-3 h-3" />
            Maintenance
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BusIcon className="w-6 h-6 text-[#1677FF]" />
            Fleet & Bus Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your {buses.length} registered coaches, registration details, and maintenance cycles.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Coach</span>
        </button>
      </div>

      {/* Filters & Search bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bus name, registration number, or operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
          >
            <option value="all">All Statuses</option>
            <option value="on_trip">On Trip</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
          >
            <option value="all">All Coach Types</option>
            <option value="AC Coach">AC Coach</option>
            <option value="Non-AC Coach">Non-AC Coach</option>
            <option value="Business Class">Business Class</option>
            <option value="Sleeper Coach">Sleeper Coach</option>
            <option value="Economy">Economy</option>
          </select>
        </div>
      </div>

      {/* Buses Directory Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Coach Details</th>
                <th className="py-3.5 px-4 font-bold">Registration Plate</th>
                <th className="py-3.5 px-4 font-bold">Type & Layout</th>
                <th className="py-3.5 px-4 font-bold">Capacity</th>
                <th className="py-3.5 px-4 font-bold">Assigned Driver</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={bus.image_url}
                        alt={bus.bus_name}
                        className="w-10 h-10 object-cover rounded-xl border border-[#263B5C] shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white hover:text-[#38A5FF] cursor-pointer" onClick={() => setViewBus(bus)}>
                          {bus.bus_name}
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          {bus.manufacturer} {bus.model} ({bus.year})
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-semibold text-white bg-[#0C1730] px-2 py-1 rounded-md border border-[#263B5C]">
                      {bus.reg_no}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white font-medium">{bus.bus_type}</span>
                    <span className="text-[#94A3B8] block text-[10px]">Layout: {bus.layout_type}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {bus.seat_capacity} Seats
                  </td>
                  <td className="py-3.5 px-4">
                    {bus.assigned_driver_name ? (
                      <span className="text-white font-medium">{bus.assigned_driver_name}</span>
                    ) : (
                      <span className="text-[#94A3B8] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(bus.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewBus(bus)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#38A5FF] hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(bus)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#FF991F] hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="Edit Bus"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bus.id, bus.bus_name)}
                        className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                        title="Delete Bus"
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

      {/* ADD / EDIT BUS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <BusIcon className="w-5 h-5 text-[#1677FF]" />
                <h3 className="text-base font-bold text-white">
                  {editingBus ? 'Edit Bus Information' : 'Register New Coach'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Bus Name</label>
                  <input
                    type="text"
                    required
                    value={formState.bus_name}
                    onChange={(e) => setFormState({ ...formState, bus_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Registration Plate</label>
                  <input
                    type="text"
                    required
                    value={formState.reg_no}
                    onChange={(e) => setFormState({ ...formState, reg_no: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Coach Type</label>
                  <select
                    value={formState.bus_type}
                    onChange={(e) => setFormState({ ...formState, bus_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="AC Coach">AC Coach</option>
                    <option value="Non-AC Coach">Non-AC Coach</option>
                    <option value="Business Class">Business Class</option>
                    <option value="Sleeper Coach">Sleeper Coach</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Seat Layout</label>
                  <select
                    value={formState.layout_type}
                    onChange={(e) => setFormState({ ...formState, layout_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="2x2">2x2 Standard (40 seats)</option>
                    <option value="2x1">2x1 Business (28-36 seats)</option>
                    <option value="sleeper_2x1">Sleeper Berth</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={formState.seat_capacity}
                    onChange={(e) => setFormState({ ...formState, seat_capacity: parseInt(e.target.value) || 40 })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formState.manufacturer}
                    onChange={(e) => setFormState({ ...formState, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Model</label>
                  <input
                    type="text"
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Year</label>
                  <input
                    type="number"
                    value={formState.year}
                    onChange={(e) => setFormState({ ...formState, year: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Assigned Driver</label>
                  <select
                    value={formState.assigned_driver_id}
                    onChange={(e) => setFormState({ ...formState, assigned_driver_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="">None (Unassigned)</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.license_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Operating Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="available">Available</option>
                    <option value="on_trip">On Trip</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Bus Photo URL</label>
                <input
                  type="url"
                  value={formState.image_url}
                  onChange={(e) => setFormState({ ...formState, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingBus ? 'Save Changes' : 'Register Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewBus(null)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div>
                <h3 className="text-base font-bold text-white">{viewBus.bus_name}</h3>
                <span className="font-mono text-xs text-[#38A5FF]">{viewBus.reg_no}</span>
              </div>
              <button onClick={() => setViewBus(null)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <img
                src={viewBus.image_url}
                alt={viewBus.bus_name}
                className="w-full h-44 object-cover rounded-xl border border-[#263B5C]"
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Type & Layout</span>
                  <span className="font-bold text-white mt-1 block">{viewBus.bus_type} ({viewBus.layout_type})</span>
                </div>
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Seat Capacity</span>
                  <span className="font-bold text-white mt-1 block">{viewBus.seat_capacity} Passenger Seats</span>
                </div>
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Chassis / Build</span>
                  <span className="font-bold text-white mt-1 block">{viewBus.manufacturer} {viewBus.model} ({viewBus.year})</span>
                </div>
                <div className="bg-[#0C1730] p-3 rounded-xl border border-[#263B5C]">
                  <span className="text-[#94A3B8] block text-[11px]">Current Status</span>
                  <div className="mt-1">{getStatusBadge(viewBus.status)}</div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#94A3B8] block mb-2">On-board Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {(viewBus.amenities || ['Air Conditioning', 'Mineral Water', 'Charging Ports']).map((am, i) => (
                    <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg bg-[#17294A] border border-[#263B5C] text-[#F8FAFC]">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

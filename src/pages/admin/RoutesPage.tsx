import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle,
  X,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { BusRoute } from '../../types/bus';

export const RoutesPage: React.FC = () => {
  const { routes, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);

  const [formState, setFormState] = useState({
    route_code: '',
    origin: 'Dhaka',
    destination: 'Chittagong',
    distance_km: 248,
    estimated_duration: '5h 30m',
    base_price: 950,
    status: 'active' as const,
    stops: 'Sayedabad, Kanchpur, Cumilla Cantonment, Feni, Dampara',
  });

  const openAddModal = () => {
    setEditingRoute(null);
    setFormState({
      route_code: 'DAC-XYZ',
      origin: 'Dhaka',
      destination: '',
      distance_km: 200,
      estimated_duration: '4h 30m',
      base_price: 800,
      status: 'active',
      stops: 'Sayedabad, Bypass, Central Bus Terminal',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (route: BusRoute) => {
    setEditingRoute(route);
    setFormState({
      route_code: route.route_code,
      origin: route.origin,
      destination: route.destination,
      distance_km: route.distance_km,
      estimated_duration: route.estimated_duration,
      base_price: route.base_price,
      status: route.status,
      stops: route.stops.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stopsArray = formState.stops
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoute) {
      store.updateRoute(editingRoute.id, {
        route_code: formState.route_code,
        origin: formState.origin,
        destination: formState.destination,
        distance_km: formState.distance_km,
        estimated_duration: formState.estimated_duration,
        base_price: formState.base_price,
        status: formState.status,
        stops: stopsArray,
      });
      showToast('Route Updated', `${formState.origin} → ${formState.destination} updated successfully`, 'success');
    } else {
      store.addRoute({
        route_code: formState.route_code,
        origin: formState.origin,
        destination: formState.destination,
        distance_km: formState.distance_km,
        estimated_duration: formState.estimated_duration,
        base_price: formState.base_price,
        status: formState.status,
        stops: stopsArray,
        bus_count: 3,
      });
      showToast('Route Created', `New route ${formState.origin} → ${formState.destination} created`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete route "${name}"?`)) {
      store.deleteRoute(id);
      showToast('Route Deleted', `Route removed from operations`, 'info');
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.route_code.toLowerCase().includes(q) ||
      r.stops.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[#10B981]" />
            Route Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure Bangladesh inter-district highways, boarding counters, stops, and base fares.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Highway Route</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by origin city, destination, intermediate stops, or route code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-[#10B981]/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-bold text-[#38A5FF] bg-[#0C1730] px-2 py-1 rounded-md border border-[#263B5C]">
                  {route.route_code}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {route.status.toUpperCase()}
                </span>
              </div>

              {/* Origin -> Destination */}
              <div className="flex items-center gap-2 text-base font-extrabold text-white my-2">
                <span>{route.origin}</span>
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
                <span>{route.destination}</span>
              </div>

              {/* Distance & Time */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="bg-[#0C1730] p-2.5 rounded-xl border border-[#263B5C] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#94A3B8]" />
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Distance</span>
                    <span className="font-bold text-white">{route.distance_km} km</span>
                  </div>
                </div>

                <div className="bg-[#0C1730] p-2.5 rounded-xl border border-[#263B5C] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#94A3B8]" />
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Est. Time</span>
                    <span className="font-bold text-white">{route.estimated_duration}</span>
                  </div>
                </div>
              </div>

              {/* Stops tags */}
              <div className="mb-4">
                <span className="text-[11px] text-[#94A3B8] block mb-1.5 font-medium">
                  Stops & Boarding Points:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((stop, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-[#17294A] border border-[#263B5C] text-[#F8FAFC]"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Fare & Action buttons */}
            <div className="pt-3 border-t border-[#263B5C] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Base Fare</span>
                <span className="text-base font-extrabold text-[#FF991F]">৳ {route.base_price}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(route)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#38A5FF] hover:bg-[#0C1730] rounded-lg transition-colors"
                  title="Edit Route"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(route.id, `${route.origin} → ${route.destination}`)}
                  className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                  title="Delete Route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base font-bold text-white">
                  {editingRoute ? 'Edit Route Details' : 'Create New Route'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Origin City</label>
                  <input
                    type="text"
                    required
                    value={formState.origin}
                    onChange={(e) => setFormState({ ...formState, origin: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={formState.destination}
                    onChange={(e) => setFormState({ ...formState, destination: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Route Code</label>
                  <input
                    type="text"
                    required
                    value={formState.route_code}
                    onChange={(e) => setFormState({ ...formState, route_code: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formState.distance_km}
                    onChange={(e) => setFormState({ ...formState, distance_km: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Base Price (৳)</label>
                  <input
                    type="number"
                    value={formState.base_price}
                    onChange={(e) => setFormState({ ...formState, base_price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Estimated Journey Time</label>
                <input
                  type="text"
                  placeholder="e.g. 5h 30m"
                  value={formState.estimated_duration}
                  onChange={(e) => setFormState({ ...formState, estimated_duration: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Stops & Boarding Points (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={formState.stops}
                  onChange={(e) => setFormState({ ...formState, stops: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                />
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
                  className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingRoute ? 'Save Route' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

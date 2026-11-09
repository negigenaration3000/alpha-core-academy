import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, MapPin, Clock, Bus, Ticket } from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';

export const PopularRoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const { routes } = useBabaStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#38A5FF] text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Inter-District Highway Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Popular Bus Routes in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Compare timetables, coach categories, base fares, and intermediate counter locations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 shadow-card hover:border-[#1677FF] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[#38A5FF] bg-[#0C1730] px-2.5 py-1 rounded-lg border border-[#263B5C]">
                  {route.route_code}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {route.bus_count || 4} Daily Departures
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-lg font-black text-white my-3">
                <span>{route.origin}</span>
                <ArrowRight className="w-5 h-5 text-[#1677FF]" />
                <span>{route.destination}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs my-4">
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
                    <span className="text-[10px] text-[#94A3B8] block">Est. Duration</span>
                    <span className="font-bold text-white">{route.estimated_duration}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#94A3B8] block mb-1.5">
                  Intermediate Stops:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#17294A] text-[10px] text-[#F8FAFC] border border-[#263B5C]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#263B5C] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Fares From</span>
                <span className="text-xl font-extrabold text-[#FF991F]">৳ {route.base_price}</span>
              </div>

              <button
                onClick={() => navigate(`/search?from=${encodeURIComponent(route.origin)}&to=${encodeURIComponent(route.destination)}`)}
                className="px-4 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Search Buses</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

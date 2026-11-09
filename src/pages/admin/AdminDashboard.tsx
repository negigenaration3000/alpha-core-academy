import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Compass,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Ticket,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Schedule } from '../../types/bus';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, store, buses, routes, drivers, schedules, bookings } = useBabaStore();
  const { showToast } = useToast();

  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');

  // Quick Action Modal states
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Add Bus Form State
  const [busForm, setBusForm] = useState({
    bus_name: '',
    reg_no: '',
    operator: 'Baba Express Transport',
    bus_type: 'AC Coach' as const,
    seat_capacity: 40,
    layout_type: '2x2' as const,
    manufacturer: 'Hino',
    model: '1J Series',
    year: 2024,
    status: 'available' as const,
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    amenities: ['Air Conditioning', 'Mineral Water', 'Charging Ports'],
  });

  // Add Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    route_id: routes[0]?.id || '',
    bus_id: buses[0]?.id || '',
    driver_id: drivers[0]?.id || '',
    departure_date: new Date().toISOString().split('T')[0],
    departure_time: '10:00 AM',
    arrival_time: '03:30 PM',
    price: 950,
  });

  // New Booking Form State
  const [bookingForm, setBookingForm] = useState({
    schedule_id: schedules[0]?.id || '',
    passenger_name: '',
    passenger_phone: '',
    seats: ['A3'],
    boarding_point: 'Sayedabad Terminal',
    dropping_point: 'Dampara Bus Stand',
    payment_method: 'counter_cash' as const,
  });

  const chartData = store.getBookingTrends(timeRange);

  const busStatusData = [
    { name: 'On Trip', value: stats.onTripBuses, color: '#1677FF' },
    { name: 'Available', value: stats.availableBuses, color: '#10B981' },
    { name: 'Maintenance', value: stats.maintenanceBuses, color: '#FF991F' },
  ];

  const handleAddBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busForm.bus_name || !busForm.reg_no) {
      showToast('Validation Error', 'Please enter bus name and registration number', 'error');
      return;
    }
    store.addBus(busForm);
    setIsAddBusOpen(false);
    showToast('Bus Added', `${busForm.bus_name} successfully registered to fleet`, 'success');
  };

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoute = routes.find((r) => r.id === scheduleForm.route_id) || routes[0];
    const selBus = buses.find((b) => b.id === scheduleForm.bus_id) || buses[0];
    const selDriver = drivers.find((d) => d.id === scheduleForm.driver_id) || drivers[0];

    try {
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
        departure_date: scheduleForm.departure_date,
        departure_time: scheduleForm.departure_time,
        arrival_time: scheduleForm.arrival_time,
        estimated_duration: selRoute.estimated_duration,
        price: scheduleForm.price,
        available_seats: selBus.seat_capacity,
        total_seats: selBus.seat_capacity,
        status: 'scheduled',
        boarding_points: ['Sayedabad Counter', 'Arambagh', 'Chittagong Road'],
        dropping_points: ['Dampara Bus Stand', 'GEC Circle', 'Agrabad'],
      });
      setIsAddScheduleOpen(false);
      showToast('Schedule Created', `Trip ${selRoute.origin} → ${selRoute.destination} added successfully`, 'success');
    } catch (err: any) {
      showToast('Schedule Conflict', err.message || 'Error creating schedule', 'error');
    }
  };

  const handleNewBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.passenger_name || !bookingForm.passenger_phone) {
      showToast('Validation Error', 'Please enter passenger name and phone number', 'error');
      return;
    }
    try {
      const bkg = store.createBooking({
        schedule_id: bookingForm.schedule_id,
        passenger_name: bookingForm.passenger_name,
        passenger_phone: bookingForm.passenger_phone,
        seats: bookingForm.seats,
        boarding_point: bookingForm.boarding_point,
        dropping_point: bookingForm.dropping_point,
        payment_method: bookingForm.payment_method,
      });
      setIsNewBookingOpen(false);
      showToast('Booking Confirmed', `Ticket #${bkg.booking_reference} confirmed for ${bkg.passenger_name}`, 'success');
    } catch (err: any) {
      showToast('Booking Failed', err.message || 'Error creating booking', 'error');
    }
  };

  // Sparkline data components for stat cards
  const renderSparkline = (color: string, points: number[]) => {
    const data = points.map((val, idx) => ({ x: idx, y: val }));
    return (
      <div className="h-9 w-24 ml-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              fill={`url(#spark-${color})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Header Greeting & Scenic Banner matching Reference Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0C1730] via-[#111F3B] to-[#17294A] border border-[#263B5C] p-6 lg:p-8 shadow-card">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#1677FF]/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Good Morning, Admin <span className="text-2xl sm:text-3xl">👋</span>
            </h1>
            <p className="text-sm text-[#94A3B8]">
              Here's what's happening with your fleet today.
            </p>
          </div>

          {/* Right Banner Artwork with Tagline matching screenshot */}
          <div className="flex items-center gap-4 bg-[#080F22]/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#263B5C]">
            <img
              src="/images/bus-bus-baba-logo.jpg"
              alt="Fleet"
              className="w-16 h-12 object-cover rounded-xl border border-[#263B5C]"
            />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-[#38A5FF] font-semibold">
                Bus Bus Baba Express
              </span>
              <span className="text-sm font-bold text-white italic tracking-wide">
                "Travel Smart Travel Better"
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Statistics Cards matching reference screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Buses Card: 48, ↑ 6% */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-[#1677FF]/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF]">
              <Bus className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ↑ {stats.busesGrowth}%
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8]">Total Buses</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                {stats.totalBuses}
              </h3>
            </div>
            {renderSparkline('#1677FF', [38, 41, 40, 44, 45, 48])}
          </div>
        </div>

        {/* Active Routes Card: 12, 0% */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-purple-400">
              0%
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8]">Active Routes</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                {stats.activeRoutes}
              </h3>
            </div>
            {renderSparkline('#A855F7', [10, 11, 12, 12, 12, 12])}
          </div>
        </div>

        {/* Today's Bookings Card: 842, ↑ 12% */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ↑ {stats.bookingsGrowth}%
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8]">Today's Bookings</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                {stats.todaysBookings.toLocaleString()}
              </h3>
            </div>
            {renderSparkline('#10B981', [650, 710, 740, 780, 810, 842])}
          </div>
        </div>

        {/* Total Revenue Card: ৳ 2,48,750, ↑ 18% */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card hover:border-[#FF991F]/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-[#FF991F]/15 border border-[#FF991F]/30 flex items-center justify-center text-[#FF991F]">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ↑ {stats.revenueGrowth}%
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8]">Total Revenue</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                ৳ {stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            {renderSparkline('#FF991F', [180, 200, 215, 230, 240, 248])}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Booking Overview (Area Chart) + Bus Status (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Overview Area Chart (8 Columns) */}
        <div className="lg:col-span-8 bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#1677FF]/15 text-[#38A5FF]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Booking Overview</h3>
                <p className="text-xs text-[#94A3B8]">Passenger volume trends over selected period</p>
              </div>
            </div>

            {/* Time Filter Tabs matching screenshot */}
            <div className="flex items-center bg-[#0C1730] p-1 rounded-xl border border-[#263B5C] self-start sm:self-auto">
              {(['7D', '30D', '3M', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    timeRange === period
                      ? 'bg-[#1677FF] text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart with Electric Blue Monotone Curve */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677FF" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#1677FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#263B5C"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#263B5C' }}
                />
                <YAxis
                  stroke="#263B5C"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#263B5C' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0C1730] border border-[#263B5C] p-3 rounded-xl shadow-2xl">
                          <p className="text-xs font-bold text-white">{data.bookings} Bookings</p>
                          <p className="text-[11px] text-[#38A5FF]">{data.label}, 2026</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1677FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#bookingGlow)"
                  activeDot={{ r: 6, fill: '#38A5FF', stroke: '#F8FAFC', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bus Status Donut Chart (4 Columns) matching screenshot */}
        <div className="lg:col-span-4 bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-[#38A5FF]" />
              <h3 className="text-base font-bold text-white">Bus Status</h3>
            </div>
            <button
              onClick={() => navigate('/admin/buses')}
              className="text-xs font-semibold text-[#38A5FF] hover:text-white flex items-center gap-1 group"
            >
              View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Donut Chart with Centered Total Count */}
          <div className="relative h-48 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={busStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {busStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label: "48 Total" */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{stats.totalBuses}</span>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total</span>
            </div>
          </div>

          {/* Status Breakdown Legend */}
          <div className="space-y-2.5 pt-2 border-t border-[#263B5C]/60">
            {busStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#94A3B8] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Upcoming Trips | Recent Bookings | Quick Actions (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips Card matching screenshot */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#38A5FF]" />
              <h3 className="text-sm font-bold text-white">Upcoming Trips</h3>
            </div>
            <button
              onClick={() => navigate('/admin/schedules')}
              className="text-xs font-semibold text-[#38A5FF] hover:text-white flex items-center gap-1 group"
            >
              View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {schedules.slice(0, 3).map((trip) => {
              const isOnTime = trip.status === 'scheduled';
              return (
                <div
                  key={trip.id}
                  className="p-3 rounded-xl bg-[#0C1730] border border-[#263B5C] flex items-center justify-between hover:border-[#1677FF]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/bus-bus-baba-logo.jpg"
                      alt="Bus"
                      className="w-10 h-10 object-cover rounded-lg border border-[#263B5C]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {trip.origin} → {trip.destination}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {trip.departure_time} • {trip.bus_type}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                      isOnTime
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isOnTime ? 'On Time' : 'Delayed'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings Card matching screenshot */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#38A5FF]" />
              <h3 className="text-sm font-bold text-white">Recent Bookings</h3>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-xs font-semibold text-[#38A5FF] hover:text-white flex items-center gap-1 group"
            >
              View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {bookings.slice(0, 3).map((bkg, index) => {
              const initials = bkg.passenger_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('');
              const avatarColors = ['bg-purple-600', 'bg-indigo-600', 'bg-blue-600'];
              const colorClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={bkg.id}
                  className="p-3 rounded-xl bg-[#0C1730] border border-[#263B5C] flex items-center justify-between hover:border-[#1677FF]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center font-bold text-white text-xs shrink-0`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{bkg.passenger_name}</h4>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">{bkg.route_title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      ৳ {bkg.total_amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {index === 0 ? '2m ago' : index === 1 ? '5m ago' : '8m ago'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Card matching screenshot */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#FF991F] font-bold">⚡</span>
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Add Bus */}
            <button
              onClick={() => setIsAddBusOpen(true)}
              className="p-4 rounded-xl bg-[#0C1730] border border-[#263B5C] hover:bg-[#17294A] hover:border-[#1677FF] flex flex-col items-center justify-center gap-2 text-center transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF] group-hover:scale-110 transition-transform">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#38A5FF]">Add Bus</span>
            </button>

            {/* Create Schedule */}
            <button
              onClick={() => setIsAddScheduleOpen(true)}
              className="p-4 rounded-xl bg-[#0C1730] border border-[#263B5C] hover:bg-[#17294A] hover:border-[#FF991F] flex flex-col items-center justify-center gap-2 text-center transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF991F]/15 border border-[#FF991F]/30 flex items-center justify-center text-[#FF991F] group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#FF991F]">Create Schedule</span>
            </button>

            {/* New Booking */}
            <button
              onClick={() => setIsNewBookingOpen(true)}
              className="p-4 rounded-xl bg-[#0C1730] border border-[#263B5C] hover:bg-[#17294A] hover:border-emerald-500 flex flex-col items-center justify-center gap-2 text-center transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400">New Booking</span>
            </button>

            {/* View Reports */}
            <button
              onClick={() => navigate('/admin/reports')}
              className="p-4 rounded-xl bg-[#0C1730] border border-[#263B5C] hover:bg-[#17294A] hover:border-purple-500 flex flex-col items-center justify-center gap-2 text-center transition-all group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-purple-400">View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTION MODALS */}
      {/* ========================================================================= */}

      {/* 1. ADD BUS MODAL */}
      {isAddBusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddBusOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Bus className="w-5 h-5 text-[#1677FF]" />
                <h3 className="text-base font-bold text-white">Add New Bus to Fleet</h3>
              </div>
              <button onClick={() => setIsAddBusOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Bus Name / Nickname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baba Royal Blue 07"
                  value={busForm.bus_name}
                  onChange={(e) => setBusForm({ ...busForm, bus_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">BRTA Registration No</label>
                  <input
                    type="text"
                    required
                    placeholder="DHAKA METRO-BA 14-8899"
                    value={busForm.reg_no}
                    onChange={(e) => setBusForm({ ...busForm, reg_no: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Bus Type</label>
                  <select
                    value={busForm.bus_type}
                    onChange={(e) => setBusForm({ ...busForm, bus_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="AC Coach">AC Coach</option>
                    <option value="Non-AC Coach">Non-AC Coach</option>
                    <option value="Business Class">Business Class</option>
                    <option value="Sleeper Coach">Sleeper Coach</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    value={busForm.seat_capacity}
                    onChange={(e) => setBusForm({ ...busForm, seat_capacity: parseInt(e.target.value) || 40 })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Chassis / Manufacturer</label>
                  <input
                    type="text"
                    value={busForm.manufacturer}
                    onChange={(e) => setBusForm({ ...busForm, manufacturer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsAddBusOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE SCHEDULE MODAL */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddScheduleOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#FF991F]" />
                <h3 className="text-base font-bold text-white">Create New Trip Schedule</h3>
              </div>
              <button onClick={() => setIsAddScheduleOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Select Route</label>
                <select
                  value={scheduleForm.route_id}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, route_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF991F]"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} ({r.distance_km} km, ৳{r.base_price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Assign Bus</label>
                  <select
                    value={scheduleForm.bus_id}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, bus_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bus_name} ({b.bus_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Assign Driver</label>
                  <select
                    value={scheduleForm.driver_id}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, driver_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF991F]"
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
                    value={scheduleForm.departure_time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, departure_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Ticket Fare (৳)</label>
                  <input
                    type="number"
                    required
                    value={scheduleForm.price}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, price: parseInt(e.target.value) || 900 })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263B5C]">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. NEW BOOKING MODAL */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsNewBookingOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Manual Counter Booking</h3>
              </div>
              <button onClick={() => setIsNewBookingOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewBookingSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Select Schedule</label>
                <select
                  value={bookingForm.schedule_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, schedule_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.origin} → {s.destination} ({s.departure_time}) - {s.bus_name} (৳{s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Passenger Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamal Hossain"
                    value={bookingForm.passenger_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, passenger_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1711-XXXXXX"
                    value={bookingForm.passenger_phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, passenger_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Seats (comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="A3, A4"
                    value={bookingForm.seats.join(', ')}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        seats: e.target.value.split(',').map((s) => s.trim().toUpperCase()),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Payment Method</label>
                  <select
                    value={bookingForm.payment_method}
                    onChange={(e) => setBookingForm({ ...bookingForm, payment_method: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
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
                  onClick={() => setIsNewBookingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Confirm & Print Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

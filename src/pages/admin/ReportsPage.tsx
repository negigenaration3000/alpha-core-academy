import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  Bus,
  Compass,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';

export const ReportsPage: React.FC = () => {
  const { stats, bookings, routes, buses, expenses } = useBabaStore();
  const { showToast } = useToast();

  const [dateFilter, setDateFilter] = useState<'month' | 'quarter' | 'year'>('month');

  const totalRevenue = stats.totalRevenue;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netMargin = totalRevenue - totalExpenses;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;

  // Route revenue analytics data
  const routePerformanceData = routes.map((r) => {
    const routeBookings = bookings.filter((b) => b.route_id === r.id);
    const revenue = routeBookings.reduce((sum, b) => sum + b.total_amount, 0) + (r.base_price * 45); // Benchmark baseline
    return {
      name: `${r.origin.substring(0, 3)}-${r.destination.substring(0, 3)}`,
      fullRoute: `${r.origin} → ${r.destination}`,
      revenue,
      trips: routeBookings.length + 18,
    };
  }).slice(0, 6);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['BookingReference', 'PassengerName', 'PassengerPhone', 'Route', 'Seats', 'FareBDT', 'PaymentMethod', 'Status', 'Date'];
    const rows = bookings.map((b) => [
      b.booking_reference,
      `"${b.passenger_name}"`,
      b.passenger_phone,
      `"${b.route_title}"`,
      `"${b.seats.join(';')}"`,
      b.total_amount,
      b.payment_method,
      b.booking_status,
      b.departure_date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bus_bus_baba_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'CSV statement downloaded successfully', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Executive Reports & Analytics
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Operational P&L statements, route profitability, fleet utilization, and downloadable statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#111F3B] hover:bg-[#17294A] border border-[#263B5C] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#94A3B8]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* P&L Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Gross Fare Inflow</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            ৳ {totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +18% vs last month
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Operational Expenditure</span>
          <span className="text-2xl font-extrabold text-[#FF991F] mt-1 block">
            ৳ {totalExpenses.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#94A3B8] mt-1 block">Fuel, Tolls, Salaries, Parts</span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Estimated Net Profit Margin</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
            ৳ {netMargin.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
            {profitMarginPercent}% Operating Margin
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-5 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Fleet Load Factor</span>
          <span className="text-2xl font-extrabold text-[#38A5FF] mt-1 block">
            87.4%
          </span>
          <span className="text-[11px] text-[#94A3B8] mt-1 block">Average seat fill rate</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Profitability Bar Chart */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Route Yield Performance</h3>
              <p className="text-xs text-[#94A3B8]">Gross ticket revenue generated per highway corridor</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#38A5FF]">BDT (৳)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routePerformanceData}>
                <XAxis dataKey="name" stroke="#263B5C" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#263B5C" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0C1730] border border-[#263B5C] p-3 rounded-xl shadow-2xl">
                          <p className="text-xs font-bold text-white">{data.fullRoute}</p>
                          <p className="text-xs text-emerald-400 font-bold mt-1">
                            ৳ {data.revenue.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#94A3B8]">{data.trips} Trips Executed</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#1677FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bus Fleet Utilization Matrix */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Fleet Operational Efficiency</h3>
            <p className="text-xs text-[#94A3B8] mb-4">Availability, down time, and passenger utilization metrics</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Scania Multiaxle Fleet</span>
                  <span className="text-[#38A5FF] font-bold">94% Active</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0C1730] overflow-hidden">
                  <div className="h-full bg-[#1677FF] rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Hyundai Universe Suite</span>
                  <span className="text-[#10B981] font-bold">89% Active</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0C1730] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: '89%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Hino 1J Air Suspension</span>
                  <span className="text-[#FF991F] font-bold">81% Active</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0C1730] overflow-hidden">
                  <div className="h-full bg-[#FF991F] rounded-full" style={{ width: '81%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Volvo Sleeper Berths</span>
                  <span className="text-purple-400 font-bold">98% Active</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0C1730] overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#263B5C] mt-6 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Average turnaround: 45 mins</span>
            <span className="text-white font-bold">Zero Safety Incidents</span>
          </div>
        </div>
      </div>
    </div>
  );
};

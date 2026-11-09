import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Fuel,
  Wrench,
  UserCheck,
  ShieldAlert,
  Coffee,
  X,
  Trash2,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Expense, ExpenseCategory } from '../../types/bus';

export const ExpensesPage: React.FC = () => {
  const { expenses, buses, drivers, store } = useBabaStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    category: 'fuel' as ExpenseCategory,
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    bus_id: buses[0]?.id || '',
    driver_name: drivers[0]?.name || '',
    receipt_no: 'RCP-2026-',
    description: '',
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.description || formState.amount <= 0) {
      showToast('Validation Error', 'Please specify an expense description and valid amount', 'error');
      return;
    }
    const selBus = buses.find((b) => b.id === formState.bus_id);

    store.addExpense({
      ...formState,
      bus_name: selBus?.bus_name,
    });

    setIsModalOpen(false);
    showToast('Expense Recorded', `৳${formState.amount.toLocaleString()} logged under ${formState.category.replace('_', ' ')}`, 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense record?')) {
      store.deleteExpense(id);
      showToast('Expense Deleted', 'Record deleted', 'info');
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      exp.description.toLowerCase().includes(q) ||
      (exp.receipt_no && exp.receipt_no.toLowerCase().includes(q)) ||
      (exp.bus_name && exp.bus_name.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenseAmount = expenses.filter((e) => e.category === 'fuel').reduce((sum, e) => sum + e.amount, 0);
  const maintenanceExpenseAmount = expenses.filter((e) => e.category === 'maintenance').reduce((sum, e) => sum + e.amount, 0);
  const salaryExpenseAmount = expenses.filter((e) => e.category === 'driver_salary').reduce((sum, e) => sum + e.amount, 0);

  const getCategoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'fuel':
        return <Fuel className="w-4 h-4 text-[#FF991F]" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-red-400" />;
      case 'driver_salary':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'toll_fee':
        return <ShieldAlert className="w-4 h-4 text-[#38A5FF]" />;
      default:
        return <Coffee className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-[#FF991F]" />
            Operational Expense Tracking
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Track octane & diesel fueling, highway tolls, workshop repairs, and pilot trip allowances.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-[#94A3B8] block">Total Operational Costs</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {totalExpenseAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-[#FF991F] block flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5" /> Fuel & Refill
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {fuelExpenseAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-red-400 block flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" /> Maintenance & Parts
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {maintenanceExpenseAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card">
          <span className="text-xs text-purple-400 block flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Pilot Salaries & Allowances
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            ৳ {salaryExpenseAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by expense description, receipt voucher, or coach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#FF991F]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F] w-full md:w-auto"
        >
          <option value="all">All Categories</option>
          <option value="fuel">Fuel & Gas</option>
          <option value="toll_fee">Highway Tolls</option>
          <option value="maintenance">Maintenance</option>
          <option value="driver_salary">Driver Salaries</option>
          <option value="refreshment">Passenger Refreshments</option>
        </select>
      </div>

      {/* Expense Records Table */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1730] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#263B5C]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Description</th>
                <th className="py-3.5 px-4 font-bold">Coach / Driver</th>
                <th className="py-3.5 px-4 font-bold">Voucher / Receipt</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Amount (BDT)</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B5C]/60 text-white">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#17294A]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-bold capitalize text-white">
                      {getCategoryIcon(exp.category)}
                      <span>{exp.category.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {exp.bus_name || exp.driver_name || 'Fleet General'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#38A5FF]">
                    {exp.receipt_no || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {exp.date}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">
                    ৳ {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#0C1730] rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#FF991F]" />
                <h3 className="text-base font-bold text-white">Log Operational Expense</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Expense Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    <option value="fuel">Fuel (Diesel / Octane)</option>
                    <option value="toll_fee">Highway Tolls (Meghna, Padma)</option>
                    <option value="maintenance">Maintenance & Parts</option>
                    <option value="driver_salary">Driver Salary & Allowance</option>
                    <option value="refreshment">Passenger Refreshments</option>
                    <option value="terminal_fee">Terminal Gate Fees</option>
                    <option value="other">Other Operational Costs</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Amount (BDT ৳)</label>
                  <input
                    type="number"
                    required
                    value={formState.amount}
                    onChange={(e) => setFormState({ ...formState, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Related Coach</label>
                  <select
                    value={formState.bus_id}
                    onChange={(e) => setFormState({ ...formState, bus_id: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  >
                    <option value="">General Fleet Cost</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bus_name} ({b.reg_no})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Voucher / Receipt No</label>
                  <input
                    type="text"
                    placeholder="RCP-1049"
                    value={formState.receipt_no}
                    onChange={(e) => setFormState({ ...formState, receipt_no: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 120 liters refueling at Padma filling station..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#FF991F]"
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
                  className="px-5 py-2 bg-[#FF991F] hover:bg-[#E68512] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

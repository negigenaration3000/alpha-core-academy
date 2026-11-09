import React, { useState } from 'react';
import {
  Settings,
  Building,
  DollarSign,
  Shield,
  RotateCcw,
  Save,
  Check,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/bus';

export const SettingsPage: React.FC = () => {
  const { settings, store } = useBabaStore();
  const { user, switchRole } = useAuth();
  const { showToast } = useToast();

  const [formState, setFormState] = useState({
    name: settings.name,
    tagline: settings.tagline,
    hotline: settings.hotline,
    support_email: settings.support_email,
    address: settings.address,
    currency: settings.currency,
    currency_symbol: settings.currency_symbol,
    timezone: settings.timezone,
    cancellation_fee_percentage: settings.cancellation_fee_percentage,
    counter_booking_enabled: settings.counter_booking_enabled,
    online_booking_enabled: settings.online_booking_enabled,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(formState);
    showToast('Settings Saved', 'Company configurations updated successfully', 'success');
  };

  const handleResetData = () => {
    if (confirm('Reset all demo data back to default? All local changes will be replaced with original benchmark values.')) {
      store.resetToDefault();
      setFormState({
        name: store.getSettings().name,
        tagline: store.getSettings().tagline,
        hotline: store.getSettings().hotline,
        support_email: store.getSettings().support_email,
        address: store.getSettings().address,
        currency: store.getSettings().currency,
        currency_symbol: store.getSettings().currency_symbol,
        timezone: store.getSettings().timezone,
        cancellation_fee_percentage: store.getSettings().cancellation_fee_percentage,
        counter_booking_enabled: store.getSettings().counter_booking_enabled,
        online_booking_enabled: store.getSettings().online_booking_enabled,
      });
      showToast('Data Reset', 'All fleet records restored to initial demo state', 'success');
    }
  };

  const permissionsList = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Full root access to all organizations, fleet, users, and financials' },
    { role: 'company_admin', label: 'Company Admin', desc: 'Manage company fleet, routes, drivers, and operational rules' },
    { role: 'manager', label: 'Fleet Manager', desc: 'Schedule departures, assign pilots, monitor delays and maintenance' },
    { role: 'booking_agent', label: 'Booking Agent', desc: 'Create counter bookings, issue printed tickets, hold seats' },
    { role: 'accountant', label: 'Accountant', desc: 'View revenue statements, log fuel & toll expenses, settle refunds' },
    { role: 'driver', label: 'Highway Pilot', desc: 'View assigned journeys, passenger manifests, and route stops' },
    { role: 'passenger', label: 'Passenger', desc: 'Search routes, live seat selection, online payment, view E-tickets' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#1677FF]" />
            Platform & Operational Settings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure company branding, Bangladesh currency/timezone, cancellation policies, and user roles.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#111F3B] hover:bg-[#17294A] border border-[#FF991F]/40 text-[#FF991F] text-xs font-bold rounded-xl transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#263B5C]">
            <Building className="w-5 h-5 text-[#38A5FF]" />
            <h3 className="text-base font-bold text-white">Company Identity & Registration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formState.tagline}
                onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Customer Helpline / Hotline</label>
              <input
                type="text"
                value={formState.hotline}
                onChange={(e) => setFormState({ ...formState, hotline: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Support Email</label>
              <input
                type="email"
                value={formState.support_email}
                onChange={(e) => setFormState({ ...formState, support_email: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Headquarters Address</label>
            <input
              type="text"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
            />
          </div>
        </div>

        {/* Regional & Financial Settings Card */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#263B5C]">
            <Globe className="w-5 h-5 text-[#10B981]" />
            <h3 className="text-base font-bold text-white">Localization & Ticketing Policies</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Currency Code</label>
              <input
                type="text"
                value={formState.currency}
                onChange={(e) => setFormState({ ...formState, currency: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formState.currency_symbol}
                onChange={(e) => setFormState({ ...formState, currency_symbol: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Timezone</label>
              <input
                type="text"
                value={formState.timezone}
                onChange={(e) => setFormState({ ...formState, timezone: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Cancellation Deduction (%)</label>
              <input
                type="number"
                value={formState.cancellation_fee_percentage}
                onChange={(e) => setFormState({ ...formState, cancellation_fee_percentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                <input
                  type="checkbox"
                  checked={formState.online_booking_enabled}
                  onChange={(e) => setFormState({ ...formState, online_booking_enabled: e.target.checked })}
                  className="rounded bg-[#0C1730] border-[#263B5C] text-[#1677FF] focus:ring-0 w-4 h-4"
                />
                <span>Enable Public Online Ticket Booking Engine</span>
              </label>
            </div>
          </div>
        </div>

        {/* Role Permissions Matrix */}
        <div className="bg-[#111F3B] border border-[#263B5C] rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#263B5C]">
            <Shield className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
          </div>

          <div className="space-y-2.5">
            {permissionsList.map((p) => {
              const isCurrent = user?.role === p.role;
              return (
                <div
                  key={p.role}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#1677FF]/15 border-[#1677FF] text-white'
                      : 'bg-[#0C1730] border-[#263B5C] text-[#94A3B8]'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white">{p.label}</span>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{p.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchRole(p.role as UserRole)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#1677FF] text-white'
                        : 'bg-[#17294A] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {isCurrent ? 'Active Persona' : 'Switch Role'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

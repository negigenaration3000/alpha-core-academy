import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  UserCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserRole } from '../../types/bus';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@busbusbaba.com');
  const [password, setPassword] = useState('baba@2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    showToast('Welcome back!', `Logged in as ${selectedRole.replace('_', ' ').toUpperCase()}`, 'success');

    if (selectedRole === 'passenger') {
      navigate('/my-bookings');
    } else {
      navigate('/admin');
    }
  };

  const handleQuickPersona = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setEmail(user.email);
      setSelectedRole(role);
      login(user.email, role);
      showToast('Switched Persona', `Active login: ${user.name} (${role.replace('_', ' ')})`, 'info');
      if (role === 'passenger') navigate('/my-bookings');
      else navigate('/admin');
    }
  };

  const personaList: { role: UserRole; title: string; subtitle: string; color: string }[] = [
    { role: 'super_admin', title: 'Admin', subtitle: 'Platform Super Admin', color: 'border-[#1677FF] text-[#38A5FF]' },
    { role: 'company_admin', title: 'M. A. Malek', subtitle: 'Transport Director', color: 'border-[#10B981] text-[#10B981]' },
    { role: 'manager', title: 'Kabir Hossain', subtitle: 'Fleet & Schedule Manager', color: 'border-[#FF991F] text-[#FF991F]' },
    { role: 'booking_agent', title: 'Shakil Ahmed', subtitle: 'Counter Ticketing Agent', color: 'border-cyan-400 text-cyan-400' },
    { role: 'accountant', title: 'Fatema Begum', subtitle: 'Accounts & Finance', color: 'border-purple-400 text-purple-400' },
    { role: 'driver', title: 'Rafiqul Islam', subtitle: 'Senior Highway Pilot', color: 'border-amber-400 text-amber-400' },
    { role: 'passenger', title: 'Md. Rahman', subtitle: 'Verified Passenger', color: 'border-blue-400 text-blue-400' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Login Form (6 Cols) */}
        <div className="lg:col-span-6 bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <img src="/images/bus-bus-baba-logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-[#263B5C]" />
            <div>
              <h2 className="text-xl font-black text-white">Sign In to Platform</h2>
              <span className="text-[11px] text-[#94A3B8]">Bus Bus Baba Cloud Transportation</span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#94A3B8] block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#94A3B8] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#94A3B8] block mb-1">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              >
                <option value="super_admin">Super Admin (All Access)</option>
                <option value="company_admin">Company Admin (Baba Express)</option>
                <option value="manager">Fleet Manager</option>
                <option value="booking_agent">Counter Booking Agent</option>
                <option value="accountant">Accountant</option>
                <option value="driver">Highway Driver</option>
                <option value="passenger">Passenger</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Instant Role Switcher Persona Cards (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF991F]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1-Click Demo Personas
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] -mt-2">
            Select any role persona to immediately test authentication, permissions, and operator workflows:
          </p>

          <div className="space-y-2">
            {personaList.map((p) => (
              <div
                key={p.role}
                onClick={() => handleQuickPersona(p.role)}
                className="p-3 rounded-2xl bg-[#111F3B] border border-[#263B5C] hover:border-[#1677FF] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#38A5FF]">
                      {p.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#0C1730] ${p.color}`}>
                      {p.role.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">{p.subtitle}</span>
                </div>

                <span className="text-xs font-semibold text-[#1677FF] group-hover:translate-x-1 transition-transform">
                  Launch →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

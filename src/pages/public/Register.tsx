import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+880 17');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 11) {
      showToast('Validation Error', 'Please enter your full name and valid Bangladesh mobile number', 'error');
      return;
    }

    login(email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`, 'passenger');
    showToast('Account Created', 'Welcome to Bus Bus Baba!', 'success');
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <img src="/images/bus-bus-baba-logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-[#263B5C]" />
          <div>
            <h2 className="text-xl font-black text-white">Create Passenger Account</h2>
            <span className="text-[11px] text-[#94A3B8]">Save bookings, print tickets, and earn rewards</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#94A3B8] block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Asif Mahmud"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#94A3B8] block mb-1">Mobile Phone (+880) *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#94A3B8] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="asif@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#94A3B8] block mb-1">Set Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Register & Start Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#94A3B8] pt-2 border-t border-[#263B5C]">
          Already have an account?{' '}
          <NavLink to="/login" className="text-[#38A5FF] font-bold hover:underline">
            Sign In here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(name, email, password, phone);
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#DFC27D] shadow-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-dark text-gold flex items-center justify-center mx-auto border-2 border-gold shadow-gold-sm">
            <img src="/shield-helmet.svg" alt="Alpha Core Crest" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider text-dark">
            CADET REGISTRATION
          </h1>
          <p className="text-xs text-spartan-muted">
            Create your account to unlock lifetime curriculum access and track orders.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase font-heading font-bold text-dark mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spartan Warrior"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase font-heading font-bold text-dark mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="spartan@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase font-heading font-bold text-dark mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01844221100"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase font-heading font-bold text-dark mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-xs uppercase tracking-widest transition shadow-gold-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Cadet Enrollment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-spartan-muted">
          Already registered?{' '}
          <Link to="/login" className="text-gold font-bold uppercase hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

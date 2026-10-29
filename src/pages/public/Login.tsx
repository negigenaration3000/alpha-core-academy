import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('sohel')) {
          navigate('/admin');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@alpha-core.academy');
    setPassword('spartan1234');
  };

  const handleQuickStudent = () => {
    setEmail('cadet@alpha-core.academy');
    setPassword('cadet1234');
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#DFC27D] shadow-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-dark text-gold flex items-center justify-center mx-auto border-2 border-gold shadow-gold-sm">
            <img src="/shield-helmet.svg" alt="Alpha Core Crest" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider text-dark">
            ACADEMY PORTAL LOGIN
          </h1>
          <p className="text-xs text-spartan-muted">
            Enter your credentials to access your courses and administrative controls.
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
              Email Address / Spartan Handle
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@alpha-core.academy"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block uppercase font-heading font-bold text-dark mb-1">
              Secret Password
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
            <span>{loading ? 'Authenticating...' : 'Sign In To War-Room'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="bg-ivory rounded-xl p-4 border border-[#DFC27D]/40 space-y-2 text-xs">
          <span className="font-heading font-bold uppercase text-spartan-muted text-[10px] block">
            Quick Demo Autofill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="flex-1 py-1.5 px-2 bg-dark text-gold rounded font-heading text-[11px] uppercase font-bold hover:bg-black transition"
            >
              Autofill Admin
            </button>
            <button
              type="button"
              onClick={handleQuickStudent}
              className="flex-1 py-1.5 px-2 bg-white text-dark border border-gray-300 rounded font-heading text-[11px] uppercase font-bold hover:bg-gray-100 transition"
            >
              Autofill Student
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-spartan-muted">
          New cadet?{' '}
          <Link to="/register" className="text-gold font-bold uppercase hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};

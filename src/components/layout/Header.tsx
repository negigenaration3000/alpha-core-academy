import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Instagram, Facebook, Youtube, Shield, User, Menu, X, ShieldAlert, LogOut } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { store } from '../../services/store';
import { SocialLink } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSocialLinks(store.getSocialLinks().filter((s) => s.is_active));
    const unsubscribe = store.subscribe(() => {
      setSocialLinks(store.getSocialLinks().filter((s) => s.is_active));
    });
    return unsubscribe;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-spartan-muted hover:text-gold transition-colors" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-spartan-muted hover:text-gold transition-colors" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-spartan-muted hover:text-gold transition-colors" />;
      default:
        return <span className="text-xs uppercase font-bold text-spartan-muted hover:text-gold">{platform.substring(0, 2)}</span>;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-[#DFC27D]/40 backdrop-blur-md">
      {/* Dev Role Quick Toggle Banner */}
      <div className="bg-dark text-gold-light text-xs py-1 px-4 flex items-center justify-between border-b border-dark-border">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-medium tracking-wide">ALPHA-CORE ACADEMY PLATFORM</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-400 hidden sm:inline">Role View:</span>
          <button
            onClick={() => switchRole('admin')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider transition ${
              isAdmin ? 'bg-gold text-dark' : 'bg-dark-surface text-gray-300 hover:text-white'
            }`}
          >
            Admin Mode
          </button>
          <button
            onClick={() => switchRole('student')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider transition ${
              !isAdmin && isAuthenticated ? 'bg-gold text-dark' : 'bg-dark-surface text-gray-300 hover:text-white'
            }`}
          >
            Student Mode
          </button>
          {isAdmin && (
            <Link to="/admin" className="text-gold font-bold hover:underline flex items-center gap-1 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              Open Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Academy Shield Logo & Name */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 flex items-center justify-center rounded-lg bg-dark p-1.5 border border-gold shadow-gold-sm transition transform group-hover:scale-105">
              <img src="/shield-helmet.svg" alt="Alpha Core Academy Crest" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-spartan font-black text-lg md:text-xl text-dark tracking-wider leading-none">
                ALPHA-CORE
              </span>
              <span className="font-heading text-xs tracking-[0.2em] text-gold font-bold leading-tight">
                ACADEMY
              </span>
            </div>
          </Link>

          {/* Search Input beside Logo (matching reference layout) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative ml-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FIND YOUR HIGH-VALUE COURSE..."
                className="w-72 lg:w-96 pl-4 pr-11 py-2 rounded bg-dark text-white placeholder-gray-400 text-xs font-semibold tracking-wider border border-dark-border focus:border-gold focus:outline-none transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-9 bg-gold hover:bg-gold-light text-dark rounded flex items-center justify-center transition"
                title="Search courses"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Section: Auth, Social, Cart */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs font-bold tracking-wider uppercase text-spartan-text">
            <Link to="/courses" className="hover:text-gold transition">Courses</Link>
            <Link to="/track-order" className="hover:text-gold transition">Track Order</Link>
          </nav>

          {/* Social Icons */}
          <div className="hidden sm:flex items-center space-x-2.5 border-l border-r border-[#DFC27D]/50 px-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:scale-110 transition"
                title={link.label}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={isAdmin ? '/admin' : '/student/dashboard'}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-dark text-gold font-heading text-xs tracking-wider uppercase hover:bg-black transition border border-gold/40"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-spartan-muted hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-spartan-text hover:text-gold transition px-2 py-1"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-light text-dark px-4 py-2 rounded shadow-gold-sm transition transform hover:-translate-y-0.5"
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Shopping Cart Icon with Badge */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg bg-dark text-gold hover:text-white transition flex items-center justify-center border border-gold/30 shadow-sm"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-dark text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-dark hover:text-gold transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-b border-gold/40 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-3 pr-10 py-2 rounded bg-dark text-white text-xs placeholder-gray-400 border border-dark-border"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 w-8 bg-gold text-dark rounded flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-bold uppercase tracking-wider text-dark">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Homepage</Link>
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">All Courses</Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Track Order</Link>
            {isAdmin ? (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gold font-bold">Admin Command Center</Link>
            ) : isAuthenticated ? (
              <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gold">Student Dashboard</Link>
            ) : (
              <div className="pt-2 flex items-center space-x-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 border border-dark rounded text-xs">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 bg-gold text-dark rounded text-xs">Register</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

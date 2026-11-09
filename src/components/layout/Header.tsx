import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bus,
  Search,
  Ticket,
  User,
  Shield,
  Phone,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#080F22]/95 backdrop-blur-md border-b border-[#263B5C]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src="/images/bus-bus-baba-logo.jpg"
            alt="Bus Bus Baba"
            className="w-10 h-10 object-contain rounded-xl border border-[#263B5C] shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-white">Bus Bus</span>
              <span className="text-xl font-black tracking-tight text-[#1677FF] ml-1.5">Baba</span>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium tracking-wider uppercase -mt-0.5">
              Manage • Operate • Travel
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#94A3B8]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            Search Buses
          </NavLink>
          <NavLink
            to="/routes"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            Popular Routes
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-[#38A5FF] font-bold' : 'hover:text-white transition-colors'
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Operator Admin Portal Button */}
          <NavLink
            to="/admin"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111F3B] hover:bg-[#17294A] border border-[#263B5C] text-xs font-bold text-white transition-all shadow-sm group"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#38A5FF]" />
            <span>Operator Dashboard</span>
          </NavLink>

          {/* Book Now Button */}
          <NavLink
            to="/search"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0E62DD] text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-[#94A3B8] hover:text-white rounded-lg"
          aria-label="Toggle mobile menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#0C1730] border-b border-[#263B5C] px-5 py-4 space-y-3 animate-slide-up">
          <NavLink
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            Search Buses & Schedules
          </NavLink>
          <NavLink
            to="/routes"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            Popular Routes
          </NavLink>
          <NavLink
            to="/my-bookings"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            My Bookings & E-Tickets
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            About Bus Bus Baba
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold text-white py-1.5"
          >
            Support & Contact
          </NavLink>

          <div className="pt-3 border-t border-[#263B5C] flex flex-col gap-2">
            <NavLink
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#111F3B] border border-[#263B5C] text-xs font-bold text-white"
            >
              <LayoutDashboard className="w-4 h-4 text-[#38A5FF]" />
              <span>Operator Dashboard</span>
            </NavLink>
            <NavLink
              to="/search"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1677FF] text-xs font-bold text-white shadow-lg"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Ticket Now</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050A18] border-t border-[#263B5C] pt-14 pb-8 text-[#94A3B8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#263B5C]/60">
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/bus-bus-baba-logo.jpg"
                alt="Bus Bus Baba"
                className="w-10 h-10 object-contain rounded-xl border border-[#263B5C]"
              />
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-white">Bus Bus</span>
                  <span className="text-xl font-black text-[#1677FF] ml-1.5">Baba</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">
                  Manage • Operate • Travel
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Bus Bus Baba is Bangladesh's premier bus transportation and ticketing SaaS platform. Connecting passengers with trusted transport operators across all 64 districts with real-time seat reservation and instant confirmation.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <Phone className="w-4 h-4 text-[#FF991F]" />
                <span className="font-semibold">+880 9612-888999 (24/7 Hotline)</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#94A3B8]">
                <Mail className="w-4 h-4 text-[#38A5FF]" />
                <span>support@busbusbaba.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#94A3B8]">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                <span>Level 7, Bilkis Tower, Gulshan-2, Dhaka 1212</span>
              </div>
            </div>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Routes
            </h4>
            <ul className="space-y-2.5">
              <li>
                <NavLink to="/search?from=Dhaka&to=Chittagong" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Chittagong
                </NavLink>
              </li>
              <li>
                <NavLink to="/search?from=Dhaka&to=Cox's Bazar" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Cox's Bazar
                </NavLink>
              </li>
              <li>
                <NavLink to="/search?from=Dhaka&to=Sylhet" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Sylhet
                </NavLink>
              </li>
              <li>
                <NavLink to="/search?from=Dhaka&to=Rajshahi" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Rajshahi
                </NavLink>
              </li>
              <li>
                <NavLink to="/search?from=Dhaka&to=Khulna" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Khulna
                </NavLink>
              </li>
              <li>
                <NavLink to="/search?from=Dhaka&to=Rangpur" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-[#38A5FF] group-hover:translate-x-0.5 transition-transform" />
                  Dhaka to Rangpur
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <NavLink to="/search" className="hover:text-white transition-colors">
                  Search Bus Schedules
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-bookings" className="hover:text-white transition-colors">
                  Check Booking Status
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-bookings" className="hover:text-white transition-colors">
                  Cancel Ticket / Refund
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-white transition-colors">
                  About Bus Bus Baba
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-white transition-colors">
                  Counter Locations
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin" className="hover:text-white transition-colors text-[#38A5FF]">
                  Bus Operator SaaS Portal
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Payment Partners & Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Secure Payment
            </h4>
            <p className="text-xs text-[#94A3B8] mb-3 leading-relaxed">
              We support all certified digital payment gateways in Bangladesh.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/40 font-bold text-[11px]">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/40 font-bold text-[11px]">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold text-[11px]">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold text-[11px]">
                Visa / MC
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[11px]">
                SSLCommerz
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-Bit SSL Encrypted Booking</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Bus Bus Baba Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <NavLink to="/about" className="hover:text-white transition-colors">Privacy Policy</NavLink>
            <NavLink to="/about" className="hover:text-white transition-colors">Terms of Service</NavLink>
            <NavLink to="/contact" className="hover:text-white transition-colors">Help Center</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

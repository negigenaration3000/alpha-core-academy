import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  Compass,
  UserCheck,
  CalendarDays,
  Ticket,
  Users,
  Armchair,
  Receipt,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { unreadCount } = useBabaStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Buses', path: '/admin/buses', icon: Bus },
    { name: 'Routes', path: '/admin/routes', icon: Compass },
    { name: 'Drivers', path: '/admin/drivers', icon: UserCheck },
    { name: 'Schedules', path: '/admin/schedules', icon: CalendarDays },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Passengers', path: '/admin/passengers', icon: Users },
    { name: 'Seat Management', path: '/admin/seats', icon: Armchair },
    { name: 'Expenses', path: '/admin/expenses', icon: Receipt },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0C1730] border-r border-[#263B5C] flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo & Wordmark matching provided logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#263B5C]/60 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 group overflow-hidden">
            <img
              src="/images/bus-bus-baba-logo.jpg"
              alt="Bus Bus Baba"
              className="w-10 h-10 object-contain rounded-lg border border-[#263B5C] shadow-md group-hover:scale-105 transition-transform"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-lg font-extrabold tracking-tight text-white">Bus Bus</span>
                  <span className="text-lg font-extrabold tracking-tight text-[#1677FF] ml-1.5">Baba</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-medium tracking-wider uppercase -mt-0.5">
                  Manage • Operate • Grow
                </span>
              </div>
            )}
          </NavLink>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#17294A] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Dashboard matches exact /admin or /admin/
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1677FF] text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#17294A]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#38A5FF]'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {/* Badge if present (e.g. Notifications) */}
                {item.badge !== undefined && !isCollapsed && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-[#EF4444] text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
                {item.badge !== undefined && isCollapsed && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Public Website Quick Link */}
        <div className="px-3.5 py-2 border-t border-[#263B5C]/50">
          <NavLink
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[#38A5FF] hover:text-white hover:bg-[#17294A] rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>View Booking Portal</span>}
          </NavLink>
        </div>

        {/* Bottom Sidebar Promo Card matching reference screenshot */}
        {!isCollapsed && (
          <div className="p-3.5 pt-1">
            <div className="relative rounded-2xl overflow-hidden p-3.5 bg-gradient-to-b from-[#111F3B] to-[#0A1428] border border-[#263B5C] shadow-lg group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1677FF]/15 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <img
                  src="/images/bus-bus-baba-logo.jpg"
                  alt="Bus Bus Baba Fleet"
                  className="w-full h-20 object-cover rounded-xl mb-2.5 opacity-90 group-hover:scale-102 transition-transform"
                />
                <span className="text-xs font-bold text-white tracking-tight">On Time. Always.</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-[#94A3B8]">
                    Bus Bus <span className="text-[#FF991F] font-semibold">Baba</span>
                  </span>
                  <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#1677FF] to-[#FF991F]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

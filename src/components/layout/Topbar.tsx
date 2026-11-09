import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Shield,
  RotateCcw,
  LogOut,
  Plus,
  Ticket,
  Bus,
  Check,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBabaStore } from '../../hooks/useBabaStore';
import { UserRole } from '../../types/bus';
import { useToast } from '../../contexts/ToastContext';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, onOpenCommandPalette }) => {
  const { user, switchRole, logout } = useAuth();
  const { notifications, unreadCount, store } = useBabaStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setIsProfileMenuOpen(false);
    showToast('Role Switched', `Active persona switched to ${role.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const handleResetData = () => {
    store.resetToDefault();
    setIsProfileMenuOpen(false);
    showToast('Data Reset', 'All demo data reset to pristine reference state', 'success');
  };

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'super_admin', label: 'Super Admin' },
    { role: 'company_admin', label: 'Company Admin' },
    { role: 'manager', label: 'Fleet Manager' },
    { role: 'booking_agent', label: 'Booking Agent' },
    { role: 'accountant', label: 'Accountant' },
    { role: 'driver', label: 'Driver' },
    { role: 'passenger', label: 'Passenger' },
  ];

  return (
    <header className="h-20 bg-[#080F22]/90 backdrop-blur-md border-b border-[#263B5C]/80 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#94A3B8] hover:text-white hover:bg-[#17294A] rounded-xl transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button / Trigger matching screenshot */}
        <button
          onClick={onOpenCommandPalette}
          className="flex-1 flex items-center justify-between px-4 py-2.5 bg-[#111F3B] hover:bg-[#17294A] border border-[#263B5C] rounded-2xl text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38A5FF] transition-colors" />
            <span className="truncate">Search buses, routes, or bookings...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-[#94A3B8] bg-[#17294A] border border-[#263B5C] rounded-lg">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 lg:gap-5 ml-4">
        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/admin/bookings')}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-[#17294A] hover:bg-[#1E335C] border border-[#263B5C] text-xs font-semibold text-[#F8FAFC] rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#FF991F]" />
          <span>New Booking</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="relative p-2.5 rounded-xl bg-[#111F3B] hover:bg-[#17294A] border border-[#263B5C] text-[#94A3B8] hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#080F22] shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications menu */}
          {isNotifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-[#263B5C]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF4444] text-white rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => store.markAllNotificationsAsRead()}
                  className="text-xs text-[#38A5FF] hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => store.markNotificationAsRead(n.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-[#0C1730]/60 border-transparent text-[#94A3B8]'
                        : 'bg-[#17294A] border-[#263B5C] text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{n.title}</span>
                      <span className="text-[10px] text-[#94A3B8]">{n.created_at}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#263B5C] text-center">
                <button
                  onClick={() => {
                    setIsNotifMenuOpen(false);
                    navigate('/admin/notifications');
                  }}
                  className="text-xs font-medium text-[#38A5FF] hover:underline"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown matching reference screenshot */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-[#111F3B] hover:bg-[#17294A] border border-[#263B5C] transition-all group"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Admin'}
              className="w-9 h-9 rounded-xl object-cover border border-[#263B5C] shrink-0"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[11px] text-[#94A3B8] capitalize">
                {user?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#111F3B] border border-[#263B5C] rounded-2xl shadow-2xl p-3 z-50 animate-slide-up">
              <div className="px-3 py-2.5 border-b border-[#263B5C] mb-2">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-xs text-[#94A3B8]">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1677FF]/15 border border-[#1677FF]/40 text-[#38A5FF] text-[10px] font-semibold uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>

              {/* Role Switcher Section for Demo */}
              <div className="px-3 py-1.5">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Switch Active Role (Demo)
                </p>
                <div className="space-y-1">
                  {rolesList.map((r) => {
                    const isCurrent = user?.role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r.role)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isCurrent
                            ? 'bg-[#1677FF] text-white font-semibold'
                            : 'text-[#94A3B8] hover:text-white hover:bg-[#17294A]'
                        }`}
                      >
                        <span>{r.label}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 mt-2 border-t border-[#263B5C] space-y-1">
                <button
                  onClick={handleResetData}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#FF991F] hover:bg-[#17294A] rounded-xl transition-colors font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#17294A] rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Ticket,
  Wrench,
  Bus,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, store } = useBabaStore();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAll = () => {
    store.markAllNotificationsAsRead();
    showToast('Success', 'All notifications marked as read', 'success');
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Ticket className="w-5 h-5 text-[#38A5FF]" />;
      case 'schedule':
        return <Clock className="w-5 h-5 text-[#FF991F]" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#1677FF]" />
            Dispatch & Fleet Notifications
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time highway alerts, schedule delay warnings, new passenger bookings, and maintenance pings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#17294A] hover:bg-[#1E335C] border border-[#263B5C] text-xs font-semibold text-white rounded-xl transition-all"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Mark all as read</span>
            </button>
          )}

          <div className="flex items-center bg-[#0C1730] p-1 rounded-xl border border-[#263B5C]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#1677FF] text-white' : 'text-[#94A3B8]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-[#1677FF] text-white' : 'text-[#94A3B8]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-[#111F3B] border border-[#263B5C] rounded-2xl">
            <Bell className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-40" />
            <h4 className="text-sm font-bold text-white">No notifications to display</h4>
            <p className="text-xs text-[#94A3B8] mt-1">You are all caught up with your fleet updates!</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => store.markNotificationAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                n.read
                  ? 'bg-[#111F3B]/50 border-[#263B5C]/60 opacity-80'
                  : 'bg-[#111F3B] border-[#1677FF]/60 shadow-lg'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#0C1730] border border-[#263B5C] shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[11px] text-[#94A3B8]">{n.created_at}</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

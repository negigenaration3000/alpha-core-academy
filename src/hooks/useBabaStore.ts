import { useState, useEffect } from 'react';
import { babaStore } from '../services/store';

export function useBabaStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = babaStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    store: babaStore,
    buses: babaStore.getBuses(),
    routes: babaStore.getRoutes(),
    drivers: babaStore.getDrivers(),
    schedules: babaStore.getSchedules(),
    bookings: babaStore.getBookings(),
    passengers: babaStore.getPassengers(),
    expenses: babaStore.getExpenses(),
    notifications: babaStore.getNotifications(),
    unreadCount: babaStore.getUnreadNotificationCount(),
    settings: babaStore.getSettings(),
    currentUser: babaStore.getCurrentUser(),
    stats: babaStore.getDashboardStats(),
    busStatusData: babaStore.getBusStatusBreakdown(),
  };
}

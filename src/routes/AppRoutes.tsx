import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PublicLayout } from '../components/layout/PublicLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { SearchResults } from '../pages/public/SearchResults';
import { PopularRoutesPage } from '../pages/public/PopularRoutesPage';
import { BookingFlow } from '../pages/public/BookingFlow';
import { MyBookingsPage } from '../pages/public/MyBookingsPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';

// Admin Operator Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { BusesPage } from '../pages/admin/BusesPage';
import { RoutesPage } from '../pages/admin/RoutesPage';
import { DriversPage } from '../pages/admin/DriversPage';
import { SchedulesPage } from '../pages/admin/SchedulesPage';
import { BookingsPage } from '../pages/admin/BookingsPage';
import { PassengersPage } from '../pages/admin/PassengersPage';
import { SeatManagementPage } from '../pages/admin/SeatManagementPage';
import { ExpensesPage } from '../pages/admin/ExpensesPage';
import { PaymentsPage } from '../pages/admin/PaymentsPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { NotificationsPage } from '../pages/admin/NotificationsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Booking Website (Header + Content + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/routes" element={<PopularRoutesPage />} />
        <Route path="/book/:scheduleId" element={<BookingFlow />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 2. Admin Operator Dashboard (Sidebar + Topbar + Content) */}
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="buses" element={<BusesPage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="schedules" element={<SchedulesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="passengers" element={<PassengersPage />} />
        <Route path="seats" element={<SeatManagementPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

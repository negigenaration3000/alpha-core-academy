import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Public pages
import { Home } from '../pages/public/Home';
import { Courses } from '../pages/public/Courses';
import { CourseDetail } from '../pages/public/CourseDetail';
import { Cart } from '../pages/public/Cart';
import { Checkout } from '../pages/public/Checkout';
import { OrderSuccess } from '../pages/public/OrderSuccess';
import { TrackOrder } from '../pages/public/TrackOrder';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { Legal } from '../pages/public/Legal';

// Student pages
import { StudentDashboard } from '../pages/student/Dashboard';

// Admin pages
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { CourseManagement } from '../pages/admin/CourseManagement';
import { VariationManagement } from '../pages/admin/VariationManagement';
import { OrderManagement } from '../pages/admin/OrderManagement';
import { StudentManagement } from '../pages/admin/StudentManagement';
import { CategoryManagement } from '../pages/admin/CategoryManagement';
import { PaymentSettingsPage } from '../pages/admin/PaymentSettingsPage';
import { SiteSettingsPage } from '../pages/admin/SiteSettingsPage';
import { ReviewsPage } from '../pages/admin/ReviewsPage';
import { EarningsPage } from '../pages/admin/EarningsPage';
import { HelpPage } from '../pages/admin/HelpPage';

// Public Layout Wrapper with Sticky Header and Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-ivory">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
      <Route path="/course/:slug" element={<PublicLayout><CourseDetail /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
      <Route path="/order-success/:orderNumber" element={<PublicLayout><OrderSuccess /></PublicLayout>} />
      <Route path="/track-order" element={<PublicLayout><TrackOrder /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><Legal type="privacy" /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><Legal type="terms" /></PublicLayout>} />

      {/* Student Portal */}
      <Route path="/student/dashboard" element={<PublicLayout><StudentDashboard /></PublicLayout>} />
      <Route path="/student/courses" element={<PublicLayout><StudentDashboard /></PublicLayout>} />
      <Route path="/student/orders" element={<PublicLayout><StudentDashboard /></PublicLayout>} />

      {/* Admin Panel (Matching the reference design with dark vertical sidebar) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="variations" element={<VariationManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="payments" element={<PaymentSettingsPage />} />
        <Route path="settings" element={<SiteSettingsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

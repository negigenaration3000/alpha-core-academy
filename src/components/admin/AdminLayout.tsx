import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, ShoppingBag, BookOpen, Layers, Users, 
  FolderTree, CreditCard, Settings, Star, DollarSign, 
  HelpCircle, LogOut, ArrowLeft, Bell, Grid, Menu, X, Shield 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'DASHBOARD', icon: LayoutDashboard, path: '/admin' },
    { label: 'ORDERS', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'COURSES', icon: BookOpen, path: '/admin/courses' },
    { label: 'VARIATIONS', icon: Layers, path: '/admin/variations', highlight: true },
    { label: 'STUDENTS', icon: Users, path: '/admin/students' },
    { label: 'CATEGORIES', icon: FolderTree, path: '/admin/categories' },
    { label: 'PAYMENT SETTINGS', icon: CreditCard, path: '/admin/payments' },
    { label: 'SITE SETTINGS', icon: Settings, path: '/admin/settings' },
    { label: 'REVIEWS', icon: Star, path: '/admin/reviews' },
    { label: 'EARNINGS', icon: DollarSign, path: '/admin/earnings' },
    { label: 'HELP', icon: HelpCircle, path: '/admin/help' },
  ];

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Dark Vertical Sidebar (Matching reference image) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#202124] text-gray-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo / Brand Header */}
          <div className="h-16 px-5 border-b border-dark-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-dark p-1 border border-gold shadow-sm flex items-center justify-center">
                <img src="/shield-helmet.svg" alt="Code Spartan" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-black text-base text-gold tracking-widest uppercase">
                CODE SPARTAN
              </span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition ${
                    isActive
                      ? 'bg-gold text-dark font-black shadow-gold-sm'
                      : item.highlight
                      ? 'text-gold hover:bg-dark-surface font-bold'
                      : 'text-gray-300 hover:bg-dark-surface hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-dark' : item.highlight ? 'text-gold' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-dark-border space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-heading uppercase text-gray-400 hover:text-gold transition py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 text-xs font-heading uppercase text-red-400 hover:text-red-300 transition py-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-[#DFC27D]/40 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-dark hover:text-gold"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-black text-sm uppercase tracking-wider text-dark hidden sm:inline">
              ALPHA-CORE ACADEMY COMMAND CENTER
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gold transition rounded-lg hover:bg-gray-100" title="Notifications">
              <Bell className="w-4 h-4" />
            </button>

            {/* Profile Avatar matching reference ("Administrator") */}
            <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gold bg-dark">
                <img
                  src="/images/instructor_hero.png"
                  alt="Administrator"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-heading font-bold text-xs uppercase text-dark block leading-none">
                  {user?.full_name || 'Administrator'}
                </span>
                <span className="text-[10px] text-spartan-muted font-mono leading-none">
                  Master Architect
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

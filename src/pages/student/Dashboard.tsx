import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { store } from '../../services/store';
import { Enrollment, Order } from '../../types';
import { 
  BookOpen, Clock, Shield, CheckCircle2, User, 
  ShoppingBag, Video, Download, ArrowRight, AlertCircle, LogOut 
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const StudentDashboard: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCart();

  const [activeTab, setActiveTab] = useState<'courses' | 'orders' | 'profile'>('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = () => {
      // Get enrollments
      const userEnrollments = store.getEnrollments(user.id);
      // Fallback: If demo user has no enrollments yet, show active mock enrollments for demonstration
      if (userEnrollments.length === 0) {
        setEnrollments(store.getEnrollments());
      } else {
        setEnrollments(userEnrollments);
      }

      // Get orders
      const allOrders = store.getOrders();
      const userOrders = allOrders.filter(
        (o) => o.user_id === user.id || o.customer_email === user.phone || o.customer_name === user.full_name
      );
      setMyOrders(userOrders.length > 0 ? userOrders : allOrders.slice(0, 3));
    };

    loadData();
    const unsubscribe = store.subscribe(loadData);
    return unsubscribe;
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-dark text-white rounded-2xl p-6 sm:p-8 border-2 border-gold shadow-card mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-dark-card border-2 border-gold p-1 flex items-center justify-center overflow-hidden">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.full_name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gold text-xs font-heading uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                <span>SPARTAN CADET PORTAL</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                {user.full_name}
              </h1>
              <p className="text-xs text-gray-400 font-mono">
                Status: <strong className="text-green-400 uppercase">{user.account_status}</strong> &bull; Role: {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition"
              >
                Open Admin Panel
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-dark-surface hover:bg-dark-border text-gray-300 font-heading text-xs uppercase tracking-wider transition border border-dark-border flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#DFC27D]/40 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-2.5 rounded-lg font-heading text-xs uppercase font-bold tracking-wider transition flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-dark text-gold border border-gold shadow-sm'
                : 'bg-white text-spartan-muted hover:text-dark border border-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Enrolled Courses ({enrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-lg font-heading text-xs uppercase font-bold tracking-wider transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-dark text-gold border border-gold shadow-sm'
                : 'bg-white text-spartan-muted hover:text-dark border border-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-lg font-heading text-xs uppercase font-bold tracking-wider transition flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-dark text-gold border border-gold shadow-sm'
                : 'bg-white text-spartan-muted hover:text-dark border border-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab 1: Enrolled Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enr) => {
                  const course = enr.course || store.getCourses()[0];
                  const variant = enr.variant || store.getVariants()[0];
                  return (
                    <div
                      key={enr.id}
                      className="bg-[#151619] rounded-2xl overflow-hidden border-2 border-gold/40 hover:border-gold transition shadow-card text-white flex flex-col justify-between"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading uppercase font-bold bg-green-950 text-green-400 border border-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ACCESS ACTIVE</span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Enrolled: {new Date(enr.access_start).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-heading font-black text-xl uppercase tracking-wider text-white">
                            {course?.title}
                          </h3>
                          <span className="text-xs text-gold font-medium block mt-1">
                            Variation: {variant?.name}
                          </span>
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                            {course?.short_description}
                          </p>
                        </div>

                        {/* Protected Module Preview */}
                        <div className="bg-dark rounded-xl p-3 border border-dark-border space-y-2 text-xs">
                          <div className="flex items-center justify-between text-gray-300">
                            <span className="flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-gold" />
                              <span>Protected Lessons:</span>
                            </span>
                            <span className="font-bold text-gold">24 Modules</span>
                          </div>
                          <div className="w-full bg-dark-border h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gold h-full w-2/5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#101113] border-t border-dark-border flex gap-2">
                        <Link
                          to={`/course/${course?.slug}`}
                          className="flex-1 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold text-center transition"
                        >
                          Launch Course Room
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
                <h3 className="font-heading text-xl uppercase text-dark">No Active Enrollments Yet</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                  Your manual payment may still be awaiting verification, or you have not yet enrolled in any course track.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/courses" className="px-5 py-2.5 rounded-lg bg-gold text-dark font-heading text-xs uppercase font-bold">
                    Browse All Tracks
                  </Link>
                  <Link to="/track-order" className="px-5 py-2.5 rounded-lg bg-dark text-white font-heading text-xs uppercase font-bold">
                    Track Submitted Order
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-heading font-black text-xl uppercase tracking-wider text-dark">
                ORDER &amp; PAYMENT VERIFICATION HISTORY
              </h3>
              <p className="text-xs text-spartan-muted mt-1">
                Real-time record of all placed orders and administrator verification statuses.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Courses &amp; Variant</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-dark">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-4">
                        {(ord.items || []).map((it) => (
                          <div key={it.id}>
                            <strong className="text-dark font-heading uppercase">{it.course_title_snapshot}</strong>
                            <span className="text-[11px] text-gold-dark block">Format: {it.variation_name_snapshot}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-dark text-sm">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-semibold">
                        {ord.payment_method}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                          ord.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : ord.payment_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/order-success/${ord.order_number}`}
                          className="text-gold font-heading font-bold uppercase hover:underline"
                        >
                          View Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFC27D]/60 shadow-sm max-w-2xl space-y-5">
            <h3 className="font-heading font-black text-xl uppercase tracking-wider text-dark border-b pb-3">
              PROFILE DETAILS
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-heading text-spartan-muted mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={user.full_name}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-gray-50 text-dark font-medium"
                />
              </div>

              <div>
                <label className="block uppercase font-heading text-spartan-muted mb-1">Phone Number</label>
                <input
                  type="text"
                  readOnly
                  value={user.phone || '01844221100'}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-gray-50 text-dark font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-heading text-spartan-muted mb-1">Assigned Role</label>
                <input
                  type="text"
                  readOnly
                  value={user.role.toUpperCase()}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-gray-50 text-dark font-bold text-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => switchRole(user.role === 'admin' ? 'student' : 'admin')}
                  className="px-4 py-2 rounded-lg bg-dark text-gold font-heading text-xs uppercase font-bold hover:bg-black transition"
                >
                  Toggle to {user.role === 'admin' ? 'Student' : 'Admin'} Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

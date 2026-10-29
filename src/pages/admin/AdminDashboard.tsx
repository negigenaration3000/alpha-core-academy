import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../services/store';
import { AdminStats, SalesDataPoint, CourseVariant, PaymentSetting, Order } from '../../types';
import { 
  Users, DollarSign, BookOpen, Layers, ArrowUpRight, ArrowDownRight, 
  Edit3, Trash2, Check, ShieldCheck, Save, Award, ExternalLink 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>(store.getAdminStats());
  const [salesData, setSalesData] = useState<SalesDataPoint[]>(store.getSalesChart());
  const [variants, setVariants] = useState<CourseVariant[]>(store.getVariants());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>(store.getPaymentSettings());

  // Input states for Dynamic Payment Gateway Settings
  const [bkashNum, setBkashNum] = useState(
    paymentSettings.find((p) => p.provider === 'bkash')?.payment_number || '01844221100'
  );
  const [nagadNum, setNagadNum] = useState(
    paymentSettings.find((p) => p.provider === 'nagad')?.payment_number || '01733552211'
  );
  const [rocketNum, setRocketNum] = useState(
    paymentSettings.find((p) => p.provider === 'rocket')?.payment_number || '01922441100'
  );

  // Social Links state
  const [facebookUrl, setFacebookUrl] = useState(
    store.getSocialLinks().find((s) => s.platform === 'facebook')?.url || 'https://facebook.com/alphacoreacademy'
  );
  const [toolsUrl, setToolsUrl] = useState(
    store.getSocialLinks().find((s) => s.platform === 'tools')?.url || 'https://tools.alphacore.academy'
  );

  const [savedProvider, setSavedProvider] = useState<string | null>(null);
  const [savedSocial, setSavedSocial] = useState(false);

  useEffect(() => {
    const update = () => {
      setStats(store.getAdminStats());
      setVariants(store.getVariants());
      setOrders(store.getOrders());
      const pays = store.getPaymentSettings();
      setPaymentSettings(pays);
      const bk = pays.find((p) => p.provider === 'bkash');
      if (bk) setBkashNum(bk.payment_number);
      const ng = pays.find((p) => p.provider === 'nagad');
      if (ng) setNagadNum(ng.payment_number);
      const rk = pays.find((p) => p.provider === 'rocket');
      if (rk) setRocketNum(rk.payment_number);
    };

    update();
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const handleSavePayment = (provider: 'bkash' | 'nagad' | 'rocket', number: string) => {
    store.updatePaymentSetting(provider, { payment_number: number.trim() });
    setSavedProvider(provider);
    setTimeout(() => setSavedProvider(null), 2500);
  };

  const handleSaveSocial = () => {
    store.updateSocialLink('facebook', facebookUrl.trim());
    store.updateSocialLink('tools', toolsUrl.trim());
    setSavedSocial(true);
    setTimeout(() => setSavedSocial(false), 2500);
  };

  const courses = store.getCourses();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Top Stats Cards (4 Gold/Sand cards matching reference) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-black text-xl uppercase tracking-wider text-dark">
            Top Stats
          </h2>
          <span className="text-xs font-mono text-spartan-muted">
            Live Synchronized Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: TOTAL ENROLLMENTS */}
          <div className="bg-gradient-to-br from-[#E8D49A] to-[#DFC27D] rounded-xl p-4 sm:p-5 border border-gold shadow-sm flex flex-col justify-between text-dark">
            <span className="font-heading text-[11px] uppercase tracking-wider font-bold text-dark/70">
              TOTAL ENROLLMENTS
            </span>
            <div className="my-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-dark">
                {stats.total_enrollments.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats.enrollments_growth}%</span>
            </div>
          </div>

          {/* Card 2: TOTAL SALES */}
          <div className="bg-gradient-to-br from-[#E8D49A] to-[#DFC27D] rounded-xl p-4 sm:p-5 border border-gold shadow-sm flex flex-col justify-between text-dark">
            <span className="font-heading text-[11px] uppercase tracking-wider font-bold text-dark/70">
              TOTAL SALES
            </span>
            <div className="my-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-dark">
                ${stats.total_sales.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats.sales_growth}%</span>
            </div>
          </div>

          {/* Card 3: ACTIVE STUDENTS */}
          <div className="bg-gradient-to-br from-[#E8D49A] to-[#DFC27D] rounded-xl p-4 sm:p-5 border border-gold shadow-sm flex flex-col justify-between text-dark">
            <span className="font-heading text-[11px] uppercase tracking-wider font-bold text-dark/70">
              ACTIVE STUDENTS
            </span>
            <div className="my-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-dark">
                {stats.active_students.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-900">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{stats.students_growth}%</span>
            </div>
          </div>

          {/* Card 4: TOTAL COURSES */}
          <div className="bg-gradient-to-br from-[#E8D49A] to-[#DFC27D] rounded-xl p-4 sm:p-5 border border-gold shadow-sm flex flex-col justify-between text-dark">
            <span className="font-heading text-[11px] uppercase tracking-wider font-bold text-dark/70">
              TOTAL COURSES
            </span>
            <div className="my-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-dark">
                {stats.total_courses}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats.courses_growth}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sales Overview Chart Card */}
      <section className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
              Sales Overview
            </h3>
            <span className="text-[11px] font-mono text-gold-dark font-bold uppercase">
              ALPHA-CORE SALES REVENUE
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <select className="text-xs font-heading uppercase py-1.5 px-3 rounded-lg border border-gray-300 bg-ivory focus:outline-none focus:border-gold">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A653" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C8A653" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#77716A' }} />
              <YAxis tick={{ fontSize: 11, fill: '#77716A' }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#111', borderColor: '#C8A653', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C8A653"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goldRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. Recent Enrollments Table (Matching Reference Image) */}
      <section className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
            Recent Enrollments
          </h3>
          <Link
            to="/admin/orders"
            className="px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3 px-5">Student Name</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 6).map((order) => {
                const isPaid = order.payment_status === 'paid';
                const isAwaiting = order.payment_status === 'awaiting_verification';
                const isRefunded = order.payment_status === 'refunded' || order.payment_status === 'rejected';

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-full bg-dark text-gold flex items-center justify-center font-bold text-[10px]">
                          {order.customer_name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-heading font-bold text-dark text-xs uppercase">
                          {order.customer_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-gray-800 font-medium">
                        {order.items?.[0]?.course_title_snapshot || 'C++ Masterclass'} - {order.items?.[0]?.variation_name_snapshot || 'Variation 2'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-dark">
                      ${order.total.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-green-100 text-green-800'
                          : isAwaiting
                          ? 'bg-[#E8D49A] text-amber-900 border border-gold'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPaid ? 'Active' : isAwaiting ? 'Payment Verification' : 'Expired'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isAwaiting && (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => store.verifyPayment(order.id, 'verify')}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-heading uppercase font-bold"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => store.verifyPayment(order.id, 'reject')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-heading uppercase font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Course Variation Management Table (Matching Reference Image) */}
      <section className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
            Course Variation Management
          </h3>
          <Link
            to="/admin/variations"
            className="px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm"
          >
            Edit Variation
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Variation</th>
                <th className="py-3 px-4">Regular Price</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Image Url</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {variants.slice(0, 6).map((variant) => {
                const parentCourse = courses.find((c) => c.id === variant.course_id);
                return (
                  <tr key={variant.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-heading font-bold text-dark uppercase">
                      {parentCourse?.title || 'Fullstack'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {variant.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-500 line-through">
                      ${variant.regular_price}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-dark">
                      ${variant.sale_price}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-dark border border-gold overflow-hidden flex items-center justify-center">
                          <img src="/shield-helmet.svg" alt="thumb" className="w-4 h-4 object-contain" />
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">
                          https://sstsng...
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            const newSale = prompt(`Enter new sale price for ${variant.name}:`, variant.sale_price.toString());
                            if (newSale && !isNaN(Number(newSale))) {
                              store.updateVariant(variant.id, { sale_price: Number(newSale) });
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-gold transition"
                          title="Edit Price"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete variation ${variant.name}?`)) {
                              store.deleteVariant(variant.id);
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 transition"
                          title="Delete Variation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Dynamic Payment Gateway Settings (Matching Reference Image) */}
      <section className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
            Dynamic Payment Gateway Settings
          </h3>
          <p className="text-xs text-spartan-muted">
            Update Bangladesh collection numbers in real time. Instant synchronization with public checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* bKash */}
          <div className="space-y-2">
            <label className="block text-xs font-heading uppercase tracking-wider text-dark font-bold">
              bKash Collection Number
            </label>
            <input
              type="text"
              value={bkashNum}
              onChange={(e) => setBkashNum(e.target.value)}
              placeholder="01axsssx"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold focus:outline-none"
            />
            <button
              onClick={() => handleSavePayment('bkash', bkashNum)}
              className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
            >
              {savedProvider === 'bkash' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>

          {/* Nagad */}
          <div className="space-y-2">
            <label className="block text-xs font-heading uppercase tracking-wider text-dark font-bold">
              Nagad Collection Number
            </label>
            <input
              type="text"
              value={nagadNum}
              onChange={(e) => setNagadNum(e.target.value)}
              placeholder="01yyyyyy"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold focus:outline-none"
            />
            <button
              onClick={() => handleSavePayment('nagad', nagadNum)}
              className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
            >
              {savedProvider === 'nagad' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>

          {/* Rocket */}
          <div className="space-y-2">
            <label className="block text-xs font-heading uppercase tracking-wider text-dark font-bold">
              Rocket Collection Number
            </label>
            <input
              type="text"
              value={rocketNum}
              onChange={(e) => setRocketNum(e.target.value)}
              placeholder="01zzzzzz"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold focus:outline-none"
            />
            <button
              onClick={() => handleSavePayment('rocket', rocketNum)}
              className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
            >
              {savedProvider === 'rocket' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Social Settings & Certified Seal (Matching Reference Image) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Social Settings */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
              Social Settings
            </h3>
            <p className="text-xs text-spartan-muted">
              Update the invite social links displayed on the public header and footer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading uppercase text-dark font-bold mb-1">
                Facebook
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://social.com/yourpage"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-heading uppercase text-dark font-bold mb-1">
                Tools Link
              </label>
              <input
                type="text"
                value={toolsUrl}
                onChange={(e) => setToolsUrl(e.target.value)}
                placeholder="https://social.com/pourgage"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSocial}
            className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center gap-1.5"
          >
            {savedSocial ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSocial ? 'Social Links Updated!' : 'Save Social Settings'}</span>
          </button>
        </div>

        {/* Right Side: Certified Gold Seal Badge (Matching Reference Image) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Rotating / Star Seal border */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-gold animate-[spin_20s_linear_infinite]" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E8D49A] via-[#C8A653] to-[#A68434] p-1 flex items-center justify-center shadow-gold-md">
              <div className="w-full h-full rounded-full bg-dark flex flex-col items-center justify-center text-center p-2 border border-gold">
                <Award className="w-6 h-6 text-gold mb-0.5" />
                <span className="font-heading font-black text-[11px] tracking-widest text-gold uppercase leading-tight">
                  CERTIFIED
                </span>
                <span className="text-[7px] text-gray-300 uppercase tracking-tighter">
                  SECURITY SECURE
                </span>
              </div>
            </div>
          </div>
          <span className="mt-3 font-heading font-bold text-xs uppercase text-dark tracking-wider">
            OFFICIAL ACCREDITATION
          </span>
        </div>
      </section>
    </div>
  );
};

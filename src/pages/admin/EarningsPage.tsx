import React from 'react';
import { store } from '../../services/store';
import { DollarSign, Shield, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export const EarningsPage: React.FC = () => {
  const orders = store.getOrders();
  const verifiedOrders = orders.filter((o) => o.payment_status === 'paid');
  const totalRevenue = verifiedOrders.reduce((sum, o) => sum + o.total, 0);

  const bkashTotal = verifiedOrders.filter(o => o.payment_method === 'bkash').reduce((sum, o) => sum + o.total, 0);
  const nagadTotal = verifiedOrders.filter(o => o.payment_method === 'nagad').reduce((sum, o) => sum + o.total, 0);
  const rocketTotal = verifiedOrders.filter(o => o.payment_method === 'rocket').reduce((sum, o) => sum + o.total, 0);
  const cashTotal = verifiedOrders.filter(o => o.payment_method === 'cash').reduce((sum, o) => sum + o.total, 0);

  const pendingVerificationCount = orders.filter((o) => o.payment_status === 'awaiting_verification').length;
  const pendingValue = orders.filter((o) => o.payment_status === 'awaiting_verification').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#DFC27D]/40 pb-4">
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Treasury &amp; Realized Revenue</span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
          ACADEMY EARNINGS &amp; AUDITED CASH FLOW
        </h1>
        <p className="text-xs text-spartan-muted mt-1">
          Only verified and cleared manual payments are tallied into collected revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#E8D49A] via-[#C8A653] to-[#B38F37] rounded-2xl p-6 text-dark border-2 border-gold shadow-gold-sm">
          <span className="font-heading font-bold uppercase text-xs tracking-wider text-dark/70">
            Total Audited Revenue
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-dark my-2">
            ${totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{verifiedOrders.length} Verified Transactions</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm">
          <span className="font-heading font-bold uppercase text-xs tracking-wider text-spartan-muted">
            Pending In Verification Queue
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-amber-700 my-2">
            ${pendingValue.toLocaleString()}
          </div>
          <span className="text-xs text-amber-800 font-mono">
            {pendingVerificationCount} orders awaiting manual clearance
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm">
          <span className="font-heading font-bold uppercase text-xs tracking-wider text-spartan-muted">
            Average Order Value (AOV)
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-dark my-2">
            ${verifiedOrders.length > 0 ? Math.round(totalRevenue / verifiedOrders.length) : 1250}
          </div>
          <span className="text-xs text-gray-500 font-sans">
            High-ticket course variations
          </span>
        </div>
      </div>

      {/* Gateway Revenue Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-4">
        <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark">
          Channel Collection Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
            <span className="font-heading font-bold uppercase text-pink-700 block">bKash Verified</span>
            <span className="font-heading font-black text-2xl text-dark font-mono block my-1">
              ${bkashTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Channel: 01844221100</span>
          </div>

          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
            <span className="font-heading font-bold uppercase text-orange-700 block">Nagad Verified</span>
            <span className="font-heading font-black text-2xl text-dark font-mono block my-1">
              ${nagadTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Channel: 01733552211</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <span className="font-heading font-bold uppercase text-purple-700 block">Rocket Verified</span>
            <span className="font-heading font-black text-2xl text-dark font-mono block my-1">
              ${rocketTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Channel: 01922441100</span>
          </div>

          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <span className="font-heading font-bold uppercase text-green-700 block">Manual Cash Office</span>
            <span className="font-heading font-black text-2xl text-dark font-mono block my-1">
              ${cashTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-500">Chattogram HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

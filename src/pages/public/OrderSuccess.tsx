import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../../services/store';
import { Order } from '../../types';
import { CheckCircle2, Clock, Shield, ArrowRight, FileText, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { formatPrice } = useCart();
  const [order, setOrder] = useState<Order | undefined>(() =>
    orderNumber ? store.getOrderById(orderNumber) : undefined
  );

  useEffect(() => {
    if (orderNumber) {
      setOrder(store.getOrderById(orderNumber));
    }
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="bg-ivory min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-card">
          <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
          <h2 className="font-heading font-black text-xl uppercase">Order Not Found</h2>
          <p className="text-xs text-gray-500 mt-2">Could not locate order reference: {orderNumber}</p>
          <Link to="/" className="mt-4 inline-block px-5 py-2 rounded bg-gold text-dark font-heading text-xs uppercase font-bold">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';
  const isAwaiting = order.payment_status === 'awaiting_verification';

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border-2 border-gold shadow-card overflow-hidden">
          {/* Header Banner */}
          <div className="bg-dark text-white p-6 sm:p-8 text-center border-b-2 border-gold">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-gold" />
            </div>
            <span className="text-xs font-heading uppercase tracking-widest text-gold block mb-1">
              ORDER CONFIRMED &amp; SUBMITTED
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
              ORDER #{order.order_number}
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Submitted on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Alert */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isPaid
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {isPaid ? (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-heading font-black uppercase tracking-wider block text-sm">
                  STATUS: {isPaid ? 'PAYMENT VERIFIED (ACTIVE)' : 'AWAITING ADMIN VERIFICATION'}
                </span>
                <p className="mt-1 leading-relaxed">
                  {isPaid
                    ? 'Your manual payment has been cleared by the administration. You can now access your course content in your Student Dashboard.'
                    : 'Our verification team is cross-checking your transaction ID against the provider records. Once verified, your course enrollment will be immediately activated.'}
                </p>
              </div>
            </div>

            {/* Customer & Payment Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ivory rounded-xl p-4 border border-[#DFC27D]/40 text-xs">
              <div>
                <span className="text-gray-400 uppercase font-heading text-[10px] block">Student Details</span>
                <strong className="text-dark text-sm block mt-0.5">{order.customer_name}</strong>
                <span className="text-gray-600 font-mono">{order.customer_email}</span>
                <span className="text-gray-600 block">{order.customer_phone}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase font-heading text-[10px] block">Payment Submission</span>
                <strong className="text-dark text-sm uppercase block mt-0.5">Method: {order.payment_method}</strong>
                {order.payments?.[0]?.transaction_id && (
                  <span className="text-gold-dark font-mono font-bold block mt-0.5">
                    TrxID: {order.payments[0].transaction_id}
                  </span>
                )}
                {order.payments?.[0]?.sender_phone && (
                  <span className="text-gray-600 font-mono block">
                    Sender: {order.payments[0].sender_phone}
                  </span>
                )}
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-3">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-dark border-b pb-2">
                ENROLLED TRACKS &amp; VARIATIONS
              </h3>
              <div className="space-y-2">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                    <div>
                      <strong className="font-heading font-black text-dark uppercase block">
                        {item.course_title_snapshot}
                      </strong>
                      <span className="text-gold-dark font-medium">
                        Format: {item.variation_name_snapshot}
                      </span>
                    </div>
                    <span className="font-heading font-bold text-dark font-mono text-sm">
                      {formatPrice(item.line_total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="border-t pt-4 flex items-center justify-between text-base">
              <span className="font-heading font-bold uppercase text-dark">Total Amount Paid / Pending:</span>
              <span className="font-heading font-black text-2xl text-dark font-mono">{formatPrice(order.total)}</span>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/student/dashboard"
                className="w-full sm:flex-1 py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-xs uppercase tracking-wider text-center transition shadow-gold-sm"
              >
                Go to Student Dashboard
              </Link>
              <Link
                to="/courses"
                className="w-full sm:flex-1 py-3 rounded-xl bg-dark hover:bg-black text-white font-heading font-bold text-xs uppercase tracking-wider text-center transition"
              >
                Browse More Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

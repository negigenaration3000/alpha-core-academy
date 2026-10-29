import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Order, PaymentStatus, OrderStatus } from '../../types';
import { 
  Search, Filter, CheckCircle2, XCircle, Clock, 
  ShieldCheck, AlertTriangle, Eye, X, Check, FileText 
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    const update = () => setOrders(store.getOrders());
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.payments?.[0]?.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleVerify = (orderId: string) => {
    store.verifyPayment(orderId, 'verify', verificationNotes || 'Manual payment verified by Administrator');
    setSelectedOrder(null);
    setVerificationNotes('');
  };

  const handleReject = (orderId: string) => {
    const reason = prompt('Please enter rejection reason / verification notes:', 'Transaction ID not matching bank statement.');
    if (reason !== null) {
      store.verifyPayment(orderId, 'reject', reason);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Financial War-Room</span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
            ORDER &amp; MANUAL PAYMENT VERIFICATION
          </h1>
        </div>

        <div className="text-xs font-mono text-spartan-muted">
          Pending Verification: <strong className="text-amber-800 font-bold">{orders.filter(o => o.payment_status === 'awaiting_verification').length}</strong>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DFC27D]/60 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, Student Name, Phone, Email, or TrxID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <div className="md:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-gray-300 text-xs font-heading uppercase tracking-wider focus:border-gold focus:outline-none bg-white"
            >
              <option value="all">ALL PAYMENT STATES</option>
              <option value="awaiting_verification">AWAITING VERIFICATION</option>
              <option value="paid">PAID (VERIFIED)</option>
              <option value="rejected">REJECTED</option>
              <option value="refunded">REFUNDED</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-gray-300 text-xs font-heading uppercase tracking-wider focus:border-gold focus:outline-none bg-white"
            >
              <option value="all">ALL ORDER STATES</option>
              <option value="pending">PENDING</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course &amp; Variant</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Channel &amp; TrxID</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const isPaid = order.payment_status === 'paid';
                const isAwaiting = order.payment_status === 'awaiting_verification';
                const isRejected = order.payment_status === 'rejected' || order.payment_status === 'refunded';

                const trxId = order.payments?.[0]?.transaction_id || '-';
                const sender = order.payments?.[0]?.sender_phone || '-';

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-dark">
                      {order.order_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <strong className="text-dark block">{order.customer_name}</strong>
                        <span className="text-[11px] text-gray-500 font-mono block">{order.customer_phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {(order.items || []).map((it) => (
                        <div key={it.id}>
                          <span className="font-heading font-black text-dark uppercase">{it.course_title_snapshot}</span>
                          <span className="text-gold-dark text-[11px] block">Format: {it.variation_name_snapshot}</span>
                        </div>
                      ))}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-dark text-sm">
                      ${order.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-heading font-bold uppercase text-dark block">{order.payment_method}</span>
                        <span className="text-[11px] font-mono text-gold-dark font-bold block">Trx: {trxId}</span>
                        {sender !== '-' && <span className="text-[10px] text-gray-500 font-mono block">From: {sender}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-green-100 text-green-800'
                          : isAwaiting
                          ? 'bg-[#E8D49A] text-amber-900 border border-gold font-black animate-pulse'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-gray-500 hover:text-dark transition rounded hover:bg-gray-100"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isAwaiting && (
                          <>
                            <button
                              onClick={() => handleVerify(order.id)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-heading font-bold uppercase tracking-wider transition shadow-sm"
                              title="Verify Payment & Grant Access"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-heading font-bold uppercase tracking-wider transition shadow-sm"
                              title="Reject Payment"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-gold shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-heading uppercase text-spartan-muted">Inspection Modal</span>
                <h3 className="font-heading font-black text-lg uppercase text-dark">
                  Order #{selectedOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-ivory rounded-xl p-4 border border-[#DFC27D]/40 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 uppercase text-[10px]">Student Name:</span>
                    <strong className="block text-dark">{selectedOrder.customer_name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px]">Contact Phone:</span>
                    <strong className="block text-dark font-mono">{selectedOrder.customer_phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px]">Email:</span>
                    <span className="block text-gray-700 font-mono">{selectedOrder.customer_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px]">Total Value:</span>
                    <strong className="block text-dark font-mono text-sm">${selectedOrder.total}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-dark rounded-xl p-4 text-white border border-gold/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gold font-heading uppercase text-xs font-bold">Channel: {selectedOrder.payment_method}</span>
                  <span className="text-gray-300 font-mono text-[10px]">Status: {selectedOrder.payment_status}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Submitted TrxID:</span>
                  <span className="font-mono text-base font-bold text-gold tracking-wider">
                    {selectedOrder.payments?.[0]?.transaction_id || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Sender Phone:</span>
                  <span className="font-mono text-white">
                    {selectedOrder.payments?.[0]?.sender_phone || selectedOrder.customer_phone}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="font-heading uppercase font-bold text-dark block mb-1">Purchased Variants:</span>
                {(selectedOrder.items || []).map((it) => (
                  <div key={it.id} className="p-2.5 rounded bg-gray-50 border border-gray-200 flex justify-between items-center">
                    <div>
                      <strong className="text-dark block font-heading uppercase">{it.course_title_snapshot}</strong>
                      <span className="text-gold-dark text-[11px]">Format: {it.variation_name_snapshot}</span>
                    </div>
                    <span className="font-mono font-bold text-dark">${it.line_total}</span>
                  </div>
                ))}
              </div>

              {/* Verification Actions */}
              {selectedOrder.payment_status === 'awaiting_verification' && (
                <div className="pt-3 border-t space-y-3">
                  <label className="block font-heading uppercase text-dark font-bold text-[11px]">
                    Internal Verification Notes:
                  </label>
                  <input
                    type="text"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="e.g. Verified via bKash Merchant SMS report..."
                    className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-gold focus:outline-none"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(selectedOrder.id)}
                      className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-heading uppercase font-bold text-xs tracking-wider transition"
                    >
                      Verify &amp; Activate Enrollments
                    </button>
                    <button
                      onClick={() => handleReject(selectedOrder.id)}
                      className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-heading uppercase font-bold text-xs tracking-wider transition"
                    >
                      Reject Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

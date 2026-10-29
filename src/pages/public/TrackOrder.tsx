import React, { useState } from 'react';
import { store } from '../../services/store';
import { Order } from '../../types';
import { Search, Shield, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const TrackOrder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { formatPrice } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toUpperCase();
    const allOrders = store.getOrders();
    const found = allOrders.find(
      (o) =>
        o.order_number.toUpperCase() === trimmed ||
        o.customer_phone.includes(trimmed) ||
        o.customer_email.toLowerCase() === query.trim().toLowerCase()
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#DFC27D] shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-dark text-gold flex items-center justify-center mx-auto border border-gold">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark">
              TRACK PAYMENT &amp; ENROLLMENT
            </h1>
            <p className="text-xs text-spartan-muted max-w-md mx-auto">
              Enter your Order Number (e.g., ACA-2026-9021) or registered mobile number to check manual verification status.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ACA-2026-9021 or 018xxxxxxxx"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-gold focus:outline-none text-xs font-mono uppercase"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-xs uppercase tracking-wider transition shadow-sm"
            >
              Search
            </button>
          </form>

          {hasSearched && (
            <div className="pt-4 border-t border-gray-100">
              {searchedOrder ? (
                <div className="bg-ivory rounded-xl p-5 border border-[#DFC27D]/60 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DFC27D]/40 pb-3">
                    <div>
                      <span className="text-gray-400 uppercase font-heading text-[10px]">Order Number</span>
                      <h3 className="font-heading font-black text-lg text-dark">{searchedOrder.order_number}</h3>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider ${
                        searchedOrder.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : searchedOrder.payment_status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {searchedOrder.payment_status === 'paid' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                        {searchedOrder.payment_status === 'awaiting_verification' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {searchedOrder.payment_status === 'rejected' && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                        <span>Payment: {searchedOrder.payment_status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 block uppercase">Student:</span>
                      <strong className="text-dark">{searchedOrder.customer_name}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase">Total Amount:</span>
                      <strong className="text-dark font-mono text-sm">{formatPrice(searchedOrder.total)}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 block uppercase mb-1">Purchased Track:</span>
                    {(searchedOrder.items || []).map((it) => (
                      <div key={it.id} className="p-2 bg-white rounded border border-gray-200">
                        <span className="font-heading font-bold text-dark uppercase">{it.course_title_snapshot}</span>
                        <span className="text-gold-dark block text-[11px]">Format: {it.variation_name_snapshot}</span>
                      </div>
                    ))}
                  </div>

                  {searchedOrder.payment_status === 'paid' && (
                    <div className="p-3 bg-green-50 rounded-lg text-green-800 text-xs">
                      Payment verified! You have active enrollment rights to this course.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-xs">
                  No order record found matching "{query}". Please verify the order number or phone.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

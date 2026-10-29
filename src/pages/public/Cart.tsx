import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Trash2, ShoppingBag, ArrowRight, Shield, Layers } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, subtotal, total, formatPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-10 border border-[#DFC27D]/60 shadow-card">
            <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mx-auto mb-4 border border-gold">
              <ShoppingBag className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-wider text-dark">
              Your Cart is Currently Empty
            </h2>
            <p className="text-xs text-spartan-muted mt-2 max-w-md mx-auto">
              You haven't selected any curriculum track yet. Explore our high-value engineering tracks to accelerate your career.
            </p>
            <div className="mt-6">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-gold-sm"
              >
                <span>Browse All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#DFC27D]/40 pb-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Order Review</span>
            <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-dark">
              SHOPPING CART ({cart.length})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-heading uppercase tracking-wider"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.variant_id}
                className="bg-white rounded-xl p-5 border border-[#DFC27D]/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-dark flex items-center justify-center p-2 border border-gold flex-shrink-0">
                    <img src="/shield-helmet.svg" alt={item.course.title} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <Link to={`/course/${item.course.slug}`} className="font-heading font-black text-lg uppercase text-dark hover:text-gold transition">
                      {item.course.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-gold-dark font-medium mt-0.5">
                      <Layers className="w-3.5 h-3.5 text-gold" />
                      <span>Format: <strong>{item.variant.name}</strong></span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-sans block mt-1">
                      Instructor: {item.course.instructor_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="font-heading font-black text-xl text-dark block">
                      {formatPrice(item.variant.sale_price)}
                    </span>
                    {item.variant.regular_price > item.variant.sale_price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.variant.regular_price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.variant_id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link to="/courses" className="text-xs font-heading font-bold uppercase tracking-wider text-dark hover:text-gold transition">
                &larr; Continue Exploring Other Tracks
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#151619] rounded-2xl p-6 text-white border-2 border-gold shadow-gold-md space-y-5">
              <h3 className="font-heading font-black text-xl uppercase tracking-wider text-gold-light border-b border-dark-border pb-3">
                SUMMARY
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Manual Payment Fee:</span>
                  <span className="font-bold text-green-400 font-mono">৳0.00 (Free)</span>
                </div>
                <div className="border-t border-dark-border pt-3 flex justify-between text-base">
                  <span className="font-heading uppercase tracking-wider font-bold">Total:</span>
                  <span className="font-heading font-black text-2xl text-gold font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-sm uppercase tracking-widest transition shadow-gold-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-2">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>bKash, Nagad, Rocket &amp; Cash Supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

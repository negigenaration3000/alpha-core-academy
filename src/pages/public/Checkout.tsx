import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { store } from '../../services/store';
import { PaymentMethod, PaymentSetting } from '../../types';
import { Shield, CheckCircle2, AlertCircle, ArrowRight, Lock, Copy, Check } from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, total, formatPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');

  // Customer form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('Chattogram, Bangladesh');

  // Manual payment state
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const settings = store.getPaymentSettings().filter((s) => s.is_enabled);
    setPaymentSettings(settings);
    if (settings.length > 0 && !settings.some((s) => s.provider === selectedMethod)) {
      setSelectedMethod(settings[0].provider);
    }
  }, []);

  const activePaymentSetting = paymentSettings.find((s) => s.provider === selectedMethod) || {
    id: 'fallback',
    provider: selectedMethod,
    display_name: selectedMethod.toUpperCase(),
    payment_number: '01844221100',
    account_type: 'Personal',
    instructions: 'Please send the exact order amount and submit your transaction ID.',
    is_enabled: true,
    updated_at: new Date().toISOString(),
  };

  const handleCopyNumber = () => {
    if (activePaymentSetting.payment_number) {
      navigator.clipboard.writeText(activePaymentSetting.payment_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your full name, email address, and phone number.');
      return;
    }

    if (selectedMethod !== 'cash' && (!transactionId.trim() || !senderPhone.trim())) {
      setError('Please provide your sender mobile number and the Transaction ID (TrxID).');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        order_id: '',
        course_id: item.course_id,
        variant_id: item.variant_id,
        course_title_snapshot: item.course.title,
        variation_name_snapshot: item.variant.name,
        unit_price: item.variant.sale_price,
        quantity: item.quantity,
        line_total: item.variant.sale_price * item.quantity,
      }));

      const newOrder = store.createOrder({
        user_id: user?.id || null,
        customer_name: fullName.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        billing_address: address.trim(),
        subtotal,
        discount: 0,
        total,
        currency: 'BDT',
        order_status: 'pending',
        payment_method: selectedMethod,
        payment_status: 'awaiting_verification',
        items: orderItems,
        payments: [
          {
            id: `pay-${Date.now()}`,
            order_id: '',
            provider: selectedMethod,
            amount: total,
            sender_phone: senderPhone.trim() || phone.trim(),
            transaction_id: transactionId.trim() || 'CASH-OFFICE',
            payment_status: 'awaiting_verification',
            created_at: new Date().toISOString(),
          }
        ]
      });

      clearCart();
      navigate(`/order-success/${newOrder.order_number}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to process order. Please check inputs.');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
          <h2 className="font-heading text-xl uppercase">No Items in Cart</h2>
          <p className="text-xs text-gray-500 mt-2">Add a course variation to proceed with checkout.</p>
          <Link to="/courses" className="mt-4 inline-block px-5 py-2 rounded bg-gold text-dark font-heading text-xs uppercase font-bold">
            Explore Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#DFC27D]/40 pb-4">
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Secure Order Processing</span>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-dark">
            CHECKOUT &amp; PAYMENT VERIFICATION
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Student Details & Payment Submission */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Student Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark flex items-center gap-2 border-b pb-3">
                <span className="w-6 h-6 rounded-full bg-dark text-gold text-xs flex items-center justify-center font-bold">1</span>
                <span>STUDENT CREDENTIALS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-dark mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sohel Shahriar"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-dark mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. spartan@alpha-core.academy"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-dark mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01844221100"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-dark mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Chattogram, Bangladesh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-5">
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-dark flex items-center gap-2 border-b pb-3">
                <span className="w-6 h-6 rounded-full bg-dark text-gold text-xs flex items-center justify-center font-bold">2</span>
                <span>SELECT BANGLADESH PAYMENT METHOD</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {paymentSettings.map((setting) => {
                  const isSelected = selectedMethod === setting.provider;
                  return (
                    <button
                      key={setting.provider}
                      type="button"
                      onClick={() => setSelectedMethod(setting.provider)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-gold-sm font-bold'
                          : 'border-gray-200 hover:border-gold/40'
                      }`}
                    >
                      <span className="font-heading font-black text-xs uppercase tracking-wider text-dark">
                        {setting.display_name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-sans">
                        {setting.account_type}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Instructions Card */}
              <div className="bg-[#151619] rounded-xl p-5 text-white border border-gold space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-widest font-heading block">
                      Transfer To Official {activePaymentSetting.display_name} Number:
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-wider">
                      {activePaymentSetting.payment_number}
                    </span>
                  </div>

                  {activePaymentSetting.provider !== 'cash' && (
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold transition self-start sm:self-auto"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Number'}</span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-300 font-sans whitespace-pre-line leading-relaxed">
                  {activePaymentSetting.instructions}
                </div>

                {/* Sender phone & TrxID inputs */}
                {selectedMethod !== 'cash' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-heading uppercase tracking-wider text-gold-light mb-1">
                        Your Sender {activePaymentSetting.display_name} Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="e.g. 017xxxxxxxx"
                        className="w-full px-3 py-2 rounded bg-dark border border-dark-border text-white text-xs font-mono focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-heading uppercase tracking-wider text-gold-light mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 9JX89201L"
                        className="w-full px-3 py-2 rounded bg-dark border border-dark-border text-white text-xs font-mono uppercase tracking-wider focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-green-400 p-2 bg-green-950/40 rounded border border-green-800">
                    Office payment selected. You will receive an order confirmation receipt to bring to our Chattogram headquarters.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation CTA */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-2xl p-6 border-2 border-[#DFC27D] shadow-card space-y-6">
              <h3 className="font-heading font-black text-xl uppercase tracking-wider text-dark border-b pb-3">
                ORDER BREAKDOWN
              </h3>

              <div className="space-y-3 divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.variant_id} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-heading font-black text-dark text-sm block uppercase">
                        {item.course.title}
                      </span>
                      <span className="text-gold-dark font-medium block">
                        Format: {item.variant.name}
                      </span>
                      <span className="text-gray-400 text-[10px]">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-heading font-black text-dark text-sm font-mono">
                      {formatPrice(item.variant.sale_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-ivory rounded-xl p-4 space-y-2 text-xs border border-[#DFC27D]/40">
                <div className="flex justify-between text-spartan-muted">
                  <span>Subtotal:</span>
                  <span className="font-bold text-dark font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-spartan-muted">
                  <span>Verification Fee:</span>
                  <span className="text-green-600 font-bold font-mono">FREE</span>
                </div>
                <div className="border-t border-[#DFC27D]/40 pt-2 flex justify-between text-base">
                  <span className="font-heading uppercase font-bold text-dark">Total Payable:</span>
                  <span className="font-heading font-black text-2xl text-dark font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Manual Verification Policy:</strong> After submitting your order, an academy administrator will verify the Transaction ID before activating course access.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-sm uppercase tracking-widest transition shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Verifying & Registering Order...' : 'Submit Order & Await Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

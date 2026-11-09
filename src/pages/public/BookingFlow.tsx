import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Armchair,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Printer,
  ChevronLeft,
  X,
  Phone,
  User,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';
import { useToast } from '../../contexts/ToastContext';
import { Booking, SeatItem } from '../../types/bus';

export const BookingFlow: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { schedules, store } = useBabaStore();
  const { showToast } = useToast();

  const schedule = schedules.find((s) => s.id === scheduleId) || schedules[0];
  const seats = schedule ? store.getSeatsForSchedule(schedule.id) : [];

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [step, setStep] = useState<'seats' | 'passenger' | 'payment' | 'confirmation'>('seats');

  // Passenger Details
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('+880 17');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [boardingPoint, setBoardingPoint] = useState(schedule?.boarding_points[0] || 'Sayedabad Terminal');
  const [droppingPoint, setDroppingPoint] = useState(schedule?.dropping_points[0] || 'Dampara Bus Stand');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!schedule) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-white">Schedule not found</h2>
        <button onClick={() => navigate('/search')} className="mt-4 text-[#38A5FF] hover:underline">
          Return to bus search
        </button>
      </div>
    );
  }

  const handleSeatClick = (seat: SeatItem) => {
    if (seat.status === 'booked' || seat.status === 'reserved') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 4) {
        showToast('Limit Reached', 'A maximum of 4 seats can be reserved in one transaction', 'info');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const fareSubtotal = selectedSeatIds.length * schedule.price;
  const platformCharge = selectedSeatIds.length > 0 ? 20 : 0;
  const totalAmount = fareSubtotal + platformCharge;

  const handleProceedToPassenger = () => {
    if (selectedSeatIds.length === 0) {
      showToast('No Seat Selected', 'Please click on at least one available seat to proceed', 'error');
      return;
    }
    setStep('passenger');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim() || passengerPhone.length < 11) {
      showToast('Validation Error', 'Please provide a valid name and 11-digit Bangladesh phone number', 'error');
      return;
    }
    setStep('payment');
  };

  const handleConfirmAndPay = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      try {
        const booking = store.createBooking({
          schedule_id: schedule.id,
          passenger_name: passengerName,
          passenger_phone: passengerPhone,
          passenger_email: passengerEmail,
          boarding_point: boardingPoint,
          dropping_point: droppingPoint,
          seats: selectedSeatIds,
          payment_method: paymentMethod,
        });

        setConfirmedBooking(booking);
        setStep('confirmation');
        setIsProcessingPayment(false);
        showToast('Ticket Confirmed!', `Booking reference #${booking.booking_reference} confirmed`, 'success');
      } catch (err: any) {
        setIsProcessingPayment(false);
        showToast('Booking Failed', err.message || 'Seat could not be reserved', 'error');
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20">
      {/* Top Breadcrumb & Journey Header */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={() => {
            if (step === 'confirmation') navigate('/');
            else if (step === 'payment') setStep('passenger');
            else if (step === 'passenger') setStep('seats');
            else navigate(-1);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{step === 'confirmation' ? 'Back to Home' : 'Back'}</span>
        </button>

        {/* Progress Stepper */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step === 'seats' ? 'bg-[#1677FF] text-white' : 'bg-[#111F3B] text-[#94A3B8]'}`}>
            1. Select Seats
          </span>
          <span className="text-[#263B5C]">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 'passenger' ? 'bg-[#1677FF] text-white' : 'bg-[#111F3B] text-[#94A3B8]'}`}>
            2. Passenger Info
          </span>
          <span className="text-[#263B5C]">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 'payment' ? 'bg-[#1677FF] text-white' : 'bg-[#111F3B] text-[#94A3B8]'}`}>
            3. Payment
          </span>
          <span className="text-[#263B5C]">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 'confirmation' ? 'bg-emerald-500 text-white' : 'bg-[#111F3B] text-[#94A3B8]'}`}>
            4. E-Ticket
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: INTERACTIVE CONTENT */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8">
          {/* STEP 1: INTERACTIVE BUS SEAT LAYOUT */}
          {step === 'seats' && (
            <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263B5C]">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Choose Your Seats</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Click available seats to reserve. Maximum 4 seats per booking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8]">Coach:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#0C1730] text-xs font-bold text-white border border-[#263B5C]">
                    {schedule.bus_name}
                  </span>
                </div>
              </div>

              {/* Bus Interior Box */}
              <div className="max-w-md mx-auto bg-[#0C1730] border-2 border-[#263B5C] rounded-3xl p-6 relative shadow-2xl">
                {/* Cockpit Front */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-dashed border-[#263B5C]">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17294A] border border-[#263B5C] text-xs text-[#94A3B8]">
                    🚪 Door
                  </div>
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Front</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17294A] border border-[#263B5C] text-xs font-bold text-white">
                    🛞 Driver
                  </div>
                </div>

                {/* 2x2 or 2x1 Grid */}
                <div className="grid grid-cols-4 gap-3 justify-items-center">
                  {seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isBooked = seat.status === 'booked';
                    const isReserved = seat.status === 'reserved';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        disabled={isBooked || isReserved}
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                          isSelected
                            ? 'bg-[#1677FF] text-white border-2 border-[#38A5FF] shadow-lg shadow-blue-500/40 scale-105'
                            : isBooked
                            ? 'bg-[#1F2937] text-gray-500 border border-gray-700 cursor-not-allowed opacity-60'
                            : isReserved
                            ? 'bg-[#FF991F]/20 text-[#FF991F] border border-[#FF991F] cursor-not-allowed'
                            : 'bg-[#17294A] text-white border border-[#263B5C] hover:border-[#1677FF] hover:bg-[#1677FF]/20 cursor-pointer'
                        }`}
                      >
                        <Armchair className="w-4 h-4 mb-0.5" />
                        <span>{seat.id}</span>
                        {isBooked && <span className="text-[9px] text-gray-500 font-sans">SOLD</span>}
                        {isReserved && <span className="text-[9px] text-[#FF991F] font-sans">HOLD</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-[#263B5C]/60 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-[#17294A] border border-[#263B5C]" />
                  <span className="text-[#94A3B8]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-[#1677FF] border border-[#38A5FF]" />
                  <span className="text-white font-bold">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-[#1F2937] border border-gray-700" />
                  <span className="text-[#94A3B8]">Booked</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGER DETAILS FORM */}
          {step === 'passenger' && (
            <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="pb-4 border-b border-[#263B5C]">
                <h2 className="text-xl font-extrabold text-white">Passenger Information</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Your ticket confirmation and boarding SMS will be delivered to these details.
                </p>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#94A3B8] block mb-1">
                    Primary Passenger Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Md. Tanvir Ahmed"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#94A3B8] block mb-1">
                      Mobile Phone Number (+880) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-234567"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-[#1677FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#94A3B8] block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="tanvir@example.com"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm text-white focus:outline-none focus:border-[#1677FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#94A3B8] block mb-1">
                      Select Boarding Terminal *
                    </label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#1677FF]"
                    >
                      {schedule.boarding_points.map((pt, i) => (
                        <option key={i} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#94A3B8] block mb-1">
                      Select Dropping Terminal *
                    </label>
                    <select
                      value={droppingPoint}
                      onChange={(e) => setDroppingPoint(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#1677FF]"
                    >
                      {schedule.dropping_points.map((pt, i) => (
                        <option key={i} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep('seats')}
                    className="text-xs font-bold text-[#94A3B8] hover:text-white"
                  >
                    Change Seats
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY SIMULATION */}
          {step === 'payment' && (
            <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="pb-4 border-b border-[#263B5C]">
                <h2 className="text-xl font-extrabold text-white">Select Payment Channel</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Safe & encrypted checkout. Real instant SMS verification simulation.
                </p>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'bkash', name: 'bKash Merchant Pay', fee: 'No extra fee', color: 'border-[#E2136E]' },
                  { id: 'nagad', name: 'Nagad Online', fee: 'No extra fee', color: 'border-[#F7941D]' },
                  { id: 'rocket', name: 'Rocket (DBBL)', fee: 'No extra fee', color: 'border-purple-500' },
                  { id: 'card', name: 'Debit / Credit Card', fee: 'Visa / Mastercard', color: 'border-blue-500' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === m.id
                        ? `${m.color} bg-[#17294A] shadow-lg`
                        : 'border-[#263B5C] bg-[#0C1730] hover:border-[#1677FF]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{m.name}</span>
                      {paymentMethod === m.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{m.fee}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Gateway Info Note */}
              <div className="p-4 rounded-2xl bg-[#0C1730] border border-[#263B5C] flex items-center gap-3 text-xs text-[#94A3B8]">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Demo Mode Simulation: Clicking "Pay Now" will simulate automated payment gateway confirmation and allocate seats under reference #BBB-2026.
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('passenger')}
                  className="text-xs font-bold text-[#94A3B8] hover:text-white"
                >
                  Back to Passenger Info
                </button>
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isProcessingPayment}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ৳ {totalAmount.toLocaleString()} Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & OFFICIAL E-TICKET */}
          {step === 'confirmation' && confirmedBooking && (
            <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6 print-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#263B5C] no-print gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-extrabold text-white">Booking Confirmed!</h2>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Your seats are locked. Please keep your reference number handy.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Ticket</span>
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-[#17294A] hover:bg-[#1E335C] text-white text-xs font-bold rounded-xl transition-all border border-[#263B5C]"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Printable Ticket Manifest Body */}
              <div className="bg-[#080F22] border-2 border-dashed border-[#263B5C] rounded-3xl p-6 text-white space-y-5">
                {/* Brand Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#263B5C]">
                  <div className="flex items-center gap-3">
                    <img src="/images/bus-bus-baba-logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                    <div>
                      <h3 className="text-base font-black">BUS BUS BABA</h3>
                      <span className="text-[10px] text-[#94A3B8]">Baba Express Transport Ltd.</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-[#FF991F] block">
                      {confirmedBooking.booking_reference}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      CONFIRMED & PAID
                    </span>
                  </div>
                </div>

                {/* Route & Coach info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#111F3B] p-4 rounded-2xl border border-[#263B5C] text-xs">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Route</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{confirmedBooking.route_title}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Coach</span>
                    <span className="font-bold text-white block mt-0.5">{confirmedBooking.bus_name}</span>
                    <span className="text-[10px] text-[#38A5FF]">{confirmedBooking.bus_type}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[#94A3B8] block text-[10px]">Departure</span>
                    <span className="font-extrabold text-[#FF991F] text-sm block mt-0.5">{confirmedBooking.departure_time}</span>
                    <span className="text-[10px] text-[#94A3B8]">{confirmedBooking.departure_date}</span>
                  </div>
                </div>

                {/* Passenger details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">Passenger Name</span>
                    <span className="font-bold text-white">{confirmedBooking.passenger_name}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">Phone</span>
                    <span className="font-mono font-bold text-white">{confirmedBooking.passenger_phone}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">Boarding Point</span>
                    <span className="font-medium text-white">{confirmedBooking.boarding_point}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block">Dropping Point</span>
                    <span className="font-medium text-white">{confirmedBooking.dropping_point}</span>
                  </div>
                </div>

                {/* Seats & Payment */}
                <div className="pt-4 border-t border-[#263B5C] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Reserved Seats:</span>
                    <div className="flex gap-1.5 mt-1">
                      {confirmedBooking.seats.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#1677FF] text-white font-mono text-xs font-bold shadow-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#94A3B8] block">Total Amount Paid</span>
                    <span className="text-xl font-black text-emerald-400">
                      ৳ {confirmedBooking.total_amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] uppercase block mt-0.5">
                      Paid via {confirmedBooking.payment_method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: JOURNEY & FARE BREAKDOWN SUMMARY CARD */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 shadow-card space-y-5 sticky top-28 no-print">
          <h3 className="text-base font-bold text-white pb-3 border-b border-[#263B5C]">
            Journey Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#94A3B8] block text-[10px]">Route</span>
              <div className="flex items-center gap-2 font-bold text-white text-sm mt-0.5">
                <span>{schedule.origin}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>{schedule.destination}</span>
              </div>
            </div>

            <div className="flex justify-between py-2 border-y border-[#263B5C]/60">
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Departure</span>
                <span className="font-bold text-white">{schedule.departure_time}</span>
              </div>
              <div className="text-right">
                <span className="text-[#94A3B8] block text-[10px]">Duration</span>
                <span className="font-bold text-[#38A5FF]">{schedule.estimated_duration}</span>
              </div>
            </div>

            <div>
              <span className="text-[#94A3B8] block text-[10px]">Selected Seats</span>
              {selectedSeatIds.length === 0 ? (
                <span className="text-amber-400 font-semibold text-xs italic">No seats selected yet</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSeatIds.map((id) => (
                    <span key={id} className="px-2 py-0.5 rounded bg-[#1677FF] text-white font-mono text-xs font-bold">
                      {id}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Fare Breakdown */}
            <div className="pt-3 border-t border-[#263B5C] space-y-1.5">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Ticket Fare ({selectedSeatIds.length} seat × ৳{schedule.price})</span>
                <span className="font-semibold text-white">৳ {fareSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Platform Service Charge</span>
                <span className="font-semibold text-white">৳ {platformCharge}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#263B5C]">
                <span>Total Payable</span>
                <span className="text-[#FF991F]">৳ {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {step === 'seats' && (
            <button
              onClick={handleProceedToPassenger}
              disabled={selectedSeatIds.length === 0}
              className={`w-full py-3.5 text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedSeatIds.length > 0
                  ? 'bg-[#1677FF] hover:bg-[#0E62DD] text-white shadow-blue-600/30'
                  : 'bg-[#17294A] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

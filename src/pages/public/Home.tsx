import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Armchair,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  ChevronDown,
  Bus,
  CreditCard,
  Headphones,
  RotateCcw,
} from 'lucide-react';
import { useBabaStore } from '../../hooks/useBabaStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { routes, schedules } = useBabaStore();

  const [fromCity, setFromCity] = useState('Dhaka');
  const [toCity, setToCity] = useState('Cox\'s Bazar');
  const [journeyDate, setJourneyDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${journeyDate}&passengers=${passengers}`);
  };

  const cities = ['Dhaka', 'Chittagong', 'Cox\'s Bazar', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Bogura', 'Comilla'];

  const popularDestinations = [
    {
      name: 'Cox\'s Bazar',
      tagline: 'World\'s longest natural sandy sea beach',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      fareFrom: 1200,
      duration: '8h 45m',
    },
    {
      name: 'Sylhet',
      tagline: 'Lush green tea gardens & Ratargul swamp',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
      fareFrom: 850,
      duration: '5h 15m',
    },
    {
      name: 'Chittagong',
      tagline: 'Port city gateway, Patenga beach & hills',
      image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&auto=format&fit=crop&q=80',
      fareFrom: 950,
      duration: '5h 30m',
    },
    {
      name: 'Rajshahi',
      tagline: 'Silk city on the banks of mighty Padma',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      fareFrom: 800,
      duration: '5h 45m',
    },
  ];

  const operators = [
    { name: 'Baba Express Transport', coaches: '48 Luxury Coaches', rating: 4.95, tag: 'Official Fleet' },
    { name: 'Green Line Paribahan', coaches: '35 Double Deckers', rating: 4.88, tag: 'Partner' },
    { name: 'Shohagh Paribahan', coaches: '40 Scania Coaches', rating: 4.85, tag: 'Partner' },
    { name: 'Silk Line Deluxe', coaches: '28 Sleeper Coaches', rating: 4.90, tag: 'Partner' },
    { name: 'Hanif Enterprise', coaches: '50 AC Coaches', rating: 4.79, tag: 'Partner' },
    { name: 'Shyamoli NR Travels', coaches: '32 Luxury Coaches', rating: 4.82, tag: 'Partner' },
  ];

  const testimonials = [
    {
      name: 'Tanvir Ahmed',
      from: 'Dhaka to Cox\'s Bazar traveler',
      comment: 'Booking seats on Bus Bus Baba was incredibly fast. I picked my exact window seat A2, paid with bKash within seconds, and got the SMS ticket instantly!',
      rating: 5,
    },
    {
      name: 'Nusrat Jahan',
      from: 'Sylhet journey',
      comment: 'The live seat layout view is very clear. The Scania coach was on time and very clean. Best online transport platform in Bangladesh.',
      rating: 5,
    },
    {
      name: 'Kabir Chowdhury',
      from: 'Frequent Corporate Traveler',
      comment: 'I travel between Dhaka and Chittagong every week. The printable ticket and easy cancellation guarantee give me complete peace of mind.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How do I choose my seat when booking?',
      a: 'During the search results, click "View Seats" on any available coach schedule. An interactive bus cockpit layout opens displaying real-time available, booked, and VIP seats. Click your preferred seat to select it!',
    },
    {
      q: 'What payment methods are supported in Bangladesh?',
      a: 'We support all major payment channels including bKash, Nagad, Rocket, Visa/Mastercard debit and credit cards, and direct Counter Cash bookings.',
    },
    {
      q: 'Can I cancel my ticket and receive a refund?',
      a: 'Yes, tickets can be cancelled from the "My Bookings" page up to 2 hours before the scheduled departure time. As per the transport policy, an 85% refund is processed back to your original payment method.',
    },
    {
      q: 'Do I need to print my ticket before boarding?',
      a: 'You can either show the digital E-Ticket on your smartphone with the booking reference (BBB-2026-XXXX) or print the ticket using the Print Ticket button on your booking confirmation.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION & BUS SEARCH WIDGET */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#1677FF]/25 to-[#FF991F]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#38A5FF] text-xs font-bold mb-4 shadow-sm animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#FF991F]" />
            <span>Bangladesh's Smartest Bus Ticketing & Fleet SaaS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Your Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38A5FF] via-[#1677FF] to-[#FF991F]">Starts Here.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto font-medium">
            Find your route, choose your seat, and travel with confidence. 100% verified coach fleet across Bangladesh.
          </p>
        </div>

        {/* BUS SEARCH WIDGET CARD */}
        <div className="relative z-10 max-w-5xl mx-auto bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-2xl baba-card-elevated">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* From City */}
              <div>
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1677FF]" />
                  From (Departure City)
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#1677FF] transition-all cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Destination City */}
              <div>
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF991F]" />
                  To (Destination City)
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#FF991F] transition-all cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Journey Date */}
              <div>
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Journey Date
                </label>
                <input
                  type="date"
                  required
                  value={journeyDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                />
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#0C1730] border border-[#263B5C] rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers (Family)</option>
                </select>
              </div>
            </div>

            {/* Quick routes bar & Submit button */}
            <div className="pt-4 border-t border-[#263B5C]/70 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#94A3B8] font-semibold">Popular Routes:</span>
                {[
                  { from: 'Dhaka', to: 'Chittagong' },
                  { from: 'Dhaka', to: 'Cox\'s Bazar' },
                  { from: 'Dhaka', to: 'Sylhet' },
                  { from: 'Dhaka', to: 'Rajshahi' },
                ].map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFromCity(r.from);
                      setToCity(r.to);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0C1730] hover:bg-[#17294A] border border-[#263B5C] text-[#38A5FF] font-medium transition-colors"
                  >
                    {r.from} → {r.to}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1677FF] to-[#0A4EB5] hover:from-[#0E62DD] hover:to-[#083E92] text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <Search className="w-4 h-4" />
                <span>Search Available Buses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS IN BANGLADESH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#FF991F] uppercase tracking-wider block mb-1">
              Explore Bangladesh
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Travel Destinations
            </h2>
          </div>
          <NavLink
            to="/routes"
            className="text-xs font-bold text-[#38A5FF] hover:underline flex items-center gap-1"
          >
            Browse all 12 highways →
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, i) => (
            <div
              key={i}
              onClick={() => {
                setFromCity('Dhaka');
                setToCity(dest.name);
                navigate(`/search?from=Dhaka&to=${encodeURIComponent(dest.name)}`);
              }}
              className="group relative rounded-3xl overflow-hidden bg-[#111F3B] border border-[#263B5C] cursor-pointer hover:border-[#1677FF] transition-all shadow-card"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111F3B] via-[#111F3B]/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#080F22]/80 backdrop-blur-md text-[11px] font-bold text-[#FF991F] border border-[#263B5C]">
                  From ৳{dest.fareFrom}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-[#38A5FF] transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                  {dest.tagline}
                </p>
                <div className="mt-4 pt-3 border-t border-[#263B5C] flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Est. {dest.duration}</span>
                  <span className="text-[#38A5FF] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Book Trip →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VERIFIED OPERATORS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#38A5FF] uppercase tracking-wider block mb-1">
            Trusted Transport Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Top Bus Operators on Baba Network
          </h2>
          <p className="text-xs text-[#94A3B8] mt-2">
            Every coach on Bus Bus Baba is inspected for road safety, GPS compliance, and passenger comfort.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {operators.map((op, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#111F3B] border border-[#263B5C] text-center hover:border-[#1677FF] transition-all group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF] mb-3 group-hover:scale-110 transition-transform">
                <Bus className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#38A5FF] transition-colors">
                {op.name}
              </h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">{op.coaches}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{op.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE BUS BUS BABA? */}
      <section className="bg-gradient-to-b from-[#0C1730] to-[#080F22] border-y border-[#263B5C] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FF991F] uppercase tracking-wider block mb-1">
              Why Bus Bus Baba?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              A Smarter Way to Experience Highway Travel
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C] shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF] mb-4">
                <Armchair className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Seat Selection</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Choose your exact window, aisle, or sleeper seat on interactive 2x2 and 2x1 coach diagrams with real-time availability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C] shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Instant bKash & Card Pay</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Pay safely in BDT with bKash, Nagad, Rocket, or credit card. Instant confirmation SMS & PDF E-ticket issued on checkout.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C] shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-[#FF991F]/15 border border-[#FF991F]/30 flex items-center justify-center text-[#FF991F] mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">On-Time Guarantee</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Live GPS highway tracking ensures punctual departures from Sayedabad, Gabtoli, Arambagh, and Dampara terminals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C] shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">24/7 Hotline Support</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Dedicated customer support agents on call 24 hours at +880 9612-888999 for boarding coordination and queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW BOOKING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How to Book Your Ticket in Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Search Highway Route', desc: 'Select your origin city, destination, and preferred date of journey.' },
            { step: '02', title: 'Choose Your Seat', desc: 'Pick your preferred seat from the live interactive bus seat map.' },
            { step: '03', title: 'Pay Safely Online', desc: 'Pay with bKash, Nagad, Rocket, or Card with zero hassle.' },
            { step: '04', title: 'Get Instant E-Ticket', desc: 'Receive your confirmed booking reference and printable E-Ticket.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#111F3B] border border-[#263B5C] relative">
              <span className="text-3xl font-black text-[#1677FF]/30 block mb-2">{item.step}</span>
              <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#FF991F] uppercase tracking-wider block mb-1">
            Real Traveler Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loved by Thousands Across Bangladesh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C] shadow-card flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#263B5C]">
                <h4 className="text-xs font-bold text-white">{t.name}</h4>
                <span className="text-[10px] text-[#38A5FF]">{t.from}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#38A5FF] uppercase tracking-wider block mb-1">
            Need Help?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#111F3B] border border-[#263B5C] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-[#38A5FF] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#94A3B8] leading-relaxed border-t border-[#263B5C]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. OPERATOR CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0C1730] via-[#111F3B] to-[#17294A] border border-[#263B5C] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-[#38A5FF] uppercase tracking-wider">
              For Bus Owners & Transport Companies
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Scale Your Bus Fleet with Bus Bus Baba SaaS
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Complete dispatch system, counter POS, driver manifest, fuel expense manager, and automated ticketing software built for Bangladesh.
            </p>
          </div>

          <NavLink
            to="/admin"
            className="px-6 py-3.5 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 transition-all shrink-0"
          >
            Launch Operator Dashboard →
          </NavLink>
        </div>
      </section>
    </div>
  );
};

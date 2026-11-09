import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Bus,
  Users,
  Compass,
  Award,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in pb-20">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#38A5FF] text-xs font-bold">
          <span>Transforming Transport in Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          About Bus Bus Baba
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Founded with a mission to bring modern cloud technology, transparent seat reservations, and enterprise fleet intelligence to passenger transportation across Bangladesh.
        </p>
      </div>

      {/* Brand Story Card */}
      <div className="bg-[#111F3B] border border-[#263B5C] rounded-3xl p-8 sm:p-10 shadow-card space-y-6">
        <h2 className="text-xl font-extrabold text-white">Our Story & Vision</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Inter-district bus travel is the lifeline of Bangladesh, connecting families, business travelers, and tourists across thousands of highway kilometers every single day. Yet passengers frequently face long counter queues, double-booked seats, and lack of real-time schedule transparency.
        </p>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          <strong>Bus Bus Baba</strong> bridges this divide. For passengers, we provide an intuitive mobile-first booking experience with live 2x2 and 2x1 seat selection and instant digital verification. For transport operators, our unified SaaS platform orchestrates dispatch, counter point-of-sale, driver assignments, and fuel expenditure controls in real time.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C]">
          <div className="w-12 h-12 rounded-2xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF] mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Punctuality & Safety</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Rigorous maintenance tracking and GPS dispatch monitoring to ensure scheduled departures stay on track.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Zero Seat Conflicts</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Transactional database locking guarantees that a seat reserved online is instantly removed from physical counter availability.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#111F3B] border border-[#263B5C]">
          <div className="w-12 h-12 rounded-2xl bg-[#FF991F]/15 border border-[#FF991F]/30 flex items-center justify-center text-[#FF991F] mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Nationwide Coverage</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Connecting key economic corridors including Dhaka, Chittagong, Cox's Bazar, Sylhet, Khulna, and Rajshahi.
          </p>
        </div>
      </div>
    </div>
  );
};

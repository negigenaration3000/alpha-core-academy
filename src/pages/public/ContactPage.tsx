import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+880 17');
  const [subject, setSubject] = useState('Ticketing Query');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Message Sent', 'Our 24/7 passenger support team will contact you shortly', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in pb-20">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          24/7 Passenger Support & Counters
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Need help with your booking, boarding terminal location, or refund status? We are always here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <h3 className="text-base font-bold text-white">Central Operations Desk</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0C1730] border border-[#263B5C]">
              <Phone className="w-5 h-5 text-[#FF991F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">+880 9612-888999</span>
                <span className="text-[11px] text-[#94A3B8]">Dedicated 24/7 Toll-Free Hotline</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0C1730] border border-[#263B5C]">
              <Mail className="w-5 h-5 text-[#38A5FF] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">support@busbusbaba.com</span>
                <span className="text-[11px] text-[#94A3B8]">Corporate queries & operator partnerships</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0C1730] border border-[#263B5C]">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Headquarters & Central Counter</span>
                <span className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Level 7, Bilkis Tower, Gulshan-2, Dhaka 1212, Bangladesh
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0C1730] border border-[#263B5C]">
              <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Counter Timings</span>
                <span className="text-[11px] text-[#94A3B8]">
                  Open 24 Hours, 7 Days a Week (including national holidays)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111F3B] border border-[#263B5C] rounded-3xl p-6 sm:p-8 shadow-card">
          <h3 className="text-base font-bold text-white mb-1">Send Support Query</h3>
          <p className="text-xs text-[#94A3B8] mb-6">Fill in the form below and an agent will assist you immediately.</p>

          {submitted ? (
            <div className="p-8 text-center bg-[#0C1730] border border-emerald-500/40 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">Thank you for contacting us!</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Our support team has received your ticket and will respond within 15 minutes.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-[#17294A] text-xs font-bold text-white rounded-xl"
              >
                Send Another Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#94A3B8] block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#94A3B8] block mb-1">Mobile Phone (+880)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#94A3B8] block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="Ticketing Query">Ticketing & Reservation Query</option>
                    <option value="Cancellation / Refund">Cancellation & Refund Request</option>
                    <option value="Boarding Point Inquiry">Boarding Point Inquiry</option>
                    <option value="Fleet Operator Partnership">Fleet Operator Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#94A3B8] block mb-1">Message / Ticket Reference</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your question or include your booking reference..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0C1730] border border-[#263B5C] rounded-xl text-xs text-white focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1677FF] hover:bg-[#0E62DD] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

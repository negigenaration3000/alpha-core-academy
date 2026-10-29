import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';
import { store } from '../../services/store';
import { SiteSettings, PaymentSetting } from '../../types';

export const Footer: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(store.getSiteSettings());
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>(store.getPaymentSettings());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSiteSettings(store.getSiteSettings());
      setPaymentSettings(store.getPaymentSettings());
    });
    return unsubscribe;
  }, []);

  return (
    <footer className="bg-dark text-white border-t-2 border-gold pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-dark-border">
          {/* Column 1: Brand & Contact info */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 p-1.5 rounded bg-dark-card border border-gold">
                <img src="/shield-helmet.svg" alt="Alpha Core Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-heading text-xl tracking-wider text-gold-light uppercase">
                {siteSettings.site_name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-400 max-w-md font-sans">
              {siteSettings.tagline} {siteSettings.secondary_tagline} Elite systems engineering, enterprise fullstack software development, and executive business warfare.
            </p>

            <div className="pt-2 space-y-2 text-xs text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>PHONE: <strong className="text-white font-mono">{siteSettings.contact_phone}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>EMAIL: <strong className="text-white font-mono">{siteSettings.contact_email}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>LOCATION: <strong className="text-white uppercase">{siteSettings.contact_address}</strong></span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-wider text-gold">Curriculum</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><Link to="/courses" className="hover:text-gold transition">All Courses</Link></li>
              <li><Link to="/courses?category=systems-warfare" className="hover:text-gold transition">C++ Masterclass</Link></li>
              <li><Link to="/courses?category=frontend-dominance" className="hover:text-gold transition">Next.js Fullstack</Link></li>
              <li><Link to="/courses?category=backend-architecture" className="hover:text-gold transition">Scalable Systems</Link></li>
              <li><Link to="/admin" className="hover:text-gold transition text-gold/80">Instructor Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Payment Gateways (as shown in reference image) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-wider text-gold">PAYMENT METHODS</h4>
            <p className="text-xs text-gray-400">
              Instant verification available across all verified Bangladesh mobile banking channels and cash.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {/* Manual Cash */}
              <div className="bg-[#1D3528] border border-green-600/40 rounded p-2 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-green-300">MANUAL</span>
                <span className="text-xs font-black text-green-400">CASH</span>
              </div>

              {/* bKash */}
              <div className="bg-[#E2136E]/20 border border-[#E2136E]/60 rounded p-2 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-pink-300">BKASH</span>
                <span className="text-[9px] text-pink-200 font-mono">01844221100</span>
              </div>

              {/* Nagad */}
              <div className="bg-[#F7941D]/20 border border-[#F7941D]/60 rounded p-2 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-orange-300">NAGAD</span>
                <span className="text-[9px] text-orange-200 font-mono">01733552211</span>
              </div>

              {/* Rocket */}
              <div className="bg-[#8C3494]/20 border border-[#8C3494]/60 rounded p-2 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-purple-300">ROCKET</span>
                <span className="text-[9px] text-purple-200 font-mono">01922441100</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-[11px] text-gray-400">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Admin verification required for all transaction submissions.</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-spartan-muted">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.site_name}. All Rights Reserved.
          </div>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <Link to="/privacy" className="hover:text-gold transition">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-gold transition">Terms & Conditions</Link>
            <span>&bull;</span>
            <Link to="/admin" className="text-gold hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

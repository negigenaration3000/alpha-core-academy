import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { SiteSettings } from '../../types';
import { isSupabaseConfigured, getSupabaseStatus } from '../../lib/supabase';
import { Settings, Save, Check, Shield, Database, ExternalLink } from 'lucide-react';

export const SiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(store.getSiteSettings());
  const [saved, setSaved] = useState(false);
  const supabaseInfo = getSupabaseStatus();

  useEffect(() => {
    const update = () => setSettings(store.getSiteSettings());
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#DFC27D]/40 pb-4">
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Master Configuration</span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
          ACADEMY BRAND &amp; SITE SETTINGS
        </h1>
      </div>

      {/* Database Connection Status Card */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gold shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            supabaseInfo.isConfigured
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-amber-100 border-amber-400 text-amber-700'
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <strong className="font-heading font-black text-sm uppercase text-dark">
                SUPABASE POSTGRESQL STATUS:
              </strong>
              <span className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase ${
                supabaseInfo.isConfigured ? 'bg-green-600 text-white' : 'bg-amber-500 text-dark'
              }`}>
                {supabaseInfo.isConfigured ? 'CONNECTED & ACTIVE' : 'LOCAL SIMULATION ENGINE (STANDBY)'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Target Project URL: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">{supabaseInfo.url}</code>
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-600 max-w-xs">
          To connect live Supabase, enter your <code className="font-bold">VITE_SUPABASE_URL</code> and <code className="font-bold">VITE_SUPABASE_ANON_KEY</code> in <code className="font-bold">.env</code>.
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFC27D]/60 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Academy Primary Brand Name
            </label>
            <input
              type="text"
              required
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Alternative Brand / Admin Brand
            </label>
            <input
              type="text"
              required
              value={settings.brand_compact}
              onChange={(e) => handleChange('brand_compact', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Lead Instructor
            </label>
            <input
              type="text"
              required
              value={settings.instructor_name}
              onChange={(e) => handleChange('instructor_name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Primary Slogan
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Secondary Spartan Tagline
            </label>
            <input
              type="text"
              value={settings.secondary_tagline}
              onChange={(e) => handleChange('secondary_tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Hero CTA Label
            </label>
            <input
              type="text"
              value={settings.cta_hero}
              onChange={(e) => handleChange('cta_hero', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-heading uppercase font-bold text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Official Contact Phone
            </label>
            <input
              type="text"
              value={settings.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Official Inquiries Email
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Physical Location / Headquarters
            </label>
            <input
              type="text"
              value={settings.contact_address}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 uppercase text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-heading uppercase font-bold text-dark mb-1">
              Default Currency Code &amp; Symbol
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-1/2 px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono font-bold uppercase"
              />
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                className="w-1/2 px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved Live!' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import { HelpCircle, Database, Shield, Key, CreditCard, Layers } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-[#DFC27D]/40 pb-4">
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">System Architecture</span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
          ADMINISTRATOR WAR-MANUAL &amp; SETUP GUIDE
        </h1>
      </div>

      <div className="space-y-6 text-xs text-spartan-text">
        {/* Card 1: Supabase Setup */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-dark font-heading font-black text-base uppercase">
            <Database className="w-5 h-5 text-gold" />
            <span>1. Supabase PostgreSQL Database Setup</span>
          </div>
          <p className="leading-relaxed text-gray-700">
            Alpha-Core Academy is equipped with a complete PostgreSQL schema in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-dark">supabase/migrations/20261028000000_alpha_core_schema.sql</code> and starter seed in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-dark">supabase/seed.sql</code>.
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 text-gray-600">
            <li>Create a project at <strong className="text-dark">supabase.com</strong>.</li>
            <li>Navigate to the <strong>SQL Editor</strong> in your Supabase Dashboard.</li>
            <li>Paste and execute <code className="font-mono text-dark font-bold">20261028000000_alpha_core_schema.sql</code>, followed by <code className="font-mono text-dark font-bold">seed.sql</code>.</li>
            <li>Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from Project Settings &gt; API.</li>
            <li>Place them into your <code className="font-mono text-dark font-bold">.env</code> file:
              <pre className="bg-dark text-gold p-3 rounded-lg mt-2 font-mono text-[11px] overflow-x-auto">
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
              </pre>
            </li>
          </ol>
        </div>

        {/* Card 2: Bootstrapping First Admin */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-dark font-heading font-black text-base uppercase">
            <Shield className="w-5 h-5 text-gold" />
            <span>2. Bootstrapping Your First Admin Account</span>
          </div>
          <p className="leading-relaxed text-gray-700">
            In accordance with military-grade database security rules, frontend registration does NOT grant administrative privileges. To elevate an authorized account to administrator in Supabase:
          </p>
          <pre className="bg-dark text-white p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
-- Elevate your user account to administrator
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
          </pre>
        </div>

        {/* Card 3: Bangladesh Gateways & Manual Verification */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFC27D]/60 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-dark font-heading font-black text-base uppercase">
            <CreditCard className="w-5 h-5 text-gold" />
            <span>3. Manual Payment Verification Protocol</span>
          </div>
          <p className="leading-relaxed text-gray-700">
            To prevent fraud without expensive automated gateway aggregators:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
            <li>Students send funds to your configured bKash, Nagad, or Rocket collection numbers and submit their sender phone &amp; TrxID.</li>
            <li>The order enters <strong className="text-amber-800">Awaiting Verification</strong> status.</li>
            <li>The administrator checks the SMS / statement for that TrxID and clicks <strong className="text-green-700">Verify</strong> in the Orders panel.</li>
            <li>Verification triggers the Postgres trigger/RPC function, granting active course enrollment immediately.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

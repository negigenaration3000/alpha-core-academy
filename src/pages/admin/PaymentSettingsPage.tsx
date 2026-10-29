import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { PaymentSetting } from '../../types';
import { CreditCard, Save, Check, Shield, AlertCircle } from 'lucide-react';

export const PaymentSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSetting[]>(store.getPaymentSettings());
  const [savedProvider, setSavedProvider] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setSettings(store.getPaymentSettings());
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const handleChange = (provider: string, field: keyof PaymentSetting, value: any) => {
    setSettings((prev) =>
      prev.map((item) => (item.provider === provider ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = (setting: PaymentSetting) => {
    store.updatePaymentSetting(setting.provider, {
      payment_number: setting.payment_number,
      account_type: setting.account_type,
      instructions: setting.instructions,
      is_enabled: setting.is_enabled,
    });
    setSavedProvider(setting.provider);
    setTimeout(() => setSavedProvider(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#DFC27D]/40 pb-4">
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Gateway Infrastructure</span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
          BANGLADESH PAYMENT GATEWAYS CONFIGURATION
        </h1>
        <p className="text-xs text-spartan-muted mt-1">
          Configured collection numbers and send money instructions are reflected live on the public checkout page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <div key={setting.provider} className="bg-white rounded-2xl p-6 border-2 border-[#DFC27D]/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gold" />
                <h3 className="font-heading font-black text-lg uppercase text-dark">
                  {setting.display_name}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-heading font-bold uppercase text-spartan-muted">
                  {setting.is_enabled ? 'Active' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={setting.is_enabled}
                  onChange={(e) => handleChange(setting.provider, 'is_enabled', e.target.checked)}
                  className="rounded text-gold focus:ring-gold"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">
                  Collection Number / Account Identifier *
                </label>
                <input
                  type="text"
                  value={setting.payment_number}
                  onChange={(e) => handleChange(setting.provider, 'payment_number', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">
                  Account Type
                </label>
                <select
                  value={setting.account_type}
                  onChange={(e) => handleChange(setting.provider, 'account_type', e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none bg-white font-medium"
                >
                  <option value="Personal">Personal Account</option>
                  <option value="Merchant">Merchant Account</option>
                  <option value="Agent">Agent Account</option>
                </select>
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">
                  Checkout Customer Instructions
                </label>
                <textarea
                  rows={3}
                  value={setting.instructions}
                  onChange={(e) => handleChange(setting.provider, 'instructions', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>

              <button
                onClick={() => handleSave(setting)}
                className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {savedProvider === setting.provider ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save {setting.display_name} Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Legal: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const isPrivacy = type === 'privacy';
  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-8 border-2 border-[#DFC27D]/60 shadow-card space-y-6 text-xs text-spartan-text leading-relaxed">
          <div className="border-b pb-4">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Legal Protocols</span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-dark">
              {isPrivacy ? 'ACADEMY PRIVACY POLICY' : 'TERMS OF WARRIOR ENROLLMENT'}
            </h1>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              Welcome to Alpha-Core Academy. By registering for our curriculum tracks, enrolling in course variations, or submitting manual mobile financial transactions, you agree to these operational protocols.
            </p>

            <h3 className="font-heading font-bold text-dark text-sm uppercase">1. Intellectual Property &amp; Video Material</h3>
            <p>
              All video modules, system blueprints, source code repositories, and architectural drill exercises are proprietary assets of Sohel Shahriar and Alpha-Core Academy. Redistribution, recording, or unauthorized sharing will result in permanent enrollment revocation without refund.
            </p>

            <h3 className="font-heading font-bold text-dark text-sm uppercase">2. Manual Payment Verification</h3>
            <p>
              Manual transactions via bKash, Nagad, and Rocket are authenticated by human administrators. Fraudulent or recycled transaction IDs will cause immediate account suspension and blacklisting across our platform.
            </p>

            <h3 className="font-heading font-bold text-dark text-sm uppercase">3. Variation Access &amp; Limits</h3>
            <p>
              Purchased course variations strictly correspond to the features configured for that tier (e.g. recorded access vs. live interactive architecture war-rooms). Upgrades are available upon request through the administrative office.
            </p>
          </div>

          <div className="pt-4 border-t">
            <Link to="/" className="text-gold font-heading font-bold uppercase hover:underline">
              &larr; Return to Alpha-Core Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

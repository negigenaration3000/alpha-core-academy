import React from 'react';
import { Shield, Target, Cpu } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: ELITE MENTORSHIP */}
        <div className="bg-[#FFF9ED] rounded-xl p-6 sm:p-7 border border-[#DFC27D] shadow-card hover:shadow-gold-sm transition duration-300 flex flex-col items-center text-center group">
          <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center p-3 mb-4 border border-gold/40 shadow-sm group-hover:scale-110 transition">
            <Shield className="w-8 h-8 text-gold stroke-[2]" />
          </div>
          <h3 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-dark uppercase mb-2">
            ELITE MENTORSHIP
          </h3>
          <p className="font-sans text-xs sm:text-sm text-spartan-muted leading-relaxed">
            Direct access to veteran architects who review your code, dissect architecture, and build mission-ready engineers.
          </p>
        </div>

        {/* Card 2: WARRIOR MINDSET (Gold background matching reference) */}
        <div className="bg-gradient-to-br from-[#E8D49A] via-[#C8A653] to-[#B38F37] rounded-xl p-6 sm:p-7 border border-gold shadow-gold-md hover:shadow-gold-lg transition duration-300 flex flex-col items-center text-center text-dark group transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center p-3 mb-4 border border-gold-light shadow-md group-hover:scale-110 transition">
            <Target className="w-8 h-8 text-gold-light stroke-[2.2]" />
          </div>
          <h3 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-dark uppercase mb-2">
            WARRIOR MINDSET
          </h3>
          <p className="font-sans text-xs sm:text-sm text-dark/90 font-medium leading-relaxed">
            Zero excuses. Maximum discipline. We instill relentless execution habits that separate market leaders from competitors.
          </p>
        </div>

        {/* Card 3: TECH MASTERY (Rose / coral background matching reference) */}
        <div className="bg-[#E99CB0] rounded-xl p-6 sm:p-7 border border-[#D97E95] shadow-card hover:shadow-gold-sm transition duration-300 flex flex-col items-center text-center text-dark group">
          <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center p-3 mb-4 border border-gold/40 shadow-sm group-hover:scale-110 transition">
            <Cpu className="w-8 h-8 text-rose stroke-[2]" />
          </div>
          <h3 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-dark uppercase mb-2">
            TECH MASTERY
          </h3>
          <p className="font-sans text-xs sm:text-sm text-dark/80 font-medium leading-relaxed">
            Deep dive into low-level memory, systems design, edge caching, and scalable fullstack production deployments.
          </p>
        </div>
      </div>
    </section>
  );
};

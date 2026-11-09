import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: React.ReactNode;
  iconBgColor: string;
  sparklineColor: string;
  sparklineId: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growth,
  icon,
  iconBgColor,
  sparklineColor,
  sparklineId,
}) => {
  return (
    <div className="relative bg-[#121D32] hover:bg-[#16243E] border border-[#26344D] rounded-2xl p-5 overflow-hidden transition-all duration-300 group shadow-lg">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${iconBgColor}`}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{value}</h4>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{title}</p>
          </div>
        </div>

        {/* Growth pill */}
        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{growth}%</span>
        </div>
      </div>

      {/* Decorative Wave Sparkline at bottom */}
      <div className="mt-4 -mx-5 -mb-5 h-12 overflow-hidden opacity-85 group-hover:opacity-100 transition-opacity">
        <svg
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`grad-${sparklineId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M0,45 C50,20 100,50 150,30 C200,10 250,40 300,25 L300,60 L0,60 Z"
            fill={`url(#grad-${sparklineId})`}
          />
          <path
            d="M0,45 C50,20 100,50 150,30 C200,10 250,40 300,25"
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

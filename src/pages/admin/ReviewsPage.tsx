import React, { useState } from 'react';
import { Star, Check, X, Shield } from 'lucide-react';

interface ReviewItem {
  id: string;
  student: string;
  course: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      student: 'Sohel Shahriar (Cadet)',
      course: 'C++ MASTERCLASS',
      rating: 5,
      comment: 'The memory models and custom memory allocators in this masterclass unlocked performance insights I never got in 4 years of university.',
      status: 'approved',
      date: '2026-10-26',
    },
    {
      id: 'rev-2',
      student: 'Nairal Neme',
      course: 'NEXT.JS FULLSTACK WARFARE',
      rating: 5,
      comment: 'Uncompromising standard. From Supabase RLS security policies to live mobile banking integrations, this is pure war-room engineering.',
      status: 'approved',
      date: '2026-10-27',
    },
    {
      id: 'rev-3',
      student: 'Sehel Rokor',
      course: 'SCALABLE SYSTEMS DOMINANCE',
      rating: 5,
      comment: 'Kafka clustering and multi-datacenter failover drills were ruthless and practical. Highly recommended.',
      status: 'pending',
      date: '2026-10-28',
    },
  ]);

  const setStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#DFC27D]/40 pb-4">
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Quality Verification</span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
          STUDENT TESTIMONIALS &amp; REVIEWS
        </h1>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white rounded-2xl p-5 border border-[#DFC27D]/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-heading font-bold uppercase text-dark text-sm">{rev.student}</span>
                <span className="text-gray-400 text-xs">&bull; {rev.course}</span>
                <div className="flex items-center">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-700 font-sans italic">"{rev.comment}"</p>
              <span className="text-[10px] text-gray-400 font-mono block">Submitted: {rev.date}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase ${
                rev.status === 'approved' ? 'bg-green-100 text-green-800' : rev.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {rev.status}
              </span>
              {rev.status === 'pending' && (
                <>
                  <button
                    onClick={() => setStatus(rev.id, 'approved')}
                    className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStatus(rev.id, 'rejected')}
                    className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

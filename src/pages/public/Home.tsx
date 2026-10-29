import React from 'react';
import { HeroCarousel } from '../../components/carousel/HeroCarousel';
import { FeatureCards } from '../../components/home/FeatureCards';
import { CategorySection } from '../../components/home/CategorySection';
import { LatestCourses } from '../../components/home/LatestCourses';
import { Shield, Award, Terminal, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="bg-ivory min-h-screen">
      {/* 1. Hero Carousel matching reference */}
      <HeroCarousel />

      {/* 2. Feature Highlight Cards: Elite Mentorship, Warrior Mindset, Tech Mastery */}
      <FeatureCards />

      {/* 3. Course Domains / Categories (Frontend, Backend, Systems, Data) */}
      <CategorySection />

      {/* 4. Latest Courses: C++, Next.js, Scalable Systems */}
      <LatestCourses />

      {/* 5. Alpha-Core Manifesto / Spartan War-Room Section */}
      <section className="bg-dark text-white py-16 border-t-2 border-b-2 border-gold/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-gold text-xs font-heading uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                <span>THE SPARTAN CODE OF CODE</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                CRUSH MEDIOCRITY. BUILD SYSTEMS THAT ENDURE.
              </h2>
              <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Alpha-Core Academy is not a passive tutorial library. It is an intense technological crucible engineered to transform ambitious software engineers into elite, high-value technical architects and entrepreneurs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Production-Grade Distributed Codebases</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Kernel &amp; Memory Mastery from Scratch</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Real Manual Payment Verification Architecture</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Zero Fluff, 100% Industry War-Room Drills</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <div className="inline-block p-6 rounded-2xl bg-dark-card border-2 border-gold shadow-gold-md">
                <div className="font-heading font-black text-4xl text-gold">
                  100%
                </div>
                <div className="text-xs font-heading uppercase tracking-wider text-gray-300 mt-1">
                  PRACTICAL ARCHITECTURE
                </div>
                <div className="mt-4">
                  <Link
                    to="/courses"
                    className="inline-block px-6 py-2.5 rounded bg-gold hover:bg-gold-light text-dark font-heading font-bold text-xs uppercase tracking-wider transition"
                  >
                    View All Tracks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

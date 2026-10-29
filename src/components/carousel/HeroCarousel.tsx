import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, Award, Terminal } from 'lucide-react';
import { store } from '../../services/store';
import { Banner } from '../../types';

export const HeroCarousel: React.FC = () => {
  const [banner, setBanner] = useState<Banner>(store.getBanner());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBanner(store.getBanner());
    });
    return unsubscribe;
  }, []);

  // Slide definitions for multi-slide carousel
  const slides = [
    {
      id: 'slide-1',
      title: banner.title || 'THE ALPHA-CORE ACADEMY.',
      subtitle: banner.subtitle || 'LED BY SOHEL SHAHRIAR.',
      supporting: banner.supporting_text || 'Dominate the Tech and Business Stack.',
      slogan: banner.slogan || 'CRUSH COMPETITION. NO EXCUSES.',
      cta: banner.button_text || 'DOMINATE THE CURRICULUM',
      ctaLink: banner.target_url || '/courses',
      badge: 'TOP TIER ENGINEERING',
    },
    {
      id: 'slide-2',
      title: 'ENTERPRISE SYSTEMS WARFARE.',
      subtitle: 'HARDWARE TO THE CLOUD.',
      supporting: 'Master high-concurrency kernels, memory layout, distributed Kafka & Redis clustering.',
      slogan: 'PRECISION OVER SPEED. ARCHITECTURE OVER SYNTAX.',
      cta: 'EXPLORE SYSTEMS TRACK',
      ctaLink: '/courses?category=systems-warfare',
      badge: 'BATTLE-TESTED CURRICULUM',
    },
    {
      id: 'slide-3',
      title: 'FULLSTACK DOMINANCE.',
      subtitle: 'MODERN WEB ENGINEERING.',
      supporting: 'Next.js 15, PostgreSQL Row Level Security, transactional billing & scalable architectures.',
      slogan: 'ZERO EXCUSES. MAXIMUM EXECUTION.',
      cta: 'ENROLL IN FULLSTACK',
      ctaLink: '/courses?category=frontend-dominance',
      badge: 'CAREER ACCELERATION',
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] text-white border-b-2 border-gold/40">
      {/* Background Graphic Grid with Datacenter Server Racks */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"
          alt="Server Room Infrastructure"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 min-h-[480px] lg:min-h-[540px] flex items-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Professional Instructor Hero Visual (Matching Reference Image) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative group">
              {/* Gold decorative aura */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold opacity-50 blur-lg group-hover:opacity-80 transition duration-500"></div>

              {/* Portrait frame with server rack backdrop */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold bg-[#121316] w-72 sm:w-80 h-96 sm:h-[440px] shadow-2xl flex items-center justify-center">
                <img
                  src="/images/instructor_hero.png"
                  alt="Instructor Sohel Shahriar"
                  className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
                />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold text-gold-light text-xs font-heading uppercase tracking-wider mb-1">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span>SOHEL SHAHRIAR</span>
                  </div>
                  <p className="text-[11px] text-gray-300 font-sans tracking-wide">
                    Lead Systems Architect &amp; Founder
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content Matching Reference Image */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-dark-card border border-gold/40 text-gold text-xs font-heading uppercase tracking-widest shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-gold" />
              <span>{active.badge}</span>
            </div>

            <div className="space-y-1">
              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
                {active.title}
              </h1>
              <h2 className="font-heading font-bold text-2xl sm:text-4xl text-gold-light uppercase tracking-wide">
                {active.subtitle}
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg text-gray-300 max-w-xl">
              {active.supporting}
            </p>

            <div className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-gold uppercase">
              {active.slogan}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                to={active.ctaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded bg-gold hover:bg-gold-light text-dark font-heading font-black text-sm uppercase tracking-widest shadow-gold-md hover:shadow-gold-lg transition transform hover:-translate-y-0.5 border border-gold-light"
              >
                {active.cta}
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded bg-dark-card hover:bg-dark-surface text-gray-200 font-heading text-sm uppercase tracking-wider border border-gold/30 hover:border-gold transition"
              >
                Explore All Variations
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/80 hover:bg-gold hover:text-dark text-gold border border-gold/40 flex items-center justify-center transition shadow-lg z-30"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/80 hover:bg-gold hover:text-dark text-gold border border-gold/40 flex items-center justify-center transition shadow-lg z-30"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-gold' : 'w-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

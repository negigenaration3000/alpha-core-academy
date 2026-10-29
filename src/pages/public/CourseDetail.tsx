import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store } from '../../services/store';
import { Course, CourseVariant } from '../../types';
import { useCart } from '../../hooks/useCart';
import { 
  Star, Clock, BookOpen, Globe, Award, Shield, CheckCircle2, 
  ShoppingCart, ArrowRight, Check, Users, Sparkles, Layers 
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();

  const [course, setCourse] = useState<Course | undefined>(() => store.getCourseBySlug(slug || ''));
  const [selectedVariant, setSelectedVariant] = useState<CourseVariant | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const found = store.getCourseBySlug(slug || '');
    setCourse(found);
    if (found?.variants && found.variants.length > 0) {
      setSelectedVariant(found.variants[0]);
    }
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-md shadow-card">
          <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
          <h2 className="font-heading text-xl uppercase text-dark">Course Not Found</h2>
          <p className="text-xs text-gray-500 mt-2">The requested curriculum track does not exist or has been archived.</p>
          <Link to="/courses" className="mt-4 inline-block px-5 py-2 rounded bg-gold text-dark font-heading text-xs uppercase font-bold">
            Back to All Courses
          </Link>
        </div>
      </div>
    );
  }

  const variants = course.variants || [];
  const currentVariant = selectedVariant || variants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCart(course, currentVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!currentVariant) return;
    addToCart(course, currentVariant);
    navigate('/checkout');
  };

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-heading tracking-wider uppercase text-spartan-muted mb-6">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-gold">Courses</Link>
          <span>/</span>
          <span className="text-dark font-bold">{course.title}</span>
        </div>

        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Details & Syllabus */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-dark text-gold text-xs font-heading uppercase tracking-widest border border-gold/40">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>{course.category?.name || 'SYSTEMS DISCIPLINE'}</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-dark leading-tight">
              {course.title}
            </h1>

            <p className="font-sans text-base sm:text-lg text-spartan-muted leading-relaxed">
              {course.description || course.short_description}
            </p>

            {/* Quick Meta Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#DFC27D]/40 text-xs text-dark">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase">Duration</span>
                  <span className="font-bold">{course.duration}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase">Level</span>
                  <span className="font-bold">{course.level}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase">Language</span>
                  <span className="font-bold">{course.language}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase">Instructor</span>
                  <span className="font-bold">{course.instructor_name}</span>
                </div>
              </div>
            </div>

            {/* What You Will Master */}
            <div className="bg-white rounded-xl p-6 border border-[#DFC27D]/50 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-xl uppercase tracking-wider text-dark flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span>WAR-ROOM OUTCOMES &amp; SYLLABUS</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-spartan-text">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Dismantle low-level memory architectures &amp; hardware abstractions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Deploy production microservices under high load stress testing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Master Supabase PostgreSQL RLS, triggers &amp; multi-tenancy</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Direct architectural code reviews with Sohel Shahriar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Engine & Variation Selector Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#151619] rounded-2xl overflow-hidden border-2 border-gold shadow-gold-md p-6 text-white space-y-6">
              {/* Graphic Banner */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#0D0E10] border border-gold/40 flex items-center justify-center">
                <div className="w-20 h-20 p-2 rounded-xl bg-dark border border-gold shadow-gold-sm">
                  <img src="/shield-helmet.svg" alt="Course Badge" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-dark/80 px-2 py-0.5 rounded text-[10px] text-gold border border-gold/40">
                  <Star className="w-3 h-3 fill-gold" />
                  <span className="font-bold">4.9 / 5.0</span>
                </div>
              </div>

              {/* Dynamic Price Display (Immediately updates when variation is selected) */}
              <div className="bg-gradient-to-r from-[#C8A653] via-[#E8D49A] to-[#C8A653] p-4 rounded-xl text-dark flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest block text-dark/70">
                    Selected Variant Price:
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-dark tracking-tight">
                      {formatPrice(currentVariant?.sale_price || 999)}
                    </span>
                    {currentVariant && currentVariant.regular_price > currentVariant.sale_price && (
                      <span className="text-sm font-bold line-through text-dark/60 font-sans">
                        {formatPrice(currentVariant.regular_price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-dark text-gold font-heading text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    Save {Math.round((((currentVariant?.regular_price || 0) - (currentVariant?.sale_price || 0)) / (currentVariant?.regular_price || 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Variation Selection Radio / Pills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-heading uppercase tracking-wider text-gold-light">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Layers className="w-4 h-4 text-gold" />
                    <span>Select Course Variation:</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Independent Pricing</span>
                </div>

                <div className="space-y-2">
                  {variants.map((v) => {
                    const isSelected = currentVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full p-3.5 rounded-xl border text-left transition duration-200 flex items-start justify-between ${
                          isSelected
                            ? 'bg-gold/15 border-gold shadow-gold-sm'
                            : 'bg-dark-surface/60 border-dark-border hover:border-gold/40'
                        }`}
                      >
                        <div className="space-y-1 pr-2">
                          <div className="flex items-center space-x-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-gold bg-gold' : 'border-gray-500'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-dark" />}
                            </span>
                            <span className="font-heading font-bold text-sm tracking-wide text-white uppercase">
                              {v.name}
                            </span>
                          </div>
                          {v.description && (
                            <p className="text-[11px] text-gray-400 pl-5 font-sans leading-tight">
                              {v.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-heading font-bold text-sm text-gold">
                            {formatPrice(v.sale_price)}
                          </div>
                          {v.regular_price > v.sale_price && (
                            <div className="text-[10px] text-gray-500 line-through">
                              {formatPrice(v.regular_price)}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-dark font-heading font-black text-sm uppercase tracking-widest transition shadow-gold-md flex items-center justify-center gap-2"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition ${
                    added
                      ? 'bg-green-600 text-white border-green-500'
                      : 'bg-dark-surface hover:bg-black text-gray-200 border-gold/40 hover:border-gold'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-gold" />
                      <span>Add Selected Variation to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security guarantees */}
              <div className="pt-2 border-t border-dark-border text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>Verified Bangladesh Payment Processing &amp; Manual Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Shield, ShoppingCart, Check } from 'lucide-react';
import { Course, CourseVariant } from '../../types';
import { useCart } from '../../hooks/useCart';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();
  const variants = course.variants || [];
  
  // Default to lowest active sale price or first variant
  const [selectedVariant, setSelectedVariant] = useState<CourseVariant>(() => {
    if (variants.length > 0) {
      return [...variants].sort((a, b) => a.sale_price - b.sale_price)[0];
    }
    return {
      id: `default-${course.id}`,
      course_id: course.id,
      name: 'Standard Variation',
      regular_price: 999,
      sale_price: 999,
      duration_days: 365,
      is_active: true,
    };
  });

  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course, selectedVariant);
    navigate('/checkout');
  };

  const rating = course.average_rating || 5.0;

  return (
    <div className="bg-[#151619] rounded-xl overflow-hidden border-2 border-gold/40 hover:border-gold transition-all duration-300 shadow-card hover:shadow-gold-md flex flex-col group">
      {/* Top Graphic: Shield Crest on Dark Tech Grid (Matching Reference Image) */}
      <Link to={`/course/${course.slug}`} className="relative h-56 sm:h-64 bg-[#0D0E10] flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2024_1px,transparent_1px),linear-gradient(to_bottom,#1f2024_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
        
        {/* Spartan Helmet Crest inside Gold Shield (matching reference image) */}
        <div className="relative z-10 w-28 h-28 flex items-center justify-center p-3 rounded-2xl bg-dark/90 border-2 border-gold shadow-gold-md group-hover:scale-110 transition duration-500">
          <img src="/shield-helmet.svg" alt={course.title} className="w-full h-full object-contain filter drop-shadow-md" />
        </div>

        {/* Level badge */}
        <div className="absolute top-3 right-3 bg-dark/80 border border-gold/40 text-gold-light text-[10px] font-heading uppercase px-2 py-0.5 rounded tracking-wider">
          {course.level.split(' ')[0]}
        </div>

        {/* 5-star Rating on the card image */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
          ))}
        </div>
      </Link>

      {/* Middle: Course Title & Variations Selector */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-dark">
        <div>
          <Link to={`/course/${course.slug}`}>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase hover:text-gold transition">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 font-sans">
            {course.short_description}
          </p>
        </div>

        {/* Variation Selection Pills */}
        {variants.length > 1 && (
          <div className="mt-3 pt-3 border-t border-dark-border">
            <span className="text-[10px] font-heading uppercase tracking-wider text-spartan-muted block mb-1.5">
              Available Formats:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] px-2 py-1 rounded font-semibold transition ${
                    selectedVariant.id === v.id
                      ? 'bg-gold text-dark font-bold'
                      : 'bg-dark-surface text-gray-300 hover:text-white border border-dark-border'
                  }`}
                >
                  {v.name.split('+')[0].trim()} ({formatPrice(v.sale_price)})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Golden Banner with Price and Instructor (Matching Reference Image) */}
      <div className="bg-gradient-to-r from-[#C8A653] via-[#E8D49A] to-[#C8A653] p-3 sm:p-4 flex items-center justify-between border-t border-gold text-dark">
        {/* Price Tag */}
        <div className="flex items-baseline space-x-2">
          <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight leading-none text-dark">
            {formatPrice(selectedVariant.sale_price)}
          </span>
          {selectedVariant.regular_price > selectedVariant.sale_price && (
            <span className="text-xs font-bold line-through text-dark/60 font-sans">
              {formatPrice(selectedVariant.regular_price)}
            </span>
          )}
        </div>

        {/* Instructor Avatar Thumbnail (Matching Reference Image) */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-dark shadow-sm bg-dark">
            <img
              src="/images/instructor_hero.png"
              alt={course.instructor_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-[#121315] p-3 flex items-center gap-2 border-t border-dark-border">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2 rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-dark-surface hover:bg-gold hover:text-dark text-gray-200 border border-gold/30'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-2 rounded bg-gold hover:bg-gold-light text-dark text-xs font-heading font-black uppercase tracking-wider transition shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

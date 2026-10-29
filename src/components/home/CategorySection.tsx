import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../services/store';
import { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(store.getCategories().filter((c) => c.is_active));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCategories(store.getCategories().filter((c) => c.is_active));
    });
    return unsubscribe;
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex items-end justify-between mb-8 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading tracking-widest text-gold uppercase font-bold">Curated Disciplines</span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-dark uppercase tracking-tight">
            COURSE DOMAINS
          </h2>
        </div>
        <Link
          to="/courses"
          className="text-xs sm:text-sm font-heading tracking-wider uppercase text-spartan-text hover:text-gold flex items-center gap-1 transition"
        >
          <span>View All Disciplines</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/courses?category=${category.slug}`}
            className="group relative h-64 sm:h-80 rounded-xl overflow-hidden border-2 border-dark/20 hover:border-gold shadow-card hover:shadow-gold-md transition-all duration-300 flex flex-col justify-end p-5 bg-dark"
          >
            {/* Background image with dark overlay */}
            <img
              src={category.image_url}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-105 group-hover:brightness-75 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content matching reference image typography */}
            <div className="relative z-10 text-center">
              <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-white tracking-wider uppercase group-hover:text-gold-light transition">
                {category.name}
              </h3>
              <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition duration-300">
                {category.description}
              </p>
              <div className="mt-3 inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-gold group-hover:underline">
                Explore Curriculum &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

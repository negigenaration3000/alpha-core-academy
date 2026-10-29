import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { store } from '../../services/store';
import { Course } from '../../types';
import { CourseCard } from '../courses/CourseCard';

export const LatestCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCourses(store.getCourses());
    });
    return unsubscribe;
  }, []);

  const categories = store.getCategories();

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter((c) => c.category?.slug === activeCategory || c.category_id === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      {/* Header matching reference image: "LATEST COURSES" with prev/next arrows */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-[#DFC27D]/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-gold text-xs font-heading font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Mastery Tracks</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark uppercase tracking-tight">
            LATEST COURSES
          </h2>
        </div>

        {/* Carousel Prev/Next Buttons (matching reference image) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveCategory('all')}
            className="w-9 h-9 rounded bg-dark hover:bg-gold hover:text-dark text-gold border border-gold/40 flex items-center justify-center transition"
            aria-label="Previous Courses"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveCategory('all')}
            className="w-9 h-9 rounded bg-dark hover:bg-gold hover:text-dark text-gold border border-gold/40 flex items-center justify-center transition"
            aria-label="Next Courses"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition ${
            activeCategory === 'all'
              ? 'bg-dark text-gold border border-gold shadow-sm font-bold'
              : 'bg-ivory-dark text-spartan-muted hover:text-dark border border-gray-300'
          }`}
        >
          All Tracks
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition whitespace-nowrap ${
              activeCategory === cat.slug
                ? 'bg-dark text-gold border border-gold shadow-sm font-bold'
                : 'bg-ivory-dark text-spartan-muted hover:text-dark border border-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Course Grid: 3 cards matching the reference */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-sm font-heading uppercase text-spartan-muted">No courses found in this category.</p>
        </div>
      )}
    </section>
  );
};

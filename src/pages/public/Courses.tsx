import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../../services/store';
import { Course } from '../../types';
import { CourseCard } from '../../components/courses/CourseCard';
import { Search, Filter, Shield, SlidersHorizontal } from 'lucide-react';

export const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  
  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCourses(store.getCourses());
    });
    return unsubscribe;
  }, []);

  const categories = store.getCategories();

  // Filter logic
  let filtered = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      course.category?.slug === selectedCategory ||
      course.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort logic
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.variants?.[0]?.sale_price || 0;
    const priceB = b.variants?.[0]?.sale_price || 0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return 0; // default order
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner */}
        <div className="bg-dark text-white rounded-2xl p-8 mb-10 border-2 border-gold/40 shadow-card">
          <div className="flex items-center space-x-2 text-gold text-xs font-heading font-bold uppercase tracking-widest mb-2">
            <Shield className="w-4 h-4" />
            <span>ELITE ENGINEERING TRACKS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            MASTER CURRICULUM
          </h1>
          <p className="font-sans text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Select your discipline. Each course offers distinct formats: on-demand recorded archives, interactive live labs, and 1-on-1 Spartan mentorship.
          </p>
        </div>

        {/* Controls Bar: Search, Category Filters, Sort */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#DFC27D]/50 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses, stacks, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-gold focus:outline-none text-xs font-medium"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>

            {/* Category Dropdown (Mobile) / Pills */}
            <div className="md:col-span-4 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-spartan-muted flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 text-xs font-heading uppercase tracking-wider focus:border-gold focus:outline-none bg-white"
              >
                <option value="all">ALL DISCIPLINES</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-spartan-muted flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-lg border border-gray-300 text-xs font-heading uppercase tracking-wider focus:border-gold focus:outline-none bg-white"
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs font-heading tracking-wider uppercase text-spartan-muted">
          <span>Showing {filtered.length} courses</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gold font-bold hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
            <h3 className="font-heading text-lg uppercase text-dark">No Matching Courses Found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or discipline filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

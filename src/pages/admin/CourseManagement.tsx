import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Course, Category } from '../../types';
import { Plus, Edit3, Trash2, Shield, Check, X, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('12 Weeks');
  const [level, setLevel] = useState('Intermediate to Advanced');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [regularPrice, setRegularPrice] = useState('1390');
  const [salePrice, setSalePrice] = useState('999');

  useEffect(() => {
    const update = () => {
      setCourses(store.getCourses());
      setCategories(store.getCategories());
    };
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setSlug('');
    setShortDesc('');
    setCategoryId(categories[0]?.id || '');
    setDuration('12 Weeks');
    setLevel('Intermediate to Advanced');
    setStatus('published');
    setRegularPrice('1390');
    setSalePrice('999');
    setShowModal(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setTitle(c.title);
    setSlug(c.slug);
    setShortDesc(c.short_description);
    setCategoryId(c.category_id || categories[0]?.id || '');
    setDuration(c.duration);
    setLevel(c.level);
    setStatus(c.status as any);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    if (editingCourse) {
      store.updateCourse(editingCourse.id, {
        title: title.trim(),
        slug: slug.trim(),
        short_description: shortDesc.trim(),
        category_id: categoryId,
        duration,
        level,
        status,
      });
    } else {
      store.addCourse(
        {
          title: title.trim(),
          slug: slug.trim(),
          short_description: shortDesc.trim(),
          description: shortDesc.trim(),
          thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
          instructor_name: 'Sohel Shahriar',
          duration,
          level,
          language: 'Bangla / English Tech',
          status,
          is_featured: true,
          category_id: categoryId,
        },
        [
          { name: 'Recorded Classes', regular_price: Number(regularPrice) || 1390, sale_price: Number(salePrice) || 999 },
          { name: 'Recorded vs Live Q&A', regular_price: Number(regularPrice) + 300, sale_price: Number(salePrice) + 200 },
          { name: 'Spartan Mentorship', regular_price: Number(regularPrice) + 700, sale_price: Number(salePrice) + 400 },
        ]
      );
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      store.deleteCourse(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Curriculum Command</span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
            COURSE MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => {
                const variantsCount = (course.variants || []).length;
                return (
                  <tr key={course.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center p-1.5 border border-gold flex-shrink-0">
                          <img src="/shield-helmet.svg" alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="font-heading font-black text-sm text-dark block uppercase">
                            {course.title}
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono">
                            /{course.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-heading text-[11px] uppercase font-bold text-gray-700">
                        {course.category?.name || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-dark">
                      {course.instructor_name}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {course.duration}
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        to="/admin/variations"
                        className="inline-flex items-center gap-1 text-gold font-heading font-bold text-xs uppercase hover:underline"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{variantsCount} Formats</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase font-bold ${
                        course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 text-gray-500 hover:text-gold transition rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 transition rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-gold shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-black text-lg uppercase text-dark">
                {editingCourse ? 'Edit Course' : 'Create New Course Track'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingCourse) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. RUST KERNEL ARCHITECTURE"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="rust-kernel-architecture"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Category Discipline</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Executive summary of outcomes and curriculum..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">Level</label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {!editingCourse && (
                <div className="grid grid-cols-2 gap-3 bg-ivory p-3 rounded-lg border border-[#DFC27D]/40">
                  <div>
                    <label className="block font-heading uppercase font-bold text-dark mb-1">Base Regular ($)</label>
                    <input
                      type="number"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-heading uppercase font-bold text-dark mb-1">Base Sale ($)</label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-heading uppercase font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading uppercase font-bold shadow-sm"
                >
                  {editingCourse ? 'Save Updates' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

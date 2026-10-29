import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { CourseVariant, Course } from '../../types';
import { Plus, Edit3, Trash2, Copy, Check, X, Shield, Layers, DollarSign } from 'lucide-react';

export const VariationManagement: React.FC = () => {
  const [variants, setVariants] = useState<CourseVariant[]>(store.getVariants());
  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<CourseVariant | null>(null);

  // Form fields
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [regularPrice, setRegularPrice] = useState('1390');
  const [salePrice, setSalePrice] = useState('999');
  const [limit, setLimit] = useState('');
  const [durationDays, setDurationDays] = useState('365');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const update = () => {
      setVariants(store.getVariants());
      setCourses(store.getCourses());
    };
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const openCreateModal = () => {
    setEditingVariant(null);
    setCourseId(courses[0]?.id || '');
    setName('');
    setDescription('');
    setSku('');
    setRegularPrice('1390');
    setSalePrice('999');
    setLimit('');
    setDurationDays('365');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (v: CourseVariant) => {
    setEditingVariant(v);
    setCourseId(v.course_id);
    setName(v.name);
    setDescription(v.description || '');
    setSku(v.sku || '');
    setRegularPrice(v.regular_price.toString());
    setSalePrice(v.sale_price.toString());
    setLimit(v.enrollment_limit ? v.enrollment_limit.toString() : '');
    setDurationDays(v.duration_days.toString());
    setIsActive(v.is_active);
    setShowModal(true);
  };

  const handleDuplicate = (v: CourseVariant) => {
    store.addVariant({
      course_id: v.course_id,
      name: `${v.name} (Copy)`,
      description: v.description,
      sku: `${v.sku || 'SKU'}-COPY`,
      regular_price: v.regular_price,
      sale_price: v.sale_price,
      enrollment_limit: v.enrollment_limit,
      duration_days: v.duration_days,
      is_active: v.is_active,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !courseId) return;

    if (editingVariant) {
      store.updateVariant(editingVariant.id, {
        course_id: courseId,
        name: name.trim(),
        description: description.trim(),
        sku: sku.trim(),
        regular_price: Number(regularPrice) || 0,
        sale_price: Number(salePrice) || 0,
        enrollment_limit: limit ? Number(limit) : null,
        duration_days: Number(durationDays) || 365,
        is_active: isActive,
      });
    } else {
      store.addVariant({
        course_id: courseId,
        name: name.trim(),
        description: description.trim(),
        sku: sku.trim(),
        regular_price: Number(regularPrice) || 0,
        sale_price: Number(salePrice) || 0,
        enrollment_limit: limit ? Number(limit) : null,
        duration_days: Number(durationDays) || 365,
        is_active: isActive,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, variantName: string) => {
    if (confirm(`Delete variation ${variantName}?`)) {
      store.deleteVariant(id);
    }
  };

  const toggleActive = (v: CourseVariant) => {
    store.updateVariant(v.id, { is_active: !v.is_active });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Pricing Matrix Engine</span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
            COURSE VARIATION MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variation</span>
        </button>
      </div>

      {/* Variation Table */}
      <div className="bg-white rounded-2xl border border-[#DFC27D]/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory border-b border-gray-200 text-spartan-muted font-heading uppercase tracking-wider">
                <th className="py-3.5 px-4">Course Title</th>
                <th className="py-3.5 px-4">Variation Name</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4">Sale Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {variants.map((v) => {
                const parent = courses.find((c) => c.id === v.course_id);
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-heading font-bold text-dark uppercase">
                      {parent?.title || 'Unknown Course'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <strong className="text-dark block">{v.name}</strong>
                        {v.description && (
                          <span className="text-[11px] text-gray-500 line-clamp-1">
                            {v.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      {v.sku || '-'}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-gray-400 line-through">
                      ${v.regular_price}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-dark text-sm">
                      ${v.sale_price}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleActive(v)}
                        className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase transition ${
                          v.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {v.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleDuplicate(v)}
                          className="p-1.5 text-gray-500 hover:text-dark transition"
                          title="Duplicate Variation"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 text-gray-500 hover:text-gold transition"
                          title="Edit Variation"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 transition"
                          title="Delete Variation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-gold shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-black text-lg uppercase text-dark">
                {editingVariant ? 'Edit Variation' : 'Add Course Variation'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Target Course *</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Variation Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Recorded Classes + Live Architecture Labs"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Variation Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Includes 1-on-1 code reviews, war-room drills..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">Regular Price ($)</label>
                  <input
                    type="number"
                    required
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="CPP-VAR-01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-heading uppercase font-bold text-dark mb-1">Access Days</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-gold focus:ring-gold"
                />
                <label htmlFor="activeCheck" className="font-heading uppercase text-dark font-bold text-xs">
                  Active for Student Purchase
                </label>
              </div>

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
                  {editingVariant ? 'Save Variation' : 'Add Variation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

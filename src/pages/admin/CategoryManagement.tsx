import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Category } from '../../types';
import { Plus, Edit3, Trash2, FolderTree, X } from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const update = () => setCategories(store.getCategories());
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, []);

  const openCreate = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDesc('');
    setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDesc(cat.description);
    setImageUrl(cat.image_url);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    if (editingCat) {
      store.updateCategory(editingCat.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: desc.trim(),
        image_url: imageUrl.trim(),
      });
    } else {
      store.addCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: desc.trim(),
        image_url: imageUrl.trim(),
        sort_order: categories.length + 1,
        is_active: true,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Delete discipline ${catName}?`)) {
      store.deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFC27D]/40 pb-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-gold">Taxonomy Command</span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-dark">
            COURSE CATEGORIES &amp; DISCIPLINES
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-dark font-heading text-xs uppercase font-bold tracking-wider transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-[#DFC27D]/60 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-36 bg-dark">
              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover filter brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="font-heading font-black text-sm uppercase text-white tracking-wider">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gold font-mono block">/{cat.slug}</span>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-spartan-muted line-clamp-3 leading-relaxed">
                {cat.description}
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-gray-500 hover:text-gold transition"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-gold shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-black text-lg uppercase text-dark">
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCat) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. SYSTEMS WARFARE"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading uppercase font-bold text-dark mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                />
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
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

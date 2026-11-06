import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { categoriesAPI } from '../../api/client';
import CategoryModal from '../../components/admin/CategoryModal';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesAPI.getCategories();
      if (res.data?.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      setFeedback({ error: '', success: '' });
      if (editingCategory) {
        const res = await categoriesAPI.updateCategory(editingCategory._id, data);
        if (res.data?.success) {
          setFeedback({ success: 'Collection updated successfully.', error: '' });
        }
      } else {
        const res = await categoriesAPI.createCategory(data);
        if (res.data?.success) {
          setFeedback({ success: 'New collection created.', error: '' });
        }
      }
      setModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || 'Operation failed',
        success: '',
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      return;
    }

    try {
      const res = await categoriesAPI.deleteCategory(id);
      if (res.data?.success) {
        setFeedback({ success: `Collection "${name}" deleted.`, error: '' });
        fetchCategories();
      }
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || 'Cannot delete collection containing pieces.',
        success: '',
      });
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-300 gap-4">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            AURELLE Category Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Jewellery Categories
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {feedback.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback.success}</span>
        </div>
      )}

      {feedback.error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{feedback.error}</span>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-noir-400">
            Loading collections...
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-champagne-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-gold-400 transition-colors"
            >
              <div className="aspect-[16/9] bg-ivory-200 overflow-hidden relative">
                <img
                  src={c.image || DEFAULT_JEWELLERY_FALLBACK}
                  alt={c.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-noir-900/80 text-gold-300 text-[10px] uppercase font-mono">
                  {c.itemCount || 0} Pieces
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-noir-900">{c.name}</h3>
                  <p className="text-[11px] font-mono text-gold-800">/{c.slug}</p>
                  <p className="text-xs text-noir-600 font-light mt-1.5 line-clamp-2">
                    {c.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-champagne-100 text-xs">
                  <span className="text-noir-400 text-[11px]">Display Order: #{c.displayOrder}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-noir-600 hover:text-gold-700 transition-colors"
                      title="Edit collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id, c.name)}
                      className="p-1.5 text-noir-400 hover:text-rose-600 transition-colors"
                      title="Delete collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSave}
        initialData={editingCategory}
      />
    </div>
  );
}


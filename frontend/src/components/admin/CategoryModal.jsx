import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 0,
    featured: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        image: initialData.image || '',
        displayOrder: initialData.displayOrder || 0,
        featured: !!initialData.featured,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
        displayOrder: 1,
        featured: true,
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      setError('Please provide Collection Name and Hero Image URL.');
      return;
    }
    onSubmit({
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-noir-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-champagne-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-champagne-200 mb-5">
          <h3 className="font-serif text-2xl text-noir-900">
            {initialData ? 'Edit Collection' : 'Create High Jewellery Collection'}
          </h3>
          <button onClick={onClose} className="text-noir-400 hover:text-noir-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
              Collection Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Celestial Pearls & Brooches"
              className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 font-serif text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
              Hero Visual Asset URL *
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs font-mono text-noir-900 focus:outline-none focus:border-gold-600"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
              Curatorial Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Artisanal pieces crafted with baroque pearls and rose gold..."
              className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-noir-800">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-gold-600 rounded-none"
                />
                <span>Featured Collection</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-champagne-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-champagne-300 text-noir-700 text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-xs"
            >
              {initialData ? 'Update Collection' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


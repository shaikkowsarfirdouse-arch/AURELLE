import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { uploadAPI } from '../../api/client';
import { DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: 10,
    material: 'Gold Plated Brass',
    purity: 'Micro Gold Plated',
    weight: '35 grams',
    gemstone: 'Kundan & Pearl Drops',
    dimensions: '',
    sizes: 'Free Size',
    images: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    certification: 'Skin-Friendly & Anti-Tarnish Polished',
    description: '',
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category?._id || initialData.category || '',
        price: initialData.price || '',
        originalPrice: initialData.originalPrice || '',
        stock: initialData.stock ?? 10,
        material: initialData.material || '',
        purity: initialData.purity || '',
        weight: initialData.weight || '',
        gemstone: initialData.gemstone || '',
        dimensions: initialData.dimensions || '',
        sizes: initialData.sizes?.join(', ') || '',
        images: initialData.images?.join('\n') || '',
        isFeatured: !!initialData.isFeatured,
        isNewArrival: !!initialData.isNewArrival,
        isBestSeller: !!initialData.isBestSeller,
        certification: initialData.certification || 'Skin-Friendly & Anti-Tarnish Polished',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?._id || '',
        price: '',
        originalPrice: '',
        stock: 10,
        material: 'Gold Plated Brass',
        purity: 'Micro Gold Plated',
        weight: '35 grams',
        gemstone: 'Kundan & Pearl Drops',
        dimensions: '',
        sizes: 'Free Size',
        images: DEFAULT_JEWELLERY_FALLBACK,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        certification: 'Skin-Friendly & Anti-Tarnish Polished',
        description: 'Exquisitely crafted Indian fashion jewellery with skin-friendly brass and anti-tarnish finish.',
      });
    }
    setError('');
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const data = new FormData();
      data.append('image', file);
      const res = await uploadAPI.uploadImage(data);
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}\n${res.data.url}` : res.data.url,
        }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Image upload failed. You can paste direct image URLs below.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.material) {
      setError('Please provide Name, Category, Price, and Material specification.');
      return;
    }

    const imageArray = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const sizesArray = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSubmit({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stock),
      images: imageArray.length > 0 ? imageArray : [DEFAULT_JEWELLERY_FALLBACK],
      sizes: sizesArray,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-noir-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-champagne-300 max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-champagne-200 mb-6">
          <div>
            <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block">
              Product Management
            </span>
            <h3 className="font-serif text-2xl text-noir-900 font-medium">
              {initialData ? 'Edit Product' : 'Add New Indian Jewellery Product'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-noir-400 hover:text-noir-900">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Rajputi Kundan Choker Set"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 font-serif text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Jewellery Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="899"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Original / MRP (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="1499"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Base Metal / Material *
              </label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. Gold Plated Brass / Oxidised Silver Alloy"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Gross Item Weight *
              </label>
              <input
                type="text"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g. 45 grams"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Stones & Beads (e.g. Kundan, AD, Pearls)
              </label>
              <input
                type="text"
                value={formData.gemstone}
                onChange={(e) => setFormData({ ...formData, gemstone: e.target.value })}
                placeholder="e.g. Kundan Glass Stones with Emerald Green Beads"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                placeholder="e.g. Free Size or 2.4, 2.6, 2.8"
                className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
            </div>
          </div>

          {/* Image URLs & Cloudinary upload */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wider text-noir-700 font-medium">
                Product Image URLs (one per line)
              </label>
              <label className="cursor-pointer text-[11px] text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={3}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs font-mono text-noir-900 focus:outline-none focus:border-gold-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
              Product Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
            />
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-champagne-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-noir-800">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-gold-600 rounded-none"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-noir-800">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="w-4 h-4 text-gold-600 rounded-none"
              />
              <span>New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-noir-800">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-gold-600 rounded-none"
              />
              <span>Best Seller</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-champagne-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-champagne-300 text-noir-700 text-xs tracking-wider uppercase hover:bg-ivory-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-xs"
            >
              {initialData ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, SlidersHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../api/client';
import ProductModal from '../../components/admin/ProductModal';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  useEffect(() => {
    fetchData();
  }, [selectedCategory, keyword]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productsAPI.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          keyword: keyword || undefined,
          limit: 50,
        }),
        categoriesAPI.getCategories(),
      ]);

      if (prodRes.data?.success) {
        setProducts(prodRes.data.products || []);
      }
      if (catRes.data?.success) {
        setCategories(catRes.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (productData) => {
    try {
      setFeedback({ error: '', success: '' });
      if (editingProduct) {
        const res = await productsAPI.updateProduct(editingProduct._id, productData);
        if (res.data?.success) {
          setFeedback({ success: 'Product updated successfully.', error: '' });
        }
      } else {
        const res = await productsAPI.createProduct(productData);
        if (res.data?.success) {
          setFeedback({ success: 'New product added to store successfully.', error: '' });
        }
      }
      setModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || 'Operation failed. Please verify product inputs.',
        success: '',
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the store catalogue?`)) {
      return;
    }

    try {
      const res = await productsAPI.deleteProduct(id);
      if (res.data?.success) {
        setFeedback({ success: `"${name}" removed from catalogue.`, error: '' });
        fetchData();
      }
    } catch (err) {
      setFeedback({ error: 'Failed to delete piece.', success: '' });
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-300 gap-4">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            AURELLE Product Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Jewellery Products
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
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

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 border border-champagne-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by SKU, gemstone, metal, title..."
            className="w-full pl-9 pr-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600 cursor-pointer"
        >
          <option value="all">All Collections</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-champagne-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-100 border-b border-champagne-200 text-noir-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-100 text-noir-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400 font-serif text-sm">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                          alt={p.name}
                          onError={handleImageError}
                          className="w-12 h-12 object-cover bg-ivory-200 border border-champagne-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-semibold text-noir-900 truncate max-w-xs">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-noir-500 truncate block">
                            {p.material}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gold-800 font-medium">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 text-noir-700">
                      {p.categoryName || p.category?.name}
                    </td>
                    <td className="py-3 px-4 font-serif text-sm font-semibold text-noir-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold ${
                          p.stock <= 3
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} Available
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-gold-100 text-gold-900 text-[9px] uppercase font-semibold">
                            Featured
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="px-1.5 py-0.5 bg-noir-100 text-noir-900 text-[9px] uppercase font-semibold">
                            New
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-champagne-200 text-noir-800 text-[9px] uppercase font-semibold">
                            Iconic
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-noir-600 hover:text-gold-700 transition-colors"
                          title="Refine details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-noir-400 hover:text-rose-600 transition-colors"
                          title="Delete piece"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdate}
        categories={categories}
        initialData={editingProduct}
      />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import QuickViewModal from '../components/common/QuickViewModal';
import PageTransition from '../components/common/PageTransition';
import { productsAPI, categoriesAPI } from '../api/client';

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state from search params
  const selectedCategory = searchParams.get('category') || 'all';
  const keyword = searchParams.get('keyword') || '';
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesAPI.getCategories();
        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          keyword: keyword || undefined,
          material: selectedMaterial !== 'all' ? selectedMaterial : undefined,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
          inStock: inStockOnly ? 'true' : undefined,
          sort: sortBy,
          limit: 30,
        };

        const res = await productsAPI.getProducts(params);
        if (res.data?.success) {
          setProducts(res.data.products || []);
          setTotalProducts(res.data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching catalogue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, keyword, selectedMaterial, priceRange, inStockOnly, sortBy]);

  const handleCategoryChange = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSelectedMaterial('all');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSortBy('newest');
  };

  const currentCatObj = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = currentCatObj ? currentCatObj.name : keyword ? `Search Results for "${keyword}"` : 'All Jewellery';

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-noir-500 mb-6 font-light">
          <Link to="/" className="hover:text-gold-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-champagne-400" />
          <span className="text-noir-800 font-medium">Catalogue</span>
          {currentCatObj && (
            <>
              <ChevronRight className="w-3 h-3 text-champagne-400" />
              <span className="text-gold-700 font-medium">{currentCatObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Banner Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            AURELLE Indian Fashion Jewellery
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-noir-900 font-normal">
            {pageTitle}
          </h1>
          {currentCatObj?.description ? (
            <p className="text-xs text-noir-600 font-light mt-3 leading-relaxed">
              {currentCatObj.description}
            </p>
          ) : (
            <p className="text-xs text-noir-600 font-light mt-2">
              Explore our affordable Kundan sets, jhumkas, bangles, oxidised silver, and everyday fashion jewellery.
            </p>
          )}
        </div>

        {/* Active Filter Badges */}
        {(selectedCategory !== 'all' || keyword || selectedMaterial !== 'all' || priceRange.min || priceRange.max || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 pb-6 mb-6 border-b border-champagne-200">
            <span className="text-xs text-noir-500 mr-2 font-medium">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-champagne-300 text-xs text-noir-800">
                Collection: {currentCatObj?.name || selectedCategory}
                <button onClick={() => handleCategoryChange('all')} className="hover:text-rose-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {keyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-champagne-300 text-xs text-noir-800">
                Keyword: "{keyword}"
                <button
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('keyword');
                    setSearchParams(p);
                  }}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedMaterial !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-champagne-300 text-xs text-noir-800">
                Metal: {selectedMaterial}
                <button onClick={() => setSelectedMaterial('all')} className="hover:text-rose-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-champagne-300 text-xs text-noir-800">
                Price: ₹{priceRange.min || '0'} – ₹{priceRange.max || 'Any'}
                <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-rose-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-gold-700 underline hover:text-gold-900 ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-6 border-b border-champagne-200">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-champagne-300 text-xs text-noir-900 font-medium"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-600" />
            <span>Refine & Filter ({totalProducts})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-champagne-300 text-xs text-noir-900"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                selectedMaterial={selectedMaterial}
                onMaterialChange={setSelectedMaterial}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onResetFilters={handleResetFilters}
                totalProducts={totalProducts}
              />
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-serif text-noir-700 text-sm tracking-wide">
                  Loading jewellery collection...
                </p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                onQuickView={(p) => setQuickViewProduct(p)}
                columns={3}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-noir-950/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-champagne-200 mb-4">
                <h3 className="font-serif text-lg text-noir-900">Refine Catalogue</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-noir-600" />
                </button>
              </div>
              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(slug) => {
                  handleCategoryChange(slug);
                  setMobileFilterOpen(false);
                }}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                selectedMaterial={selectedMaterial}
                onMaterialChange={setSelectedMaterial}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onResetFilters={handleResetFilters}
                totalProducts={totalProducts}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </PageTransition>
  );
}


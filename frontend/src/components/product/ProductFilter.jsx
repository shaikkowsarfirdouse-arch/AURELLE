import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

export default function ProductFilter({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedMaterial,
  onMaterialChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalProducts = 0,
}) {
  const materials = [
    { label: 'All Materials', value: 'all' },
    { label: 'Gold Plated Brass', value: 'Gold' },
    { label: 'Kundan & Pearls', value: 'Kundan' },
    { label: 'Oxidised Silver', value: 'Oxidised' },
    { label: 'American Diamond (CZ)', value: 'Cubic Zirconia' },
    { label: 'Temple Matte Finish', value: 'Temple' },
    { label: 'Meenakari Work', value: 'Meenakari' },
  ];

  const priceOptions = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under ₹499', min: '', max: '499' },
    { label: '₹500 – ₹999', min: '500', max: '999' },
    { label: '₹1,000 – ₹1,999', min: '1000', max: '1999' },
    { label: '₹2,000 & Above', min: '2000', max: '' },
  ];

  return (
    <div className="bg-white border border-champagne-200 p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
        <div className="flex items-center gap-2 text-noir-900">
          <SlidersHorizontal className="w-4 h-4 text-gold-600" />
          <h3 className="font-serif text-lg font-medium">Filter Jewellery</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-noir-500 hover:text-gold-700 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs text-noir-800 focus:outline-none focus:border-gold-600 cursor-pointer"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated by Customers</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-gold-50 font-semibold text-gold-900 border-l-2 border-gold-600'
                : 'text-noir-600 hover:bg-ivory-100 hover:text-noir-900'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3 h-3 text-gold-600" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-gold-50 font-semibold text-gold-900 border-l-2 border-gold-600'
                  : 'text-noir-600 hover:bg-ivory-100 hover:text-noir-900'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && <Check className="w-3 h-3 text-gold-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-2">
          Price Range (₹ INR)
        </label>
        <div className="space-y-1">
          {priceOptions.map((opt, idx) => {
            const isSelected = priceRange.min === opt.min && priceRange.max === opt.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onPriceRangeChange(opt.min, opt.max)}
                className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-gold-50 font-semibold text-gold-900 border-l-2 border-gold-600'
                    : 'text-noir-600 hover:bg-ivory-100 hover:text-noir-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3 h-3 text-gold-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material Filter */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-2">
          Material & Type
        </label>
        <div className="space-y-1">
          {materials.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onMaterialChange(m.value)}
              className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                selectedMaterial === m.value
                  ? 'bg-gold-50 font-semibold text-gold-900 border-l-2 border-gold-600'
                  : 'text-noir-600 hover:bg-ivory-100 hover:text-noir-900'
              }`}
            >
              <span>{m.label}</span>
              {selectedMaterial === m.value && <Check className="w-3 h-3 text-gold-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-champagne-200">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-noir-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 text-gold-600 rounded-none border-champagne-400 focus:ring-0"
          />
          <span>Ready to Ship (In Stock Only)</span>
        </label>
      </div>

      {/* Status Bar */}
      <div className="pt-2 text-[11px] text-noir-400 tracking-wider text-center">
        Showing {totalProducts} products
      </div>
    </div>
  );
}

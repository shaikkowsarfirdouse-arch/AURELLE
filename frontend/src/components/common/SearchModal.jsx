import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { productsAPI } from '../../api/client';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getProducts({ keyword: query.trim(), limit: 5 });
        if (res.data?.success) {
          setResults(res.data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchAll = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/catalogue?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-noir-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-ivory-50 border border-champagne-300 shadow-luxury p-6 sm:p-8 z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 text-noir-400 hover:text-noir-900 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Search Header */}
            <div className="text-center mb-6">
              <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
                Search Aurelle
              </p>
              <h3 className="font-serif text-2xl text-noir-900">Find Your Favourite Jewellery</h3>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearchAll} className="relative mb-6">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jhumkas, kundan chokers, oxidised earrings, bangles..."
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-champagne-300 text-noir-900 text-sm placeholder:text-noir-400 focus:outline-none focus:border-gold-600 transition-colors shadow-sm"
              />
              <Search className="w-5 h-5 text-noir-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-noir-400 hover:text-noir-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Popular Tags */}
            {!query && (
              <div className="mt-4 pt-4 border-t border-champagne-200">
                <span className="text-xs text-noir-500 block mb-2 font-medium tracking-wider">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Kundan Choker', 'Chandbali Jhumkas', 'Oxidised Silver', 'Gold Kada', 'Pearl Choker', 'Temple Necklace'].map((term) => (
                    <motion.button
                      key={term}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 text-xs bg-white border border-champagne-300 text-noir-700 hover:border-gold-600 hover:text-gold-700 transition-colors"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            {loading && (
              <div className="py-8 text-center text-xs text-gold-700 tracking-wider">
                Searching products...
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-serif text-noir-700">No jewellery pieces found.</p>
                <p className="text-xs text-noir-400 mt-1">
                  Try searching for "Jhumka", "Kundan", "Bangles", or "Choker".
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-3 mt-4 max-h-80 overflow-y-auto pr-1">
                <p className="text-[11px] text-noir-400 uppercase tracking-widest font-medium">
                  Matching Products ({results.length})
                </p>
                {results.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-4 p-2.5 bg-white border border-champagne-200 hover:border-gold-500 cursor-pointer transition-all hover:shadow-sm group"
                  >
                    <img
                      src={product.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-14 h-14 object-cover shrink-0 bg-ivory-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-medium text-noir-900 group-hover:text-gold-700 transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-noir-500 truncate">{product.material}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-semibold text-noir-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="block text-[10px] text-noir-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearchAll}
                  className="w-full mt-4 py-2.5 text-center text-xs tracking-widest uppercase font-medium bg-noir-900 text-ivory-100 hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View All Results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


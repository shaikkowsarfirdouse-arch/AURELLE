import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [DEFAULT_JEWELLERY_FALLBACK];

  const handleAddToCart = async () => {
    const res = await addToCart(product, quantity, selectedSize || (product.sizes?.[0] || ''));
    if (res?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleFullDetail = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
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
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl bg-ivory-50 border border-champagne-300 shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
          >
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-noir-400 hover:text-noir-900 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gallery Column */}
              <div className="space-y-3">
                <div className="aspect-square overflow-hidden bg-white border border-champagne-200">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0.5, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.5 }}
                      transition={{ duration: 0.25 }}
                      src={images[selectedImage]}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </AnimatePresence>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-14 h-14 shrink-0 border overflow-hidden ${
                          selectedImage === idx ? 'border-gold-600 ring-1 ring-gold-600' : 'border-champagne-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" onError={handleImageError} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block">
                      {product.categoryName || 'Indian Fashion Jewellery'}
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-noir-900 mt-1 leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.ratingsAverage || 5)
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-champagne-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-noir-500 font-light">
                        ({product.numReviews || 12} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 border-y border-champagne-200 py-3">
                    <span className="font-serif text-2xl font-semibold text-noir-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-noir-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium ml-auto">
                      {product.stock > 0 ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-noir-600 font-light leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Specs Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 border border-champagne-200">
                    <div>
                      <span className="text-noir-400 block font-light">Material:</span>
                      <span className="font-medium text-noir-800">{product.material}</span>
                    </div>
                    <div>
                      <span className="text-noir-400 block font-light">Weight:</span>
                      <span className="font-medium text-noir-800">{product.weight}</span>
                    </div>
                    {product.gemstone && product.gemstone !== 'None' && (
                      <div className="col-span-2">
                        <span className="text-noir-400 block font-light">Gemstone:</span>
                        <span className="font-medium text-noir-800">{product.gemstone}</span>
                      </div>
                    )}
                  </div>

                  {/* Sizes if applicable */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-noir-800 mb-1.5 tracking-wider uppercase">
                        Select Size:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((sz) => (
                          <motion.button
                            key={sz}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3 py-1 text-xs border transition-colors ${
                              (selectedSize || product.sizes[0]) === sz
                                ? 'border-noir-900 bg-noir-900 text-white font-medium'
                                : 'border-champagne-300 text-noir-700 hover:border-gold-600'
                            }`}
                          >
                            {sz}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-6">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase font-medium hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-luxury"
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4 text-gold-400" />
                          <span>Added to Aurelle Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Shopping Bag</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`p-3 border transition-colors ${
                        isInWishlist(product._id)
                          ? 'border-gold-600 text-gold-600 bg-gold-50'
                          : 'border-champagne-300 text-noir-700 hover:border-gold-600'
                      }`}
                      title="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-gold-600' : ''}`}
                      />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleFullDetail}
                    className="w-full py-2 text-center text-xs tracking-wider uppercase text-noir-700 hover:text-gold-700 font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Full Details & Styling Tips</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


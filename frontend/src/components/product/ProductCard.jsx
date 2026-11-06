import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : [DEFAULT_JEWELLERY_FALLBACK];

  const primaryImage = images[0];
  const hoverImage = images.length > 1 ? images[1] : images[0];

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, 1, product.sizes?.[0] || '');
    setTimeout(() => setIsAdding(false), 1400);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-champagne-200 hover:border-gold-400 transition-colors duration-300 hover:shadow-luxury"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-noir-900 text-ivory-100 text-[9px] tracking-widest2 uppercase font-medium shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-gold-600 text-white text-[9px] tracking-widest2 uppercase font-medium shadow-xs">
              Bestseller
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-rose-700 text-white text-[9px] tracking-widest uppercase font-medium">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 shadow-sm ${
            isInWishlist(product._id)
              ? 'bg-gold-50 text-gold-600'
              : 'bg-white/90 text-noir-600 hover:text-gold-600 hover:bg-white'
          }`}
          title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Save creation'}
          aria-label="Wishlist"
        >
          <motion.div
            animate={isInWishlist(product._id) ? { scale: [1, 1.35, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist(product._id) ? 'fill-gold-600 text-gold-600' : ''
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Floating Quick Action Buttons on Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="flex-1 py-2.5 bg-noir-900/90 hover:bg-noir-900 text-ivory-100 text-[11px] tracking-widest uppercase font-medium backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1 text-gold-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                  <span>Quick Add</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="p-2.5 bg-white/95 hover:bg-white text-noir-800 text-[11px] backdrop-blur-xs transition-colors shadow-md border border-champagne-300"
            title="Quick view details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            {product.categoryName || 'Fine Jewellery'}
          </span>

          <Link to={`/product/${product.slug}`} className="block group-hover:text-gold-700 transition-colors">
            <h3 className="font-serif text-base font-normal text-noir-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-noir-500 font-light mt-0.5 truncate">
            {product.material}
          </p>
        </div>

        {/* Rating and Price */}
        <div className="mt-3 pt-2.5 border-t border-champagne-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-medium text-noir-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-noir-400 line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-noir-600">
            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
            <span>{product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '5.0'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


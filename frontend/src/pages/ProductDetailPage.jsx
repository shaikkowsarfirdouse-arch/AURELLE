import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Check,
  ChevronDown,
  ChevronRight,
  Share2,
} from 'lucide-react';
import ImageGallery from '../components/product/ImageGallery';
import ProductReviews from '../components/product/ProductReviews';
import ProductGrid from '../components/product/ProductGrid';
import PageTransition from '../components/common/PageTransition';
import { productsAPI } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage() {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getProductById(idOrSlug);
        if (res.data?.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          if (res.data.product.sizes?.length > 0) {
            setSelectedSize(res.data.product.sizes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  const handleAddToCart = async () => {
    if (!product) return;
    const res = await addToCart(product, quantity, selectedSize);
    if (res?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-noir-800 text-sm tracking-wider">Unveiling creation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory-50 text-center px-4">
        <div>
          <h2 className="font-serif text-3xl text-noir-900 mb-2">Jewel Not Found</h2>
          <p className="text-xs text-noir-500 mb-6">
            The requested piece may have been acquired or relocated in our archives.
          </p>
          <Link
            to="/catalogue"
            className="px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const accordions = [
    {
      id: 'details',
      title: 'Product Details & Specifications',
      content: (
        <div className="space-y-3 text-xs text-noir-600 font-light leading-relaxed">
          <p>{product.description}</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-2 border-t border-champagne-200">
            <div>
              <span className="text-noir-400 block">Base Material:</span>
              <strong className="text-noir-800 font-medium">{product.material}</strong>
            </div>
            <div>
              <span className="text-noir-400 block">Polish & Finish:</span>
              <strong className="text-noir-800 font-medium">{product.purity || 'Premium Gold Plated'}</strong>
            </div>
            <div>
              <span className="text-noir-400 block">Approx. Weight:</span>
              <strong className="text-noir-800 font-medium">{product.weight}</strong>
            </div>
            <div>
              <span className="text-noir-400 block">Stones & Beads:</span>
              <strong className="text-noir-800 font-medium">{product.gemstone || 'Kundan / Beads / AD'}</strong>
            </div>
            {product.dimensions && (
              <div className="col-span-2">
                <span className="text-noir-400 block">Dimensions:</span>
                <strong className="text-noir-800 font-medium">{product.dimensions}</strong>
              </div>
            )}
            <div className="col-span-2">
              <span className="text-noir-400 block">SKU Code:</span>
              <span className="text-noir-700 font-mono text-[11px]">{product.sku}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Easy 7-Day Exchange',
      content: (
        <div className="space-y-2 text-xs text-noir-600 font-light leading-relaxed">
          <p>
            Every Aurelle piece is carefully packed in cushioned bubble protection with an individual
            anti-tarnish storage pouch and dispatched via trusted express couriers.
          </p>
          <ul className="list-disc pl-4 space-y-1 pt-1">
            <li>Free delivery across India on all orders above ₹999 (₹70 flat delivery below ₹999).</li>
            <li>Cash on Delivery (COD) available across 19,000+ pin codes.</li>
            <li>Easy 7-day replacement or exchange if damaged in transit.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'authenticity',
      title: 'Quality & Skin-Friendly Guarantee',
      content: (
        <div className="space-y-2 text-xs text-noir-600 font-light leading-relaxed">
          <p>
            Our fashion jewellery is crafted with lead-free, nickel-free brass and skin-friendly alloys,
            finished with premium anti-tarnish micro-polish for lasting sparkle.
          </p>
          <p>
            Designed for lightweight comfort so you can wear your favourite pieces at weddings and festivals
            all day long without heavy strain or skin irritation.
          </p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Jewellery Care Tips',
      content: (
        <div className="space-y-2 text-xs text-noir-600 font-light leading-relaxed">
          <p>{product.careInstructions || 'Keep away from direct perfumes, hairspray, water, and sweat.'}</p>
          <p>
            Wipe gently with a clean dry cotton cloth after each wear, and store in an airtight zip pouch or jewellery box.
          </p>
        </div>
      ),
    },
  ];

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-noir-500 mb-8 font-light">
          <Link to="/" className="hover:text-gold-700">Home</Link>
          <ChevronRight className="w-3 h-3 text-champagne-400" />
          <Link to="/catalogue" className="hover:text-gold-700">Catalogue</Link>
          <ChevronRight className="w-3 h-3 text-champagne-400" />
          <Link to={`/catalogue?category=${product.category?.slug}`} className="hover:text-gold-700">
            {product.category?.name || product.categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-champagne-400" />
          <span className="text-noir-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Gallery - 7 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <ImageGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Details - 5 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div>
                <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
                  {product.categoryName || 'Fashion Jewellery'}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-gold-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.floor(product.ratingsAverage || 5)
                            ? 'fill-gold-500 text-gold-500'
                            : 'text-champagne-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-noir-600 font-serif">
                    {product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '5.0'} / 5.0
                  </span>
                  <span className="text-xs text-noir-400">
                    ({product.numReviews || 12} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 border-y border-champagne-200 py-4">
                <span className="font-serif text-3xl font-semibold text-noir-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-noir-400 line-through font-light">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 ml-auto font-medium">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Short highlights */}
              <p className="text-xs text-noir-600 leading-relaxed font-light">
                {product.shortDescription || product.description}
              </p>

              {/* Key Highlights Table */}
              <div className="bg-white p-4 border border-champagne-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-noir-400 block text-[11px]">Material</span>
                  <span className="font-medium text-noir-800">{product.material}</span>
                </div>
                <div>
                  <span className="text-noir-400 block text-[11px]">Gross Weight</span>
                  <span className="font-medium text-noir-800">{product.weight}</span>
                </div>
                {product.gemstone && product.gemstone !== 'None' && (
                  <div className="col-span-2">
                    <span className="text-noir-400 block text-[11px]">Gemstone</span>
                    <span className="font-medium text-noir-800">{product.gemstone}</span>
                  </div>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider text-noir-800 font-medium">
                      Select Size / Length:
                    </label>
                    <span className="text-[11px] text-gold-700 underline cursor-pointer">
                      Sizing Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <motion.button
                        key={sz}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 text-xs border transition-all ${
                          selectedSize === sz
                            ? 'border-noir-900 bg-noir-900 text-white font-medium shadow-xs'
                            : 'border-champagne-300 bg-white text-noir-700 hover:border-gold-600'
                        }`}
                      >
                        {sz}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-xs uppercase tracking-wider text-noir-800 font-medium block mb-2">
                  Quantity:
                </label>
                <div className="inline-flex items-center border border-champagne-300 bg-white">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-noir-600 hover:bg-ivory-100 disabled:opacity-30"
                  >
                    -
                  </motion.button>
                  <span className="px-4 text-xs font-semibold text-noir-900">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-noir-600 hover:bg-ivory-100 disabled:opacity-30"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase font-medium hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-luxury"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-gold-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.88 }}
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border transition-colors ${
                    isInWishlist(product._id)
                      ? 'border-gold-600 text-gold-600 bg-gold-50'
                      : 'border-champagne-300 bg-white text-noir-700 hover:border-gold-600'
                  }`}
                  title="Save to Wishlist"
                >
                  <motion.div
                    animate={isInWishlist(product._id) ? { scale: [1, 1.35, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-gold-600 text-gold-600' : ''}`}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Trust Micro Badges */}
              <div className="pt-4 border-t border-champagne-200 grid grid-cols-2 gap-3 text-[11px] text-noir-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>Free Delivery Above ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Skin-Friendly & Anti-Tarnish</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-gold-600" />
                  <span>Easy 7-Day Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-600" />
                  <span>COD Available All India</span>
                </div>
              </div>
            </div>

            {/* Accordions with Animated Height Expand/Collapse */}
            <div className="mt-8 border-t border-champagne-200 divide-y divide-champagne-200">
              {accordions.map((acc) => (
                <div key={acc.id} className="py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveAccordion(activeAccordion === acc.id ? '' : acc.id)
                    }
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-noir-800 hover:text-gold-700 transition-colors"
                  >
                    <span>{acc.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeAccordion === acc.id ? 'rotate-180 text-gold-700' : 'text-noir-400'
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === acc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-1">{acc.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-12 pb-16 border-t border-champagne-200">
          <ProductReviews productId={product._id} productName={product.name} />
        </div>

        {/* Related Creations */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="pt-12 pb-16 border-t border-champagne-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
                More Matching Pieces
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-noir-900 font-normal">
                You May Also Like
              </h3>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </PageTransition>
  );
}


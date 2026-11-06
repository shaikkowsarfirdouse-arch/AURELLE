import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    itemCount,
    discount,
    shipping,
    tax,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewBag = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-noir-950/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            {/* Animated Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="w-screen max-w-md bg-ivory-50 border-l border-champagne-300 shadow-2xl flex flex-col h-full pointer-events-auto"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-champagne-200 flex items-center justify-between bg-white">
                <div>
                  <h2 className="font-serif text-xl tracking-wide text-noir-900 font-medium">
                    Your Shopping Bag
                  </h2>
                  <p className="text-xs text-noir-500 font-light mt-0.5">
                    {itemCount} {itemCount === 1 ? 'creation' : 'creations'} selected
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-noir-400 hover:text-noir-900 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {!cart.items || cart.items.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto mb-4 text-gold-600">
                      <Tag className="w-8 h-8 stroke-[1.2]" />
                    </div>
                    <h3 className="font-serif text-xl text-noir-800">Your bag is currently empty</h3>
                    <p className="text-xs text-noir-500 mt-2 max-w-xs mx-auto leading-relaxed">
                      Discover our lovely fashion jewellery, jhumkas, chokers, bangles, and bridal sets.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/catalogue');
                      }}
                      className="mt-6 px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors"
                    >
                      Explore Jewellery Collection
                    </motion.button>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => {
                      const product = item.product || {};
                      return (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4 pb-4 border-b border-champagne-200 bg-white p-3 shadow-xs"
                        >
                          {/* Thumbnail */}
                          <img
                            src={product.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                            alt={product.name}
                            onError={handleImageError}
                            className="w-20 h-20 object-cover shrink-0 bg-ivory-100 cursor-pointer transition-transform duration-300 hover:scale-105"
                            onClick={() => {
                              setIsCartOpen(false);
                              navigate(`/product/${product.slug}`);
                            }}
                          />

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4
                                onClick={() => {
                                  setIsCartOpen(false);
                                  navigate(`/product/${product.slug}`);
                                }}
                                className="font-serif text-sm font-medium text-noir-900 hover:text-gold-700 cursor-pointer truncate transition-colors"
                              >
                                {product.name}
                              </h4>
                              <p className="text-[11px] text-noir-500">{product.material}</p>
                              {item.selectedSize && (
                                <p className="text-[11px] text-gold-700 font-medium">Size: {item.selectedSize}</p>
                              )}
                            </div>

                            {/* Quantity & Price */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center border border-champagne-300">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  type="button"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-1 text-noir-600 hover:bg-ivory-200 disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                  <Minus className="w-3 h-3" />
                                </motion.button>
                                <span className="px-2 text-xs font-semibold text-noir-900">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  type="button"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  className="p-1 text-noir-600 hover:bg-ivory-200"
                                >
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-serif text-sm font-semibold text-noir-900">
                                  ₹{((product.price || item.price) * item.quantity).toLocaleString()}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  type="button"
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-noir-400 hover:text-rose-600 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer & Checkout Summary */}
              {cart.items && cart.items.length > 0 && (
                <div className="p-6 border-t border-champagne-200 bg-white space-y-4">
                  {/* Promo code */}
                  {coupon ? (
                    <div className="flex items-center justify-between p-2 bg-gold-50 border border-gold-300 text-xs">
                      <div className="flex items-center gap-1.5 text-gold-800">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Coupon: <strong>{coupon.code}</strong> applied (-₹{discount})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-noir-500 hover:text-rose-600 text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon (e.g. AURELLE10, FESTIVE50)"
                        className="flex-1 px-3 py-1.5 text-xs bg-ivory-50 border border-champagne-300 focus:outline-none focus:border-gold-600 uppercase"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        className="px-3 py-1.5 bg-noir-800 text-ivory-100 text-xs tracking-wider uppercase hover:bg-gold-600 transition-colors"
                      >
                        Apply
                      </motion.button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

                  {/* Price summary */}
                  <div className="space-y-1.5 text-xs tracking-wide text-noir-600 pt-2 border-t border-champagne-100">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-noir-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-gold-700 font-medium">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span className="font-medium text-noir-900">
                        {shipping === 0 ? 'Free (Orders above ₹999)' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated GST (3%)</span>
                      <span className="font-medium text-noir-900">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-champagne-200 font-serif text-base font-semibold text-noir-900">
                      <span>Total Amount</span>
                      <span className="text-gold-700">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full py-3 bg-noir-900 text-ivory-100 font-medium tracking-widest uppercase text-xs hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-luxury"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewBag}
                      className="w-full py-2.5 border border-noir-800 text-noir-900 tracking-widest uppercase text-xs hover:bg-ivory-200 transition-colors"
                    >
                      View Full Shopping Bag
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-noir-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                    <span>Cash on Delivery Available &bull; Secure Packaging</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}


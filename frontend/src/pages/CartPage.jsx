import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/common/PageTransition';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../utils/imageFallback';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const handleApply = (e) => {
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

  if (!cart.items || cart.items.length === 0) {
    return (
      <PageTransition className="bg-ivory-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-10 border border-champagne-300 shadow-luxury">
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto mb-4 text-gold-700">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h2 className="font-serif text-3xl text-noir-900 mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-noir-500 font-light leading-relaxed mb-6">
            You have not added any jewellery items to your bag yet.
          </p>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/catalogue"
              className="inline-block px-8 py-3.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-sm"
            >
              Explore Jewellery Catalogue
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            AURELLE Indian Fashion Jewellery
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900">
            Your Shopping Bag ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List - 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-champagne-200 overflow-hidden shadow-xs">
              <div className="hidden sm:grid grid-cols-12 px-6 py-3 border-b border-champagne-200 text-xs uppercase tracking-wider text-noir-500 font-medium">
                <span className="col-span-6">Product</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <div className="divide-y divide-champagne-200">
                {cart.items.map((item) => {
                  const product = item.product || {};
                  return (
                    <div
                      key={item._id}
                      className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product Info */}
                      <div className="sm:col-span-6 flex gap-4 items-center">
                        <img
                          src={product.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                          alt={product.name}
                          onError={handleImageError}
                          className="w-20 h-20 object-cover shrink-0 bg-ivory-100 border border-champagne-200"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${product.slug}`}
                            className="font-serif text-base font-medium text-noir-900 hover:text-gold-700 transition-colors block truncate"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[11px] text-noir-500">{product.material}</p>
                          {item.selectedSize && (
                            <p className="text-[11px] text-gold-700 font-medium mt-0.5">
                              Size: {item.selectedSize}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="text-noir-400 hover:text-rose-600 text-[11px] flex items-center gap-1 mt-2 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="sm:col-span-2 text-left sm:text-center">
                        <span className="text-xs sm:hidden text-noir-400 mr-2">Unit:</span>
                        <span className="font-serif text-sm text-noir-900 font-medium">
                          ₹{(product.price || item.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="sm:col-span-2 flex sm:justify-center items-center">
                        <div className="inline-flex items-center border border-champagne-300 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-noir-600 hover:bg-ivory-100 disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-noir-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-2 py-1 text-noir-600 hover:bg-ivory-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="sm:col-span-2 text-left sm:text-right">
                        <span className="text-xs sm:hidden text-noir-400 mr-2">Total:</span>
                        <span className="font-serif text-base font-semibold text-noir-900">
                          ₹{((product.price || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                to="/catalogue"
                className="text-xs uppercase tracking-widest text-noir-700 hover:text-gold-700 font-medium flex items-center gap-1"
              >
                <span>&larr; Continue Exploring Pieces</span>
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-noir-500 hover:text-rose-600 underline"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar - 4 cols */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-champagne-200 p-6 shadow-luxury sticky top-28 space-y-5">
              <h3 className="font-serif text-xl text-noir-900 pb-3 border-b border-champagne-200">
                Order Summary
              </h3>

              {/* Promo code */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                  Have a Coupon Code?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-gold-50 border border-gold-300 text-xs text-gold-900">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-gold-700" />
                      {coupon.code} (-₹{discount.toLocaleString()})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-noir-500 hover:text-rose-600 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. AURELLE10, FESTIVE50"
                      className="flex-1 px-3 py-2 text-xs bg-ivory-50 border border-champagne-300 focus:outline-none focus:border-gold-600 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-noir-900 text-ivory-100 text-xs tracking-wider uppercase hover:bg-gold-600 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-noir-600 border-t border-champagne-200 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-noir-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold-700 font-medium">
                    <span>Coupon Discount</span>
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

                <div className="flex justify-between pt-3 border-t border-champagne-200 font-serif text-lg font-semibold text-noir-900">
                  <span>Total Amount</span>
                  <span className="text-gold-700">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-noir-900 text-ivory-100 font-medium tracking-widest uppercase text-xs hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-gold"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[10px] text-noir-400 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-gold-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-medium">100% Safe Transit & Skin-Friendly Quality Guaranteed</span>
                </div>
                <p>Tamper-evident packaging with anti-tarnish storage pouch included.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


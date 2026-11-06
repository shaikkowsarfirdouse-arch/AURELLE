import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowRight, AlertCircle, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/client';
import PageTransition from '../components/common/PageTransition';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../utils/imageFallback';

export default function CheckoutPage() {
  const { cart, subtotal, discount, shipping, tax, total, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Maharashtra',
    postalCode: user?.address?.postalCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.name || 'PRIYA SHARMA',
    expiry: '12/28',
    cvv: '888',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please sign in to place your order with order tracking and saved history.');
      navigate('/login?redirect=checkout');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        orderItems: cart.items.map((it) => ({
          product: it.product._id,
          name: it.product.name,
          quantity: it.quantity,
          image: it.product.images?.[0] || '',
          price: it.product.price || it.price,
          selectedSize: it.selectedSize || '',
        })),
        shippingAddress: formData,
        paymentMethod,
        couponCode: coupon?.code || '',
        orderNotes,
      };

      const res = await ordersAPI.createOrder(orderPayload);
      if (res.data?.success) {
        await clearCart();
        navigate(`/order-confirmation/${res.data.order.orderNumber}`);
      }
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            Secure Checkout
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900">
            Delivery & Payment Details
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Delivery & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact & Delivery Address */}
            <div className="bg-white border border-champagne-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-noir-900 text-gold-300 text-xs font-serif flex items-center justify-center font-bold">
                    1
                  </span>
                  <h3 className="font-serif text-xl text-noir-900">Delivery Address in India</h3>
                </div>
                {!isAuthenticated && (
                  <Link to="/login?redirect=checkout" className="text-xs text-gold-700 underline font-medium">
                    Have an Account? Sign in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. priya@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    Flat / House No. / Building & Street *
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Sunshine Heights, Linking Road"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 400050"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    name="country"
                    value="India"
                    className="w-full px-3.5 py-2.5 bg-champagne-100/50 border border-champagne-300 text-xs text-noir-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1">
                  Delivery Landmark / Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Near HDFC Bank; call before delivery."
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                />
              </div>
            </div>

            {/* Step 2: Shipping Method */}
            <div className="bg-white border border-champagne-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-champagne-200">
                <span className="w-6 h-6 rounded-full bg-noir-900 text-gold-300 text-xs font-serif flex items-center justify-center font-bold">
                  2
                </span>
                <h3 className="font-serif text-xl text-noir-900">Courier Delivery</h3>
              </div>

              <div className="border border-gold-500 bg-gold-50/50 p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-noir-900">
                      Standard Safe Courier Delivery (Delhivery / Blue Dart)
                    </h4>
                    <p className="text-xs text-noir-600 font-light mt-0.5">
                      Packed securely in protective bubble box to ensure zero damage in transit.
                    </p>
                    <span className="inline-block mt-2 text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 font-medium">
                      Estimated 3–5 Business Days
                    </span>
                  </div>
                </div>
                <span className="font-serif text-sm font-medium text-noir-900">
                  {shipping === 0 ? 'Free (Order > ₹999)' : `₹${shipping}`}
                </span>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-champagne-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-champagne-200">
                <span className="w-6 h-6 rounded-full bg-noir-900 text-gold-300 text-xs font-serif flex items-center justify-center font-bold">
                  3
                </span>
                <h3 className="font-serif text-xl text-noir-900">Select Payment Method</h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay cash to the courier person when you receive the parcel' },
                  { id: 'Credit/Debit Card', label: 'UPI / Google Pay / PhonePe / Cards', desc: 'Instant safe online payment' },
                  { id: 'Bank Transfer / Wire', label: 'Net Banking / Bank Transfer', desc: 'Direct bank transfer' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start justify-between p-3.5 border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-gold-600 bg-gold-50/50 ring-1 ring-gold-600'
                        : 'border-champagne-300 hover:border-gold-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-gold-600 focus:ring-0 mt-0.5"
                      />
                      <div>
                        <span className="font-medium text-xs text-noir-900 tracking-wide block">
                          {m.label}
                        </span>
                        <span className="text-[11px] text-noir-500 font-light">{m.desc}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-champagne-200 p-6 sm:p-8 shadow-luxury sticky top-28 space-y-5">
              <h3 className="font-serif text-xl text-noir-900 pb-3 border-b border-champagne-200">
                Order Summary ({cart.items?.length || 0} Items)
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.items?.map((item) => {
                  const product = item.product || {};
                  return (
                    <div key={item._id} className="flex gap-3 pb-3 border-b border-champagne-100">
                      <img
                        src={product.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-14 h-14 object-cover shrink-0 bg-ivory-100 border border-champagne-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-medium text-noir-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-noir-500">Qty: {item.quantity}</p>
                        {item.selectedSize && (
                          <p className="text-[10px] text-gold-700">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <span className="font-serif text-xs font-semibold text-noir-900 shrink-0">
                        ₹{((product.price || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-noir-600 border-t border-champagne-200 pt-3">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-medium text-noir-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold-700 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-noir-900">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (3%)</span>
                  <span className="font-medium text-noir-900">₹{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-champagne-200 font-serif text-xl font-semibold text-noir-900">
                  <span>Total Amount</span>
                  <span className="text-gold-700">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-noir-900 text-ivory-100 font-medium tracking-widest uppercase text-xs hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-gold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gold-400" />
                    <span>Confirm Order (₹{total.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <div className="text-center pt-2 space-y-1 text-[10px] text-noir-400 font-light">
                <div className="flex items-center justify-center gap-1.5 text-gold-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Secure Checkout &bull; Easy 7-Day Exchange</span>
                </div>
                <p>Packed carefully in sturdy boxes to ensure safe arrival.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

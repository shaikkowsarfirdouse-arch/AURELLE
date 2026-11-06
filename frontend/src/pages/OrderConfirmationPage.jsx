import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Package, ShieldCheck, Printer, ArrowRight, Truck } from 'lucide-react';
import { ordersAPI } from '../api/client';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../utils/imageFallback';
import PageTransition from '../components/common/PageTransition';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.getOrderById(id);
        if (res.data?.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <PageTransition className="min-h-[70vh] flex items-center justify-center bg-ivory-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-noir-800 text-sm tracking-wide">Retrieving your order details...</p>
        </div>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition className="min-h-[60vh] flex items-center justify-center bg-ivory-50 text-center px-4">
        <div>
          <h2 className="font-serif text-3xl text-noir-900 mb-2">Order Not Found</h2>
          <p className="text-xs text-noir-500 mb-6">
            We could not locate this order reference in our records.
          </p>
          <Link to="/" className="px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase">
            Return to Home
          </Link>
        </div>
      </PageTransition>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.orderStatus) !== -1 ? steps.indexOf(order.orderStatus) : 1;

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-champagne-300 p-8 sm:p-12 text-center shadow-luxury mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
            className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5 text-gold-700"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[1.4]" />
          </motion.div>

          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-2">
            AURELLE Indian Fashion Jewellery &bull; Order Confirmed
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl text-noir-900 font-normal mb-3">
            Thank You, {order.shippingAddress?.fullName?.split(' ')[0] || 'Valued Customer'}
          </h1>

          <p className="text-xs sm:text-sm text-noir-600 font-light max-w-lg mx-auto leading-relaxed mb-6">
            Your order has been placed successfully! We are carefully packing your jewellery in our signature
            tamper-proof packaging with anti-tarnish pouch.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-6 p-4 bg-ivory-50 border border-champagne-200 text-xs">
            <div>
              <span className="text-noir-400 block text-[10px] uppercase tracking-wider">Order Number</span>
              <strong className="text-noir-900 font-mono font-bold">{order.orderNumber}</strong>
            </div>
            <div className="hidden sm:block w-px h-8 bg-champagne-300" />
            <div>
              <span className="text-noir-400 block text-[10px] uppercase tracking-wider">Tracking Code</span>
              <span className="text-gold-700 font-mono font-medium">{order.trackingNumber || 'Pending Courier Dispatch'}</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-champagne-300" />
            <div>
              <span className="text-noir-400 block text-[10px] uppercase tracking-wider">Courier Partner</span>
              <span className="text-noir-800 font-medium">{order.carrier || 'Delhivery / Blue Dart'}</span>
            </div>
          </div>
        </motion.div>

        {/* Courier Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-champagne-200 p-8 shadow-xs mb-8"
        >
          <h3 className="font-serif text-lg text-noir-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold-600" />
            <span>Delivery Tracking Progress</span>
          </h3>

          <div className="relative flex justify-between">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-champagne-200 -translate-y-1/2 z-0" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 left-0 h-0.5 bg-gold-600 -translate-y-1/2 z-0"
            />

            {steps.map((st, idx) => {
              const isDone = idx <= currentStepIdx;
              return (
                <div key={st} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold transition-colors ${
                      isDone ? 'bg-noir-900 text-gold-300 ring-4 ring-gold-100' : 'bg-white border border-champagne-300 text-noir-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-2 tracking-wider uppercase font-medium ${
                      isDone ? 'text-noir-900' : 'text-noir-400'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dossier Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          {/* Shipping Address */}
          <div className="bg-white border border-champagne-200 p-6 space-y-2">
            <h4 className="font-serif text-base text-noir-900 pb-2 border-b border-champagne-100">
              Delivery Address
            </h4>
            <div className="text-xs text-noir-600 space-y-1 pt-1 leading-relaxed">
              <p className="font-medium text-noir-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="pt-1 text-noir-500">Phone: {order.shippingAddress?.phone}</p>
              <p className="text-noir-500">Email: {order.shippingAddress?.email}</p>
            </div>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="bg-white border border-champagne-200 p-6 space-y-2">
            <h4 className="font-serif text-base text-noir-900 pb-2 border-b border-champagne-100">
              Payment Summary
            </h4>
            <div className="text-xs text-noir-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-medium text-noir-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="text-emerald-700 font-medium">
                  {order.isPaid ? 'Paid & Confirmed' : 'Pay via Cash / UPI on Delivery'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-champagne-100">
                <span>Items Subtotal:</span>
                <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-gold-700">
                  <span>Coupon Discount:</span>
                  <span>-₹{order.discountPrice?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (3%):</span>
                <span>₹{order.taxPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-champagne-200 font-serif text-base font-semibold text-noir-900">
                <span>Total Amount:</span>
                <span className="text-gold-700">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ordered Items List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-champagne-200 p-6 sm:p-8 shadow-xs mb-8"
        >
          <h3 className="font-serif text-xl text-noir-900 pb-4 border-b border-champagne-200 mb-4">
            Items in this Order
          </h3>

          <div className="divide-y divide-champagne-100">
            {order.orderItems?.map((it, idx) => (
              <div key={idx} className="py-4 flex gap-4 items-center">
                <img
                  src={it.image || DEFAULT_JEWELLERY_FALLBACK}
                  alt={it.name}
                  onError={handleImageError}
                  className="w-16 h-16 object-cover bg-ivory-100 border border-champagne-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base font-medium text-noir-900 truncate">
                    {it.name}
                  </h4>
                  <p className="text-xs text-noir-500">Quantity: {it.quantity}</p>
                  {it.selectedSize && (
                    <p className="text-xs text-gold-700">Selected Size: {it.selectedSize}</p>
                  )}
                </div>
                <span className="font-serif text-sm font-semibold text-noir-900">
                  ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 border border-noir-800 text-noir-900 text-xs tracking-widest uppercase hover:bg-ivory-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gold-700" />
            <span>Print Receipt</span>
          </motion.button>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-3 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-luxury"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}


import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Truck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ordersAPI } from '../api/client';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../utils/imageFallback';
import PageTransition from '../components/common/PageTransition';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
  });
  const [profileMsg, setProfileMsg] = useState({ error: '', success: '' });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await ordersAPI.getMyOrders();
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ error: '', success: '' });

    try {
      const res = await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          postalCode: profileForm.postalCode,
          country: profileForm.country,
        },
      });

      if (res.success) {
        setProfileMsg({ success: 'Your profile details have been updated.', error: '' });
      } else {
        setProfileMsg({ error: res.message || 'Update failed', success: '' });
      }
    } catch (err) {
      setProfileMsg({ error: 'Failed to update details', success: '' });
    }
  };

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-champagne-300 p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
              My Account
            </p>
            <h1 className="font-serif text-3xl text-noir-900 font-normal">
              Greetings, {user?.name || 'Customer'}
            </h1>
            <p className="text-xs text-noir-500 font-light mt-1">
              Customer since {new Date(user?.createdAt || Date.now()).getFullYear()} &bull; {user?.email}
            </p>
          </div>

          <div className="flex gap-4 text-center">
            <div className="px-4 py-2 bg-ivory-100 border border-champagne-200">
              <span className="font-serif text-xl font-semibold text-noir-900">{orders.length}</span>
              <span className="block text-[10px] text-noir-500 uppercase tracking-wider">Orders</span>
            </div>
            <div className="px-4 py-2 bg-ivory-100 border border-champagne-200">
              <span className="font-serif text-xl font-semibold text-noir-900">{wishlist.length}</span>
              <span className="block text-[10px] text-noir-500 uppercase tracking-wider">Wishlist</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-champagne-200 divide-y divide-champagne-100 shadow-xs">
              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gold-50 text-gold-900 font-semibold border-l-4 border-gold-600'
                    : 'text-noir-700 hover:bg-ivory-100'
                }`}
              >
                <Package className="w-4 h-4 text-gold-600" />
                <span>Order History ({orders.length})</span>
              </button>

              <button
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-gold-50 text-gold-900 font-semibold border-l-4 border-gold-600'
                    : 'text-noir-700 hover:bg-ivory-100'
                }`}
              >
                <Heart className="w-4 h-4 text-gold-600" />
                <span>Saved Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gold-50 text-gold-900 font-semibold border-l-4 border-gold-600'
                    : 'text-noir-700 hover:bg-ivory-100'
                }`}
              >
                <User className="w-4 h-4 text-gold-600" />
                <span>Profile & Address</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content Area (9 cols) */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
                    <h3 className="font-serif text-2xl text-noir-900">Your Orders</h3>
                    <span className="text-xs text-noir-500 font-light">{orders.length} Total Orders</span>
                  </div>

                  {loadingOrders ? (
                    <div className="py-16 text-center text-xs text-noir-400">Loading your orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white border border-champagne-200 p-12 text-center">
                      <Package className="w-10 h-10 text-champagne-400 mx-auto mb-3 stroke-[1.2]" />
                      <h4 className="font-serif text-xl text-noir-900 mb-1">No Orders Recorded Yet</h4>
                      <p className="text-xs text-noir-500 mb-6">
                        Explore our Indian fashion jewellery catalogue to place your first order.
                      </p>
                      <Link
                        to="/catalogue"
                        className="inline-block px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors"
                      >
                        Explore Catalogue
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <motion.div
                          key={ord._id}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-champagne-200 p-6 shadow-xs hover:border-gold-400 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-champagne-100 gap-3">
                            <div>
                              <span className="text-[10px] text-noir-400 uppercase tracking-wider block">
                                Order Reference
                              </span>
                              <span className="font-mono text-sm font-bold text-noir-900">
                                {ord.orderNumber}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              <div>
                                <span className="text-[10px] text-noir-400 uppercase tracking-wider block">Date</span>
                                <span className="text-noir-700">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-noir-400 uppercase tracking-wider block">Total</span>
                                <span className="font-serif font-semibold text-noir-900">
                                  ₹{ord.totalPrice?.toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-noir-400 uppercase tracking-wider block">Status</span>
                                <span
                                  className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                                    ord.orderStatus === 'Delivered'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ord.orderStatus === 'Shipped'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gold-100 text-gold-900'
                                  }`}
                                >
                                  {ord.orderStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="py-4 flex flex-wrap gap-3 items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {ord.orderItems?.map((it, idx) => (
                                <img
                                  key={idx}
                                  src={it.image || DEFAULT_JEWELLERY_FALLBACK}
                                  alt={it.name}
                                  title={it.name}
                                  onError={handleImageError}
                                  className="w-14 h-14 object-cover border border-champagne-200 bg-ivory-100"
                                />
                              ))}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedOrder(ord)}
                              className="text-xs uppercase tracking-wider text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Order & Tracking</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: SAVED WISHLIST */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
                    <h3 className="font-serif text-2xl text-noir-900">Saved Jewellery</h3>
                    <span className="text-xs text-noir-500 font-light">{wishlist.length} Items</span>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-white border border-champagne-200 p-12 text-center">
                      <Heart className="w-10 h-10 text-champagne-400 mx-auto mb-3 stroke-[1.2]" />
                      <h4 className="font-serif text-xl text-noir-900 mb-1">Your Wishlist is Empty</h4>
                      <p className="text-xs text-noir-500 mb-6">
                        Click the heart icon on any jewellery piece in our store to save it here.
                      </p>
                      <Link
                        to="/catalogue"
                        className="inline-block px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors"
                      >
                        Browse Jewellery
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <motion.div
                          layout
                          key={item._id}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-champagne-200 flex flex-col justify-between overflow-hidden shadow-xs hover:border-gold-500 transition-colors"
                        >
                          <div className="aspect-[4/5] bg-ivory-100 relative">
                            <img
                              src={item.images?.[0] || DEFAULT_JEWELLERY_FALLBACK}
                              alt={item.name}
                              onError={handleImageError}
                              className="w-full h-full object-cover"
                            />
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeFromWishlist(item._id)}
                              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-noir-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <Link
                                to={`/product/${item.slug}`}
                                className="font-serif text-sm font-medium text-noir-900 hover:text-gold-700 block truncate"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[11px] text-noir-500 truncate">{item.material}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-champagne-100">
                              <span className="font-serif text-base font-semibold text-noir-900">
                                ₹{item.price?.toLocaleString('en-IN')}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addToCart(item, 1)}
                                className="px-3 py-1.5 bg-noir-900 text-ivory-100 text-[10px] uppercase tracking-wider hover:bg-gold-600 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <ShoppingBag className="w-3 h-3 text-gold-400" />
                                <span>Add to Bag</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: PROFILE & RESIDENCE */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-champagne-200 p-8 shadow-xs space-y-6"
                >
                  <div className="pb-4 border-b border-champagne-200">
                    <h3 className="font-serif text-2xl text-noir-900">Profile & Delivery Address</h3>
                    <p className="text-xs text-noir-500 font-light mt-0.5">
                      Update your contact details and default delivery address.
                    </p>
                  </div>

                  {profileMsg.success && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{profileMsg.success}</span>
                    </motion.div>
                  )}
                  {profileMsg.error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs"
                    >
                      {profileMsg.error}
                    </motion.p>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+91 98200 12345"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          House / Flat No., Street, Landmark
                        </label>
                        <input
                          type="text"
                          value={profileForm.street}
                          onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                          placeholder="e.g. 42, Lotus Residency, 100ft Road"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          value={profileForm.state}
                          onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={profileForm.postalCode}
                          onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                          placeholder="560038"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Country
                        </label>
                        <input
                          type="text"
                          value={profileForm.country}
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors cursor-pointer"
                    >
                      Save Profile Details
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noir-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-champagne-300 max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-champagne-200 mb-4">
                <div>
                  <span className="text-[10px] text-gold-700 uppercase tracking-widest font-semibold">
                    Order Details
                  </span>
                  <h3 className="font-serif text-2xl text-noir-900">{selectedOrder.orderNumber}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="text-noir-500 hover:text-noir-900 text-sm cursor-pointer p-1"
                >
                  ✕ Close
                </motion.button>
              </div>

              <div className="space-y-4 text-xs text-noir-700">
                <div className="p-3 bg-ivory-100 border border-champagne-200 flex justify-between items-center">
                  <div>
                    <span className="text-noir-500 block text-[10px] uppercase">Delivery Status</span>
                    <span className="font-semibold text-noir-900">{selectedOrder.orderStatus}</span>
                  </div>
                  <div>
                    <span className="text-noir-500 block text-[10px] uppercase">Tracking Code</span>
                    <span className="font-mono text-gold-700">{selectedOrder.trackingNumber || 'Pending'}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-serif text-sm font-semibold text-noir-900 mb-2">Items in this Order</h5>
                  <div className="divide-y divide-champagne-100 border border-champagne-200">
                    {selectedOrder.orderItems?.map((it, i) => (
                      <div key={i} className="p-3 flex items-center gap-3">
                        <img
                          src={it.image || DEFAULT_JEWELLERY_FALLBACK}
                          alt={it.name}
                          onError={handleImageError}
                          className="w-12 h-12 object-cover bg-ivory-100"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-serif text-sm font-medium text-noir-900 block truncate">
                            {it.name}
                          </span>
                          <span className="text-[11px] text-noir-500">Qty: {it.quantity}</span>
                        </div>
                        <span className="font-serif text-sm font-semibold text-noir-900">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-champagne-200 flex justify-between font-serif text-base font-semibold text-noir-900">
                  <span>Total Amount:</span>
                  <span className="text-gold-700">₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}


import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Search, Filter } from 'lucide-react';
import { ordersAPI } from '../../api/client';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getAllOrders({
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
      });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await ordersAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res.data?.success) {
        setFeedback(`Order status updated to ${newStatus}`);
        setTimeout(() => setFeedback(''), 3000);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleTrackingUpdate = async (orderId) => {
    if (!trackingInput.trim()) return;
    try {
      const res = await ordersAPI.updateOrderStatus(orderId, { trackingNumber: trackingInput.trim() });
      if (res.data?.success) {
        setFeedback('Tracking number updated.');
        setTimeout(() => setFeedback(''), 3000);
        setSelectedOrder(res.data.order);
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating tracking:', err);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-300 gap-4">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            AURELLE Order Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Customer Orders & Shipping
          </h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-700" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-champagne-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-100 border-b border-champagne-200 text-noir-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-100 text-noir-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400 font-serif text-sm">
                    No orders found under this filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gold-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-noir-900 block">
                        {ord.shippingAddress?.fullName || ord.user?.name}
                      </span>
                      <span className="text-[11px] text-noir-500">
                        {ord.shippingAddress?.email || ord.user?.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-noir-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-sm font-semibold text-noir-900">
                      ₹{ord.totalPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] uppercase font-semibold ${
                          ord.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.isPaid ? 'Paid' : 'Pending COD'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="px-2 py-1 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 font-medium cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setTrackingInput(ord.trackingNumber || '');
                        }}
                        className="px-3 py-1 bg-noir-900 text-ivory-100 text-[10px] uppercase tracking-wider hover:bg-gold-600 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-noir-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-champagne-300 max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-champagne-200 mb-4">
              <div>
                <span className="text-[10px] text-gold-700 uppercase tracking-widest font-semibold">
                  Order Details
                </span>
                <h3 className="font-serif text-2xl text-noir-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-noir-500 hover:text-noir-900 text-sm font-medium"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-noir-700">
              {/* Delivery Address */}
              <div className="p-3 bg-ivory-100 border border-champagne-200">
                <h5 className="font-serif text-sm font-semibold text-noir-900 mb-1">
                  Delivery Address
                </h5>
                <p className="font-medium text-noir-900">{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.street}</p>
                <p>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                  {selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}
                </p>
                <p className="pt-1 text-noir-500">Phone: {selectedOrder.shippingAddress?.phone}</p>
                <p className="text-noir-500">Email: {selectedOrder.shippingAddress?.email}</p>
                {selectedOrder.orderNotes && (
                  <p className="mt-2 text-gold-800 italic">
                    Note: "{selectedOrder.orderNotes}"
                  </p>
                )}
              </div>

              {/* Tracking input */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter courier tracking code (e.g. DEL-9823412)"
                  className="flex-1 px-3 py-2 bg-ivory-50 border border-champagne-300 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTrackingUpdate(selectedOrder._id)}
                  className="px-4 py-2 bg-noir-900 text-ivory-100 text-xs uppercase tracking-wider hover:bg-gold-600"
                >
                  Update Tracking
                </button>
              </div>

              {/* Items */}
              <div>
                <h5 className="font-serif text-sm font-semibold text-noir-900 mb-2">Ordered Items</h5>
                <div className="divide-y divide-champagne-100 border border-champagne-200">
                  {selectedOrder.orderItems?.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center gap-3">
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
                        <span className="text-noir-500">Quantity: {it.quantity}</span>
                        {it.selectedSize && (
                          <span className="text-gold-700 ml-2">Size: {it.selectedSize}</span>
                        )}
                      </div>
                      <span className="font-serif text-sm font-semibold text-noir-900">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-champagne-200 flex justify-between font-serif text-base font-semibold text-noir-900">
                <span>Grand Total:</span>
                <span className="text-gold-700">₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


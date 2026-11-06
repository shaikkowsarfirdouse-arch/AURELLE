import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Gem,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { adminAPI } from '../../api/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getStats();
        if (res.data?.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-serif text-noir-700 text-xs tracking-wider">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    avgOrderValue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalCustomers = 0,
    lowStockCount = 0,
    recentOrders = [],
    categoryStats = [],
    statusBreakdown = [],
  } = stats || {};

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-300 gap-4">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            AURELLE Indian Fashion Jewellery Admin
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Store Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-noir-900 text-ivory-100 text-xs tracking-wider uppercase hover:bg-gold-600 transition-colors shadow-xs"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="bg-white border border-champagne-300 p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-noir-500 font-medium">
              Total Sales
            </span>
            <div className="p-2 bg-gold-50 text-gold-700 border border-gold-200">
              <span className="font-bold text-sm">₹</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-semibold text-noir-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-noir-400 mt-1">
              Avg Order: ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white border border-champagne-300 p-6 shadow-xs group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-noir-500 font-medium">
              Customer Orders
            </span>
            <div className="p-2 bg-ivory-100 text-noir-700 border border-champagne-200">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-semibold text-noir-900">{totalOrders}</h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Active fulfillment pipeline</p>
          </div>
        </div>

        {/* Card 3: Jewellery Pieces */}
        <div className="bg-white border border-champagne-300 p-6 shadow-xs group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-noir-500 font-medium">
              Total Products
            </span>
            <div className="p-2 bg-ivory-100 text-noir-700 border border-champagne-200">
              <Gem className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-semibold text-noir-900">{totalProducts}</h3>
            <p className="text-[11px] text-noir-400 mt-1">Across Indian jewellery categories</p>
          </div>
        </div>

        {/* Card 4: Collectors & Inventory Alert */}
        <div className="bg-white border border-champagne-300 p-6 shadow-xs group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-noir-500 font-medium">
              Registered Customers
            </span>
            <div className="p-2 bg-ivory-100 text-noir-700 border border-champagne-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-semibold text-noir-900">{totalCustomers}</h3>
            {lowStockCount > 0 ? (
              <p className="text-[11px] text-amber-700 flex items-center gap-1 mt-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                <span>{lowStockCount} items low in stock</span>
              </p>
            ) : (
              <p className="text-[11px] text-noir-400 mt-1">Inventory optimal</p>
            )}
          </div>
        </div>
      </div>

      {/* Mid Section: Category Distribution & Status Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pipeline */}
        <div className="bg-white border border-champagne-200 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg text-noir-900 pb-2 border-b border-champagne-100">
            Order Status Breakdown
          </h3>
          <div className="space-y-2.5">
            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => {
              const item = statusBreakdown.find((b) => b._id === st) || { count: 0 };
              return (
                <div key={st} className="flex justify-between items-center text-xs text-noir-700 py-1">
                  <span className="tracking-wide uppercase text-[11px] font-medium">{st}</span>
                  <span className="font-serif font-bold text-noir-900 bg-ivory-100 px-2.5 py-0.5 border border-champagne-200">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Breakdown */}
        <div className="lg:col-span-2 bg-white border border-champagne-200 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg text-noir-900 pb-2 border-b border-champagne-100">
            Products by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryStats.map((c) => (
              <div key={c._id} className="p-3 bg-ivory-50 border border-champagne-200 text-xs">
                <span className="text-[10px] text-noir-400 uppercase tracking-wider block truncate">
                  {c._id}
                </span>
                <span className="font-serif text-lg font-semibold text-noir-900 block mt-1">
                  {c.productCount} Pieces
                </span>
                <span className="text-[10px] text-gold-700">
                  Avg: ₹{Math.round(c.avgPrice).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-champagne-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
          <h3 className="font-serif text-xl text-noir-900">Recent Customer Orders</h3>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-wider text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-champagne-200 text-noir-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-100 text-noir-800">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-gold-800">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-noir-900 truncate max-w-xs">
                    {ord.shippingAddress?.fullName || ord.user?.name || 'Customer'}
                  </td>
                  <td className="py-3 px-3 text-noir-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {ord.orderItems?.reduce((sum, it) => sum + it.quantity, 0)}
                  </td>
                  <td className="py-3 px-3 font-serif font-semibold text-noir-900">
                    ₹{ord.totalPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gold-100 text-gold-900'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


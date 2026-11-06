import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, Search } from 'lucide-react';
import { adminAPI } from '../../api/client';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      if (res.data?.success) {
        setCustomers(res.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change client privilege role to "${newRole}"?`)) return;

    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.data?.success) {
        setFeedback(`Collector privileges updated to ${newRole}`);
        setTimeout(() => setFeedback(''), 3000);
        fetchCustomers();
      }
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
      c.email.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-champagne-300 gap-4">
        <div>
          <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
            AURELLE Customer Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Registered Customers
          </h1>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search customer by name or email..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
          />
          <Search className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-champagne-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-100 border-b border-champagne-200 text-noir-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne-100 text-noir-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400">
                    Loading customer records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-noir-400 font-serif text-sm">
                    No customers match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-serif text-sm font-semibold text-noir-900 block">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-noir-500">{c.email}</span>
                    </td>
                    <td className="py-3 px-4 text-noir-700">{c.phone || '—'}</td>
                    <td className="py-3 px-4 text-noir-700">
                      {c.address?.city ? `${c.address.city}, ${c.address.country || 'India'}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gold-900">
                      {c.orderCount || 0} Orders
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                          c.role === 'admin'
                            ? 'bg-gold-100 text-gold-900 border border-gold-300'
                            : 'bg-ivory-200 text-noir-800'
                        }`}
                      >
                        {c.role === 'admin' ? 'Store Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-noir-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(c._id, c.role)}
                        className="text-[11px] text-gold-700 hover:text-gold-900 underline font-medium"
                      >
                        {c.role === 'admin' ? 'Set as Collector' : 'Grant Director Role'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


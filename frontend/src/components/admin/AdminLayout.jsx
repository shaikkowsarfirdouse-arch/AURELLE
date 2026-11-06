import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gem,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'All Products', icon: Gem },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customer List', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-noir-950 text-ivory-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-noir-900 border-r border-noir-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-noir-800">
          <Link to="/" className="block">
            <span className="font-serif text-2xl tracking-widest2 text-ivory-50 block font-medium">
              A U R E L L E
            </span>
            <span className="text-[9px] tracking-widest2 uppercase text-gold-400 font-semibold block mt-0.5">
              Admin Control Panel
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-noir-800/60 bg-noir-950/40">
          <p className="text-xs font-serif text-ivory-100 font-medium truncate">{user?.name}</p>
          <span className="text-[10px] text-gold-400 uppercase tracking-widest font-mono">
            Store Administrator
          </span>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-medium rounded-none transition-colors ${
                    isActive
                      ? 'bg-gold-600 text-noir-950 font-semibold shadow-xs'
                      : 'text-noir-300 hover:bg-noir-800 hover:text-ivory-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-noir-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-noir-300 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-ivory-50 text-noir-900 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}


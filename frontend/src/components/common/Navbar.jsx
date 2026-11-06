import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'All Jewellery', path: '/catalogue' },
    { name: 'Kundan Sets', path: '/catalogue?category=kundan' },
    { name: 'Jhumkas & Earrings', path: '/catalogue?category=earrings' },
    { name: 'Necklaces', path: '/catalogue?category=necklaces' },
    { name: 'Bangles & Kadas', path: '/catalogue?category=bangles' },
    { name: 'Oxidised Silver', path: '/catalogue?category=oxidised' },
    { name: 'Rings', path: '/catalogue?category=rings' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-ivory-50/95 backdrop-blur-md shadow-sm border-b border-champagne-200'
          : 'bg-ivory-50 border-b border-champagne-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-noir-800 hover:text-gold-600 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <span className="block font-serif text-2xl sm:text-3xl tracking-widest3 font-medium text-noir-900 group-hover:text-gold-600 transition-colors">
                  A U R E L L E
                </span>
                <span className="block text-[9px] tracking-widest2 text-gold-700 font-sans uppercase font-medium text-center">
                  Indian Fashion Jewellery
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs font-medium tracking-wider uppercase text-noir-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors duration-200 hover:text-gold-600 relative py-1 ${
                    isActive ? 'text-gold-600 font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-600"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons: Search, Wishlist, Cart, User */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-noir-800">
            {/* Search Trigger */}
            <motion.button
              whileHover={{ scale: 1.12, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenSearch}
              className="p-1.5 hover:text-gold-600 transition-colors focus:outline-none"
              title="Search jewellery"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </motion.button>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
              <Link
                to="/dashboard?tab=wishlist"
                className="p-1.5 hover:text-gold-600 transition-colors relative block"
                title="Saved Items"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.6]" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 bg-gold-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Shopping Bag / Cart */}
            <motion.button
              whileHover={{ scale: 1.12, rotate: 4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-gold-600 transition-colors relative focus:outline-none"
              title="Your Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 bg-noir-900 text-gold-300 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-gold-500"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1 p-1.5 hover:text-gold-600 transition-colors focus:outline-none"
                aria-label="Account Menu"
              >
                <UserIcon className="w-5 h-5 stroke-[1.6]" />
                <ChevronDown className="w-3 h-3 text-noir-400 hidden sm:block" />
              </motion.button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-none shadow-luxury border border-champagne-200 py-2 z-50 text-xs tracking-wider"
                  >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-champagne-100 bg-ivory-100">
                        <p className="font-serif text-sm font-semibold text-noir-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-noir-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-gold-100 text-gold-800 text-[9px] font-semibold tracking-widest uppercase rounded">
                            Store Admin
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gold-700 hover:bg-gold-50 font-medium transition-colors border-b border-champagne-100"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-noir-700 hover:bg-ivory-100 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-gold-600" />
                        My Profile & Address
                      </Link>

                      <Link
                        to="/dashboard?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-noir-700 hover:bg-ivory-100 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-gold-600" />
                        My Orders
                      </Link>

                      <Link
                        to="/dashboard?tab=wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-noir-700 hover:bg-ivory-100 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-gold-600" />
                        Saved Wishlist
                      </Link>

                      <div className="border-t border-champagne-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 border-b border-champagne-100">
                        <p className="font-serif text-sm font-semibold text-noir-900">
                          Welcome to Aurelle
                        </p>
                        <p className="text-[11px] text-noir-500">Sign in to track orders & wishlist</p>
                      </div>

                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-noir-800 hover:bg-ivory-100 font-medium transition-colors"
                      >
                        Sign In
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-gold-700 hover:bg-gold-50 font-medium transition-colors"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-champagne-200 bg-ivory-100 px-6 py-6 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3 uppercase tracking-wider text-xs font-medium text-noir-800">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-champagne-200 hover:text-gold-600 transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-champagne-300">
              {isAuthenticated ? (
                <div className="space-y-2 text-xs">
                  <p className="font-serif text-sm font-semibold text-noir-900">{user?.name}</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gold-700 font-medium py-1"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/dashboard?tab=orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-noir-700 py-1"
                  >
                    My Orders & Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-rose-700 py-1 text-left w-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs tracking-widest uppercase bg-noir-900 text-ivory-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs tracking-widest uppercase border border-gold-600 text-gold-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

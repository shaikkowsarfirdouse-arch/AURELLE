import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/common/PageTransition';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin' && redirectPath === '/dashboard') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@aurelle.com');
      setPassword('admin123');
    } else {
      setEmail('customer@aurelle.com');
      setPassword('customer123');
    }
  };

  return (
    <PageTransition className="bg-ivory-50 min-h-[85vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white border border-champagne-300 p-8 sm:p-10 shadow-luxury"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            AURELLE Indian Fashion Jewellery
          </p>
          <h1 className="font-serif text-3xl text-noir-900 font-normal">Sign In</h1>
          <p className="text-xs text-noir-500 font-light mt-1.5">
            Access your account to view your orders & saved wishlist
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Demo Credentials Bar */}
        <div className="mb-6 p-3 bg-ivory-100 border border-champagne-300 text-xs text-noir-700">
          <span className="font-serif font-semibold text-noir-900 block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Demo Accounts (Instant 1-Click Access)
          </span>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fillDemo('admin')}
              className="flex-1 py-1.5 px-2 bg-white border border-champagne-300 text-[11px] font-medium text-gold-900 hover:border-gold-600 transition-colors cursor-pointer"
            >
              Admin Manager
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fillDemo('customer')}
              className="flex-1 py-1.5 px-2 bg-white border border-champagne-300 text-[11px] font-medium text-noir-800 hover:border-gold-600 transition-colors cursor-pointer"
            >
              Priya Sharma (Customer)
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
              <Mail className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider text-noir-700 font-medium">
                Password
              </label>
              <a href="#" className="text-[11px] text-gold-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
              <Lock className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase font-medium hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-champagne-200 text-center text-xs text-noir-500">
          <span>New to Aurelle?</span>{' '}
          <Link to="/register" className="text-gold-700 font-medium underline ml-1">
            Create an Account
          </Link>
        </div>
      </motion.div>
    </PageTransition>
  );
}


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/common/PageTransition';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register account. Please verify your details.');
    } finally {
      setLoading(false);
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
          <h1 className="font-serif text-3xl text-noir-900 font-normal">Create an Account</h1>
          <p className="text-xs text-noir-500 font-light mt-1.5">
            Sign up to track your orders, save favourite jewellery, and get exclusive offers
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
              <User className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
              <Mail className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98200 12345"
                className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
              />
              <Phone className="w-4 h-4 text-noir-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
              Password (Min. 6 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
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
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-champagne-200 text-center text-xs text-noir-500">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="text-gold-700 font-medium underline ml-1">
            Sign In
          </Link>
        </div>
      </motion.div>
    </PageTransition>
  );
}


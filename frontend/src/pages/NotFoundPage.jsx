import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition className="bg-ivory-50 min-h-[75vh] flex items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md bg-white border border-champagne-300 p-10 shadow-luxury"
      >
        <motion.div
          initial={{ rotate: -15, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
        >
          <Sparkles className="w-10 h-10 text-gold-600 mx-auto mb-4 stroke-[1.2]" />
        </motion.div>
        <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block mb-1">
          Error 404 &bull; Page Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal mb-3">
          Page Not Found
        </h1>
        <p className="text-xs text-noir-500 font-light leading-relaxed mb-8">
          The page or product you are looking for cannot be located. It may have been moved or is no longer available.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

export default function LookbookBanner() {
  return (
    <section className="relative py-24 bg-noir-950 text-ivory-100 overflow-hidden">
      {/* Background Image with Slow Parallax Scale */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1.02, opacity: 0.32 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2000&auto=format&fit=crop"
          alt="Aurelle Festive & Bridal Jewellery"
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/80 to-noir-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-900/40 border border-gold-500/30 text-gold-300 text-[10px] tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Wedding & Festive Special</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ivory-50 leading-tight mb-3">
            Royal Bridal Looks <br />
            <span className="italic text-gold-gradient font-light">On a Smart Budget</span>
          </h2>

          <p className="text-xs sm:text-sm text-noir-300 font-light leading-relaxed mb-6">
            Get that regal maharani charm without spending lakhs on real gold. Complete Kundan and
            antique gold-polished bridal sets with matching earrings and maang tikka starting at
            just ₹1,299.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/catalogue?category=kundan"
                className="px-7 py-3 bg-gold-600 hover:bg-gold-500 text-noir-950 text-xs tracking-widest uppercase font-medium transition-colors flex items-center justify-center gap-2 shadow-gold"
              >
                <span>Shop Wedding Sets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/catalogue?category=earrings"
                className="px-7 py-3 border border-champagne-300/40 hover:border-gold-400 text-ivory-100 hover:text-gold-300 text-xs tracking-widest uppercase transition-colors flex items-center justify-center"
              >
                <span>Explore Jhumkas</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

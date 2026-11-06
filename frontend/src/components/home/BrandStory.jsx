import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Heart, Truck } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

export default function BrandStory() {
  return (
    <section className="py-20 bg-white border-b border-champagne-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-ivory-200 border border-champagne-300 overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
                alt="Aurelle Traditional Indian Fashion Jewellery"
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Plaque with Gentle Floating Animation */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-ivory-50 border border-gold-500/50 p-5 shadow-xl max-w-xs hidden sm:block"
            >
              <span className="text-gold-600 font-serif text-2xl font-light block mb-0.5">
                50,000+ Happy Women
              </span>
              <p className="text-xs text-noir-800 font-medium tracking-wide uppercase">
                Across 28 States in India
              </p>
              <p className="text-[11px] text-noir-500 mt-1 font-light leading-relaxed">
                Loved for lightweight design, realistic gold look, and long-lasting shine.
              </p>
            </motion.div>
          </motion.div>

          {/* Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold">
              <Heart className="w-3.5 h-3.5 text-gold-600" />
              <span>Why Women Love Aurelle</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-noir-900 leading-tight">
              Royal Indian Looks, <br />
              <span className="italic font-light text-gold-700">Pocket-Friendly Prices</span>
            </h2>

            <p className="text-xs sm:text-sm text-noir-600 font-light leading-relaxed">
              We believe you should not have to spend lakhs on heavy real gold to feel special.
              AURELLE brings you premium imitation and fashion jewellery designed for everyday
              festivals, family weddings, college functions, and office celebrations.
            </p>

            <p className="text-xs sm:text-sm text-noir-600 font-light leading-relaxed">
              Every single piece is made using skin-friendly brass alloy and coated with premium gold
              or silver plating. You get the rich brilliance of Kundan, American Diamond, and
              traditional temple work without worrying about safety or high locker charges.
            </p>

            {/* 4 Friendly Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-champagne-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-noir-900">Anti-Tarnish Polish</h4>
                  <p className="text-[11px] text-noir-500 font-light">Long-lasting shine with proper care</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-noir-900">Skin Friendly</h4>
                  <p className="text-[11px] text-noir-500 font-light">Lead & nickel free brass base</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-noir-900">Cash on Delivery</h4>
                  <p className="text-[11px] text-noir-500 font-light">Pay cash when package arrives</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-noir-900">Lightweight Comfort</h4>
                  <p className="text-[11px] text-noir-500 font-light">Wear for hours without heaviness</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  to="/about"
                  className="inline-block px-7 py-2.5 bg-noir-900 hover:bg-gold-600 text-ivory-100 text-xs tracking-widest uppercase font-medium transition-colors"
                >
                  Read Our Story
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

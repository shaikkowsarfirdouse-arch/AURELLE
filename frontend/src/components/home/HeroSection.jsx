import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[82vh] flex items-center justify-center bg-noir-950 text-ivory-100 overflow-hidden">
      {/* Background Indian Jewellery Photo with Smooth Scale & Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1.03, opacity: 0.38 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=2000&auto=format&fit=crop"
          alt="Aurelle Indian Fashion Jewellery"
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/70 to-noir-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-noir-900/70 backdrop-blur-md shadow-gold">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            </motion.span>
            <span className="text-[10px] sm:text-xs tracking-widest uppercase text-gold-300 font-medium">
              Festive & Wedding Collection 2026
            </span>
          </div>
        </motion.div>

        {/* Heading in Clean Editorial Serif */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-ivory-50 leading-[1.15] mb-5"
        >
          Stunning Indian Fashion Jewellery <br className="hidden sm:block" />
          <span className="italic font-light text-gold-gradient">For Every Celebration</span>
        </motion.h1>

        {/* Simple Everyday English Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto text-xs sm:text-sm text-noir-300 font-light leading-relaxed mb-8 tracking-wide"
        >
          Explore beautiful Kundan choker sets, traditional jhumkas, trendy bangles, and oxidised
          silver pieces. Premium finish imitation jewellery at pocket-friendly prices.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto"
          >
            <Link
              to="/catalogue"
              className="w-full sm:w-auto px-8 py-3 bg-gold-600 hover:bg-gold-500 text-noir-950 font-medium text-xs tracking-widest uppercase transition-colors duration-300 shadow-gold flex items-center justify-center gap-2"
            >
              <span>Shop All Jewellery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto"
          >
            <Link
              to="/catalogue?category=kundan"
              className="w-full sm:w-auto px-8 py-3 border border-champagne-300/40 hover:border-gold-400 text-ivory-100 hover:text-gold-300 text-xs tracking-widest uppercase transition-colors duration-300 backdrop-blur-xs flex items-center justify-center"
            >
              <span>Explore Kundan Sets</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Simple Trust Points */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-noir-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] text-noir-300 font-light tracking-wider uppercase"
        >
          <motion.span
            whileHover={{ scale: 1.05, color: '#D4B866' }}
            className="flex items-center gap-1.5 transition-colors cursor-default"
          >
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            Free Shipping Above ₹999
          </motion.span>
          <span className="hidden sm:inline text-noir-700">&bull;</span>
          <motion.span
            whileHover={{ scale: 1.05, color: '#D4B866' }}
            className="flex items-center gap-1.5 transition-colors cursor-default"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            Cash on Delivery Across India
          </motion.span>
          <span className="hidden sm:inline text-noir-700">&bull;</span>
          <motion.span
            whileHover={{ scale: 1.05, color: '#D4B866' }}
            className="flex items-center gap-1.5 transition-colors cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Skin-Friendly Anti-Tarnish Finish
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

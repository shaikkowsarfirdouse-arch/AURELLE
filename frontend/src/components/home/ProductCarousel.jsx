import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';

export default function ProductCarousel({
  featured = [],
  newArrivals = [],
  bestSellers = [],
  onQuickView,
}) {
  const [activeTab, setActiveTab] = useState('featured');

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'new':
        return newArrivals;
      case 'bestsellers':
        return bestSellers;
      case 'featured':
      default:
        return featured;
    }
  };

  const tabs = [
    { id: 'featured', label: 'Trending Jewellery' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'bestsellers', label: 'Best Sellers' },
  ];

  return (
    <section className="py-16 bg-ivory-50 border-b border-champagne-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-champagne-200 gap-4"
        >
          <div>
            <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
              Popular Picks
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
              Handpicked Fashion Jewellery
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex border border-champagne-300 p-1 bg-white relative">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors z-10 ${
                  activeTab === tab.id
                    ? 'text-ivory-100 font-medium'
                    : 'text-noir-600 hover:text-gold-700'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeCarouselTab"
                    className="absolute inset-0 bg-noir-900 z-[-1]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid with Smooth Tab Switch Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductGrid
              products={getActiveProducts().slice(0, 8)}
              onQuickView={onQuickView}
              columns={4}
            />
          </motion.div>
        </AnimatePresence>

        {/* View all catalogue CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-3 border border-noir-900 text-noir-900 hover:bg-noir-900 hover:text-ivory-100 text-xs tracking-widest uppercase font-medium transition-all duration-300"
            >
              <span>View All Jewellery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

const catGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const catCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedCategories({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-ivory-100/70 border-b border-champagne-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            Top Categories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Shop by Style
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-0.5 bg-gold-500 mx-auto mt-3 origin-center"
          />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={catGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              variants={catCardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <Link
                to={`/catalogue?category=${cat.slug}`}
                className="group relative flex flex-col overflow-hidden bg-white border border-champagne-300 hover:border-gold-500 transition-colors duration-300 hover:shadow-luxury h-full"
              >
                <div className="aspect-[4/5] overflow-hidden bg-ivory-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/20 to-transparent" />
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white flex flex-col justify-end text-center">
                  <h3 className="font-serif text-sm sm:text-base font-medium text-ivory-50 group-hover:text-gold-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] tracking-wider uppercase text-champagne-200 mt-0.5 flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Items</span>
                    <ArrowRight className="w-3 h-3 text-gold-400" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export default function ProductGrid({ products, onQuickView, columns = 4 }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-champagne-200 p-8">
        <p className="font-serif text-2xl text-noir-800">No creations found</p>
        <p className="text-xs text-noir-500 mt-2 max-w-sm mx-auto">
          We could not find any fine jewellery matching your selected criteria. Try adjusting your
          filters or search terms.
        </p>
      </div>
    );
  }

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`grid ${gridColsClass} gap-6`}
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </motion.div>
  );
}


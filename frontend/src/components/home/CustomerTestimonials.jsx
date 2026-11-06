import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const testGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const testCardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CustomerTestimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        'The Royal Heritage Kundan choker was the highlight of my sangeet night! Everyone thought it was real gold. So lightweight, and the matching earrings are gorgeous.',
      author: 'Priya Sharma',
      location: 'Bengaluru, Karnataka',
      piece: 'Royal Heritage Kundan Choker Set',
      rating: 5,
    },
    {
      id: 2,
      quote:
        'Ordered the peacock chandbali jhumkas and an oxidised silver choker. Packaging was super safe with bubble wrap and a sturdy box. Cash on delivery was so convenient!',
      author: 'Ananya Roy',
      location: 'Kolkata, West Bengal',
      piece: 'Peacock Chandbali Jhumkas',
      rating: 5,
    },
    {
      id: 3,
      quote:
        'These gold-plated kada bangles look like real 22K gold. The side screw lock makes it very easy to put on. Incredible quality and finish for just ₹699.',
      author: 'Meera Patel',
      location: 'Ahmedabad, Gujarat',
      piece: 'Traditional Gold-Plated Kada Bangles',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-ivory-100/60 border-b border-champagne-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
            Real Reviews
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-noir-900 font-normal">
            Loved by Women Across India
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-3" />
        </motion.div>

        <motion.div
          variants={testGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={testCardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              className="bg-white border border-champagne-200 p-6 flex flex-col justify-between shadow-xs hover:border-gold-400 hover:shadow-luxury transition-colors duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-gold-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-champagne-300 stroke-[1.2]" />
                </div>

                <p className="text-xs text-noir-700 font-light leading-relaxed italic mb-4">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-champagne-100">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-sm font-semibold text-noir-900">{t.author}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />
                </div>
                <p className="text-[11px] text-noir-500">{t.location}</p>
                <p className="text-[10px] text-gold-700 font-medium uppercase tracking-wider mt-0.5 truncate">
                  Item: {t.piece}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

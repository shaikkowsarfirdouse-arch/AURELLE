import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, Compass, ShieldCheck, Sparkles, Feather, HeartHandshake } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { handleImageError } from '../utils/imageFallback';

export default function AboutPage() {
  return (
    <PageTransition className="bg-ivory-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-28 bg-noir-950 text-ivory-100 overflow-hidden text-center">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 0.28 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=2000"
            alt="Aurelle Indian Jewellery"
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto px-4"
        >
          <p className="text-[10px] tracking-widest2 uppercase text-gold-400 font-semibold mb-2">
            Indian Fashion & Imitation Jewellery
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-ivory-50 leading-tight">
            The Aurelle Story
          </h1>
          <p className="text-xs sm:text-sm text-noir-300 font-light mt-4 max-w-xl mx-auto leading-relaxed">
            Making royal Indian jewellery traditions accessible, lightweight, and pocket-friendly for every celebration.
          </p>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <span className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold block">
              Our Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-noir-900 leading-snug">
              Royal Heritage, Everyday Affordability
            </h2>
            <p className="text-xs sm:text-sm text-noir-600 font-light leading-relaxed">
              We believe every woman deserves to look and feel radiant on her special days without spending
              lakhs on expensive real gold or diamonds. Aurelle brings you the beauty of authentic Indian
              craftsmanship in premium imitation and fashion jewellery.
            </p>
            <p className="text-xs sm:text-sm text-noir-600 font-light leading-relaxed">
              Our collections include traditional Kundan chokers, temple jewellery, peacock jhumkas, meenakari bangles,
              and trendy oxidised silver jewellery. Every piece is made with skin-friendly brass and alloys, coated
              with long-lasting anti-tarnish micro-polish for lasting shine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200"
              alt="Indian jewellery craftsmanship"
              onError={handleImageError}
              className="w-full aspect-[4/5] object-cover border border-champagne-300 shadow-luxury"
            />
          </motion.div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-20 bg-white border-y border-champagne-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
              Why Customers Love Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-noir-900">
              Our 4 Quality Promises
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Skin-Friendly & Safe',
                desc: 'Lead-free and nickel-free brass and alloy materials that do not cause skin rashes or green marks.'
              },
              {
                icon: Sparkles,
                title: 'Anti-Tarnish Polish',
                desc: 'Advanced micro-coating protects the golden and antique finish against moisture and daily tarnishing.'
              },
              {
                icon: Feather,
                title: 'Lightweight Comfort',
                desc: 'Thoughtfully crafted to look grand yet remain light and easy on your ears and neck during celebrations.'
              },
              {
                icon: HeartHandshake,
                title: 'Pocket-Friendly Prices',
                desc: 'Direct-from-maker prices starting at ₹299 with free delivery across India on orders above ₹999.'
              }
            ].map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="p-6 bg-ivory-50 border border-champagne-200 space-y-3 shadow-soft hover:shadow-subtle transition-shadow"
                >
                  <IconComp className="w-8 h-8 text-gold-600 stroke-[1.2]" />
                  <h3 className="font-serif text-lg text-noir-900">{pillar.title}</h3>
                  <p className="text-xs text-noir-600 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-serif text-3xl text-noir-900 mb-3">Discover the Collection</h3>
          <p className="text-xs text-noir-600 font-light mb-6">
            Find your perfect necklace set, jhumkas, or bangles for the upcoming wedding and festive season.
          </p>
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/catalogue"
                className="inline-block px-8 py-3.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase hover:bg-gold-600 transition-colors shadow-luxury"
              >
                Shop Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/contact"
                className="inline-block px-8 py-3.5 border border-noir-800 text-noir-900 text-xs tracking-widest uppercase hover:bg-ivory-200 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}

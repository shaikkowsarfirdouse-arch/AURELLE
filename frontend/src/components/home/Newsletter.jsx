import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-ivory-50 border-b border-champagne-200">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center mx-auto mb-3 text-gold-700"
        >
          <Mail className="w-5 h-5 stroke-[1.2]" />
        </motion.div>

        <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-1">
          Special Welcome Offer
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl text-noir-900 font-normal mb-2">
          Get ₹100 Off On Your First Order
        </h2>

        <p className="text-xs text-noir-600 font-light max-w-md mx-auto mb-6 leading-relaxed">
          Sign up with your email to receive an instant ₹100 coupon code (use code: <strong>FIRST100</strong>)
          plus early access to new jewellery drops and festive sales.
        </p>

        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              key="subscribed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3.5 bg-gold-50 border border-gold-300 max-w-md mx-auto text-xs text-gold-900 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-gold-700" />
              <span>Thank you for subscribing! Use coupon code <strong>FIRST100</strong> at checkout.</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3.5 py-2.5 bg-white border border-champagne-300 text-xs text-noir-900 placeholder:text-noir-400 focus:outline-none focus:border-gold-600 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-5 py-2.5 bg-noir-900 text-ivory-100 text-xs tracking-wider uppercase font-medium hover:bg-gold-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Get ₹100 Off</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-noir-400 font-light mt-3">
          No spam, ever. Unsubscribe anytime with a single click.
        </p>
      </motion.div>
    </section>
  );
}

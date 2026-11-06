import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Check, Send } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Delivery Status',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition className="bg-ivory-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[10px] tracking-widest2 uppercase text-gold-700 font-semibold mb-2">
            AURELLE Indian Fashion Jewellery &bull; Customer Care
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-noir-900 font-normal">
            Get in Touch With Us
          </h1>
          <p className="text-xs sm:text-sm text-noir-600 font-light mt-3 leading-relaxed">
            Have questions about an order, styling help, or delivery? Our friendly support team is here to help!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Offices & Contact Info (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Location 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-champagne-300 p-6 shadow-xs space-y-3"
            >
              <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                Corporate Office & Warehouse &bull; Mumbai
              </span>
              <h3 className="font-serif text-xl text-noir-900">Mumbai Experience Center</h3>
              <div className="text-xs text-noir-600 font-light space-y-2 pt-1">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <span>42 Linking Road, Bandra West, Mumbai, Maharashtra 400050</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>+91 98200 12345 / 022 2640 1122</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Monday – Saturday: 10:00 AM – 7:00 PM IST</span>
                </p>
              </div>
            </motion.div>

            {/* Location 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-champagne-300 p-6 shadow-xs space-y-3"
            >
              <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                Regional Hub &bull; Bengaluru
              </span>
              <h3 className="font-serif text-xl text-noir-900">Bengaluru Center</h3>
              <div className="text-xs text-noir-600 font-light space-y-2 pt-1">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <span>100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>+91 80 4123 5678</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Monday – Sunday: 11:00 AM – 8:00 PM IST</span>
                </p>
              </div>
            </motion.div>

            <div className="p-4 bg-gold-50 border border-gold-300 text-xs text-gold-900 space-y-1">
              <strong className="font-serif text-sm block">Email & WhatsApp Support</strong>
              <p className="font-mono">help@aurelle.com &bull; care@aurelle.com</p>
              <p className="text-[11px] text-gold-800">WhatsApp Support: +91 98200 12345 (10am - 7pm)</p>
            </div>
          </motion.div>

          {/* Contact Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-champagne-300 p-8 shadow-luxury">
              <h3 className="font-serif text-2xl text-noir-900 mb-2">Send Us a Message</h3>
              <p className="text-xs text-noir-500 font-light mb-6">
                Fill in your details below and our team will get back to you within 24 business hours.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-8 text-center bg-ivory-100 border border-champagne-300 space-y-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto"
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                    <h4 className="font-serif text-2xl text-noir-900">Message Received</h4>
                    <p className="text-xs text-noir-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out! Our customer care representative will contact you shortly via email or phone.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Priya Sharma"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="priya@example.com"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98200 12345"
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                          Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                        >
                          <option value="Order & Delivery Status">Order & Delivery Status</option>
                          <option value="Exchange & Replacement">Exchange & Replacement</option>
                          <option value="Jewellery Care & Polishing">Jewellery Care & Sizing</option>
                          <option value="Bulk / Wedding Gift Orders">Bulk / Wedding Gift Orders</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-noir-700 font-medium mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-3.5 py-2.5 bg-ivory-50 border border-champagne-300 text-xs text-noir-900 focus:outline-none focus:border-gold-600"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-noir-900 text-ivory-100 text-xs tracking-widest uppercase font-medium hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-luxury cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

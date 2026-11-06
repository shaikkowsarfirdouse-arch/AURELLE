import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-noir-950 text-ivory-100 border-t border-gold-900/30 font-sans">
      {/* Trust Badges Bar */}
      <div className="border-b border-noir-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck className="w-7 h-7 text-gold-400 shrink-0 stroke-[1.4]" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-ivory-50">Free Delivery Above ₹999</h4>
              <p className="text-xs text-noir-400 font-light">Fast courier delivery across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <ShieldCheck className="w-7 h-7 text-gold-400 shrink-0 stroke-[1.4]" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-ivory-50">Cash on Delivery Available</h4>
              <p className="text-xs text-noir-400 font-light">Pay easily at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <RotateCcw className="w-7 h-7 text-gold-400 shrink-0 stroke-[1.4]" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-ivory-50">7-Day Easy Exchange</h4>
              <p className="text-xs text-noir-400 font-light">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Sparkles className="w-7 h-7 text-gold-400 shrink-0 stroke-[1.4]" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-ivory-50">Skin-Friendly & Anti-Tarnish</h4>
              <p className="text-xs text-noir-400 font-light">Lead-free, nickel-free brass alloy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest3 font-medium text-ivory-50">
                A U R E L L E
              </span>
              <span className="block text-[9px] tracking-widest2 text-gold-400 uppercase font-medium mt-0.5">
                Indian Fashion & Imitation Jewellery
              </span>
            </Link>
            <p className="text-xs text-noir-300 leading-relaxed max-w-sm font-light">
              AURELLE is an Indian fashion jewellery brand offering premium Kundan choker sets,
              traditional jhumkas, bangles, and oxidised silver jewellery. We make beautiful celebration
              wear affordable and accessible to every woman across India.
            </p>
            <div className="pt-1 text-xs text-noir-400 space-y-1">
              <p>Customer Support: support@aurelle.com</p>
              <p>Helpline / WhatsApp: +91 98200 12345 (Mon–Sat, 10 AM – 7 PM)</p>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm tracking-wider uppercase text-gold-300 font-medium">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs text-noir-300 tracking-wide">
              <li>
                <Link to="/catalogue?category=kundan" className="hover:text-gold-400 transition-colors">
                  Kundan & Bridal Sets
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=earrings" className="hover:text-gold-400 transition-colors">
                  Jhumkas & Chandbalis
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=necklaces" className="hover:text-gold-400 transition-colors">
                  Necklaces & Pearl Chokers
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=bangles" className="hover:text-gold-400 transition-colors">
                  Gold-Plated Kada Bangles
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=oxidised" className="hover:text-gold-400 transition-colors">
                  Oxidised Silver Jewellery
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=rings" className="hover:text-gold-400 transition-colors">
                  Adjustable Finger Rings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm tracking-wider uppercase text-gold-300 font-medium">
              Customer Help
            </h3>
            <ul className="space-y-2 text-xs text-noir-300 tracking-wide">
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  About Our Brand
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=orders" className="hover:text-gold-400 transition-colors">
                  Track Your Courier
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Jewellery Care Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Shipping & COD Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Account Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm tracking-wider uppercase text-gold-300 font-medium">
              My Account
            </h3>
            <ul className="space-y-2 text-xs text-noir-300 tracking-wide">
              <li>
                <Link to="/dashboard" className="hover:text-gold-400 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=orders" className="hover:text-gold-400 transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=wishlist" className="hover:text-gold-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold-400 transition-colors text-gold-400 font-medium">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-noir-800 flex flex-col sm:flex-row items-center justify-between text-xs text-noir-400 font-light gap-3">
          <p>&copy; {new Date().getFullYear()} AURELLE Indian Fashion Jewellery. All prices in Indian Rupees (₹ INR).</p>
          <div className="flex gap-4 tracking-wider">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Delivery Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

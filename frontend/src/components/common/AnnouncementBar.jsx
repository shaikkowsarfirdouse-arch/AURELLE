import React from 'react';
import { Sparkles, Phone, ShieldCheck, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-noir-900 text-ivory-100 text-xs py-2 px-4 border-b border-gold-900/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left tracking-wider">
        <div className="flex items-center gap-2 justify-center">
          <Truck className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-light">
            Free Shipping on Orders Above ₹999 | Cash on Delivery (COD) Available Across India
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-noir-300">
          <span className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            100% Skin-Friendly & Anti-Tarnish
          </span>
          <span className="text-noir-600">|</span>
          <span className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            Help: +91 98200 12345
          </span>
        </div>
      </div>
    </div>
  );
}

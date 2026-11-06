import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { handleImageError, DEFAULT_JEWELLERY_FALLBACK } from '../../utils/imageFallback';

export default function ImageGallery({ images = [], productName = 'Aurelle Jewellery' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const safeImages = images && images.length > 0
    ? images
    : [DEFAULT_JEWELLERY_FALLBACK];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Strip */}
      {safeImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-20 shrink-0 pb-2 lg:pb-0">
          {safeImages.map((img, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border overflow-hidden bg-white transition-all ${
                selectedIndex === idx
                  ? 'border-gold-600 ring-1 ring-gold-600 shadow-xs'
                  : 'border-champagne-300 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Image with Zoom */}
      <div className="relative flex-1 aspect-[4/5] bg-white border border-champagne-200 overflow-hidden group">
        <div
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="w-full h-full cursor-crosshair overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0.5, scale: 1.01 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={safeImages[selectedIndex]}
              alt={productName}
              onError={handleImageError}
              className="w-full h-full object-cover"
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-noir-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-noir-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-xs px-2.5 py-1 text-[10px] text-noir-600 tracking-wider flex items-center gap-1 pointer-events-none">
          <Maximize2 className="w-3 h-3 text-gold-600" />
          <span>Hover to inspect gemstone cut</span>
        </div>
      </div>
    </div>
  );
}


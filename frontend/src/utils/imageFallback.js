export const DEFAULT_JEWELLERY_FALLBACK =
  'https://images.unsplash.com/photo-1738754719555-05aca36707b1?q=80&w=800&auto=format&fit=crop';

/**
 * Gracefully handles image load errors by swapping to a verified fallback
 * and preventing infinite error triggering.
 */
export const handleImageError = (e, fallback = DEFAULT_JEWELLERY_FALLBACK) => {
  if (e && e.target && e.target.src !== fallback) {
    e.target.onerror = null;
    e.target.src = fallback;
  }
};


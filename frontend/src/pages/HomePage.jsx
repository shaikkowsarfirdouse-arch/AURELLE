import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductCarousel from '../components/home/ProductCarousel';
import BrandStory from '../components/home/BrandStory';
import LookbookBanner from '../components/home/LookbookBanner';
import CustomerTestimonials from '../components/home/CustomerTestimonials';
import Newsletter from '../components/home/Newsletter';
import QuickViewModal from '../components/common/QuickViewModal';
import PageTransition from '../components/common/PageTransition';
import { categoriesAPI, productsAPI } from '../api/client';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [highlights, setHighlights] = useState({
    featured: [],
    newArrivals: [],
    bestSellers: [],
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, highRes] = await Promise.all([
          categoriesAPI.getCategories(),
          productsAPI.getHighlights(),
        ]);

        if (catsRes.data?.success) {
          setCategories(catsRes.data.categories || []);
        }
        if (highRes.data?.success) {
          setHighlights({
            featured: highRes.data.featured || [],
            newArrivals: highRes.data.newArrivals || [],
            bestSellers: highRes.data.bestSellers || [],
          });
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageTransition className="bg-ivory-50">
      <HeroSection />

      <FeaturedCategories categories={categories} />

      <ProductCarousel
        featured={highlights.featured}
        newArrivals={highlights.newArrivals}
        bestSellers={highlights.bestSellers}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      <BrandStory />

      <LookbookBanner />

      <CustomerTestimonials />

      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </PageTransition>
  );
}


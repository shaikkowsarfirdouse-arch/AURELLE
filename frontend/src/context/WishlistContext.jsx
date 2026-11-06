import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await wishlistAPI.getWishlist();
        if (res.data?.success) {
          setWishlist(res.data.wishlist || []);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('aurelle_guest_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await wishlistAPI.toggleWishlist(productId);
        if (res.data?.success) {
          setWishlist(res.data.wishlist);
          return { success: true, added: res.data.added, message: res.data.message };
        }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Error updating wishlist',
        };
      }
    } else {
      let updated;
      let added = false;
      const exists = wishlist.some((p) => p._id === productId);

      if (exists) {
        updated = wishlist.filter((p) => p._id !== productId);
        added = false;
      } else {
        updated = [...wishlist, product];
        added = true;
      }

      setWishlist(updated);
      localStorage.setItem('aurelle_guest_wishlist', JSON.stringify(updated));
      return {
        success: true,
        added,
        message: added ? 'Added to your Wishlist' : 'Removed from your Wishlist',
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistAPI.removeItem(productId);
        if (res.data?.success) {
          setWishlist(res.data.wishlist);
        }
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
      }
    } else {
      const updated = wishlist.filter((p) => p._id !== productId);
      setWishlist(updated);
      localStorage.setItem('aurelle_guest_wishlist', JSON.stringify(updated));
    }
  };

  const value = {
    wishlist,
    loading,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    wishlistCount: wishlist.length,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};


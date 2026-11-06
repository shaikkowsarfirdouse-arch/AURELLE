import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code, discountPercent, discountAmount }

  // Load cart on auth change or mount
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartAPI.getCart();
        if (res.data?.success) {
          setCart(res.data.cart || { items: [] });
        }
      } catch (err) {
        console.error('Failed to fetch user cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local storage cart
      const saved = localStorage.getItem('aurelle_guest_cart');
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          setCart({ items: [] });
        }
      } else {
        setCart({ items: [] });
      }
    }
  };

  const saveGuestCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('aurelle_guest_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product, quantity = 1, selectedSize = '') => {
    const qty = Number(quantity) || 1;

    if (isAuthenticated) {
      try {
        const res = await cartAPI.addToCart({
          productId: product._id,
          quantity: qty,
          selectedSize,
        });
        if (res.data?.success) {
          setCart(res.data.cart);
          setIsCartOpen(true);
          return { success: true };
        }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to add item to bag',
        };
      }
    } else {
      // Guest cart logic
      const items = [...(cart.items || [])];
      const existingIdx = items.findIndex(
        (it) => it.product._id === product._id && it.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        items[existingIdx].quantity += qty;
      } else {
        items.push({
          _id: 'guest_' + Date.now() + Math.random().toString(36).substr(2, 4),
          product: {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            images: product.images,
            material: product.material,
            stock: product.stock,
          },
          quantity: qty,
          selectedSize: selectedSize || '',
          price: product.price,
        });
      }

      saveGuestCart({ items });
      setIsCartOpen(true);
      return { success: true };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const qty = Number(quantity);
    if (qty < 1) return;

    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateItem(itemId, { quantity: qty });
        if (res.data?.success) {
          setCart(res.data.cart);
        }
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    } else {
      const items = (cart.items || []).map((it) =>
        it._id === itemId ? { ...it, quantity: qty } : it
      );
      saveGuestCart({ items });
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeItem(itemId);
        if (res.data?.success) {
          setCart(res.data.cart);
        }
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    } else {
      const items = (cart.items || []).filter((it) => it._id !== itemId);
      saveGuestCart({ items });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        setCart({ items: [] });
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      saveGuestCart({ items: [] });
    }
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase();
    if (c === 'AURELLE10') {
      setCoupon({ code: 'AURELLE10', discountPercent: 10, description: '10% Festive Discount' });
      return { success: true, message: '10% discount applied to your order!' };
    } else if (c === 'FESTIVE50') {
      setCoupon({ code: 'FESTIVE50', discountAmount: 50, description: '₹50 Festive Offer' });
      return { success: true, message: '₹50 discount applied!' };
    } else if (c === 'FIRST100') {
      setCoupon({ code: 'FIRST100', discountAmount: 100, description: '₹100 Welcome Discount' });
      return { success: true, message: '₹100 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = (cart.items || []).reduce(
    (acc, it) => acc + (it.product?.price || it.price || 0) * it.quantity,
    0
  );

  const itemCount = (cart.items || []).reduce((acc, it) => acc + it.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(subtotal, coupon.discountAmount);
    }
  }

  // Free shipping on orders ₹999 and above, else ₹70 standard delivery
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 70;
  const tax = Math.round((subtotal - discount) * 0.03 * 100) / 100;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const value = {
    cart,
    loading,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    itemCount,
    discount,
    shipping,
    tax,
    total,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


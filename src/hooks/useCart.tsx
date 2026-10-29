import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Course, CourseVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (course: Course, variant: CourseVariant) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
  formatPrice: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aca_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aca_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const addToCart = (course: Course, variant: CourseVariant) => {
    setCart((prev) => {
      // Check if variant is already in cart
      const existing = prev.find((item) => item.variant_id === variant.id);
      if (existing) {
        return prev; // Course variant already added
      }
      const newItem: CartItem = {
        id: `cart-${course.id}-${variant.id}`,
        course_id: course.id,
        variant_id: variant.id,
        course,
        variant,
        quantity: 1,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.variant.sale_price * item.quantity, 0);
  const total = subtotal;

  const formatPrice = (amount: number): string => {
    // Format nicely as $ or BDT
    return `$${amount.toLocaleString()}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        total,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

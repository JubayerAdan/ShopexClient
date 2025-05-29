"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth  from "../app/hooks/useAuth";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch cart from backend when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`https://shopex-server-xi.vercel.app/cart/${user.email}`);
          if (!res.ok) throw new Error('Failed to fetch cart');
          const data = await res.json();
          setCart(data);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };

    fetchCart();
  }, [user]);

  // Add to cart
  const addToCart = async (product: any, quantity: number = 1) => {
    if (!user?.email) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      // Check if product already exists in cart
      const existingItem = cart.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if product exists
        await updateQuantity(product._id, existingItem.quantity + quantity);
      } else {
        // Add new product to cart
        const cartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          selectedVariant: product.selectedVariant
        };

        const res = await fetch("https://shopex-server-xi.vercel.app/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: user.email, 
            product: cartItem 
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to add to cart');
        }
        
        // Update local state immediately
        setCart(prev => [...prev, cartItem]);
      }
    } catch (error: any) {
      console.error('Error adding to cart:', {
        error: error?.message || 'Unknown error',
        product
      });
      alert(`Failed to add item to cart: ${error?.message || 'Unknown error'}`);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.email) return;

    try {
      console.log('Updating quantity:', { productId, quantity }); // Debug log
      
      const res = await fetch(`https://shopex-server-xi.vercel.app/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          _id: productId, 
          quantity 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Update quantity error:', {
          status: res.status,
          statusText: res.statusText,
          data
        });
        throw new Error(data.error || 'Failed to update quantity');
      }

      // Update local state immediately
      setCart(prev => 
        prev.map(item => 
          item._id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (error: any) {
      console.error('Error updating quantity:', {
        error: error?.message || 'Unknown error',
        productId,
        quantity
      });
      alert(`Failed to update quantity: ${error?.message || 'Unknown error'}`);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    if (!user?.email) return;

    try {
      console.log('Removing from cart:', { productId }); // Debug log
      
      const res = await fetch("https://shopex-server-xi.vercel.app/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          _id: productId
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Remove from cart error:', {
          status: res.status,
          statusText: res.statusText,
          data
        });
        throw new Error(data.error || 'Failed to remove from cart');
      }

      // Update local state immediately
      setCart(prev => prev.filter(item => item._id !== productId));
    } catch (error: any) {
      console.error('Error removing from cart:', {
        error: error?.message || 'Unknown error',
        productId
      });
      alert(`Failed to remove item from cart: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
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
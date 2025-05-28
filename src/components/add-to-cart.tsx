"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Button 
      onClick={handleAddToCart}
      size="lg"
      className={`w-full gap-2 ${
        isAdding ? 'bg-green-500' : 'bg-green-600'
      } hover:bg-green-700`}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Check className="h-5 w-5" /> Added to Cart
        </>
      ) : (
        <>
          <Plus className="h-5 w-5" /> Add to Cart
        </>
      )}
    </Button>
  );
} 
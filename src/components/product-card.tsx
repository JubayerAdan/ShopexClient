"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Plus, Check } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  badge?: string;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute left-4 top-4 z-10">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-all group-hover:scale-105"
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-2 text-sm text-gray-500">{product.category}</div>
          <h3 className="font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-bold">
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className={`w-full gap-2 transition-all duration-300 ${
              isAdding 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </Link>
  );
} 
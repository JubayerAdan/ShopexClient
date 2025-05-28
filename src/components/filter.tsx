"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Filter() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Sports',
  ];

  return (
    <div className="w-64 space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 
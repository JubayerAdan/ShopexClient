import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

export function Wishlist() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border rounded-lg p-4">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
          <h3 className="font-medium">Product Name {item}</h3>
          <p className="text-muted-foreground text-sm mt-1">$99.99</p>
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 
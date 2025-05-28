import Image from 'next/image';
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-90" />
      
      {/* Hero Content */}
      <div className="container relative flex min-h-[600px] items-center gap-8">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Sustainable Living,
              <span className="block text-green-600">Luxurious Style</span>
            </h1>
            <p className="text-xl text-gray-600">
              Discover our curated collection of eco-friendly products that combine luxury with sustainability.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Shop Now
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="relative hidden flex-1 lg:block">
          <Image
            src="https://images.unsplash.com/photo-1610024062303-e355e94c7a8c?w=800&auto=format"
            alt="Eco-friendly products"
            width={600}
            height={600}
            className="rounded-2xl object-cover shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
} 
"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
        <Image
          src={selectedImage}
          alt="Product image"
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(image)}
            className={`aspect-square overflow-hidden rounded-lg border ${
              selectedImage === image ? "ring-2 ring-green-600" : ""
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${i + 1}`}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery; 
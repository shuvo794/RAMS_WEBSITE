"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

// Update the interface to match the new data structure
interface Gallery {
  id: number;
  image: string;
}

interface GalleryGridProps {
  images: Gallery[];
  baseUrl: string;
}

// Update the component to use the new data structure
export function GalleryGrid({ images, baseUrl }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
    {}
  );
  const imageRefs = useRef<{ [key: number]: HTMLImageElement }>({});

  // Pre-fetch full-size images
  const fullSizeImages = images.map((image) => `${baseUrl}${image.image}`);

  // Preload images and store their references
  useEffect(() => {
    images.forEach((_, index) => {
      const img = new window.Image();
      img.src = fullSizeImages[index];
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
      };
      imageRefs.current[index] = img;
    });
  }, [fullSizeImages, images]);

  const handleImageClick = (index: number) => {
    if (loadedImages[index]) {
      setSelectedImage(index);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="aspect-[4/3] relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={fullSizeImages[index] || "/placeholder.svg"}
              alt={`Gallery Image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onLoadingComplete={() => {
                setLoadedImages((prev) => ({ ...prev, [index]: true }));
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage !== null && loadedImages[selectedImage] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 p-4 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Use background-image for instant display */}
            <div
              className="absolute inset-0 bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${fullSizeImages[selectedImage]})`,
              }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                const newIndex =
                  selectedImage === 0 ? images.length - 1 : selectedImage - 1;
                if (loadedImages[newIndex]) {
                  setSelectedImage(newIndex);
                }
              }}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                const newIndex =
                  selectedImage === images.length - 1 ? 0 : selectedImage + 1;
                if (loadedImages[newIndex]) {
                  setSelectedImage(newIndex);
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

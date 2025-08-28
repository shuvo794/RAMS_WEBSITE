"use client";
import { useState, useEffect } from "react";
import { GalleryGrid } from "./GalleryGrid";
import { BASE_URL, GET_GALLERIES } from "@/lib/config";
import { Loader2 } from "lucide-react";

interface Gallery {
  id: number;
  image: string;
}

export default function Gallery() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch(GET_GALLERIES);
        if (!response.ok) {
          throw new Error("Failed to fetch galleries");
        }
        const data = await response.json();
        if (data && data.galleries) {
          setGalleries(data.galleries);
        }
      } catch (err) {
        console.error("Error fetching galleries:", err);
        setError("Failed to load gallery images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No gallery images found.</p>
      </div>
    );
  }

  return <GalleryGrid images={galleries} baseUrl={BASE_URL} />;
}

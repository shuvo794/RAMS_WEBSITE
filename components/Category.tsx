"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "ALL" },
  { id: "rams", label: "RAMS" },
  { id: "pos", label: "POS" },
  { id: "dms", label: "DMS" },
  { id: "otms", label: "OTMS" },
  { id: "hrms", label: "HRMS" },
  { id: "e-com", label: "E-COMMERCE" },
];

const portfolioItems = [
  {
    id: "poly-world-service",
    title: "Poly World Service",
    category: "rams",
    image: "/recruitment agency management system.svg?height=400&width=600",
    description: "Comprehensive recruitment agency management system",
  },
  {
    id: "hrdc",
    title: "H R D C",
    category: "rams",
    image: "/hrdc.svg?height=400&width=600",
    description: "Human resource development center management",
  },
  {
    id: "airtrip-international",
    title: "Airtrip International",
    category: "rams",
    image: "/airtrip.svg?height=400&width=600",
    description: "International travel and recruitment platform",
  },
  {
    id: "welcome-dmc",
    title: "Welcome D M C",
    category: "dms",
    image: "/welcome.svg?height=400&width=600",
    description: "Digital medical center management system",
  },
  {
    id: "perfect-medicare",
    title: "Perfect Medicare Ltd",
    category: "dms",
    image: "/medicare.svg?height=400&width=600",
    description: "Healthcare facility management solution",
  },
  {
    id: "bashurhat-super-shop",
    title: "Bashurhat Super Shop",
    category: "pos",
    image: "/shop.svg?height=400&width=600",
    description: "Modern point of sale system for retail",
  },
  {
    id: "Winner-Overseas-Limited",
    category: "rams",
    title: "Winner Overseas Limited",
    description: "A leading overseas recruitment agency.",
    image: "/Winner.svg?height=400&width=600",
  },
  {
    id: "Active-Manpower-Service",
    category: "rams",
    title: "Active Manpower Service",
    description: "Providing skilled manpower services globally.",
    image: "/Manpower.svg?height=400&width=600",
  },
  {
    id: "Al-Humayra-Health-Centre",
    category: "dms",
    title: "Al-Humayra Health Centre Ltd",
    description: "A comprehensive health care center.",
    image: "/Health.svg?height=400&width=600",
  },
];

interface CategoryProps {
  initialCategory?: string;
  showCategoryButtons?: boolean;
}

export default function Category({
  initialCategory = "all",
  showCategoryButtons = true,
}: CategoryProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredItems =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter(
          (item) => item.category === activeCategory.toLowerCase()
        );

  return (
    <div>
      {showCategoryButtons && (
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-1 bg-gray-100 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === category.id
                    ? "bg-[#00D749] text-white"
                    : "hover:bg-gray-200"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <Link
            key={item.id}
            href={`/portfolio/${item.id}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  View Project
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 uppercase text-sm">{item.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

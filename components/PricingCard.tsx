"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fetureSingelGet } from "@/lib/config";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  name: string;
  price: string | number;
  period: string;
  description: string;
  disabledIndexes?: number[];
  btnColor?: string;
  gradient?: string;
  hoverGradient?: string;
  hoveredTitle?: string | null;
  id?: number;
  setHoveredTitle?: (name: string | null) => void;
}

interface Feature {
  id: number;
  is_checked: boolean;
  icon: string;
  label: string;
  feature: {
    id: number;
    label: string;
  };
}

/* ---------------- Skeleton Card ---------------- */
const PricingCardSkeleton = () => {
  return (
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-200 h-40 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Body Skeleton */}
      <div className="p-6 flex flex-col justify-between min-h-[380px]">
        {/* Description */}
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-6"></div>

        {/* Features */}
        <ul className="mb-6 space-y-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

/* ---------------- Main Pricing Card ---------------- */
const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  btnColor = "bg-gray-800 text-white",
  gradient = "from-blue-600 to-blue-600",
  hoverGradient = "from-blue-600 to-blue-600",
  hoveredTitle,
  setHoveredTitle,
  id,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [fetureSinge, setFetureSinge] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const isPremium = name.toLowerCase() === "premium";
  const isBasic = name.toLowerCase() === "gold";
  const isStandard = name.toLowerCase() === "standard";
  const isHoveredByAnother = hoveredTitle && hoveredTitle !== name;
  const defaultGradient =
    name.toLowerCase() === "premium" ? gradient : "from-gray-100 to-gray-400";

  const appliedGradient =
    isHovered || hoveredTitle === name
      ? hoverGradient
      : isHoveredByAnother
      ? "from-gray-100 to-gray-200"
      : defaultGradient;

  // responsive check
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // scale logic
  let scale = 1;
  if (isDesktop) {
    if (hoveredTitle?.toLowerCase() === "gold") {
      if (isPremium) scale = 1;
      else if (isBasic) scale = 1.1;
    } else if (hoveredTitle?.toLowerCase() === "standard") {
      if (isStandard) scale = 1.1;
    } else if (hoveredTitle?.toLowerCase() === "premium") {
      if (isPremium) scale = 1.1;
    } else {
      scale = isPremium ? 1.05 : 1;
    }
  }

  // fetch data
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${fetureSingelGet}${id}`);
        if (!response.ok) throw new Error("Failed to fetch features");
        const data = await response.json();
        setFetureSinge(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const router = useRouter();

  const handlePurchaseClick = () => {
    const userName = localStorage.getItem("userName");
    if (!id) return;

    const packageItem = { id, name };
    const existingCart = localStorage.getItem("cartPackages");
    const cartArray: { id: string | number; name: string }[] = existingCart
      ? JSON.parse(existingCart)
      : [];

    cartArray.push(packageItem);
    localStorage.setItem("cartPackages", JSON.stringify(cartArray));
    const stored = localStorage.getItem("cartPackages");

    // Parse it back to array
    const cartPackages = stored ? JSON.parse(stored) : [];

    // Get IDs only
    const ids = cartPackages.map((item: { id: number }) => item.id);
    if (!userName) {
      router.push("/sign-in");
    } else {
      router.push(`/cart?id=${ids}`);
    }
  };

  /* ----- Skeleton Loading ----- */
  if (loading) {
    return <PricingCardSkeleton />;
  }

  /* ----- Real Card ----- */
  return (
    <motion.div
      onMouseEnter={() => {
        setIsHovered(true);
        setHoveredTitle?.(name);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredTitle?.(null);
      }}
      animate={{ scale }}
      transition={{ duration: 0.3 }}
      className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl transition-transform ${
        isHovered ? "z-10" : "z-0"
      }`}
    >
      {/* Header */}
      <div
        className={`relative bg-gradient-to-b ${appliedGradient} p-16 text-white text-center`}
      >
        <h2 className="text-3xl font-light">
          <span> ৳ </span>
          {price}
        </h2>
        <h4 className="text-sm mb-2">{period}</h4>
        <h3 className="text-2xl font-bold">{name}</h3>
      </div>

      {/* Body */}
      <div className="bg-white p-6 text-center flex flex-col justify-between min-h-[380px]">
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <ul className="mb-6 text-left space-y-3">
          {fetureSinge.map((feature) => (
            <li
              key={feature.id}
              className={`flex items-center gap-1 ${
                !feature.is_checked
                  ? "text-gray-400"
                  : "text-gray-700 font-medium"
              }`}
            >
              {feature.is_checked ? (
                <CheckCircle size={16} className="text-blue-600" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
              {feature.feature.label}
            </li>
          ))}
        </ul>

        <button
          onClick={handlePurchaseClick}
          className={`w-full py-3 rounded-lg shadow-md hover:opacity-90 transition-all font-semibold ${btnColor}`}
        >
          PURCHASE NOW
        </button>
      </div>
    </motion.div>
  );
};

export default PricingCard;

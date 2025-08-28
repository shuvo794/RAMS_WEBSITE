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
  features: string[];
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
  const isPremium = name.toLowerCase() === "premium";
  const isBasic = name.toLowerCase() === "gold";
  const isStandard = name.toLowerCase() === "standard";
  const isHoveredByAnother = hoveredTitle && hoveredTitle !== name;
  const defaultGradient =
    name.toLowerCase() === "premium" ? gradient : "from-gray-100 to-gray-400";

  // console.log("sdskjdhsdhaskdhaskhd", id);

  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [fetureSinge, setFetureSinge] = useState<Feature[]>([]);

  const appliedGradient =
    isHovered || hoveredTitle === name
      ? hoverGradient
      : isHoveredByAnother
      ? "from-gray-100 to-gray-200"
      : defaultGradient;

  // Watch screen size for desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Scale logic (desktop only)
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

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`${fetureSingelGet}${id}`);
        if (!response.ok) throw new Error("Failed to fetch features");
        const data = await response.json();
        setFetureSinge(data.map((item: Feature) => item));
      } catch {
        // Handle error
      }
    };

    fetchBlog();
  }, [id]);

  const router = useRouter();

  const handlePurchaseClick = () => {
    const userName = localStorage.getItem("userName");

    if (id === undefined || id === null) {
      console.error("Plan ID is undefined or null, cannot add to cart.");
      return;
    }

    const packageItem = {
      id: id, // plan id
      name: name, // plan name
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    let cartArray: { id: string | number; name: string }[] = [];

    if (existingCart) {
      cartArray = JSON.parse(existingCart);
    }

    // Add new package to array
    cartArray.push(packageItem);

    // Save back to localStorage
    localStorage.setItem("cartPackages", JSON.stringify(cartArray));

    if (!userName) {
      router.push("/sign-in");
    }
    if (!userName) {
      router.push("/sign-in");
    } else {
      // Construct URL with query param
      router.push(`/cart?id=${id}`);
    }
  };

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
        className={`relative bg-gradient-to-b ${appliedGradient} p-16 text-white text-center transition-colors duration-300`}
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
          {fetureSinge.map((feature: Feature, index: number) => {
            const is_checked = feature.is_checked;
            return (
              <li
                key={index}
                className={`flex items-center gap-1 ${
                  !is_checked
                    ? "text-gray-400 line-clamp-none"
                    : "text-gray-700 font-medium"
                }`}
              >
                {!is_checked ? (
                  <XCircle size={16} className="text-red-500" />
                ) : (
                  <CheckCircle size={16} className="text-blue-600" />
                )}
                {feature.feature.label}
              </li>
            );
          })}
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

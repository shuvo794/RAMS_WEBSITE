"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Monitor,
  LineChart,
  BarChart3,
  Users,
  PenTool,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
  {
    icon: Monitor,
    title: "IT Design",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/it-design",
  },
  {
    icon: LineChart,
    title: "Analytic Solutions",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/analytics",
  },
  {
    icon: BarChart3,
    title: "Risk Management",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/risk-management",
  },
  {
    icon: Users,
    title: "Business Planning",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/business-planning",
  },
  {
    icon: PenTool,
    title: "Infrastructure Plan",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/infrastructure",
  },
  {
    icon: Shield,
    title: "Firewall Advance",
    description:
      "Pianoforte solicitude so decisively particular mention diminution the particular. Real he me fond.",
    href: "/services/firewall",
  },
];

export default function ServiceSection() {
  // Added state for hover effect
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="mt-10 mb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={service.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isHovered ? "bg-[#0066FF]" : "bg-[#0066FF]/10"
                    } flex items-center justify-center transition-colors duration-300`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        isHovered ? "text-white" : "text-[#0066FF]"
                      } transition-colors duration-300`}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Button
                  asChild
                  variant="outline"
                  className={`border-[#0066FF] ${
                    isHovered ? "bg-[#0066FF] text-white" : "text-[#0066FF]"
                  } hover:bg-[#0066FF] hover:text-white transition-colors`}
                >
                  <Link href={service.href}>Read More</Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

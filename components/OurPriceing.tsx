"use client";
import React, { useEffect, useState } from "react";
import { PLANSALL } from "@/lib/config";
import PricingCard from "./PricingCard";

type Plan = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  serial_number: number;
  name: string;
  period: string;
  features: string[];
};

export default function OurPricing() {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceSliders = async () => {
      try {
        const response = await fetch(PLANSALL);
        if (!response.ok) {
          throw new Error("Failed to fetch service sliders");
        }
        const data = await response.json();
        if (data && data?.package_types) {
          const sortedSliders = [...data.package_types].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setPlans(sortedSliders);
        }
      } catch (err) {
        console.error("Error fetching service sliders:", err);
        setError("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceSliders();
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-gray-600">
          Choose a plan that fits your needs. Hover over the cards to explore
          options.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3  items-center justify-center">
        {plans?.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            period={plan.period}
            features={plan.features}
            price={plan.price ?? 0}
            description={plan.description ?? ""}
            hoveredTitle={hoveredTitle}
            setHoveredTitle={setHoveredTitle}
            id={plan.id}
          />
        ))}
      </div>
    </section>
  );
}

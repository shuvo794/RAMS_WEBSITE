import OurPriceing from "@/components/OurPriceing";
import PageHeroSection from "@/components/PageHeroSection";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeroSection
        title="OUR PRICING"
        backgroundImage="/half-circle-bg.png"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "pricing", href: "/pricing" },
        ]}
      />
      <OurPriceing />
    </div>
  );
};

export default page;

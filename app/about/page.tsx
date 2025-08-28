import AboutUs from "@/components/AboutUs";
import PageHeroSection from "@/components/PageHeroSection";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeroSection
        title="About Us"
        backgroundImage="/half-circle-bg.png" // Make sure this path and file exist
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
      />
      <AboutUs />
    </div>
  );
};

export default page;

import ContactUs from "@/components/ContactUs";
import PageHeroSection from "@/components/PageHeroSection";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeroSection
        title="CONTACT US"
        backgroundImage="/half-circle-bg.png" // Make sure this path and file exist
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "Contact Us", href: "/contact-us" },
        ]}
      />
      <ContactUs />
    </div>
  );
};

export default page;

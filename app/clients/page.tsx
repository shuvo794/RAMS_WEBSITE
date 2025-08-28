import ClientsDetails from "@/components/ClientDetails";
import PageHeroSection from "@/components/PageHeroSection";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeroSection
        title="OUR CLIENTS"
        backgroundImage="/half-circle-bg.png"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "CLIENTS", href: "/clients" },
        ]}
      />
      <ClientsDetails />
    </div>
  );
};

export default page;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeroSection from "@/components/PageHeroSection";

export default function BlogItemPage() {
  const router = useRouter();

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      router.push("/sign-in"); // Redirect to home if userName is not found
    }
  }, [router]);

  return (
    <>
      <PageHeroSection
        title=""
        backgroundImage="/half-circle-bg.png"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "PRICING", href: "/pricing" },
        ]}
      />
      <h1>Coming soon .............</h1>
    </>
  );
}

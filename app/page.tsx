import HeroSection from "@/components/HeroSection";

import OurServices from "@/components/OurServices";
import { Metadata } from "next";
import TestimonialSection from "@/components/TestimonialSection";
import OurToolkit from "@/components/OurToolkit";
import OurPriceing from "@/components/OurPriceing";

export const metadata: Metadata = {
  title: "RAMS - Home",
  description: "RAMS - Your partner for innovative IT solutions",
  openGraph: {
    title: "RAMS - Home",
    description: "Your partner for innovative IT solutions",
    images: [
      {
        url: "/api/og?title=Home&description=Your partner for innovative IT solutions",
      },
    ],
  },
  // twitter: {
  //   title: "RAMS - Home",
  //   description: "Your partner for innovative IT solutions",
  //   images: [
  //     "/api/og?title=Home&description=Your partner for innovative IT solutions",
  //   ],
  // },
};

export default async function Home() {
  return (
    <main>
      <HeroSection />
      <OurServices />
      <OurToolkit />
      <OurPriceing />
      <TestimonialSection />
    </main>
  );
}

// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // prevents invisible text & shifts
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarAndFooter =
    // pathname === "/sign-in" ||
    // pathname === "/sign-up" ||
    // pathname === "/sign-up" ||
    pathname === "/dashboard" ||
    pathname === "/package" ||
    pathname === "/package-details" ||
    pathname === "/ticket" ||
    pathname === "/invoice" ||
    // pathname.startsWith("/invoice/") ||
    pathname.startsWith("/open-ticket/") || // Handles dynamic ID route
    pathname.startsWith("/ticket/") || // Handles dynamic ID route
    pathname === "/open-ticket" ||
    pathname === "/ticketCreate" ||
    // pathname === "/VerifyOtp" ||
    // pathname === "/otp-send" ||
    pathname === "/info-update";

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {!hideNavbarAndFooter && <NavbarSection />}
          {children}
          {!hideNavbarAndFooter && <FooterSection />}
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, UserCheck } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";

export default function NavbarSection() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<string | { name?: string } | null>(null);
  const [, setMounted] = useState(false);
  const pathname = usePathname();
  const isWhiteHeader = pathname.startsWith("/pricing/");
  // const isWhiteInVoice = pathname.startsWith("/invoice/");
  // const searchParams = useSearchParams();
  // console.log("gfhfjgfhgfg", searchParams);
  // const id = searchParams.get("id"); // 👉 get ?id=123

  // const [, setId] = useState<string | null>(null);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   setId(params.get("id"));
  // }, []);
  useEffect(() => {
    setMounted(true);
    const storedUserName = localStorage.getItem("userName");
    setUser(storedUserName);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <header
      className={cn(
        "w-full z-50 transition-all duration-300",
        isScrolled ||
          isWhiteHeader ||
          pathname.startsWith("/Reviwe/") ||
          pathname.startsWith("/checkout/") ||
          pathname.startsWith("/edit/") ||
          pathname === "/cart" ||
          pathname === "/package-details" ||
          pathname === "/payment-success" ||
          pathname === "/payment-failed" ||
          pathname === "/payment-cancelled" ||
          pathname.startsWith("/invoice/") ||
          pathname.startsWith("/cart/")
          ? "fixed top-0 bg-white shadow"
          : "fixed top-0 bg-transparent text-white"
      )}
    >
      <div className="max-w-[1200px] mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/RAMSNew(2).png" alt="Logo" width={150} height={80} />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex gap-1">
            {[
              { href: "/", label: "HOME" },
              { href: "/blog", label: "BLOG" },
              { href: "/pricing", label: "PRICING" },
              { href: "/clients", label: "CLIENTS" },
              { href: "/contact-us", label: "CONTACT US" },
            ].map(({ href, label }) => (
              <NavigationMenuItem key={label}>
                <Link
                  href={href}
                  className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium"
                >
                  {label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {/* Desktop: Sign In or User Dropdown */}
          {!isMobile && (
            <>
              {!user ? (
                <Link href="/sign-in">
                  <Button className="bg-white text-gray-700 border hover:text-blue-500">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
                  {/* <DropdownMenuTrigger asChild>
                    <Link href={`/Checkout/${id}`}>
                      <button className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 border border-gray-300 rounded-full hover:text-blue-500 focus:outline-none">
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    </Link>
                  </DropdownMenuTrigger> */}
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 border border-gray-300 rounded-full hover:text-blue-500 focus:outline-none">
                      <UserCheck className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="shadow-lg rounded-md bg-white">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">
                        <span className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                          Account
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-64 bg-white">
                <nav className="flex flex-col gap-4 mt-4 text-gray-700 font-semibold">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/blog", label: "Blog" },
                    { href: "/pricing", label: "Pricing" },
                    { href: "/clients", label: "Clients" },
                    { href: "/contact-us", label: "Contact Us" },
                  ].map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}

                  <div className="mt-6 border-t pt-4">
                    {user ? (
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setOpen(false);
                        }}
                        className="w-full bg-red-500 text-white hover:bg-red-600"
                      >
                        Sign Out
                      </Button>
                    ) : (
                      <Link href="/sign-in" onClick={() => setOpen(false)}>
                        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

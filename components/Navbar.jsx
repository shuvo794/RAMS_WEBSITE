"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, UserCheck } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = (useState < string) | (null > null);

  // Load user info from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    if (!storedUserName || !token) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/sign-in");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/package", label: "Package" },
    { href: "/invoice", label: "Invoice" },
    { href: "/ticket", label: "Ticket" },
    { href: "/open-ticket", label: "Open Ticket" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-900 text-white px-4 py-2 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png" // Replace with your logo
            alt="Logo"
            width={48}
            height={48}
            className="mr-3"
          />
        </Link>
        <span className="font-bold text-lg">MyApp</span>
      </div>

      {/* Center: Nav links (desktop only) */}
      <div className="hidden md:flex gap-6">
        {navLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="uppercase font-semibold hover:text-gray-200 transition"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right: User info & mobile menu */}
      <div className="flex items-center gap-3">
        {/* Desktop user menu */}
        <div className="hidden md:flex items-center gap-2 relative">
          <span>{userName}</span>
          <button
            className="bg-white text-gray-700 rounded-full p-2 hover:text-blue-500"
            onClick={handleSignOut}
          >
            <UserCheck className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile sidebar menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-purple-900 text-white shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/30">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setMenuOpen(false)}>&times;</button>
        </div>

        <nav className="flex flex-col p-4 gap-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="uppercase font-semibold px-3 py-2 rounded hover:bg-blue-800"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <hr className="border-white/30 my-2" />

          <button
            onClick={() => {
              handleSignOut();
              setMenuOpen(false);
            }}
            className="font-semibold text-left px-3 py-2 rounded hover:bg-blue-800"
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Overlay behind sidebar */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </nav>
  );
};

export default Navbar;

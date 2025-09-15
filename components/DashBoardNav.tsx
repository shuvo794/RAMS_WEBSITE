"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { BASE_URL, GET_SITESETTINGS } from "@/lib/config";

type GeneralSettings = {
  rams_logo: string;
  address: string;
  email: string;
  phone: number;
};

const DashBoardNav = () => {
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // ✅ site settings fetch
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();
        setData(json.general_settings[0]);
      } catch (error) {
        console.error("DashBoardNav fetch error:", error);
      }
    }
    fetchData();
  }, []);

  // ✅ user check
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (!storedUserName) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/sign-in");
    setUserName(null);
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
    <>
      {/* DashBoardNav */}
      <nav
        className="relative text-white px-4 py-2 flex items-center justify-between flex-wrap"
        style={{
          background:
            "linear-gradient(45deg, #488fed 0%, #291fbc 51%, #0f0786 100%)",
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src={`${BASE_URL}${data?.rams_logo ?? ""}`}
              alt="Logo"
              className="h-12 w-auto"
              width={48}
              height={48}
            />
          </Link>
          <span className="font-bold text-lg hidden sm:block">RAMS</span>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-2 font-semibold uppercase text-sm hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* ✅ User Dropdown (show both Desktop + Mobile) */}
          {userName && (
            <div className="hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 border border-gray-300 rounded-full hover:text-blue-500 focus:outline-none">
                    <UserCheck className="w-5 h-5" />
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
            </div>
          )}

          {/* ✅ Mobile Menu Button (only on small screens) */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0f0786] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/30">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="uppercase font-semibold px-3 py-2 rounded hover:bg-blue-900"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <hr className="border-white/30 my-2" />

          {userName && (
            <>
              <Link
                href="/dashboard"
                className="font-semibold px-3 py-2 rounded hover:bg-blue-900"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="font-semibold text-left px-3 py-2 rounded hover:bg-blue-900"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </>
  );
};

export default DashBoardNav;

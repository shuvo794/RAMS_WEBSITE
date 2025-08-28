"use client";

// import TicketTabile from "@/components/TicketTabile";
import { BASE_URL, GET_SITESETTINGS } from "@/lib/config";
import {
  faComment,
  faFilter,
  faGlobe,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import InvoiceTabile from "@/components/InvoiceTabile";
type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
};

const TicketPage = () => {
  const [, setUserName] = useState<string | null>(null);
  const [, setMenuOpen] = useState(false);

  const [data, setData] = useState<GeneralSettings | null>(null);
  const [, setUser] = useState<string | { name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();
        setData(json.general_settings[0]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
      }
    }

    fetchData();
  }, []);

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
    setUser(null);
  };

  const navLinks = [
    { href: "/", label: "Home" },

    { href: "/dashboard", label: "Dashboard" },

    { href: "/package", label: "Pakage" },
    { href: "/invoice", label: "Invoice" },
    { href: "/ticket", label: "Ticket" },
    { href: "/open-ticket", label: "Open Ticket" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav
        className="relative text-white px-4 py-2 flex items-center justify-between flex-wrap"
        style={{
          background:
            "linear-gradient(45deg, #488fed 0%, #291fbc 51%, #0f0786 100%)",
        }}
      >
        {/* Left: Logo */}
        <div className="w-full flex justify-center md:justify-start md:w-auto mb-2 md:mb-0">
          <Link href="/">
            <Image
              src={`${BASE_URL}${data?.rams_logo ?? ""}`}
              alt="CWP Logo"
              className="h-12 w-auto"
              width={48}
              height={48}
            />
          </Link>
        </div>

        {/* Center: Nav Links (Desktop only) */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-2 font-semibold uppercase text-sm"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Username + Mobile Menu Icon */}
        <div className="flex items-center gap-3 px-8">
          {/* Desktop dropdown */}
          <span className="hidden md:inline font-semibold text-sm md:text-base">
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
          </span>

          {/* Mobile menu toggle */}
          <div className="flex justify-center w-1/2 md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="ml-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Sidebar */}
        <aside className="space-y-4 md:col-span-1">
          <div className=" rounded shadow-md space-y-6 text-sm">
            {/* View Section */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} />
                  View
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Open", count: 1 },
                  { label: "Answered", count: 12 },
                  { label: "Coustomer Reply", count: 1 },

                  { label: "Closed", count: 3 },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        className="accent-blue-600"
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-gray-500">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} />
                  Support
                </div>
              </div>
              <div className="space-y-2">
                <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  My Invoice
                  <FontAwesomeIcon icon={faTicket} />
                </button>
                {/* <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  Announcement
                  <FontAwesomeIcon icon={faScroll} />
                </button> */}
                {/* <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  Knowledge
                  <FontAwesomeIcon icon={faBookAtlas} />
                </button> */}
                {/* <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  Download
                  <FontAwesomeIcon icon={faDownload} />
                </button> */}
                {/* <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  Network Status
                  <FontAwesomeIcon icon={faNetworkWired} />
                </button> */}
                <Link href="/open-ticket">
                  <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                    Open Ticket
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </aside>
        <div className="md:col-span-3">
          <InvoiceTabile />
        </div>
      </main>
    </div>
  );
};

export default TicketPage;

"use client";

import DashBoardNav from "@/components/DashBoardNav";
import PackageTabile from "@/components/PackageTabile";
import { BASE_URL, GET_SITESETTINGS } from "@/lib/config";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Menu, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
};

const PackagePage = () => {
  const [, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <DashBoardNav />

      {/* Mobile menu sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0f0786] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/30">
          <span className="font-bold text-lg">Menu</span>
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
              onClick={() => setMenuOpen(false)} // close on click
            >
              {label}
            </Link>
          ))}

          <hr className="border-white/30 my-2" />

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
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Sidebar */}
        <aside className="space-y-4 p-2 md:col-span-1">
          <div className=" bg-white rounded shadow-md space-y-6 text-sm">
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
                  { label: "Active", count: 1 },
                  { label: "Pending", count: 0 },
                  { label: "Expired", count: 0 },
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
          </div>
        </aside>
        {/* Dashboard Content */}
        <div className="md:col-span-3">
          <PackageTabile />
        </div>
      </main>
    </div>
  );
};

export default PackagePage;

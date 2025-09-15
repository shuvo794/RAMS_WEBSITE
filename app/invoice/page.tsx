"use client";

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
import DashBoardNav from "@/components/DashBoardNav";

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
  const [menuOpen, setMenuOpen] = useState(false); // ✅ keep menu state
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

      {/* Main Content */}
      <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Sidebar */}
        <aside className="space-y-4 md:col-span-1">
          <div className="rounded shadow-md space-y-6 text-sm">
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
                  <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
                  Support
                </div>
              </div>
              <div className="space-y-2">
                <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                  My Invoice
                  <FontAwesomeIcon icon={faTicket} className="w-5 h-5" />
                </button>

                <Link href="/open-ticket">
                  <button className="flex justify-between items-center w-full text-gray-600 px-4 py-2 transition-all duration-200 hover:bg-gray-500 hover:text-white rounded-[10px]">
                    Open Ticket
                    <FontAwesomeIcon icon={faComment} className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">
          <InvoiceTabile />
        </div>
      </main>
    </div>
  );
};

export default TicketPage;

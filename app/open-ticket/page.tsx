"use client";

import { Menu, MessageSquare, UserCheck } from "lucide-react";

import { BASE_URL, GET_SITESETTINGS, TICKET_CHECK_IDS } from "@/lib/config";
import {
  faComment,
  faGlobe,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import OpenTicket from "@/components/OpenTicket";
type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
};

// const tickets = [
//   {
//     id: "#900336",
//     title: "Apache Custom Templat...",
//     status: "Customer Reply",
//     statusColor: "text-orange-500",
//     date: "2 weeks ago",
//   },
//   {
//     id: "#214679",
//     title: "Prevent Apache Config ...",
//     status: "Answered",
//     statusColor: "text-gray-500",
//     date: "1 month ago",
//   },
//   {
//     id: "#015273",
//     title: "postgresql access",
//     status: "Answered",
//     statusColor: "text-gray-500",
//     date: "6 months ago",
//   },
//   {
//     id: "#335283",
//     title: "CronTab default Config...",
//     status: "Answered",
//     statusColor: "text-gray-500",
//     date: "7 months ago",
//   },
//   {
//     id: "#240199",
//     title: "how to backup Postgres...",
//     status: "Answered",
//     statusColor: "text-gray-500",
//     date: "10 months ago",
//   },
// ];

type TicketMe = {
  id: number;
  ticket_number: string;
  subject: string;
  created_at: string;
  ticket_status?: {
    id: number;
    name: string;
  };
  // Add other fields as needed
};

const OpenTicketPage = () => {
  const [, setUserName] = useState<string | null>(null);
  const [, setMenuOpen] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [, setUser] = useState<string | { name?: string } | null>(null);
  const [ticket, setTicket] = useState<TicketMe[]>([]); // ✅ array type
  const [userId, setUserId] = useState<string | null>(null);

  // const userId = localStorage.getItem("id");

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
    const storedUserId = localStorage.getItem("id");

    setUserId(storedUserId);

    if (!storedUserName) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        const res = await fetch(`${TICKET_CHECK_IDS}${userId}`);
        if (!res.ok) {
          const text = await res.text(); // optional: log raw HTML error
          console.error("Failed to fetch ticket data:", text);
          return;
        }
        const jsonDpt = await res.json();

        setTicket(jsonDpt?.tickets);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [userId]);

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

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
    <div className="min-h-screen bg-gray-100 font-sans  overflow-hidden">
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

      <main className="pt-[20px] p-2 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Sidebar */}
        <aside className="space-y-4 md:col-span-1">
          <div className=" rounded shadow-md space-y-6 text-sm">
            {/* View Section */}
            <div className="bg-white p-4 rounded shadow">
              {ticket.length === 0
                ? // Skeleton loader
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 animate-pulse bg-gray-200 rounded"
                    >
                      <div className="h-4 w-3/4 mb-2 bg-gray-300 rounded"></div>
                      <div className="h-3 w-full bg-gray-300 rounded"></div>
                    </div>
                  ))
                : ticket.map((item) => (
                    <Link key={item.id} href={`/ticket/${item.id}`}>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        # {item.ticket_number}
                        <div className="flex justify-between items-start mb-1">
                          {/* optional ticket ID and date */}
                        </div>
                        <h3 className="text-gray-800 text-sm mb-1 font-normal">
                          {truncateWords(item?.subject || "", 50)}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-medium ${
                              item.ticket_status?.name?.toLowerCase() ===
                              "customer reply"
                                ? "text-orange-500"
                                : item.ticket_status?.name?.toLowerCase() ===
                                  "answered"
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {item.ticket_status?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

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
        <div className="md:col-span-3">
          <OpenTicket />
        </div>
      </main>
    </div>
  );
};

export default OpenTicketPage;

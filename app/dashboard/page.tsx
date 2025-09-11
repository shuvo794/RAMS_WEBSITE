"use client";

import {
  BASE_URL,
  GET_SITESETTINGS,
  INVOICE_UNPAID,
  PACKAGE,
  TICKET_CHECK_IDS,
  USER_ME,
} from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Menu, UserCheck } from "lucide-react";
import moment from "moment";
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
type UserMe = {
  first_name: string;
  last_name: string;
  email: string;
  country_code1: number;
  primary_phone: number;
  logo: string;
  rl_no: number;
};
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

type Invoice = {
  paid_invoice: number;
  unpaid_invoice: number;
  subscription: number;
};

type PackageCheck = {
  ticket_department: {
    name: string;
  };
  subject: string;
  ticket_priority: {
    name: string;
  };
  ticket_status: {
    name: string;
  };
  ticket_number: string;
  id: number;
  subscription_items: {
    package: {
      name: string;
    };
    amount: string;
    end_date: string;
    is_active: boolean;
  };
};

const Page = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [support, setsupport] = useState<number | null>(null);
  const [packageCheck, setPackageCheck] = useState<PackageCheck[]>([]);
  const [, setEmail] = useState<string | null>(null);
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [invoice, setInVoice] = useState<Invoice | null>(null);
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [ticket, setTicket] = useState<TicketMe[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setToken] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [, setUser] = useState<string | { name?: string } | null>(null);
  const router = useRouter();

  const [currentPage] = useState<number>(1);
  const [, setTotalPages] = useState<number>(1);
  const [size, setSize] = useState<number>(10); // page size = 1
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${PACKAGE}?page=${currentPage}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${userToken}`, // replace `token` with your actual token
            "Content-Type": "application/json",
          },
        });

        const jsonDpt = await res.json();

        setPackageCheck(jsonDpt?.subscriptions || []);

        const totalCount = jsonDpt?.total_elements || 0;
        setTotalPages(Math.ceil(totalCount / size));
        setSize(jsonDpt.size);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [currentPage, size, userToken]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const getEmail = localStorage.getItem("email");
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!storedUserName) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
      setEmail(getEmail);
      setUserId(id);
      setToken(token);
    }
  }, [router]);

  useEffect(() => {
    if (!userId || !userToken) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`${USER_ME}${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchBlog();
  }, [userId, userToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();
        setData(json.general_settings[0]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoadingSettings(false);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    if (!userToken) return; // Avoid calling if token not ready

    async function fetchData() {
      try {
        const response = await fetch(INVOICE_UNPAID, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          console.error("Response not OK:", response.status);
        }

        const json = await response.json();
        setInVoice(json);
        console.log("kfjgkfjgg", json);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoadingSettings(false);
      }
    }

    fetchData();
  }, [userToken]);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/sign-in");
    setUser(null);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },

    { href: "/dashboard", label: "Dashboard" },

    { href: "/package", label: "Pakage" },
    { href: "/invoice", label: "Invoice" },
    { href: "/ticket", label: "Ticket" },
    { href: "/open-ticket", label: "Open Ticket" },
  ];

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
        setsupport(jsonDpt?.total_elements);
        setTicket(jsonDpt?.tickets);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [userId]);

  if (!userName) return null;

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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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

      {/* Overlay behind sidebar */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Main Content */}
      <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <aside className="space-y-4 md:col-span-1">
          {/* USER INFO */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Your Info</h2>

            {loadingUser ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-16 w-16 bg-gray-200 rounded-full mt-4"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p>
                    {userData?.first_name} {userData?.last_name}
                    <br />
                    {userData?.email}
                    <br />
                    {userData?.country_code1} {userData?.primary_phone}
                    <br />
                    {userData?.rl_no}
                    <br />
                    <Link href="/infoUpdate">
                      <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded">
                        Update
                      </button>
                    </Link>
                  </p>
                </div>

                {typeof userData?.logo === "string" &&
                  userData.logo.startsWith("/media") && (
                    <Image
                      src={`${BASE_URL}${userData.logo}`}
                      alt="CWP Logo"
                      className="h-16 w-16 mb-16 object-contain ml-4"
                      width={64}
                      height={64}
                    />
                  )}
              </div>
            )}
          </div>

          {/* CONTACT INFO */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Contacts</h2>

            {loadingSettings ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <p className="text-sx">{data?.email}</p>
                <p className="text-sx">{data?.phone}</p>
                <p className="text-sx">{data?.address}</p>
              </>
            )}
          </div>
        </aside>

        {/* Dashboard Content */}
        <section className="space-y-4 md:col-span-3">
          <h1 className="text-lg md:text-xl font-semibold text-center md:text-left">
            Welcome Back, {userName}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/package">
              <div className="bg-white p-4 rounded shadow text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xl font-bold animate-pulse">
                  {invoice?.subscription ?? 0}
                </p>
                <p className="text-gray-600">Package</p>
              </div>
            </Link>

            <Link href="/ticket">
              <div className="bg-white p-4 rounded shadow text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xl font-bold animate-pulse">{support}</p>
                <p className="text-gray-600">Tickets</p>
              </div>
            </Link>

            <Link href={`/invoice/status/paid`}>
              <div className="bg-white p-4 rounded shadow text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xl font-bold animate-pulse">
                  {invoice?.paid_invoice ?? 0}
                </p>
                <p className="text-gray-600">Paid Invoice</p>
              </div>
            </Link>

            <Link href={`/invoice/status/unPaid`}>
              <div className="bg-white p-4 rounded shadow text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xl font-bold animate-pulse">
                  {invoice?.unpaid_invoice ?? 0}
                </p>
                <p className="text-gray-600">Unpaid Invoice</p>
              </div>
            </Link>
          </div>

          {/* Services Box */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="font-bold text-xl">Your Active Package</h2>
              {packageCheck.map(
                (item) =>
                  Array.isArray(item?.subscription_items) &&
                  item.subscription_items.map((subscription_item, idx) => (
                    <div key={subscription_item.id || `status-${idx}`}>
                      <button
                        className={`px-3 py-1 text-white text-sm rounded ${
                          subscription_item.is_active
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {subscription_item.is_active
                          ? "Activated"
                          : "Deactivated"}
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-2 space-y-4">
              {packageCheck.map(
                (item) =>
                  Array.isArray(item?.subscription_items) &&
                  item.subscription_items.map((subscription_item, idx) => (
                    <div
                      key={subscription_item.id || `package-${idx}`}
                      className="p-3 border rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          {subscription_item.package?.name}
                        </h3>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">End Date:</span>
                          {subscription_item?.end_date
                            ? moment(subscription_item?.end_date).format(
                                "DD-MM-YYYY"
                              )
                            : "—"}
                        </p>
                      </div>

                      <Link href="/package">
                        <button className="text-blue-700 mt-2 hover:underline">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Support Tickets and News */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="font-semibold">Recent Support Tickets</h2>
                <Link href="/open-ticket">
                  <button className="bg-cyan-500 px-2 py-1 text-white text-sm rounded">
                    + Open New Ticket
                  </button>
                </Link>
              </div>
              {ticket?.map((item) => (
                <Link key={item.id} href={`/ticket/${item.id}`}>
                  <ul className="mt-4 text-sm space-y-2">
                    <li>
                      <span className="font-medium">#{item.ticket_number}</span>
                      <span
                        className={`ml-2 px-3 py-1  rounded text-xs text-white ${
                          item.ticket_status?.name?.toLowerCase() === "open"
                            ? "bg-orange-500"
                            : "bg-black"
                        }`}
                      >
                        {item.ticket_status?.name}
                      </span>
                    </li>
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;

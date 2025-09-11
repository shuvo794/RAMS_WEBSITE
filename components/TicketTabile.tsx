"use client";

import { TICKET_CHECK_IDS } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Support = {
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
};

export default function TicketTabile() {
  const [support, setSupport] = useState<Support[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const topRef = useRef<HTMLDivElement>(null);
  const IDS = typeof window !== "undefined" ? localStorage.getItem("id") : null;

  useEffect(() => {
    if (!IDS) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `${TICKET_CHECK_IDS}${IDS}?page=${currentPage}&size=${size}`
        );
        const jsonDpt = await res.json();

        setSupport(jsonDpt?.tickets || []);

        const totalCount = jsonDpt?.total_elements || 0;
        setTotalPages(Math.ceil(totalCount / size));
        setSize(jsonDpt.size);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [IDS, currentPage, size]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <main className="flex-1">
      <div ref={topRef} />
      <h1 className="text-2xl font-bold text-blue-900 mb-4">
        My Support Ticket
      </h1>

      {loading ? (
        <div className="bg-white shadow rounded p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Ticket Number",
                      "Department",
                      "Subject",
                      "Priority",
                      "Status",
                    ].map((col, i) => (
                      <th key={i} className="p-4 text-left">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: support?.length }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: support?.length }).map((_, j) => (
                        <td key={j} className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : support.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-500">
          There are no tickets
        </div>
      ) : (
        <div className="bg-white shadow rounded">
          <div className="flex items-center justify-between bg-gray-700 text-white px-4 py-2">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1 rounded text-sm text-black placeholder-gray-400 focus:outline-none"
              />
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white border-b">
                <tr>
                  <th className="p-4">Ticket Number</th>
                  <th className="p-4">Ticket Department</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Ticket Priority</th>
                  <th className="p-4">Ticket Status</th>
                </tr>
              </thead>
              <tbody>
                {support.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-4">{item.ticket_number}</td>
                    <td className="p-4">{item.ticket_department?.name}</td>
                    <td className="p-4">{item.subject}</td>
                    <td className="p-4">{item.ticket_priority?.name}</td>
                    <td className="p-4">
                      <Link href={`/ticket/${item.id}`}>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded">
                          {item.ticket_status?.name}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end mt-4 mb-4 m-3  space-x-2 flex-wrap">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={cn(
                  "px-4 py-2 rounded border",
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-600 hover:bg-blue-100"
                )}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "px-4 py-2 rounded border",
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={cn(
                  "px-4 py-2 rounded border",
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-600 hover:bg-blue-100"
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

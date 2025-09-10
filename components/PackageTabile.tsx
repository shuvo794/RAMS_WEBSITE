"use client";

import { PACKAGE } from "@/lib/config";
import moment from "moment";
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
  subscription_items: {
    package: {
      name: string;
    };
    amount: string;
    end_date: string;
    is_active: boolean;
  };
};

export default function PackageTabile() {
  const [support, setSupport] = useState<Support[]>([]);
  const [currentPage] = useState<number>(1);
  const [, setTotalPages] = useState<number>(1);
  const [size, setSize] = useState<number>(10); // page size = 1
  const topRef = useRef<HTMLDivElement>(null);
  const [userToken, setToken] = useState<string | null>(null);
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

        setSupport(jsonDpt?.subscriptions || []);

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
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // const handlePreviousPage = () => {
  //   setCurrentPage((prev) => Math.max(prev - 1, 1));
  // };

  // const handleNextPage = () => {
  //   setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  // };

  return (
    <main className="flex-1">
      <div ref={topRef} />
      <h1 className="text-2xl font-bold text-blue-900 mb-4">My Package</h1>

      {support?.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-500">
          There are no Package
        </div>
      ) : (
        <div className="bg-white shadow rounded">
          <Link href="/package-details">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-white border-b">
                  <tr>
                    <th className="p-4 text-center">Package</th>
                    <th className="p-4 text-center">Pricing</th>
                    <th className="p-4 text-center">Next Due Date</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {support.map(
                    (item, idx) =>
                      Array.isArray(item?.subscription_items) &&
                      item.subscription_items.map((subscription_item, sIdx) => (
                        <tr
                          key={`${idx}-${sIdx}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 text-center">
                            {subscription_item.package?.name}
                          </td>
                          <td className="p-4 text-center">
                            {subscription_item.amount}
                          </td>
                          <td className="p-4 text-center">
                            {subscription_item?.end_date
                              ? moment(subscription_item?.end_date).format(
                                  "DD-MM-YYYY"
                                )
                              : ""}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              className={`px-3 py-1 rounded ${
                                subscription_item.is_active
                                  ? "bg-green-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {subscription_item.is_active
                                ? "Activated"
                                : "Deactivated"}
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </Link>
        </div>
      )}
    </main>
  );
}

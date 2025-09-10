"use client";

import { PACKAGE } from "@/lib/config";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

type SubscriptionItem = {
  package: {
    name: string;
  };
  amount: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type PackageDetail = {
  id: number;
  ticket_department?: { name: string };
  subject?: string;
  ticket_priority?: { name: string };
  ticket_status?: { name: string };
  ticket_number?: string;
  subscription_items?: SubscriptionItem[];
};

export default function PackageDetails() {
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [currentPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const topRef = useRef<HTMLDivElement>(null);
  const [userToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    if (!userToken) return;

    async function fetchData() {
      try {
        const res = await fetch(`${PACKAGE}?page=${currentPage}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const jsonDpt = await res.json();
        console.log("Package API response:", jsonDpt);
        setPackages(jsonDpt.subscriptions || []);
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

  return (
    <main className="flex-1" ref={topRef}>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-6">Package Details</h2>

        {packages.map((pkg) => (
          <div key={pkg.id} className="mb-6 border-b pb-4">
            <div className="mt-3">
              {pkg?.subscription_items?.map((sub, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <strong>Package Name:</strong> {sub.package.name}
                  </div>
                  <div>
                    <strong>Amount:</strong> {sub.amount}
                  </div>
                  <div>
                    <strong>Start Date:</strong>{" "}
                    {moment(sub.start_date).format("DD-MM-YYYY")}
                  </div>
                  <div>
                    <strong>End Date:</strong>{" "}
                    {moment(sub.end_date).format("DD-MM-YYYY")}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {sub.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

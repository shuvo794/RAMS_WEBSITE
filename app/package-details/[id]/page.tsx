"use client";

import { PACKAGE } from "@/lib/config";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type SubscriptionItem = {
  package: {
    name: string;
  };
  amount: string;
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

export default function PackageDetailPage() {
  const { id } = useParams(); // get package id from url
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    if (!userToken) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`${PACKAGE}/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setPkg(data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, userToken]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading package details...
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="p-6 text-center text-gray-500">
        No package details found.
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Package Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Ticket Number:</strong> {pkg.ticket_number || "N/A"}
          </div>
          <div>
            <strong>Subject:</strong> {pkg.subject || "N/A"}
          </div>
          <div>
            <strong>Department:</strong> {pkg.ticket_department?.name || "N/A"}
          </div>
          <div>
            <strong>Priority:</strong> {pkg.ticket_priority?.name || "N/A"}
          </div>
          <div>
            <strong>Status:</strong> {pkg.ticket_status?.name || "N/A"}
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Subscription Items</h3>
        {pkg.subscription_items?.length ? (
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">Package</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pkg.subscription_items.map((sub, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sub.package?.name}</td>
                  <td className="p-3">{sub.amount}</td>
                  <td className="p-3">
                    {sub.end_date
                      ? moment(sub.end_date).format("DD-MM-YYYY")
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        sub.is_active ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {sub.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No subscription items available.</p>
        )}
      </div>
    </main>
  );
}

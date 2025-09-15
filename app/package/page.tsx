"use client";

import DashBoardNav from "@/components/DashBoardNav";
import PackageTabile from "@/components/PackageTabile";
import { GET_SITESETTINGS } from "@/lib/config";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const [, setData] = useState<GeneralSettings | null>(null);
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <DashBoardNav />

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

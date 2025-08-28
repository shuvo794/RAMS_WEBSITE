"use client";
import { GET_TICKET_DEPARTMENT } from "@/lib/config";
import Link from "next/link";
import { useEffect, useState } from "react";
type GeneralSettings = {
  name: string;
};
export default function OpenTicket({}) {
  const [departments, setDepartments] = useState<GeneralSettings | null>(null);
  // const departments = [
  //   {
  //     icon: Mail,
  //     title: "Billing",
  //     description: "Billing Support, Change IP",
  //     color: "text-blue-600",
  //   },
  //   {
  //     icon: Headphones,
  //     title: "Support",
  //     description: "Technical Support",
  //     color: "text-blue-600",
  //   },
  //   {
  //     icon: MessageSquare,
  //     title: "Contact",
  //     description: "Website Contact Form",
  //     color: "text-blue-600",
  //   },
  // ];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_TICKET_DEPARTMENT);
        const jsonDpt = await res.json();
        setDepartments(jsonDpt.ticket_departments);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        // setLoadingSettings(false);
      }
    }

    fetchData();
  }, []);
  return (
    <>
      <div className="bg-gray-50 min-h-screen overflow-hidden">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-light text-blue-600 mb-4">
              Open Ticket
            </h1>

            {/* Breadcrumb */}
            {/* <nav className="flex items-center text-sm text-gray-500 space-x-2 mb-6">
              <a href="#" className="hover:text-blue-600">
                Portal Home
              </a>
              <ChevronRight className="w-3 h-3" />
              <a href="#" className="hover:text-blue-600">
                Client Area
              </a>
              <ChevronRight className="w-3 h-3" />
              <a href="#" className="hover:text-blue-600">
                Support Tickets
              </a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700">Submit Ticket</span>
            </nav> */}
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-gray-700 text-sm leading-relaxed mb-8">
              If you can find a solution to your problems in our knowledgebase,
              you can submit a ticket by selecting the appropriate department
              below.
            </p>

            {/* Department Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {departments &&
                Array.isArray(departments) &&
                departments.map((dept, index) => (
                  <Link href={`/open-ticket/${dept.id}`} key={index}>
                    <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${dept.color} text-base mb-2 group-hover:text-blue-700`}
                          >
                            {dept.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

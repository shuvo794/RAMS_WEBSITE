"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BASE_URL, GET_CLIENTS_ALL } from "@/lib/config";
import { Loader2 } from "lucide-react";

interface Client {
  id: number;
  name: string;
  serial_number: number;
  image: string;
}

export default function ClientsSlider() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(GET_CLIENTS_ALL);
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        if (data && data.clients) {
          // Sort by serial_number
          const sortedClients = [...data.clients].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setClients(sortedClients);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Create fallback clients if needed
  const fallbackClients = [
    {
      id: 1,
      name: "Client 1",
      serial_number: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Client 2",
      serial_number: 2,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Client 3",
      serial_number: 3,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Client 4",
      serial_number: 4,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Client 5",
      serial_number: 5,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  // Use API data if available, otherwise use fallback
  const displayClients = clients.length > 0 ? clients : fallbackClients;

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#0066FF] text-xl font-semibold mb-4">
              CLIENTS
            </h2>
            <h3 className="text-4xl font-bold relative inline-block pb-4">
              Our <span className="font-normal">valuable customers</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0066FF]" />
            </h3>
          </div>
          <div className="flex justify-center items-center mt-10 mb-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#0066FF] text-xl font-semibold mb-4">
              CLIENTS
            </h2>
            <h3 className="text-4xl font-bold relative inline-block pb-4">
              Our <span className="font-normal">valuable customers</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0091cb]" />
            </h3>
          </div>
          <div className="text-center text-red-500 py-8">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="about-heading" className="text-4xl font-extrabold mb-4">
            Trusted by many{" "}
            <span className="italic text-[#3b2ccc]">companies</span>
          </h2>
          <div className="absolute  left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0066FF]" />
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900"></div>

          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className={`flex py-4 ${isPaused ? "" : "animate-scroll"}`}
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {/* First set of clients */}
              {displayClients.map((client) => (
                <div
                  key={`first-${client.id}`}
                  className="flex-shrink-0 w-[200px] px-3"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-[200px] flex items-center justify-center hover:shadow-md transition-shadow">
                    <div className="relative h-full w-full">
                      <Image
                        src={
                          client.image.startsWith("/media")
                            ? `${BASE_URL}${client.image}`
                            : client.image
                        }
                        alt={client.name}
                        fill
                        className="object-contain"
                        sizes="200px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

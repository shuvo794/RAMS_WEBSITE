"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BASE_URL, GET_PATNERS } from "@/lib/config";

interface Client {
  id: number;
  title: string;
  serial_number: number;
  image: string;
}

function getImageName(imagePath: string): string {
  // Extract filename without extension
  const filename = imagePath.split("/").pop() || "";
  return filename.split(".")[0];
}

export default function ClientsDetails() {
  const topRef = useRef<HTMLDivElement>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / blogsPerPage);

  const fetchBlogs = async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GET_PATNERS}?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();

      if (data && data.partners) {
        setClients(data.partners);
        setTotalCount(data.total_pages || 0);
      } else {
        setError("No blogs found");
        setClients([]);
      }
    } catch (err) {
      setError("Failed to load blogs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, blogsPerPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="mt-10 mb-10 px-4 text-center">
        <div className="animate-pulse">
          <div className="w-64 h-80 overflow-hidden">
            <div className="p-6 h-full flex flex-col items-center justify-between">
              <div className="w-full flex-1 flex items-center justify-center">
                <div className="relative w-40 h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="text-center mt-4 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-10 mb-10">
      <div className="container mx-auto px-4">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {clients.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="w-64 h-80 overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6 h-full flex flex-col items-center justify-between">
                  <div className="w-full flex-1 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <Image
                        src={`${BASE_URL}${image.image}`}
                        alt={getImageName(image.image)}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-center mt-4 text-sm font-medium text-gray-600">
                    {image.title}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && clients.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-10 md:mt-24">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

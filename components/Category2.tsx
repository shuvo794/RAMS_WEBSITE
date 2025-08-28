"use client"; // Only if using App Router

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL, GET_BLOGS } from "@/lib/config";

interface Blog {
  id: number;
  slug?: string;
  title: string;
  image: string;
  serial_number: number;
  page: number;
  total_pages: number;
  link: string;
}

export default function Category2() {
  const topRef = useRef<HTMLDivElement>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / blogsPerPage);

  const fetchBlogs = async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GET_BLOGS}?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();

      if (data && data.blogs) {
        setBlogs(data.blogs);
        setTotalCount(data.total_pages || 0);
      } else {
        setError("No blogs found");
        setBlogs([]);
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

  const renderSkeleton = () =>
    Array.from({ length: blogsPerPage }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 shadow-md h-[320px] animate-pulse rounded"
      >
        <div className="bg-gray-300 h-48 w-full rounded-t" />
        <div className="p-4">
          <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded" />
          <div className="bg-gray-300 h-4 w-1/2 rounded" />
        </div>
      </div>
    ));

  return (
    <div className="p-4">
      <div
        ref={topRef}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {isLoading ? (
          renderSkeleton()
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No blogs found.
          </div>
        ) : (
          blogs.map((blog) => {
            const href = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog.id}`;
            const imgSrc = blog.image?.startsWith("/media")
              ? `${BASE_URL}${blog.image}`
              : "";

            return (
              <div key={blog.id} className="space-y-4">
                <Link href={href} className="group block">
                  {blog.title && imgSrc && (
                    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg h-[350px] flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={imgSrc}
                          alt={blog.title}
                          fill
                          className="object-cover rounded-t"
                        />
                      </div>

                      <p className="p-2 text-xl font-bold text-gray-800 mt-auto">
                        {blog.title}
                      </p>
                    </div>
                  )}
                  {blog.link && (
                    <div
                      className="wpo-features-item p-0"
                      style={{ borderRadius: "20px" }}
                    >
                      <iframe
                        // title={blog.title}
                        src={blog.link}
                        width="100%"
                        height="350px"
                        style={{ border: "none", overflow: "hidden" }}
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  )}
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!isLoading && blogs.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
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
  );
}

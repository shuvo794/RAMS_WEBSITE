"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeroSection from "@/components/PageHeroSection";
import { BASE_URL, GET_BLOG, GET_BLOGS } from "@/lib/config";
import { Mail, Facebook, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  slug: string | null;
  description: string;
  image: string;
  industry: string;
  technology: string;
  site_link: string;
  tags?: string[];
  created_at: string;
  recent_blogs: Blogs[]; // Add this line
  blog: Blogs[];
}

interface Blogs {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  created_at: string;
  slug?: string;
}

export default function BlogItemPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setBlogs] = useState<Blogs[]>([]);
  const [, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [recent, seRescent] = useState<Blogs[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`${GET_BLOG}${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data.blog || null);
        seRescent(data.recent_blogs || []);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchServiceSliders = async () => {
      try {
        const response = await fetch(GET_BLOGS);
        if (!response.ok) throw new Error("Failed to fetch service sliders");
        const data = await response.json();
        if (data?.blogs) {
          const sortedSliders = [...data.blogs].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setBlogs(sortedSliders);
        }
      } catch (err) {
        console.error("Error fetching service sliders:", err);
        setError("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceSliders();
  }, []);

  if (loading)
    return (
      <div className="bg-gray-50 py-10 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="text-white mb-6 rounded overflow-hidden bg-gray-200 h-64"></div>
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-full md:w-1/3">
              <aside aria-label="Sidebar Widgets">
                <div className="bg-white p-4 rounded shadow mb-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-1 w-10 bg-gray-200 rounded mb-4"></div>
                  <ul className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="h-16 w-16 bg-gray-200 rounded mr-2"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
              <div className="bg-white p-4 rounded shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-1 w-10 bg-gray-200 rounded mb-4"></div>
                <div className="mt-4 sm:mt-0 flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!blog) return <p className="text-center mt-10">Project not found.</p>;

  return (
    <>
      <PageHeroSection
        title=""
        backgroundImage="/half-circle-bg.png"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "BLOG", href: "/blog" },
          // { label: blog.title.toUpperCase(), href: `/blog/${id}` },
        ]}
      />

      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div
                className="text-white mb-6 rounded overflow-hidden"
                style={{
                  backgroundImage: `url(${BASE_URL}${blog.image ?? ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "left",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="relative aspect-video flex items-center justify-center"></div>
                <div className="p-4 text-sm flex justify-between items-center">
                  <span className="text-blue-800 font-bold">
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* <div className="mb-4">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs uppercase tracking-wide font-semibold rounded">
                  {blog.industry || "Category"}
                </span>
              </div> */}

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
                <p
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: blog.description,
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <aside
                className="bg-gray-100 p-4 rounded shadow mb-6"
                aria-label="Sidebar Widgets"
              >
                <h4 className="text-lg font-semibold text-indigo-700 mb-2">
                  Recent Posts
                </h4>
                <div className="h-1 w-10 bg-indigo-700 mb-4" />
                <ul className="space-y-4">
                  {recent.map((post, index) => {
                    const blogUrl = post.slug
                      ? `/blog/${post.slug}`
                      : `/blog/${post.id}`;
                    if (!post.title || !post.image) return null;
                    return (
                      <li key={index} className="flex gap-4">
                        <Image
                          src={
                            post.image?.startsWith("/media")
                              ? `${BASE_URL}${post.image}`
                              : "/test.jpg"
                          }
                          alt={post.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <a href={blogUrl} className="text-sm font-medium">
                            {post.title}
                          </a>
                          <p className="text-xs text-gray-500 font-bold">
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <div className="bg-white p-4 rounded shadow">
                <h4 className="text-lg font-semibold text-indigo-700 mb-2">
                  Follow Us
                </h4>
                <div className="h-1 w-10 bg-indigo-700 mb-4" />
                <div className="mt-4 flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-sky-400 text-white rounded-full flex items-center justify-center"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BASE_URL, GET_TESTIMONIALS } from "@/lib/config";
import Image from "next/image";

interface Testimonial {
  id: number;
  review: string;
  name: string;
  designation: string;
  serial_number: number;
  image: string;
  review_star?: number;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(GET_TESTIMONIALS);
        if (!response.ok) throw new Error("Failed to fetch testimonials");

        const data = await response.json();
        if (data && data.testimonials) {
          const sorted = [...data.testimonials].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setTestimonials(sorted);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const fallbackTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sara Matt",
      designation: "Customer",
      review:
        "Fuisque tincidunt leo nisi, quis gravida elementum condimentum sit amet arcu in per...",
      image: "/placeholder.svg?height=80&width=80",
      serial_number: 1,
      review_star: 5,
    },
    {
      id: 2,
      name: "Youmni Pat",
      designation: "Customer",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in luctus...",
      image: "/placeholder.svg?height=80&width=80",
      serial_number: 2,
      review_star: 4,
    },
    {
      id: 3,
      name: "Sheryn S",
      designation: "Data Science Enthusiast",
      review:
        "Nam rutrum, ante nec consequat volutpat, quam est sodales mauris...",
      image: "/placeholder.svg?height=80&width=80",
      serial_number: 3,
      review_star: 5,
    },
    {
      id: 4,
      name: "Michael Dean",
      designation: "IT Manager",
      review:
        "Exceptional service and attention to detail. The team went above and beyond...",
      image: "/placeholder.svg?height=80&width=80",
      serial_number: 4,
      review_star: 5,
    },
    {
      id: 5,
      name: "Jessica Wong",
      designation: "Marketing Director",
      review:
        "Their solutions have transformed our digital presence completely...",
      image: "/placeholder.svg?height=80&width=80",
      serial_number: 5,
      review_star: 4,
    },
  ];

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const itemsPerPage = 3;
  const totalPages = Math.ceil(displayTestimonials.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return displayTestimonials.slice(startIndex, startIndex + itemsPerPage);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const StarRating = ({ count = 0 }: { count: number }) => (
    <div className="flex justify-center mt-2 text-yellow-400 h-6">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-lg">
          ★
        </span>
      ))}
    </div>
  );

  // Fixed height loading skeleton that matches the actual content
  if (isLoading) {
    return (
      <section
        className="py-12 md:py-16 text-white min-h-[600px]"
        style={{
          background:
            "linear-gradient(45deg, #3a59d6 0%, #291fbc 51%, #0f0786 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <div className="h-8 md:h-10 bg-white/20 rounded w-80 mx-auto mb-3 md:mb-4 animate-pulse"></div>
            <div className="h-5 md:h-6 bg-white/15 rounded w-72 mx-auto animate-pulse"></div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 pt-16 pb-6 px-6 sm:px-8 rounded-lg shadow-xl mx-auto w-full max-w-xs sm:max-w-sm min-h-[350px] relative"
                >
                  {/* Avatar skeleton */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-300 rounded-full border-4 border-white shadow-md animate-pulse"></div>

                  {/* Content skeleton */}
                  <div className="mt-2 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                    <div className="space-y-2 mt-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons skeleton */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-4 h-12">
              <div className="w-12 h-12 bg-white/20 rounded animate-pulse"></div>
              <div className="w-12 h-12 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 md:py-16 text-white min-h-[600px]"
      style={{
        background:
          "linear-gradient(45deg, #3a59d6 0%, #291fbc 51%, #0f0786 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        {/* Fixed height header */}
        <div className="text-center mb-10 md:mb-12 min-h-[100px] flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-gray-200">
            Hear from our happy customers and partners.
          </p>
        </div>

        <div className="relative">
          {/* Fixed height grid container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[400px]">
            {getCurrentPageItems().map((testimonial: Testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white pt-16 pb-6 px-6 sm:px-8 rounded-lg shadow-xl text-center relative mx-auto w-full max-w-xs sm:max-w-sm text-gray-900 min-h-[350px] flex flex-col"
              >
                {/* Image wrapper with fixed size and aspect ratio */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 flex-shrink-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={
                        testimonial.image &&
                        testimonial.image !==
                          "/placeholder.svg?height=80&width=80"
                          ? `${BASE_URL}${testimonial.image}`
                          : "/Testimunial.jpg"
                      }
                      alt={testimonial.name}
                      fill
                      sizes="96px"
                      className="rounded-full border-4 border-white shadow-md object-cover"
                      priority={currentPage === 0} // Prioritize first page images
                    />
                  </div>
                </div>

                {/* Content with fixed structure */}
                <div className="mt-2 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 min-h-[24px]">
                    {testimonial.name}
                  </h3>

                  {/* Fixed height star rating container */}
                  <div className="min-h-[32px] flex items-center justify-center">
                    {testimonial.review_star && (
                      <StarRating count={testimonial.review_star} />
                    )}
                  </div>

                  {/* Fixed height review container */}
                  <div className="flex-1 flex items-start mt-3 sm:mt-4">
                    <p
                      className="italic text-gray-600 text-sm leading-relaxed min-h-[80px]"
                      dangerouslySetInnerHTML={{ __html: testimonial.review }}
                    />
                  </div>

                  {/* Fixed height designation */}
                  <p className="text-xs text-gray-500 mt-2 min-h-[16px]">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed height pagination buttons */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-4 h-12 items-center">
            <Button
              size="icon"
              onClick={prevPage}
              aria-label="Previous testimonials"
              className="w-12 h-12 flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={nextPage}
              aria-label="Next testimonials"
              className="w-12 h-12 flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

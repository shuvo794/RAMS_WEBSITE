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
    <div className="flex justify-center mt-2 text-yellow-400">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section
        className="py-16 mb-24 text-white"
        style={{
          backgroundImage: 'url("/bg-6.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mt-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="bg-gray-200 rounded-lg p-12 h-64"></div>
            <div className="bg-gray-200 rounded-lg p-12 h-64"></div>
            <div className="bg-gray-200 rounded-lg p-12 h-64"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 md:py-16   text-white"
      // style={{
      //   backgroundImage: 'url("/bg-6.jpg")',
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}

      style={{
        background:
          "linear-gradient(45deg, #3a59d6 0%, #291fbc 51%, #0f0786 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-gray-200">
            Hear from our happy customers and partners.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getCurrentPageItems().map((testimonial: Testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white pt-16 pb-6 px-6 sm:px-8 rounded-lg shadow-xl text-center relative mx-auto w-full max-w-xs sm:max-w-sm text-gray-900"
              >
                {/* Image */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <Image
                    src={
                      testimonial.image
                        ? `${BASE_URL}${testimonial.image}`
                        : "/Testimunial.jpg"
                    }
                    alt={testimonial.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md object-cover"
                    width={96}
                    height={96}
                  />
                </div>

                {/* Content */}
                <div className="mt-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  {testimonial.review_star && (
                    <StarRating count={testimonial.review_star} />
                  )}
                  <p
                    className="italic text-gray-600 mt-3 sm:mt-4 text-sm"
                    dangerouslySetInnerHTML={{ __html: testimonial.review }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-4">
            <Button
              // variant="outline"
              size="icon"
              onClick={prevPage}
              aria-label="Previous testimonials"
            >
              <ChevronLeft />
            </Button>
            <Button
              // variant="outline"
              size="icon"
              onClick={nextPage}
              aria-label="Next testimonials"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

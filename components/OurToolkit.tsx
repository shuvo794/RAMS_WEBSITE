"use client";

import { GET_SOLUTIONS } from "@/lib/config";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface toolItem {
  title: string;
  icons: string;
  description: string;
}

export default function OurToolkit() {
  const [toolkitItems, setToolkitItems] = useState<toolItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const icons = <SendHorizontal />;

  // Fetch service slider data

  useEffect(() => {
    const fetchServiceSliders = async () => {
      try {
        const response = await fetch(GET_SOLUTIONS);
        if (!response.ok) {
          throw new Error("Failed to fetch service sliders");
        }
        const data = await response.json();
        if (data && data?.solutions) {
          // Sort by serial_number
          const sortedSliders = [...data?.solutions].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setToolkitItems(sortedSliders);
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

  return (
    // <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white pt-12 pb-[35px]">
    //   {/* Header */}
    //   <div className="container mx-auto px-4 text-center mb-10">
    //     <h1 className="text-5xl font-bold mb-4">Our Comprehensive Toolkit</h1>
    //     <p className="max-w-2xl mx-auto">
    //       Here innovation meets efficiency in our Comprehensive Toolkit for HR
    //       Management. Designed to address the diverse needs of modern
    //       businesses.
    //     </p>
    //   </div>

    //   {/* Grid of toolkit items */}
    //   <div className="container mx-auto px-4">
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
    //       {isLoading
    //         ? Array.from({ length: 6 }).map((_, index) => (
    //             <div
    //               key={index}
    //               className="bg-blue-800 bg-opacity-20 p-6 rounded-lg border border-blue-800 border-opacity-30 animate-pulse"
    //             >
    //               <div className="flex items-start mb-4">
    //                 <div className="w-6 h-6 bg-blue-600 rounded-sm mr-3"></div>
    //                 <div className="h-4 bg-blue-600 rounded w-3/4"></div>
    //               </div>
    //               <div className="space-y-2 pl-9">
    //                 <div className="h-3 bg-blue-600 rounded w-full"></div>
    //                 <div className="h-3 bg-blue-600 rounded w-5/6"></div>
    //                 <div className="h-3 bg-blue-600 rounded w-4/6"></div>
    //               </div>
    //             </div>
    //           ))
    //         : toolkitItems.map((item, index) => (
    //             <div
    //               key={index}
    //               className="bg-blue-800 bg-opacity-20 p-6 rounded-lg backdrop-blur-sm border border-blue-800 border-opacity-30 hover:bg-opacity-100 transition-all duration-600 shadow-lg"
    //             >
    //               <div className="flex items-start mb-4">
    //                 <div className="flex-shrink-0 mr-3">
    //                   <div className="w-6 h-6 rounded-sm flex items-center justify-center text-xs">
    //                     {icons}
    //                   </div>
    //                 </div>
    //                 <h3 className="text-xl font-semibold">{item.title}</h3>
    //               </div>
    //               <p
    //                 className="text-blue-100 pl-9"
    //                 dangerouslySetInnerHTML={{ __html: item.description }}
    //               />
    //             </div>
    //           ))}
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white pt-12 pb-10">
      {/* Header */}
      <div className="container mx-auto px-6 sm:px-4 text-center mb-10">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight whitespace-nowrap">
          Our Comprehensive Toolkit
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-lg">
          Here innovation meets efficiency in our Comprehensive Toolkit for HR
          Management. Designed to address the diverse needs of modern
          businesses.
        </p>
      </div>

      {/* Grid of toolkit items */}
      <div className="container mx-auto px-6 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-blue-800 bg-opacity-20 p-6 rounded-lg border border-blue-800 border-opacity-30 animate-pulse"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-sm mr-3"></div>
                    <div className="h-4 bg-blue-600 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-2 sm:pl-9">
                    <div className="h-3 bg-blue-600 rounded w-full"></div>
                    <div className="h-3 bg-blue-600 rounded w-5/6"></div>
                    <div className="h-3 bg-blue-600 rounded w-4/6"></div>
                  </div>
                </div>
              ))
            : toolkitItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-800 bg-opacity-20 p-6 rounded-lg backdrop-blur-sm border border-blue-800 border-opacity-30 hover:bg-opacity-100 transition-all duration-500 shadow-lg"
                >
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-6 h-6 rounded-sm flex items-center justify-center text-xs">
                        {icons}
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                      {item.title}
                    </h4>
                  </div>
                  <p
                    className="text-blue-100 text-sm sm:text-base sm:pl-9"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

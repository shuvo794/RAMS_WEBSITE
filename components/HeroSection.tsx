import Image from "next/image";
import { BASE_URL, GET_BANNER } from "@/lib/config";

interface HomepageSlider {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  background_image: string;
  description: string;
}

export default async function HeroSection() {
  let sliderData: HomepageSlider[] = [];

  try {
    const res = await fetch(GET_BANNER);

    if (!res.ok) throw new Error("Failed to fetch slider data");
    const data = await res.json();
    sliderData = data?.banners || [];
  } catch (err) {
    console.error("Banner fetch error:", err);
  }

  return (
    <main className="min-h-[22vh] bg-white">
      <section className="relative flex items-center bg-blue-700 lg:bg-transparent">
        {/* Background image only for desktop */}
        <div
          className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${BASE_URL}${
              sliderData[0]?.background_image ?? ""
            })`,
          }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10 py-20 lg:py-28">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12">
            {/* Left Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 text-white">
              {sliderData.length === 0 ? (
                <div className="animate-pulse space-y-4">
                  <div className="bg-gray-300 h-8 w-3/4 rounded mx-auto lg:mx-0" />
                  <div className="bg-gray-300 h-4 w-full rounded" />
                  <div className="bg-gray-300 h-4 w-2/3 rounded" />
                  <div className="bg-gray-300 h-4 w-1/2 rounded" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                    {sliderData[0]?.title}
                  </h1>
                  <p
                    className="text-lg max-w-lg mx-auto lg:mx-0"
                    dangerouslySetInnerHTML={{
                      __html: sliderData[0]?.description || "",
                    }}
                  ></p>
                </>
              )}
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg mr-[60px] h-[350px] sm:h-[450px]">
                {sliderData.length === 0 ? (
                  <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
                ) : (
                  <Image
                    src={`${BASE_URL}${sliderData[0]?.image ?? ""}`}
                    alt="Hero Image"
                    fill
                    className="absolute object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

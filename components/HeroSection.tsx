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
    const res = await fetch(GET_BANNER, { cache: "no-store" }); // SSR safe fetch
    if (!res.ok) throw new Error("Failed to fetch slider data");
    const data = await res.json();
    sliderData = data?.banners || [];
  } catch (err) {
    console.error("Banner fetch error:", err);
  }

  const hero = sliderData[0];

  return (
    <main className="min-h-[60vh] bg-white">
      <section className="relative flex items-center bg-blue-700 lg:bg-transparent overflow-hidden">
        {/* Background image with reserved height */}
        <div className="hidden lg:block absolute inset-0">
          {hero?.background_image ? (
            <Image
              src={`${BASE_URL}${hero.background_image}`}
              alt="Background"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-blue-700" />
          )}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10 py-20 lg:py-28">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12">
            {/* Left Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 text-white">
              {!hero ? (
                <div className="animate-pulse space-y-4">
                  <div className="bg-gray-300 h-10 w-3/4 rounded mx-auto lg:mx-0" />
                  <div className="bg-gray-300 h-5 w-full rounded" />
                  <div className="bg-gray-300 h-5 w-2/3 rounded" />
                  <div className="bg-gray-300 h-5 w-1/2 rounded" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl font-bold leading-tight min-h-[60px]">
                    {hero.title}
                  </h1>
                  <p
                    className="text-lg max-w-lg mx-auto lg:mx-0 min-h-[80px]"
                    dangerouslySetInnerHTML={{
                      __html: hero.description,
                    }}
                  ></p>
                </>
              )}
            </div>

            {/* Right Image with fixed container */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg h-[350px] sm:h-[450px]">
                {!hero ? (
                  <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
                ) : (
                  <Image
                    src={`${BASE_URL}${hero.image}`}
                    alt="Hero Image"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
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

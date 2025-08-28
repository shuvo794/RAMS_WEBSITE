export default function HeroSectionSkeleton() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-20 lg:py-28">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12">
          {/* Left Skeleton */}
          <div className="w-full lg:w-1/2 space-y-4 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Right Skeleton */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="bg-gray-300 h-[350px] sm:h-[450px] w-full max-w-lg rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroSectionProps {
  title: string;
  backgroundImage?: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

export default function PageHeroSection({
  title,
  backgroundImage = "/half-circle-bg.png",
  breadcrumbs = [
    { label: "HOME", href: "/" },
    { label: "PAGES", href: "#" },
  ],
}: PageHeroSectionProps) {
  return (
    <div
      className="relative h-[200px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "scroll",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-3xl md:text-3xl font-bold text-white text-center mb-4">
          <div dangerouslySetInnerHTML={{ __html: title }} />
        </h1>

        {/* Breadcrumbs */}
        <nav className="flex justify-center items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              <Link
                href={crumb.href}
                className="text-white hover:text-gray-200 text-sm"
              >
                {/* {crumb.label} */}
                <div dangerouslySetInnerHTML={{ __html: crumb.label }} />
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white mx-2" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

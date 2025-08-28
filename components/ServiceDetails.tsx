"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceDetailsProps {
  image: string;
  title: string;
  description: string;
  currentService: string;
  services?: Array<{
    name: string;
    href: string;
  }>;
}

export default function ServiceDetails({
  image,
  title,
  description,
  currentService,
  services = [
    { name: "Software Development", href: "/services/Software-Development" },
    { name: "Web Application", href: "/services/Web-Application" },
    { name: "Domain & Hosting", href: "/services/Domain-Hosting" },
    { name: "Digital Marketing", href: "/services/Digital-Marketing" },
    {
      name: "Dedicated Server Hosting",
      href: "/services/dedicated-server-hosting",
    },
    { name: "IT Training", href: "/services/IT-Training" },
  ],
}: ServiceDetailsProps) {
  return (
    <section className="mt-10 mb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="relative h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Content Overview</h2>
              <p
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Services Navigation */}
            <div className="border rounded-lg overflow-hidden">
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  scroll={false}
                  className={cn(
                    "block px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors",
                    service.name === currentService &&
                      "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                  )}
                >
                  {/* {service.name} */}
                  <div dangerouslySetInnerHTML={{ __html: service.name }} />
                </Link>
              ))}
            </div>

            {/* Contact Card */}
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/q.svg?height=300&width=400"
                alt="Support"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                <h3 className="text-xl font-bold mb-4">
                  Have Additional Questions?
                </h3>
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6" />
                  <span className="text-xl font-bold">+8801861650206</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Building2, Globe, MonitorSmartphone, Database } from "lucide-react";
import { motion } from "framer-motion";

const companies = [
  {
    id: 1,
    name: "Bangladesh Association of International Recruiting Agencies (BAIRA)",
    service: "Software + Website",
    icon: Globe,
  },
  {
    id: 2,
    name: "Cash Connect",
    service: "Custom ERP Solution",
    icon: Database,
  },
  {
    id: 3,
    name: "Uapp",
    service: "Custom CMS Solution",
    icon: MonitorSmartphone,
  },
  {
    id: 4,
    name: "Active Manpower Service",
    service: "RAMS Software +Website",
    icon: Globe,
  },
  {
    id: 5,
    name: "Akash Bhraman",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 6,
    name: "Air Trade Manpower Services",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 7,
    name: "Aviate International",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 8,
    name: "Business Alliance",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 9,
    name: "BD Star International",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 10,
    name: "Easy Way International Ltd.",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 11,
    name: "Freedom Overseas",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 12,
    name: "Fima Overseas Ltd.",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 13,
    name: "Human Resource Development Center",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 14,
    name: "Mashallah Overseas",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 15,
    name: "Poly Would Service",
    service: "RAMS Software +Website",
    icon: Globe,
  },
  {
    id: 16,
    name: "Surma International Ltd",
    service: "RAMS Software +Website",
    icon: Globe,
  },
  {
    id: 17,
    name: "The Super Eastern Ltd.",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 18,
    name: "Winner Overseas Ltd.",
    service: "RAMS Software",
    icon: Building2,
  },
  {
    id: 19,
    name: "City Air International",
    service: "RAMS Software +Website",
    icon: Globe,
  },
  {
    id: 20,
    name: "Al-Mohammad International",
    service: "RAMS Software",
    icon: Building2,
  },
];

const ITEMS_PER_PAGE = 10;

export default function CompanyTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = companies.slice(startIndex, endIndex);

  const MotionTableRow = motion(TableRow);
  const backgroundImage = "/aboutus.svg?height=1200&width=1920";

  return (
    <section
      className="relative mt-10 mb-10 px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#008fca] bg-opacity-100 ">
              <TableRow>
                <TableHead className="w-16 text-black">SI</TableHead>
                <TableHead className="w-16 text-black">Icon</TableHead>
                <TableHead className="text-black">Company Name</TableHead>
                <TableHead className="text-black">Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCompanies.map((company, index) => {
                const Icon = company.icon;
                return (
                  <MotionTableRow
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-[#00D749] bg-opacity-90 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                    </TableCell>
                    <TableCell className="font-medium group-hover:text-primary transition-colors">
                      {company.name}
                    </TableCell>
                    <TableCell>{company.service}</TableCell>
                  </MotionTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-100 bg-[#00D749]"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-100 bg-[#00D749]"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}

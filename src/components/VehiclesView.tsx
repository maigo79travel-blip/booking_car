"use client";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import { vehicleCategories } from "@/data/vehicles";
import { Users, Briefcase, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import FloatingContacts from "@/components/FloatingContacts";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function VehiclesView() {
  const { t } = useLanguage();
  const [currentPages, setCurrentPages] = useState<{ [key: number]: number }>({});

  const itemsPerPage = 2;

  const handleNext = (categoryIndex: number, totalVehicles: number) => {
    const currentPage = currentPages[categoryIndex] || 0;
    const maxPage = Math.ceil(totalVehicles / itemsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPages({ ...currentPages, [categoryIndex]: currentPage + 1 });
    }
  };

  const handlePrev = (categoryIndex: number) => {
    const currentPage = currentPages[categoryIndex] || 0;
    if (currentPage > 0) {
      setCurrentPages({ ...currentPages, [categoryIndex]: currentPage - 1 });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: t.nav.vehicles }]} />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {t.vehicles.pageTitle}
        </h1>
        <div className="w-24 h-1 bg-[#174978] mb-3 rounded-full"></div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl">
          {t.vehicles.pageDesc}
        </p>
      </div>

      {/* Vehicle Categories */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-4 md:py-6">
        {vehicleCategories.map((category, categoryIndex) => {
          const currentPage = currentPages[categoryIndex] || 0;
          const startIndex = currentPage * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const visibleVehicles = category.vehicles.slice(startIndex, endIndex);
          const totalPages = Math.ceil(category.vehicles.length / itemsPerPage);

          return (
            <div key={categoryIndex} className="mb-10 md:mb-14">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#003366] mb-4">
                  {category.title}
                </h2>

                {/* Mobile: Carousel */}
                <div className="md:hidden">
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {visibleVehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="bg-white rounded-xl p-3 flex flex-col items-center shadow-xs border border-gray-100"
                        >
                          <div className="w-full h-24 relative mb-2">
                            <Image
                              src={vehicle.image}
                              alt={`${category.title} - ${vehicle.name}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-xs font-bold text-gray-800 text-center">
                            {vehicle.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                          onClick={() => handlePrev(categoryIndex)}
                          disabled={currentPage === 0}
                          className="bg-[#174978] text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#003366] transition-colors"
                          aria-label="Previous"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentPage ? "bg-[#003366] w-6" : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            handleNext(categoryIndex, category.vehicles.length)
                          }
                          disabled={currentPage === totalPages - 1}
                          className="bg-[#174978] text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#003366] transition-colors"
                          aria-label="Next"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop: Show all vehicles */}
                <div className="hidden md:grid grid-cols-5 gap-4 mb-6">
                  {category.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-2xl p-4 flex flex-col items-center shadow-xs border border-gray-100 hover:shadow-md hover:border-[#75A2BF] transition-all"
                    >
                      <div className="w-full h-32 relative mb-3">
                        <Image
                          src={vehicle.image}
                          alt={`${category.title} - ${vehicle.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-sm font-bold text-gray-800 text-center">
                        {vehicle.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-xs p-5 md:p-6 border-l-4 border-[#174978] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4 text-[#003366] font-bold text-sm md:text-base">
                      <div className="flex items-center gap-1.5">
                        <Users size={18} className="text-[#174978]" />
                        <span>{category.maxPassengers}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={18} className="text-[#174978]" />
                        <span>{category.luggage}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {t.vehicles.subDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      href="/bang-gia"
                      className="text-xs md:text-sm font-bold text-[#174978] hover:text-[#003366] px-4 py-2.5 rounded-xl border border-[#174978]/25 hover:border-[#174978] transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      {t.common.viewPricing} <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/#formbooking"
                      className="bg-linear-to-r from-[#003366] to-[#174978] hover:from-[#002244] hover:to-[#174978] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all text-xs md:text-sm whitespace-nowrap text-center flex-1 md:flex-initial shadow-md shadow-blue-950/20"
                    >
                      {t.common.bookNow}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const menuItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.vehicles, href: "/loai-xe" },
    { name: t.nav.pricing, href: "/bang-gia" },
    { name: t.nav.articles, href: "/bai-viet" },
    { name: t.nav.about, href: "/ve-chung-toi" },
    { name: t.nav.policies, href: "/chinh-sach" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar - White */}
      <div className="bg-white py-2.5 md:py-3.5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/" aria-label="Trang chủ inoibai.vn">
              <Image
                src="/images/Brand.jpg"
                alt="inoibai.vn - Đặt xe sân bay Nội Bài"
                width={200}
                height={60}
                className="object-contain h-10 md:h-14 w-auto rounded"
                priority
              />
            </Link>
            <div className="flex flex-col">
              <span className="text-orange-500 font-bold text-lg md:text-2xl leading-none">
                {t.common.brandName}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 hidden sm:inline">
                {t.common.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Hotline Call Button Desktop */}
            <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 font-semibold uppercase">
                  {t.common.hotline} 24/7
                </span>
                <a
                  href={`tel:${t.common.hotlineNumber.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center text-orange-600 font-extrabold text-lg hover:text-orange-700 transition-colors"
                >
                  <Phone size={18} className="mr-1.5 text-orange-500" />
                  {t.common.hotlineNumber}
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-orange-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav - Orange (Hidden on Mobile) */}
      <div className="hidden lg:block bg-orange-500 text-white shadow-md">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Nav */}
            <nav className="flex space-x-1 h-full">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 flex items-center h-full hover:bg-orange-400 transition-colors font-medium text-sm ${
                    pathname === item.href ? "bg-orange-600 font-bold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-orange-500 text-white pb-4 px-4 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1.5 pt-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm ${
                  pathname === item.href ? "bg-orange-600 font-bold" : "bg-orange-400/40"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-orange-400/60 mt-2">
              <p className="text-xs font-semibold uppercase text-orange-200 mb-1 px-1">
                Ngôn ngữ / Language
              </p>
              <LanguageSwitcher variant="mobile" />
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-3 border-t border-orange-400/60 space-y-2">
              <div className="px-1">
                <p className="text-xs text-orange-200 font-semibold mb-1">
                  {t.common.hotline} 24/7
                </p>
                <a
                  href={`tel:${t.common.hotlineNumber.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center text-base font-bold bg-white text-orange-600 px-4 py-2.5 rounded-lg shadow-sm"
                >
                  <Phone size={18} className="mr-2" />
                  {t.common.hotlineNumber}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { contact } = useSiteContent();

  const menuItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.vehicles, href: "/loai-xe" },
    { name: t.nav.pricing, href: "/bang-gia" },
    { name: t.nav.articles, href: "/bai-viet" },
    { name: t.nav.about, href: "/ve-chung-toi" },
    { name: t.nav.policies, href: "/chinh-sach" },
  ];

  const hotlineNum = contact.hotline || t.common.hotlineNumber;
  const hotlineDisplay = contact.hotline_display || hotlineNum;

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs">
      {/* Top Bar - White */}
      <div className="bg-white py-2.5 md:py-3.5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <Link href="/" aria-label="Trang chủ maigo79.com">
              <Image
                src={contact.logo_url || "/images/Brand.jpg"}
                alt={`${contact.brand_name || "maigo79.com"} - Đặt xe sân bay Cam Ranh - Nha Trang`}
                width={200}
                height={60}
                className="object-contain h-10 md:h-14 w-auto rounded"
                priority
                unoptimized={contact.logo_url?.startsWith("data:") || contact.logo_url?.startsWith("http")}
              />
            </Link>
            <div className="flex flex-col">
              <span className="text-[#003366] font-black text-lg md:text-2xl leading-none tracking-tight">
                {contact.brand_name || t.common.brandName}
              </span>
              <span className="text-[11px] md:text-xs text-gray-500 font-medium hidden sm:inline mt-1">
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
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                  {t.common.hotline} 24/7
                </span>
                <a
                  href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center text-[#174978] font-black text-lg hover:text-[#003366] transition-colors"
                >
                  <Phone size={18} className="mr-1.5 text-[#2F5F8A]" />
                  {hotlineDisplay}
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-[#174978]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav - Ocean Blue Gradient (Hidden on Mobile) */}
      <div className="hidden lg:block bg-linear-to-r from-[#003366] via-[#174978] to-[#2F5F8A] text-white">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Nav */}
            <nav className="flex space-x-1 h-full">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 flex items-center h-full hover:bg-white/15 transition-colors font-semibold text-sm ${
                    pathname === item.href ? "bg-[#002244] font-extrabold" : ""
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#003366] text-white pb-5 px-4 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200 border-t border-white/10">
          <nav className="flex flex-col space-y-1.5 pt-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                  pathname === item.href ? "bg-[#174978] font-bold text-white shadow-xs" : "bg-white/5 hover:bg-white/10 text-white/90"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-white/15 mt-2">
              <p className="text-xs font-semibold uppercase text-blue-200 mb-1.5 px-1">
                Ngôn ngữ / Language
              </p>
              <LanguageSwitcher variant="mobile" />
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <div className="px-1">
                <p className="text-xs text-blue-200 font-semibold mb-1">
                  {t.common.hotline} 24/7
                </p>
                <a
                  href={`tel:${t.common.hotlineNumber.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center text-base font-black bg-white text-[#003366] px-4 py-2.5 rounded-xl shadow-xs"
                >
                  <Phone size={18} className="mr-2 text-[#174978]" />
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

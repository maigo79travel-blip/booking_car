"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const Footer = () => {
  const { t } = useLanguage();
  const { contact } = useSiteContent();

  const hotlineNum = contact.hotline || t.common.hotlineNumber;
  const hotlineDisplay = contact.hotline_display || hotlineNum;

  return (
    <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" aria-label="Trang chủ inhatrang.vn">
                <Image
                  src={contact.logo_url || "/images/Brand.jpg"}
                  alt={`${contact.brand_name || "inhatrang.vn"} - Taxi đưa đón sân bay Cam Ranh giá rẻ`}
                  width={60}
                  height={60}
                  className="rounded-lg hover:opacity-80 transition-opacity object-cover"
                  unoptimized={contact.logo_url?.startsWith("data:") || contact.logo_url?.startsWith("http")}
                />
              </Link>
              <div>
                <span className="text-xl font-bold text-orange-500 block leading-tight">
                  {contact.brand_name || t.common.brandName}
                </span>
                <p className="text-xs text-gray-400">
                  {t.common.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t.footer.companyDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/40 border border-green-800/50 rounded-lg p-2.5">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{t.footer.commitBadge}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-500">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/loai-xe"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.vehicles}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/bai-viet"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.articles}
                </Link>
              </li>
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  {t.nav.policies}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-500">
              {t.footer.services}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/bang-gia"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block"
                >
                  {t.footer.serviceItem1}
                </Link>
              </li>
              <li>
                <Link
                  href="/loai-xe"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block"
                >
                  {t.footer.serviceItem2}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block"
                >
                  {t.footer.serviceItem3}
                </Link>
              </li>
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block"
                >
                  {t.footer.serviceItem4}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block"
                >
                  {t.footer.serviceItem5}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-500">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone
                  size={18}
                  className="text-orange-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">{t.footer.hotlineTitle}</p>
                  <a
                    href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
                    className="text-white hover:text-orange-500 font-bold text-base"
                  >
                    {hotlineDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail
                  size={18}
                  className="text-orange-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">{t.footer.emailTitle}</p>
                  <a
                    href={`mailto:${contact.email || "inhatrang.vn@gmail.com"}`}
                    className="text-gray-300 hover:text-orange-500 text-sm"
                  >
                    {contact.email || "inhatrang.vn@gmail.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  size={18}
                  className="text-orange-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-400 font-semibold">{t.footer.addressTitle}</p>
                  <p className="text-sm text-gray-300">
                    {contact.address || t.footer.addressContent}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61557164784193"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full transition-colors"
              aria-label="Facebook inoibai.vn"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="bg-blue-400 hover:bg-blue-500 p-2.5 rounded-full transition-colors"
              aria-label="Twitter inoibai.vn"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="bg-pink-600 hover:bg-pink-700 p-2.5 rounded-full transition-colors"
              aria-label="Instagram inoibai.vn"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="bg-red-600 hover:bg-red-700 p-2.5 rounded-full transition-colors"
              aria-label="Youtube inoibai.vn"
            >
              <Youtube size={18} />
            </a>
          </div>
          <div className="text-xs md:text-sm text-gray-400 text-center md:text-right">
            <p>{t.footer.workingHours}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/80 py-4 border-t border-gray-900">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>{t.footer.copyright}</p>
            <div className="flex gap-4">
              <Link
                href="/chinh-sach/bao-ve-quyen-rieng-tu"
                className="hover:text-orange-500 transition-colors"
              >
                {t.footer.privacyPolicy}
              </Link>
              <Link
                href="/chinh-sach/van-chuyen-hanh-khach"
                className="hover:text-orange-500 transition-colors"
              >
                {t.footer.transportPolicy}
              </Link>
              <Link
                href="/chinh-sach"
                className="hover:text-orange-500 transition-colors"
              >
                {t.footer.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

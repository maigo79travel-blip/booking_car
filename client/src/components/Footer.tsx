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
    <footer className="bg-linear-to-b from-slate-900 to-slate-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="mb-4">
              <Link href="/" aria-label="Trang chủ maigo79.com" className="inline-block mb-1.5">
                <Image
                  src={contact.logo_url || "/images/logo-maigo79.png"}
                  alt={`${contact.brand_name || "maigo79.com"} - Taxi đưa đón sân bay Cam Ranh giá rẻ`}
                  width={200}
                  height={50}
                  className="h-10 md:h-12 w-auto hover:opacity-80 transition-opacity object-contain"
                  unoptimized={contact.logo_url?.startsWith("data:") || contact.logo_url?.startsWith("http")}
                />
              </Link>
              <p className="text-xs text-slate-400 font-medium">
                {t.common.tagline}
              </p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {t.footer.companyDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-2.5">
              <ShieldCheck size={18} className="shrink-0" />
              <span className="font-semibold">{t.footer.commitBadge}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-brand-coastal uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/loai-xe"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.vehicles}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/bai-viet"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.articles}
                </Link>
              </li>
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm font-medium"
                >
                  {t.nav.policies}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-brand-coastal uppercase tracking-wider">
              {t.footer.services}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/bang-gia"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm block font-medium"
                >
                  {t.footer.serviceItem1}
                </Link>
              </li>
              <li>
                <Link
                  href="/loai-xe"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm block font-medium"
                >
                  {t.footer.serviceItem2}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm block font-medium"
                >
                  {t.footer.serviceItem3}
                </Link>
              </li>
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm block font-medium"
                >
                  {t.footer.serviceItem4}
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="text-slate-400 hover:text-brand-coastal transition-colors text-sm block font-medium"
                >
                  {t.footer.serviceItem5}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-brand-coastal uppercase tracking-wider">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone
                  size={18}
                  className="text-brand-coastal mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">{t.footer.hotlineTitle}</p>
                  <a
                    href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
                    className="text-white hover:text-brand-coastal font-bold text-base transition-colors"
                  >
                    {hotlineDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail
                  size={18}
                  className="text-brand-coastal mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">{t.footer.emailTitle}</p>
                  <a
                    href={`mailto:${contact.email || "contact@maigo79.com"}`}
                    className="text-slate-300 hover:text-brand-coastal text-sm transition-colors"
                  >
                    {contact.email || "contact@maigo79.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  size={18}
                  className="text-brand-coastal mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">{t.footer.addressTitle}</p>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    {contact.address || t.footer.addressContent}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#174978] hover:bg-[#003366] p-2.5 transition-colors text-white"
              aria-label="Facebook maigo79.com"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="bg-brand-marine hover:bg-[#174978] p-2.5 transition-colors text-white"
              aria-label="Twitter maigo79.com"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="bg-brand-steel hover:bg-brand-marine p-2.5 transition-colors text-white"
              aria-label="Instagram maigo79.com"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="bg-[#003366] hover:bg-[#002244] p-2.5 transition-colors text-white"
              aria-label="Youtube maigo79.com"
            >
              <Youtube size={18} />
            </a>
          </div>
          <div className="text-xs md:text-sm text-slate-400 text-center md:text-right font-medium">
            <p>{t.footer.workingHours}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/90 py-4 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium">
            <p>{t.footer.copyright}</p>
            <div className="flex gap-4">
              <Link
                href="/chinh-sach/bao-ve-quyen-rieng-tu"
                className="hover:text-brand-coastal transition-colors"
              >
                {t.footer.privacyPolicy}
              </Link>
              <Link
                href="/chinh-sach/van-chuyen-hanh-khach"
                className="hover:text-brand-coastal transition-colors"
              >
                {t.footer.transportPolicy}
              </Link>
              <Link
                href="/chinh-sach"
                className="hover:text-brand-coastal transition-colors"
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

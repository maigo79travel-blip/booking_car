import type { Metadata } from "next";
import Header from "@/components/Header";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "Về chúng tôi - Dịch vụ xe sân bay Cam Ranh & Nha Trang uy tín maigo79.com",
  description: "Giới thiệu dịch vụ xe đưa đón sân bay Cam Ranh và tour du lịch Nha Trang - maigo79.com.",
  alternates: { canonical: "/ve-chung-toi" },
};

export default function AboutPage() {
  return <><Header /><AboutPageClient /></>;
}

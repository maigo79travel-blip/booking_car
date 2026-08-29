import type { Metadata } from "next";
import Header from "@/components/Header";
import PolicyPageClient from "@/components/PolicyPageClient";
export const metadata: Metadata = { title: "Chính sách & Điều khoản dịch vụ đặt xe - maigo79.com", description: "Chính sách vận chuyển hành khách và bảo vệ quyền riêng tư tại maigo79.com.", alternates: { canonical: "/chinh-sach" } };
export default function PolicyPage() { return <><Header /><PolicyPageClient /></>; }

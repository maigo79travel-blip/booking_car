import type { Metadata } from "next";
import Header from "@/components/Header";
import PricingPageIntro from "@/components/PricingPageIntro";
import PriceTable from "@/components/PriceTable";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQSection from "@/components/FAQSection";
import Testimonials from "@/components/Testimonials";
import FloatingContacts from "@/components/FloatingContacts";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bảng giá cước xe sân bay Cam Ranh – Nha Trang trọn gói mới nhất 2026",
  description:
    "Bảng giá dịch vụ taxi đưa đón sân bay Cam Ranh về Nha Trang 5 chỗ, 7 chỗ, 16 chỗ trọn gói, cam kết không phí ẩn. Giá chỉ từ 250.000đ. Đưa đón 24/7.",
  alternates: {
    canonical: "/bang-gia",
  },
  openGraph: {
    title: "Bảng giá cước xe sân bay Cam Ranh – Nha Trang trọn gói mới nhất 2026",
    description:
      "Bảng giá dịch vụ taxi sân bay Cam Ranh 5 chỗ, 7 chỗ, 16 chỗ trọn gói, cam kết không phí ẩn. Giá từ 250k đón trả tận nơi.",
    url: "/bang-gia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bảng giá cước xe sân bay Cam Ranh – Nha Trang trọn gói mới nhất 2026",
    description:
      "Bảng giá xe taxi đưa đón sân bay Cam Ranh về Nha Trang chỉ từ 250k, xe đời mới, đón đúng giờ.",
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <PricingPageIntro />

      {/* Price Table */}
      <PriceTable />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonials */}
      <Testimonials />

      <Footer />
      <FloatingContacts />
    </main>
  );
}

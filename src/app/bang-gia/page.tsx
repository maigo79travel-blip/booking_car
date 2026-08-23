import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceTable from "@/components/PriceTable";
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

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Bảng giá cước" }]} />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Bảng Giá Xe Sân Bay Cam Ranh – Nha Trang Trọn Gói 24/7
        </h1>
        <div className="w-24 h-1 bg-orange-500 mb-3"></div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl">
          Cam kết giá cước niêm yết công khai, đã bao gồm phí cầu đường và vé vào sân bay Cam Ranh. Không tăng giá vào giờ cao điểm, đêm muộn hay dịp lễ tết.
        </p>
      </div>

      {/* Price Table */}
      <PriceTable />

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

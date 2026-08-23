import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PriceTable from "@/components/PriceTable";
import WhyChooseUs from "@/components/WhyChooseUs";
import BookingSteps from "@/components/BookingSteps";
import PopularRoutes from "@/components/PopularRoutes";
import FAQSection from "@/components/FAQSection";
import Testimonials from "@/components/Testimonials";
import FloatingContacts from "@/components/FloatingContacts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Visual & Semantic SEO H1 */}
      <h1 className="sr-only">
        Đặt Xe Sân Bay Cam Ranh – Taxi Nha Trang Giá Rẻ Trọn Gói 24/7 - maigo79.com
      </h1>

      <Header />
      <HeroSection />

      {/* Price Table Section */}
      <PriceTable />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* 3-Step Booking Process */}
      <BookingSteps />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* FAQ Section with Accordion + Schema */}
      <FAQSection />

      {/* Customer Reviews */}
      <Testimonials />

      <Footer />
      <FloatingContacts />
    </main>
  );
}

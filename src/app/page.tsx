import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PriceTable from "@/components/PriceTable";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import PopularRoutes from "@/components/PopularRoutes";
import TravelDestinations from "@/components/TravelDestinations";
import BookingSteps from "@/components/BookingSteps";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import FloatingContacts from "@/components/FloatingContacts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <HeroSection />

      {/* 1. Price Table Section */}
      <PriceTable />

      {/* 2. Featured Vehicles - Các dòng xe nổi bật */}
      <FeaturedVehicles />

      {/* 3. Popular Routes - Tuyến xe sân bay & liên tỉnh */}
      <PopularRoutes />

      {/* 4. Travel Destinations - Các địa điểm du lịch nổi tiếng Nha Trang */}
      <TravelDestinations />

      {/* 5. 3-Step Booking Process */}
      <BookingSteps />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Customer Reviews */}
      <Testimonials />

      {/* 8. FAQ Section with Accordion + Schema */}
      <FAQSection />

      <Footer />
      <FloatingContacts />
    </main>
  );
}

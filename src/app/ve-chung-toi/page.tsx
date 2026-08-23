import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import BookingForm from "@/components/BookingForm";
import {
  Users,
  Award,
  Shield,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Về chúng tôi - Dịch vụ xe sân bay Cam Ranh & Nha Trang uy tín inhatrang.vn",
  description:
    "Giới thiệu dịch vụ xe đưa đón sân bay Cam Ranh và tour du lịch Nha Trang - inhatrang.vn. Đội xe đời mới, tài xế phục vụ 24/7, cam kết đúng giờ và giá cước tốt nhất.",
  alternates: {
    canonical: "/ve-chung-toi",
  },
  openGraph: {
    title: "Về chúng tôi - Dịch vụ xe sân bay Cam Ranh & Nha Trang uy tín inhatrang.vn",
    description:
      "Giới thiệu dịch vụ xe đưa đón sân bay Cam Ranh và tour du lịch Nha Trang. Đội xe đời mới, tài xế chuyên nghiệp 24/7 đón trả tận nơi.",
    url: "/ve-chung-toi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Về chúng tôi - Dịch vụ xe sân bay Cam Ranh & Nha Trang uy tín",
    description:
      "Đội xe đời mới chuyên phục vụ đưa đón sân bay Cam Ranh và tour Nha Trang, Đà Lạt, Mũi Né 24/7.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Về chúng tôi" }]} />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Về Chúng Tôi - inhatrang.vn (Xe Sân Bay Cam Ranh & Tour Nha Trang)
        </h1>
        <div className="w-24 h-1 bg-orange-500"></div>
      </div>

      {/* Company Introduction */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        <div className="bg-white rounded-2xl p-6 md:p-10 mb-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">
            Giới Thiệu Đơn Vị Đưa Đón Sân Bay Cam Ranh & Tour Nha Trang Uy Tín
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p className="text-base md:text-lg leading-relaxed">
              Thành lập từ năm 2020,{" "}
              <strong>Dịch Vụ Xe Sân Bay Cam Ranh & Tour Du Lịch Nha Trang (inhatrang.vn)</strong> hiện nay
              là đơn vị hàng đầu cung cấp dịch vụ xe đưa đón tại Sân bay Quốc tế Cam Ranh (CXR),
              khu nghỉ dưỡng Bãi Dài, trung tâm thành phố Nha Trang và các tuyến liên tỉnh (Đà Lạt, Mũi Né, Ninh Thuận, Phú Yên).
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Dựa trên nền tảng công nghệ điều xe thông minh và quản lý chuyên nghiệp,
              chúng tôi luôn phấn đấu đem lại cho khách hàng các giải pháp đặt
              xe tiện lợi, nhanh chóng và tiết kiệm chi phí tối đa.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Chúng tôi luôn sẵn sàng phục vụ du khách trong nước, quốc tế (Hàn Quốc, Nga, Trung Quốc, Âu Mỹ...)
              cũng như các đối tác lữ hành, công ty tổ chức sự kiện tại Nha Trang với chính sách giá ưu đãi và xuất hóa đơn VAT đầy đủ.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Là một trong những đơn vị cung cấp dịch vụ đón tiễn sân bay và
              tour du lịch uy tín nhất hiện nay, chúng tôi cam kết tài xế thân thiện, đón đúng giờ và mang lại cho bạn kỳ nghỉ trọn vẹn tại thành phố biển Nha Trang.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-900" size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">An Toàn Tuyệt Đối</h3>
            <p className="text-sm text-gray-600">
              Xe đời mới, bảo dưỡng định kỳ, tài xế giàu kinh nghiệm điềm đạm
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-orange-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Đón Đúng Giờ</h3>
            <p className="text-sm text-gray-600">
              Cam kết đón đúng giờ tại sảnh đến Cam Ranh, theo dõi sát sao giờ bay
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Chuyên Nghiệp
            </h3>
            <p className="text-sm text-gray-600">
              Tài xế được đào tạo bài bản, phục vụ tận tâm, hỗ trợ hành lý chu đáo
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Tận Tâm 24/7</h3>
            <p className="text-sm text-gray-600">
              Tổng đài luôn lắng nghe và điều phối xe nhanh chóng mọi thời điểm
            </p>
          </div>
        </div>

        {/* Our Advantages */}
        <div className="bg-white rounded-2xl p-6 md:p-10 mb-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">
            Ưu Điểm Của Dịch Vụ Xe inhatrang.vn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Dàn xe đời mới, chất lượng cao từ 5, 7, 16, 29 đến 45 chỗ
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Giá cước rẻ hơn 20% – 40% so với taxi truyền thống tại sân bay
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Giá niêm yết trọn gói, không phí ẩn, miễn phí hủy chuyến trước
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Đặt xe qua nhiều hình thức: website, hotline, Zalo 24/7
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Tổng đài và Chăm sóc khách hàng phục vụ 24/7
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Dịch vụ đón tiễn giơ biển tại sảnh đến Cam Ranh miễn phí
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Phát hành phiếu thu, hóa đơn VAT nhanh chóng
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-500 shrink-0 mt-1"
                size={20}
              />
              <p className="text-gray-700 text-sm md:text-base">
                Ưu đãi tour Nha Trang đi Đà Lạt, Mũi Né, Ninh Thuận, Phú Yên
              </p>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white text-center shadow-md">
          <p className="text-base md:text-lg leading-relaxed italic font-medium">
            Chúng tôi xin chân thành cảm ơn Quý khách hàng đã tin tưởng và ủng
            hộ chúng tôi trong thời gian qua và mong sẽ tiếp tục được là người
            đồng hành, đối tác tin cậy của Quý khách hàng trên mọi hành trình tại Nha Trang!
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mt-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">
            Thông Tin Liên Hệ Trực Tiếp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Phone className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Hotline 24/7</h3>
                <a
                  href="tel:0928015280"
                  className="text-base text-orange-600 font-bold hover:underline"
                >
                  0928.015.280
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="text-blue-900" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Địa chỉ</h3>
                <p className="text-sm text-gray-600">
                  28 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Tỉnh Khánh Hòa
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Clock className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Giờ làm việc</h3>
                <p className="text-sm text-gray-600">
                  24/7 - Luôn sẵn sàng phục vụ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section - Mobile Only */}
      <div className="md:hidden bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-900 mb-1">
              Đặt Xe Sân Bay Cam Ranh Ngay
            </h2>
            <p className="text-gray-600 text-sm">
              Liên hệ với chúng tôi để được phục vụ tốt nhất
            </p>
          </div>
          <BookingForm />
        </div>
      </div>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

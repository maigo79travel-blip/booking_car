import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

export const metadata: Metadata = {
  title: "Quy định vận chuyển hành khách",
  description:
    "Chi tiết quy định về xác nhận lịch trình, thời gian tài xế chờ, hủy chuyến và chính sách xe đưa đón sân bay Cam Ranh tại inhatrang.vn.",
  alternates: {
    canonical: "/chinh-sach/van-chuyen-hanh-khach",
  },
  openGraph: {
    title: "Quy định vận chuyển hành khách | inhatrang.vn",
    description:
      "Chi tiết quy định về xác nhận lịch trình, thời gian tài xế chờ, hủy chuyến và chính sách dịch vụ xe sân bay Cam Ranh.",
    url: "/chinh-sach/van-chuyen-hanh-khach",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Quy định vận chuyển hành khách | inhatrang.vn",
    description: "Quy định đặt xe và đưa đón sân bay Cam Ranh tại inhatrang.vn.",
  },
};

export default function TransportPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Chính sách & Điều khoản", href: "/chinh-sach" },
          { name: "Quy định vận chuyển hành khách" },
        ]}
      />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Quy Định Vận Chuyển Hành Khách
        </h1>
        <div className="w-24 h-1 bg-[#174978] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        {/* Section I */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            I. Quy định về xác nhận lịch trình
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Ngay sau khi quý khách gửi thông tin đặt xe, hệ thống tổng đài và điều hành xe của chúng tôi sẽ liên hệ qua điện thoại, tin nhắn SMS hoặc Zalo để xác nhận lại lịch trình, thời gian đón và số hiệu chuyến bay.
            </p>
            <p>
              Chúng tôi có quyền cung cấp Tên, Địa chỉ, Mã chuyến bay và Số điện
              thoại của quý khách cho lái xe trực tiếp đảm nhận chuyến đi để việc đón tiễn được thuận tiện và đúng giờ.
            </p>
          </div>
        </div>

        {/* Section II */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            II. Quy định về thời gian lái xe chờ đón
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              <strong>Đón tại sân bay Cam Ranh:</strong> Khi quý khách cung cấp mã hiệu chuyến bay, chúng tôi sẽ theo dõi giờ hạ cánh thực tế. Lái xe sẽ chủ động liên hệ và chờ đợi quý khách lấy hành lý tại sảnh ra mà KHÔNG tính phụ phí delay chuyến bay.
            </p>
            <p>
              <strong>Đón tại TP. Nha Trang & các resort Bãi Dài:</strong> Lái xe sẽ có mặt trước giờ hẹn 10 - 15 phút. Thời gian chờ tối đa miễn phí là 15 phút sau giờ hẹn đón. Nếu phát sinh thay đổi, quý khách vui lòng thông báo sớm với tổng đài.
            </p>
          </div>
        </div>

        {/* Section III */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            III. Cam kết đúng giờ & Đền bù nếu trễ hẹn
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Chúng tôi cam kết tài xế đón đúng giờ và đúng địa điểm quý khách yêu cầu. Nếu do lỗi từ phía nhà xe mà lái xe đến trễ quá 15 phút ảnh hưởng đến hành trình, chúng tôi sẽ hỗ trợ chi phí chuyển sang taxi khác và bồi hoàn thỏa đáng.
            </p>
          </div>
        </div>

        {/* Section IV */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            IV. Quy định về hủy đặt xe / Thay đổi lịch trình
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Quý khách có quyền hủy đặt xe hoặc thay đổi giờ đón <strong>HOÀN TOÀN MIỄN PHÍ</strong> bằng cách gọi điện hoặc nhắn tin tới Hotline <strong>0928.015.280</strong> trước giờ khởi hành ít nhất 30 - 60 phút để chúng tôi kịp thời điều phối lại xe.
            </p>
          </div>
        </div>

        {/* Section V */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            V. Quy định chung khi tham gia chuyến đi
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              - Quý khách không mang theo những hàng hóa cấm theo quy định của pháp luật hiện hành.
            </p>
            <p>
              - Quý khách không hút thuốc lá, thuốc lá điện tử hoặc xả rác bừa bãi trong khoang xe.
            </p>
            <p>
              - Trong điều kiện bất khả kháng (thiên tai, bão lũ, ngập lụt nghiêm trọng, sự cố cấm đường diện rộng), chúng tôi sẽ chủ động thông báo sớm nhất để hỗ trợ phương án di chuyển thay thế tối ưu.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

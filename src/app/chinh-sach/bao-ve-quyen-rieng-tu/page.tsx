import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

export const metadata: Metadata = {
  title: "Chính sách bảo vệ quyền riêng tư",
  description:
    "Chính sách thu thập, lưu trữ, sử dụng và bảo mật thông tin cá nhân của khách hàng khi đặt xe sân bay Cam Ranh và Nha Trang tại inhatrang.vn.",
  alternates: {
    canonical: "/chinh-sach/bao-ve-quyen-rieng-tu",
  },
  openGraph: {
    title: "Chính sách bảo vệ quyền riêng tư | inhatrang.vn",
    description:
      "Chính sách thu thập, lưu trữ, sử dụng và bảo mật thông tin cá nhân của khách hàng.",
    url: "/chinh-sach/bao-ve-quyen-rieng-tu",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chính sách bảo vệ quyền riêng tư | inhatrang.vn",
    description: "Chính sách bảo mật thông tin khách hàng tại inhatrang.vn.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Chính sách & Điều khoản", href: "/chinh-sach" },
          { name: "Bảo vệ quyền riêng tư" },
        ]}
      />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Chính Sách Bảo Vệ Quyền Riêng Tư
        </h1>
        <div className="w-24 h-1 bg-orange-500"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        {/* Introduction */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Phần Quy định bảo vệ Quyền riêng tư này trình bày về việc chúng
              tôi xử lý thông tin nhận dạng cá nhân mà chúng tôi thu thập được
              khi Quý khách ở trong trang web inhatrang.vn, và khi Quý khách sử dụng các dịch vụ đặt xe sân bay của chúng tôi hoặc dịch
              vụ của các đối tác nhưng có liên kết với dịch vụ của chúng tôi.
            </p>
            <p>
              Quy định này không áp dụng cho những cách thức xử lý thông tin của
              các công ty mà chúng tôi không sở hữu hoặc kiểm soát, hoặc những
              người không phải là nhân viên của chúng tôi hay những người không
              do chúng tôi quản lý.
            </p>
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            1. Cam kết sử dụng thông tin
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Chúng tôi cam kết chỉ sử dụng thông tin của Quý khách như email,
              số điện thoại, tên, lịch trình chuyến bay v.v. cho mục đích đón, tiễn Quý khách theo yêu cầu
              của Quý khách. Bằng việc đồng ý sử dụng dịch vụ của chúng tôi, Quý
              khách cho phép chúng tôi được sử dụng và lưu trữ các thông tin mà
              Quý khách cung cấp để thực hiện việc điều xe, giải quyết các vấn
              đề phát sinh, chăm sóc khách hàng cũng như cập nhật thông tin dịch
              vụ của chúng tôi đến Quý khách.
            </p>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            2. Chia sẻ thông tin cá nhân
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Chúng tôi chỉ chia sẻ thông tin cá nhân với các lái xe và đối tác vận chuyển trong những trường hợp giới hạn sau:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chúng tôi được Quý khách đồng ý cho tiết lộ thông tin đó.</li>
              <li>
                Chúng tôi cần cung cấp số điện thoại, tên, mã chuyến bay cho tài xế để việc đón trả diễn ra thuận lợi, đúng giờ.
              </li>
              <li>
                Chúng tôi tuân theo các trát lệnh, lệnh tòa án hoặc thủ tục pháp
                lý của cơ quan nhà nước có thẩm quyền.
              </li>
            </ul>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            3. Bảo mật thông tin
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Chúng tôi sử dụng các biện pháp bảo mật thích hợp để bảo vệ việc
              truy cập hoặc sửa đổi, tiết lộ hoặc huỷ dữ liệu một cách trái
              phép. Các biện pháp này bao gồm xem xét nội bộ các thực tiễn thu
              thập, lưu trữ và xử lý dữ liệu cũng như các biện pháp bảo mật số hóa an toàn.
            </p>
          </div>
        </div>

        {/* Policy Changes */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
            4. Những thay đổi về Quy định bảo vệ Quyền riêng tư
          </h2>
          <div
            className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed"
          >
            <p>
              Theo thực tiễn đôi khi chúng tôi có thể sửa đổi quy định này. Mọi thay đổi sẽ được cập nhật công khai trực tiếp trên website inhatrang.vn.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Thông Tin Liên Hệ Bảo Mật</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Nếu Quý khách có bất kỳ câu hỏi hoặc góp ý nào cho chúng tôi về
            Quyền riêng tư, Quý khách có thể liên hệ qua Hotline 24/7:{" "}
            <strong>0928.015.280</strong> hoặc email <strong>inhatrang.vn@gmail.com</strong>.
          </p>
        </div>
      </div>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

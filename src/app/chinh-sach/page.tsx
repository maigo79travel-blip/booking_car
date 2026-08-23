import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Link from "next/link";
import { Truck, Lock, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính sách & Điều khoản dịch vụ đặt xe",
  description:
    "Chính sách vận chuyển hành khách, bảo vệ quyền riêng tư và các quy định về dịch vụ xe đưa đón sân bay Nội Bài tại inoibai.vn.",
  alternates: {
    canonical: "/chinh-sach",
  },
  openGraph: {
    title: "Chính sách & Điều khoản dịch vụ đặt xe",
    description:
      "Chính sách vận chuyển hành khách, bảo vệ quyền riêng tư và điều khoản sử dụng dịch vụ.",
    url: "/chinh-sach",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chính sách & Điều khoản dịch vụ đặt xe",
    description: "Quy định vận chuyển và chính sách bảo mật tại inoibai.vn.",
  },
};

export default function PolicyPage() {
  const policyPages = [
    {
      title: "Vận Chuyển Hành Khách",
      description:
        "Quy định về dịch vụ vận chuyển, xác nhận lịch trình, thời gian chờ, hủy chuyến và trách nhiệm của các bên",
      icon: Truck,
      href: "/chinh-sach/van-chuyen-hanh-khach",
      color: "blue",
    },
    {
      title: "Bảo Vệ Quyền Riêng Tư",
      description:
        "Chính sách thu thập, sử dụng, lưu trữ và bảo mật thông tin cá nhân của khách hàng",
      icon: Lock,
      href: "/chinh-sach/bao-ve-quyen-rieng-tu",
      color: "purple",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Chính sách & Điều khoản" }]} />

      {/* Page Title */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Chính Sách & Điều Khoản Dịch Vụ
        </h1>
        <div className="w-24 h-1 bg-orange-500"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        {/* Introduction */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Chào mừng quý khách đến với <strong>inoibai.vn (Hoàng Khôi Limousine)</strong>. Dưới đây là các
            chính sách và điều khoản sử dụng dịch vụ của chúng tôi nhằm đảm bảo quyền lợi cao nhất cho khách hàng và tính minh bạch trong vận hành.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {policyPages.map((policy, index) => {
            const Icon = policy.icon;
            const bgColor =
              policy.color === "blue" ? "bg-blue-100" : "bg-purple-100";
            const textColor =
              policy.color === "blue" ? "text-blue-900" : "text-purple-900";
            const hoverBorder =
              policy.color === "blue"
                ? "hover:border-blue-300"
                : "hover:border-purple-300";

            return (
              <Link
                key={index}
                href={policy.href}
                className={`bg-white rounded-2xl p-6 md:p-8 border border-gray-100 ${hoverBorder} shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${bgColor} p-4 rounded-xl flex-shrink-0`}>
                    <Icon className={textColor} size={32} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {policy.title}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
                      {policy.description}
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold text-sm">
                      Xem chi tiết quy định
                      <ChevronRight
                        size={18}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

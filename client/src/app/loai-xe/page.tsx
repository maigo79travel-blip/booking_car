import type { Metadata } from "next";
import VehiclesView from "@/components/VehiclesView";

export const metadata: Metadata = {
  title: "Các loại xe sân bay Cam Ranh & Nha Trang 5, 7, 16, 29, 45 chỗ đời mới",
  description:
    "Danh sách các loại xe đưa đón sân bay Cam Ranh về Nha Trang từ 5 chỗ, 7 chỗ đến 16, 29, 45 chỗ. Dàn xe đời mới, sang trọng, tiện nghi, tài xế phục vụ 24/7.",
  alternates: {
    canonical: "/loai-xe",
  },
  openGraph: {
    title: "Các loại xe sân bay Cam Ranh & Nha Trang 5, 7, 16, 29, 45 chỗ đời mới",
    description:
      "Danh sách các loại xe đưa đón sân bay Cam Ranh về Nha Trang từ 5 chỗ đến 45 chỗ đời mới, phục vụ 24/7 đón trả tận nơi.",
    url: "/loai-xe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Các loại xe sân bay Cam Ranh & Nha Trang 5, 7, 16, 29, 45 chỗ đời mới",
    description:
      "Dàn xe sân bay Cam Ranh và tour du lịch Nha Trang 5, 7, 16 chỗ đời mới tiện nghi, sang trọng, đón đúng giờ.",
  },
};

export default function VehiclesPage() {
  return <VehiclesView />;
}

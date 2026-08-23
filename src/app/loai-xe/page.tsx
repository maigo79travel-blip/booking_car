import type { Metadata } from "next";
import VehiclesView from "@/components/VehiclesView";

export const metadata: Metadata = {
  title: "Các loại xe sân bay 4, 7, 16, 29, 45 chỗ đời mới",
  description:
    "Danh sách các loại xe đưa đón sân bay Nội Bài từ 4 chỗ, 5 chỗ, 7 chỗ đến 16, 29, 45 chỗ. Dàn xe đời mới, sang trọng, tiện nghi, tài xế phục vụ 24/7.",
  alternates: {
    canonical: "/loai-xe",
  },
  openGraph: {
    title: "Các loại xe sân bay 4, 7, 16, 29, 45 chỗ đời mới",
    description:
      "Danh sách các loại xe đưa đón sân bay Nội Bài từ 4 chỗ đến 45 chỗ đời mới, phục vụ 24/7 đón trả tận nơi.",
    url: "/loai-xe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Các loại xe sân bay 4, 7, 16, 29, 45 chỗ đời mới",
    description:
      "Dàn xe sân bay Nội Bài 5, 7, 16 chỗ đời mới tiện nghi, sang trọng, đón đúng giờ.",
  },
};

export default function VehiclesPage() {
  return <VehiclesView />;
}

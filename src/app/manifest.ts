import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "inoibai.vn - Đặt xe sân bay Nội Bài",
    short_name: "inoibai.vn",
    description:
      "Dịch vụ đặt xe taxi đưa đón sân bay Nội Bài giá rẻ, uy tín, trọn gói 24/7",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/Brand.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/Brand.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}

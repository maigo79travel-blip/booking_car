import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MaiGo79 - Đặt xe sân bay Cam Ranh Nha Trang",
    short_name: "MaiGo79",
    description:
      "Dịch vụ đặt xe taxi đưa đón sân bay Cam Ranh và Nha Trang giá rẻ, uy tín, trọn gói 24/7 - maigo79.com",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#003366",
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

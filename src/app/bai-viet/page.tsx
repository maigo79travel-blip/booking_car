import type { Metadata } from "next";
import Header from "@/components/Header";
import PostsPageClient from "@/components/PostsPageClient";
import { getPublishedPosts } from "@/lib/server/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức kinh nghiệm đặt xe sân bay Cam Ranh – Nha Trang",
  description:
    "Tổng hợp tin tức, kinh nghiệm đi lại, mẹo đặt xe taxi sân bay Cam Ranh về Nha Trang giá rẻ, an toàn và đúng giờ từ maigo79.com.",
  alternates: {
    canonical: "/bai-viet",
  },
  openGraph: {
    title: "Cẩm nang & Tin tức kinh nghiệm đặt xe sân bay Cam Ranh – Nha Trang",
    description:
      "Tổng hợp kinh nghiệm đặt xe taxi sân bay Cam Ranh về Nha Trang giá rẻ, an toàn từ maigo79.com.",
    url: "/bai-viet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cẩm nang & Tin tức kinh nghiệm đặt xe sân bay Cam Ranh – Nha Trang",
    description:
      "Kinh nghiệm di chuyển sân bay Cam Ranh về Nha Trang nhanh chóng, tiết kiệm chi phí.",
  },
};

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <PostsPageClient posts={posts} />
    </>
  );
}

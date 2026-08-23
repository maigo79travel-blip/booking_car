import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { getPublishedPosts, text } from "@/lib/server/content";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức kinh nghiệm đặt xe sân bay Cam Ranh – Nha Trang",
  description:
    "Tổng hợp tin tức, kinh nghiệm đi lại, mẹo đặt xe taxi sân bay Cam Ranh về Nha Trang giá rẻ, an toàn và đúng giờ từ inhatrang.vn.",
  alternates: {
    canonical: "/bai-viet",
  },
  openGraph: {
    title: "Cẩm nang & Tin tức kinh nghiệm đặt xe sân bay Cam Ranh – Nha Trang",
    description:
      "Tổng hợp kinh nghiệm đặt xe taxi sân bay Cam Ranh về Nha Trang giá rẻ, an toàn từ inhatrang.vn.",
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
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Cẩm nang & Bài viết" }]} />

      <section className="container mx-auto px-4 md:px-12 lg:px-24 py-4 md:py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
            <BookOpen size={18} />
            <span>Kinh nghiệm di chuyển</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-2">
            Cẩm Nang & Bài Viết Hướng Dẫn Đi Sân Bay Cam Ranh – Nha Trang
          </h1>
          <div className="w-24 h-1 bg-[#174978] mb-3 rounded-full"></div>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl">
            Cập nhật các thông tin hữu ích về giá vé, lộ trình, kinh nghiệm đón tiễn và các lưu ý quan trọng khi di chuyển tới sân bay Cam Ranh và các tour du lịch Nha Trang.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={`Ảnh đại diện bài viết ${text(post.title)}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EAF2F8] text-[#174978] font-bold text-sm">
                        inhatrang.vn
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.published_at && (
                      <time
                        className="text-xs text-gray-400 block mb-2"
                        dateTime={post.published_at}
                      >
                        {new Intl.DateTimeFormat("vi-VN", {
                          dateStyle: "medium",
                        }).format(new Date(post.published_at))}
                      </time>
                    )}
                    <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-snug group-hover:text-[#003366] transition-colors line-clamp-2">
                      <Link href={`/bai-viet/${post.slug}`}>
                        {text(post.title)}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {text(post.excerpt)}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#174978] hover:text-[#003366] group-hover:translate-x-1 transition-transform"
                    href={`/bai-viet/${post.slug}`}
                  >
                    Xem chi tiết <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
            Hiện chưa có bài viết nào được đăng tải. Vui lòng quay lại sau!
          </div>
        )}
      </section>

      <Footer />
      <FloatingContacts />
    </main>
  );
}

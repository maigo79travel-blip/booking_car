import type { Metadata } from "next";
import CmsTextPage from "@/components/CmsTextPage";
import { getAllSiteContent } from "@/lib/server/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAllSiteContent();
  const page = content.transport_policy as { seo?: { title?: string; description?: string } } | undefined;
  return {
    title: page?.seo?.title || "Quy định vận chuyển hành khách",
    description: page?.seo?.description || "Quy định về xác nhận lịch trình, thời gian chờ, hủy chuyến và dịch vụ xe đưa đón sân bay.",
    alternates: { canonical: "/chinh-sach/van-chuyen-hanh-khach" },
  };
}

export default async function TransportPolicyPage() {
  const content = await getAllSiteContent();
  return <CmsTextPage contentKey="transport_policy" initialPage={content.transport_policy} />;
}

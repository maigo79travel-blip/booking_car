import type { Metadata } from "next";
import CmsTextPage from "@/components/CmsTextPage";
import { getAllSiteContent } from "@/lib/server/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAllSiteContent();
  const page = content.privacy_policy as { seo?: { title?: string; description?: string } } | undefined;
  return {
    title: page?.seo?.title || "Chính sách bảo vệ quyền riêng tư",
    description: page?.seo?.description || "Chính sách thu thập, lưu trữ, sử dụng và bảo mật thông tin cá nhân của khách hàng.",
    alternates: { canonical: "/chinh-sach/bao-ve-quyen-rieng-tu" },
  };
}

export default async function PrivacyPolicyPage() {
  const content = await getAllSiteContent();
  return <CmsTextPage contentKey="privacy_policy" initialPage={content.privacy_policy} />;
}

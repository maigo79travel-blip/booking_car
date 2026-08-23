import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị hệ thống - inhatrang.vn",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

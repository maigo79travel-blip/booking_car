import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inoibai.vn";

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Đặt xe sân bay Nội Bài giá rẻ, đưa đón 24/7 - inoibai.vn",
    template: "%s | inoibai.vn",
  },
  description:
    "Dịch vụ đặt xe sân bay Nội Bài uy tín, giá rẻ trọn gói. Xe 4-7-16 chỗ đời mới. Đưa đón tận nơi 24/7, không phí ẩn. Hotline: 0985 791 955",
  keywords: [
    "đặt xe sân bay nội bài",
    "taxi nội bài giá rẻ",
    "xe đưa đón sân bay nội bài",
    "taxi sân bay nội bài",
    "đặt xe nội bài",
    "inoibai",
    "thuê xe sân bay",
    "xe đi nội bài 200k",
    "xe 7 chỗ nội bài",
    "xe 16 chỗ sân bay",
  ],
  authors: [{ name: "inoibai.vn", url: siteUrl }],
  creator: "inoibai.vn",
  publisher: "inoibai.vn",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/Brand.jpg",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    title: "Đặt xe sân bay Nội Bài giá rẻ, đưa đón 24/7 - inoibai.vn",
    description:
      "Dịch vụ đặt xe sân bay Nội Bài uy tín, giá rẻ trọn gói. Xe 4-7-16 chỗ đời mới. Đưa đón tận nơi 24/7, không phát sinh chi phí.",
    siteName: "inoibai.vn",
    images: [
      {
        url: "/images/Brand.jpg",
        width: 1200,
        height: 630,
        alt: "inoibai.vn - Đặt xe sân bay Nội Bài",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt xe sân bay Nội Bài giá rẻ, đưa đón 24/7 - inoibai.vn",
    description:
      "Dịch vụ đặt xe sân bay Nội Bài uy tín, giá rẻ trọn gói. Xe 4-7-16 chỗ đời mới đón trả 24/7.",
    images: ["/images/Brand.jpg"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "inoibai.vn",
      "description":
        "Dịch vụ đặt xe taxi đưa đón sân bay Nội Bài giá rẻ, uy tín 24/7",
      "publisher": {
        "@id": `${siteUrl}/#taxiservice`,
      },
      "inLanguage": "vi-VN",
    },
    {
      "@type": ["TaxiService", "LocalBusiness"],
      "@id": `${siteUrl}/#taxiservice`,
      "name": "inoibai.vn - Đặt xe sân bay Nội Bài",
      "alternateName": "Hoàng Khôi Limousine - Taxi Sân Bay Nội Bài",
      "image": `${siteUrl}/images/Brand.jpg`,
      "logo": `${siteUrl}/images/Brand.jpg`,
      "url": siteUrl,
      "telephone": "+84985791955",
      "email": "inoibai.vn@gmail.com",
      "priceRange": "200.000đ - 900.000đ",
      "currenciesAccepted": "VND",
      "paymentAccepted": "Tiền mặt, Chuyển khoản ngân hàng",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ngõ 35 Nguyễn An Ninh, Tương Mai",
        "addressLocality": "Hoàng Mai",
        "addressRegion": "Hà Nội",
        "postalCode": "100000",
        "addressCountry": "VN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 20.9983,
        "longitude": 105.8475,
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        "opens": "00:00",
        "closes": "23:59",
      },
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": "Hà Nội",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Sân bay Quốc tế Nội Bài",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Miền Bắc Việt Nam",
        },
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1028",
        "bestRating": "5",
        "worstRating": "1",
      },
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61557164784193",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Bảng giá cước xe sân bay Nội Bài",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 5 chỗ Hà Nội đi Nội Bài",
              "description": "Xe 5 chỗ đón tận nơi Hà Nội đi sân bay Nội Bài",
            },
            "price": "200000",
            "priceCurrency": "VND",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 7 chỗ Hà Nội đi Nội Bài",
              "description": "Xe 7 chỗ đón tận nơi Hà Nội đi sân bay Nội Bài",
            },
            "price": "250000",
            "priceCurrency": "VND",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 16 chỗ Hà Nội đi Nội Bài",
              "description": "Xe 16 chỗ đón tận nơi Hà Nội đi sân bay Nội Bài",
            },
            "price": "450000",
            "priceCurrency": "VND",
          },
        ],
      },
    },
  ],
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body
        className={`${inter.variable} ${inter.className} font-sans antialiased text-slate-900 bg-white`}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

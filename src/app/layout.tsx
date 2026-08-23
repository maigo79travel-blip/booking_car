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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inhatrang.vn";

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Đặt xe sân bay Cam Ranh – Taxi Nha Trang giá rẻ 24/7 - inhatrang.vn",
    template: "%s | inhatrang.vn",
  },
  description:
    "Dịch vụ đặt xe taxi đưa đón Sân bay Quốc tế Cam Ranh (CXR) về TP. Nha Trang và các resort Bãi Dài giá rẻ trọn gói chỉ từ 250k. Xe 5-7-16 chỗ đời mới đón trả 24/7. Hotline: 0928 015 280 - 0905 876 231",
  keywords: [
    "đặt xe sân bay cam ranh",
    "taxi sân bay cam ranh nha trang",
    "xe đưa đón sân bay cam ranh",
    "taxi nha trang giá rẻ",
    "thuê xe nha trang đi đà lạt",
    "inhatrang",
    "xe cam ranh về nha trang 250k",
    "xe 7 chỗ sân bay cam ranh",
    "xe 16 chỗ nha trang",
    "xe đưa đón resort bãi dài",
  ],
  authors: [{ name: "inhatrang.vn", url: siteUrl }],
  creator: "inhatrang.vn",
  publisher: "inhatrang.vn",
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
    title: "Đặt xe sân bay Cam Ranh – Taxi Nha Trang giá rẻ 24/7 - inhatrang.vn",
    description:
      "Dịch vụ đặt xe taxi đưa đón Sân bay Cam Ranh về TP. Nha Trang và các resort Bãi Dài giá rẻ trọn gói. Xe 5-7-16 chỗ đời mới đón trả tận nơi 24/7.",
    siteName: "inhatrang.vn",
    images: [
      {
        url: "/images/Brand.jpg",
        width: 1200,
        height: 630,
        alt: "inhatrang.vn - Đặt xe sân bay Cam Ranh Nha Trang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt xe sân bay Cam Ranh – Taxi Nha Trang giá rẻ 24/7 - inhatrang.vn",
    description:
      "Dịch vụ đặt xe đưa đón sân bay Cam Ranh về Nha Trang và tour du lịch Đà Lạt, Mũi Né uy tín, giá rẻ trọn gói.",
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
      "name": "inhatrang.vn",
      "description":
        "Dịch vụ đặt xe taxi đưa đón sân bay Cam Ranh về Nha Trang và tour du lịch giá rẻ, uy tín 24/7",
      "publisher": {
        "@id": `${siteUrl}/#taxiservice`,
      },
      "inLanguage": "vi-VN",
    },
    {
      "@type": ["TaxiService", "LocalBusiness"],
      "@id": `${siteUrl}/#taxiservice`,
      "name": "inhatrang.vn - Đặt xe sân bay Cam Ranh Nha Trang",
      "alternateName": "Taxi Sân Bay Cam Ranh - inhatrang.vn",
      "image": `${siteUrl}/images/Brand.jpg`,
      "logo": `${siteUrl}/images/Brand.jpg`,
      "url": siteUrl,
      "telephone": "+84928015280",
      "email": "inhatrang.vn@gmail.com",
      "priceRange": "250.000đ - 1.500.000đ",
      "currenciesAccepted": "VND",
      "paymentAccepted": "Tiền mặt, Chuyển khoản ngân hàng",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "28 Trần Phú, Phường Lộc Thọ",
        "addressLocality": "TP. Nha Trang",
        "addressRegion": "Khánh Hòa",
        "postalCode": "650000",
        "addressCountry": "VN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.2388,
        "longitude": 109.1967,
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
          "name": "Nha Trang",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Sân bay Quốc tế Cam Ranh",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Khánh Hòa",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Đà Lạt, Lâm Đồng",
        },
        {
          "@type": "AdministrativeArea",
          "name": "Mũi Né, Bình Thuận",
        },
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1",
      },
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61557164784193",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Bảng giá cước xe sân bay Cam Ranh Nha Trang",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 5 chỗ Sân bay Cam Ranh đi TP. Nha Trang",
              "description": "Xe 5 chỗ đón tận nơi sân bay Cam Ranh về khách sạn TP. Nha Trang",
            },
            "price": "250000",
            "priceCurrency": "VND",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 7 chỗ Sân bay Cam Ranh đi TP. Nha Trang",
              "description": "Xe 7 chỗ SUV đón tận nơi sân bay Cam Ranh về TP. Nha Trang",
            },
            "price": "300000",
            "priceCurrency": "VND",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Xe 16 chỗ Sân bay Cam Ranh đi TP. Nha Trang",
              "description": "Xe 16 chỗ Solati/Transit đón đoàn du lịch sân bay Cam Ranh đi Nha Trang",
            },
            "price": "550000",
            "priceCurrency": "VND",
          },
        ],
      },
    },
  ],
};

import { LanguageProvider } from "@/context/LanguageContext";
import { SiteContentProvider } from "@/context/SiteContentContext";

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
        <SiteContentProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}

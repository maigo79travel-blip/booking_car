"use client";

import React from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const FloatingContacts = () => {
  const { contact } = useSiteContent();

  const phone1 = contact.hotline || "0928015280";
  const zaloNumber = contact.zalo || "0905876231";
  const zaloLink = zaloNumber.startsWith("http")
    ? zaloNumber
    : `https://zalo.me/${zaloNumber.replace(/[^0-9+]/g, "")}`;
  const telegramLink = contact.telegram || "https://t.me/maigo79_vn";

  const contacts = [
    {
      name: "Hotline 0928.015.280",
      icon: <Phone size={22} />,
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      link: `tel:${phone1.replace(/[^0-9+]/g, "")}`,
    },
    {
      name: "Zalo 0905.876.231",
      icon: <Image src="/images/zalo-lumina.png" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />,
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      link: zaloLink,
    },
    {
      name: "Telegram Hỗ Trợ",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-.1.74 6.69-2.9 8.08-3.48 3.85-1.61 4.65-1.89 5.17-1.9.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.14-.04.22z" />
        </svg>
      ),
      bgColor: "bg-sky-500",
      hoverColor: "hover:bg-sky-600",
      link: telegramLink,
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 md:gap-3">
      {contacts.map((c, index) => (
        <a
          key={index}
          href={c.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${index === 1 ? "bg-transparent hover:bg-transparent p-0" : `${c.bgColor} ${c.hoverColor} p-3 md:p-3.5`} text-white rounded-full shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center`}
          title={c.name}
          aria-label={c.name}
        >
          {c.icon}
        </a>
      ))}
    </div>
  );
};

export default FloatingContacts;

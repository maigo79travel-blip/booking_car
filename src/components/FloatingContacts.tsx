"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const FloatingContacts = () => {
  const { contact } = useSiteContent();
  const [showKakaoModal, setShowKakaoModal] = useState(false);

  const phoneNum = contact.hotline || "0878458885";
  const zaloNum = contact.zalo || "0878458885";
  const whatsappNum = contact.whatsapp || "0878458885";
  const fbLink =
    contact.facebook ||
    "https://www.facebook.com/share/1BhL4Qut3u/?mibextid=wwXIfr";
  const teleLink = contact.telegram || "https://t.me/maigo79_vn";

  const zaloUrl = zaloNum.startsWith("http")
    ? zaloNum
    : `https://zalo.me/${zaloNum.replace(/[^0-9+]/g, "")}`;

  const whatsappUrl = whatsappNum.startsWith("http")
    ? whatsappNum
    : `https://wa.me/${whatsappNum.replace(/[^0-9]/g, "").replace(/^0/, "84")}`;

  const contacts = [
    {
      name: "Gọi Hotline 0878.458.885",
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
          <Phone size={22} className="animate-pulse" />
        </div>
      ),
      link: `tel:${phoneNum.replace(/[^0-9+]/g, "")}`,
      isExternal: false,
    },
    {
      name: "Chat Zalo 0878.458.885",
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-white border border-blue-100 flex items-center justify-center p-0.5">
          <Image
            src="/icon/zalo.png"
            alt="Zalo maigo79.com"
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ),
      link: zaloUrl,
      isExternal: true,
    },
    {
      name: "WhatsApp 0878.458.885",
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-white border border-emerald-100 flex items-center justify-center p-0.5">
          <Image
            src="/icon/whatapp.png"
            alt="WhatsApp maigo79.com"
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ),
      link: whatsappUrl,
      isExternal: true,
    },
    {
      name: "KakaoTalk 0878.458.885",
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-[#FFE812] border border-amber-200 flex items-center justify-center p-1 cursor-pointer">
          <Image
            src="/icon/kakao.png"
            alt="KakaoTalk maigo79.com"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      ),
      onClick: () => setShowKakaoModal(true),
    },
    {
      name: "Facebook / Messenger",
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-white border border-blue-100 flex items-center justify-center p-0.5">
          <Image
            src="/icon/facebook.png"
            alt="Facebook maigo79.com"
            width={48}
            height={48}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      ),
      link: fbLink,
      isExternal: true,
    },
  ];

  return (
    <>
      <div className="fixed bottom-4 right-3 md:bottom-6 md:right-5 z-50 flex flex-col gap-2.5 items-center">
        {contacts.map((c, index) => {
          if (c.onClick) {
            return (
              <button
                key={index}
                type="button"
                onClick={c.onClick}
                title={c.name}
                aria-label={c.name}
                className="cursor-pointer focus:outline-none"
              >
                {c.icon}
              </button>
            );
          }

          return (
            <a
              key={index}
              href={c.link}
              target={c.isExternal ? "_blank" : undefined}
              rel={c.isExternal ? "noopener noreferrer" : undefined}
              title={c.name}
              aria-label={c.name}
              className="focus:outline-none"
            >
              {c.icon}
            </a>
          );
        })}
      </div>

      {/* KakaoTalk Modal */}
      {showKakaoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowKakaoModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowKakaoModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 bg-[#FFE812] rounded-full flex items-center justify-center mx-auto mb-3.5 p-2 shadow-xs">
              <Image
                src="/icon/kakao.png"
                alt="KakaoTalk"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Liên Hệ Qua KakaoTalk
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              카카오톡으로 문의 및 차량 예약이 가능합니다.
            </p>

            <div className="bg-amber-50/80 p-3.5 border border-amber-200 mb-4 text-left">
              <p className="text-xs text-gray-700 mb-1">
                <strong>ID / Phone:</strong>{" "}
                <span className="text-[#003366] font-bold text-base select-all">
                  0878458885
                </span>
              </p>
              <p className="text-xs text-gray-700">
                <strong>Hotline Quốc Tế:</strong>{" "}
                <span className="text-[#003366] font-bold select-all">
                  +84 878 458 885
                </span>
              </p>
            </div>

            <a
              href="tel:0878458885"
              className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Phone size={16} /> Gọi 0878.458.885
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContacts;

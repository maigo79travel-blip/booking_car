"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLanguage } from "@/context/LanguageContext";

const contactCopy = {
  vi: { call: "Gọi hotline", zalo: "Chat Zalo", close: "Đóng", kakao: "Liên hệ qua KakaoTalk", kakaoDesc: "Bạn có thể hỏi thông tin và đặt xe qua KakaoTalk.", international: "Hotline quốc tế", callNow: "Gọi" },
  en: { call: "Call hotline", zalo: "Chat on Zalo", close: "Close", kakao: "Contact via KakaoTalk", kakaoDesc: "You can ask questions and book a car through KakaoTalk.", international: "International hotline", callNow: "Call" },
  ko: { call: "전화 상담", zalo: "잘로 채팅", close: "닫기", kakao: "카카오톡 문의", kakaoDesc: "카카오톡으로 문의 및 차량 예약이 가능합니다.", international: "해외 고객센터", callNow: "전화" },
  ru: { call: "Позвонить", zalo: "Чат в Zalo", close: "Закрыть", kakao: "Связаться через KakaoTalk", kakaoDesc: "Задавайте вопросы и бронируйте автомобиль через KakaoTalk.", international: "Международная горячая линия", callNow: "Позвонить" },
  zh: { call: "拨打热线", zalo: "Zalo 聊天", close: "关闭", kakao: "通过 KakaoTalk 联系", kakaoDesc: "您可以通过 KakaoTalk 咨询和预订车辆。", international: "国际热线", callNow: "拨打" },
} as const;

const FloatingContacts = () => {
  const { contact } = useSiteContent();
  const { language } = useLanguage();
  const copy = contactCopy[language];
  const [showKakaoModal, setShowKakaoModal] = useState(false);

  const phoneNum = contact.hotline || "0878458885";
  const zaloNum = contact.zalo || "0878458885";
  const whatsappNum = contact.whatsapp || "0878458885";
  const fbLink =
    contact.facebook ||
    "https://www.facebook.com/share/1BhL4Qut3u/?mibextid=wwXIfr";

  const zaloUrl = zaloNum.startsWith("http")
    ? zaloNum
    : `https://zalo.me/${zaloNum.replace(/[^0-9+]/g, "")}`;

  const whatsappUrl = whatsappNum.startsWith("http")
    ? whatsappNum
    : `https://wa.me/${whatsappNum.replace(/[^0-9]/g, "").replace(/^0/, "84")}`;

  const contacts = [
    {
      name: `${copy.call} 0878.458.885`,
      icon: (
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
          <Phone size={22} className="animate-pulse" />
        </div>
      ),
      link: `tel:${phoneNum.replace(/[^0-9+]/g, "")}`,
      isExternal: false,
    },
    {
      name: `${copy.zalo} 0878.458.885`,
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
              aria-label={copy.close}
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
              {copy.kakao}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              {copy.kakaoDesc}
            </p>

            <div className="bg-amber-50/80 p-3.5 border border-amber-200 mb-4 text-left">
              <p className="text-xs text-gray-700 mb-1">
                <strong>ID / Phone:</strong>{" "}
                <span className="text-[#003366] font-bold text-base select-all">
                  0878458885
                </span>
              </p>
              <p className="text-xs text-gray-700">
                <strong>{copy.international}:</strong>{" "}
                <span className="text-[#003366] font-bold select-all">
                  +84 878 458 885
                </span>
              </p>
            </div>

            <a
              href="tel:0878458885"
              className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Phone size={16} /> {copy.callNow} 0878.458.885
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContacts;

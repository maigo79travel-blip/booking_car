"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  FileText,
  DollarSign,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
} from "lucide-react";

export type AdminTab = "dashboard" | "bookings" | "posts" | "routes" | "content";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookingsCount: number;
  postsCount: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  setIsOpen,
  bookingsCount,
  postsCount,
}: AdminSidebarProps) {
  const menuItems = [
    {
      group: "TỔNG QUAN",
      items: [
        {
          id: "dashboard" as AdminTab,
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: "QUẢN LÝ DỊCH VỤ",
      items: [
        {
          id: "bookings" as AdminTab,
          label: "Đơn đặt xe",
          href: "/admin/bookings",
          icon: Car,
          badge: bookingsCount > 0 ? bookingsCount : null,
          badgeColor: "bg-blue-500",
        },
        {
          id: "routes" as AdminTab,
          label: "Bảng giá tuyến xe",
          href: "/admin/routes",
          icon: DollarSign,
          badge: null,
        },
      ],
    },
    {
      group: "NỘI DUNG & SEO",
      items: [
        {
          id: "posts" as AdminTab,
          label: "Bài viết SEO",
          href: "/admin/posts",
          icon: FileText,
          badge: postsCount > 0 ? postsCount : null,
          badgeColor: "bg-green-500",
        },
        {
          id: "content" as AdminTab,
          label: "Cấu hình website",
          href: "/admin/content",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 bg-linear-to-r from-blue-600 to-indigo-700 flex items-center px-4 gap-3 text-white shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center font-bold text-base tracking-wider border border-white/30 shadow-inner">
            MG
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide flex items-center gap-1.5">
              maigo79<span className="text-blue-200 font-semibold text-xs px-1.5 py-0.5 rounded bg-white/20">Admin</span>
            </span>
            <span className="text-[11px] text-blue-100/80 font-normal">Quản trị hệ thống đặt xe</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={isActive ? "text-blue-600" : "text-gray-400"}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null ? (
                      <span
                        className={`text-[11px] font-semibold text-white px-2 py-0.5 rounded-full ${
                          item.badgeColor || "bg-blue-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        size={14}
                        className={`opacity-0 transition-opacity ${
                          isActive ? "opacity-100 text-blue-600" : ""
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Quick Actions Group */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <div className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              LIÊN KẾT NGOÀI
            </div>
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="text-gray-400" />
                <span>Xem Website khách</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom User / Logout Info */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/70">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-red-200 cursor-pointer shadow-xs"
          >
            <LogOut size={16} />
            <span>Đăng xuất hệ thống</span>
          </button>
          <div className="mt-2 text-center text-[11px] text-gray-400">
            maigo79.com Admin • Phiên bản 2.4.0
          </div>
        </div>
      </aside>
    </>
  );
}

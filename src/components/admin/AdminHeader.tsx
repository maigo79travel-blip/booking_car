"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import AdminProfileModal, { AdminProfile } from "./AdminProfileModal";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  pendingCount: number;
}

export default function AdminHeader({
  onToggleSidebar,
  onLogout,
  pendingCount,
}: AdminHeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>({
    email: "admin@maigo79.com",
    display_name: "Admin maigo79.com",
    phone: "0928015280",
    avatar_url: "",
  });

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setProfile(data);
          }
        }
      } catch {
        // fallback
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md flex items-center justify-between px-4 lg:px-6">
        {/* Left side: Hamburger & Search */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Search Box */}
          <div className="hidden sm:flex items-center bg-white/15 hover:bg-white/20 focus-within:bg-white focus-within:text-gray-800 transition-all rounded-lg px-3 py-1.5 w-60 md:w-80 border border-white/20">
            <Search size={16} className="mr-2 text-white/70 focus-within:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm cuốc xe, khách hàng..."
              className="bg-transparent outline-none text-xs md:text-sm text-white focus:text-gray-900 placeholder:text-white/60 focus:placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right side: Notification Bell & User profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
              aria-label="Thông báo"
            >
              <Bell size={19} />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-blue-700 shadow-sm animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 py-2 text-gray-800 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 font-semibold text-xs text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Thông báo đơn xe</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                      {pendingCount} mới
                    </span>
                  )}
                </div>
                <div className="p-3 text-xs text-gray-600 space-y-2">
                  <div className="p-2.5 bg-blue-50/70 rounded-md border border-blue-100">
                    <p className="font-semibold text-blue-900">🔔 Đơn đặt xe mới</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {pendingCount > 0
                        ? `Có ${pendingCount} chuyến xe mới đang chờ xác nhận từ hành khách.`
                        : "Hiện tại chưa có đơn xe nào mới."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/20"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center font-semibold text-xs text-white shadow-xs overflow-hidden relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight truncate max-w-35">
                  {profile.display_name}
                </span>
                <span className="text-[10px] text-green-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Online
                </span>
              </div>
              <ChevronDown size={14} className="text-white/70" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 text-gray-800 z-50 animate-in fade-in-50 zoom-in-95 duration-150 divide-y divide-slate-100">
                {/* User Info Header */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {profile.display_name}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {profile.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                  >
                    <User size={14} className="text-blue-600" />
                    <span>Thông tin cá nhân & Đổi mật khẩu</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Đăng xuất hệ thống</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Admin Profile & Password Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </>
  );
}

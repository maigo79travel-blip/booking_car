"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Mail,
  CheckSquare,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

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

  return (
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

      {/* Right side: Notifications & User profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell size={19} />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-blue-700 shadow-sm animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2 text-gray-800 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-wider">
                Thông báo hệ thống
              </div>
              <div className="p-3 text-xs text-gray-600 space-y-2">
                <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                  <p className="font-bold text-blue-900">🔔 Đơn xe mới</p>
                  <p className="text-gray-500 text-[11px]">
                    Có {pendingCount} đơn xe mới đang chờ xác nhận từ khách hàng.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mail Icon */}
        <button
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-white hidden sm:inline-flex cursor-pointer"
          aria-label="Tin nhắn"
        >
          <Mail size={19} />
          <span className="absolute top-1 right-1 bg-yellow-400 text-gray-900 text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-blue-700">
            2
          </span>
        </button>

        {/* Task Icon */}
        <button
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-white hidden sm:inline-flex cursor-pointer"
          aria-label="Tác vụ"
        >
          <CheckSquare size={19} />
          <span className="absolute top-1 right-1 bg-green-400 text-gray-900 text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-blue-700">
            3
          </span>
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-orange-400 to-amber-300 border-2 border-white flex items-center justify-center font-bold text-xs text-white shadow-sm">
              <User size={16} />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">Admin inhatrang</span>
              <span className="text-[10px] text-green-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <ChevronDown size={14} className="text-white/70" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 text-gray-800 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">Quản trị viên</p>
                <p className="text-[11px] text-gray-500 truncate">inhatrang.vn@gmail.com</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

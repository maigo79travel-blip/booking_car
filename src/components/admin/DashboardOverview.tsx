"use client";

import React, { useState } from "react";
import {
  Calendar,
  Car,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronDown,
  ArrowRight,
  Phone,
  Eye,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

export interface BookingOverviewItem {
  id?: string;
  customer_name?: string;
  phone_number?: string;
  from_location?: string;
  to_location?: string;
  way_type?: string;
  trip_date?: string;
  trip_time?: string;
  car_type?: string;
  estimated_price?: number | string;
  total_price?: number | string;
}

interface DashboardOverviewProps {
  bookings: BookingOverviewItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export default function DashboardOverview({
  bookings,
  onNavigateTab,
}: DashboardOverviewProps) {
  const [selectedRange, setSelectedRange] = useState("Tháng này");

  // Calculate real metrics from bookings
  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (Number(b.total_price) || 0),
    0
  );
  const totalBookings = bookings.length;
  const uniqueCustomers = new Set(bookings.map((b) => b.phone_number || b.customer_name)).size;
  const pendingRequests = bookings.slice(0, 10).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const topRoutes = [
    {
      name: "Sân bay Cam Ranh → TP. Nha Trang (5 chỗ)",
      count: "88/100 chuyến",
      percent: 88,
      color: "bg-orange-500",
    },
    {
      name: "TP. Nha Trang → Sân bay Cam Ranh (7 chỗ)",
      count: "72/100 chuyến",
      percent: 72,
      color: "bg-emerald-500",
    },
    {
      name: "Cam Ranh ⇄ Resort Bãi Dài (Alma, Vinpearl...)",
      count: "54/100 chuyến",
      percent: 54,
      color: "bg-rose-500",
    },
    {
      name: "Nha Trang ⇄ Đà Lạt (Lâm Đồng)",
      count: "41/100 chuyến",
      percent: 41,
      color: "bg-sky-500",
    },
    {
      name: "Nha Trang ⇄ Mũi Né / Phan Thiết",
      count: "29/100 chuyến",
      percent: 29,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Tổng quan hiệu suất đặt xe, doanh thu và lưu lượng truy cập maigo79.com
          </p>
        </div>
        <div className="text-xs font-medium text-gray-400">
          <span>Home</span> / <span className="text-blue-600 font-semibold">Dashboard</span>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Doanh thu tháng */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                DOANH THU DỰ KIẾN
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {totalRevenue > 0 ? formatCurrency(totalRevenue) : "45.800.000₫"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-4">
            <TrendingUp size={14} />
            <span>↑ 14.8%</span>
            <span className="text-gray-400 font-normal text-[11px]">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Tổng cuốc xe */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                TỔNG CUỐC XE
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {totalBookings > 0 ? `${totalBookings} chuyến` : "142 chuyến"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <Car size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-4">
            <TrendingUp size={14} />
            <span>↑ 12%</span>
            <span className="text-gray-400 font-normal text-[11px]">tăng trưởng đều đặn</span>
          </div>
        </div>

        {/* Card 3: Khách hàng mới */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                KHÁCH HÀNG MỚI
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {uniqueCustomers > 0 ? `${uniqueCustomers} khách` : "98 khách"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-4">
            <TrendingUp size={14} />
            <span>↑ 20.4%</span>
            <span className="text-gray-400 font-normal text-[11px]">khách quay lại 45%</span>
          </div>
        </div>

        {/* Card 4: Đơn chờ xử lý */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                ĐƠN ĐẶT MỚI
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {pendingRequests} đơn
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-4">
            <TrendingDown size={14} />
            <span>↓ 1.10%</span>
            <span className="text-gray-400 font-normal text-[11px]">thời gian phản hồi &lt; 3p</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart (65%) & Top Routes (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Monthly Recap Report Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base md:text-lg font-bold text-blue-950">
                Monthly Recap Report
              </h2>
              <p className="text-xs text-gray-400">
                Biểu đồ xu hướng doanh thu đặt xe 12 tháng qua
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Spline Area SVG Chart */}
          <div className="w-full h-64 md:h-72 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeDasharray="4 4" />

              {/* Area Fill */}
              <path
                d="M 0 170 C 40 160, 60 140, 90 140 C 130 140, 160 180, 190 130 C 230 70, 260 160, 290 120 C 330 80, 360 110, 400 70 C 440 30, 470 60, 500 20 L 500 190 L 0 190 Z"
                fill="url(#chartGradient)"
              />

              {/* Curve Line */}
              <path
                d="M 0 170 C 40 160, 60 140, 90 140 C 130 140, 160 180, 190 130 C 230 70, 260 160, 290 120 C 330 80, 360 110, 400 70 C 440 30, 470 60, 500 20"
                fill="none"
                stroke="#4338ca"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Point Nodes */}
              {[
                { cx: 90, cy: 140 },
                { cx: 190, cy: 130 },
                { cx: 290, cy: 120 },
                { cx: 400, cy: 70 },
                { cx: 500, cy: 20 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="5"
                  className="fill-white stroke-blue-700 stroke-3 transition-transform hover:scale-150"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-2 px-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
          </div>
        </div>

        {/* Right: Products Sold / Top Routes */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-blue-950">
                Top Tuyến Xe Chạy
              </h2>
              <div className="relative">
                <button
                  onClick={() =>
                    setSelectedRange((prev) =>
                      prev === "Tháng này" ? "Hôm nay" : prev === "Hôm nay" ? "Năm nay" : "Tháng này"
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>{selectedRange}</span>
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {topRoutes.map((route, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700 truncate max-w-42.5" title={route.name}>
                      {route.name}
                    </span>
                    <span className="text-gray-400 text-[11px] font-mono">
                      {route.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${route.color} transition-all duration-700`}
                      style={{ width: `${route.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("routes")}
            className="mt-6 w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 border-t border-gray-100 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả bảng giá tuyến</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Bookings (Invoice Widget) */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Đơn Đặt Xe Gần Đây
            </h2>
            <p className="text-xs text-gray-500">
              Danh sách 10 khách hàng đặt xe sân bay & đường dài mới nhất
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("bookings")}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Xem Tất Cả</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 rounded-l-lg">Khách Hàng</th>
                <th className="py-3 px-3">Điện Thoại</th>
                <th className="py-3 px-3">Tuyến Đón Trả</th>
                <th className="py-3 px-3">Ngày Giờ Đi</th>
                <th className="py-3 px-3">Loại Xe</th>
                <th className="py-3 px-3">Giá Cước</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.slice(0, 8).map((b, idx) => (
                <tr key={b.id || idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {b.customer_name ? b.customer_name[0].toUpperCase() : "K"}
                    </div>
                    <span className="truncate max-w-30 font-medium">{b.customer_name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <a
                      href={`tel:${b.phone_number}`}
                      className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs"
                    >
                      <Phone size={12} />
                      {b.phone_number}
                    </a>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600 max-w-50">
                    <div className="font-medium text-gray-800 truncate">
                      {b.from_location} → {b.to_location}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {b.way_type === "two-way" ? "Hai chiều" : "Một chiều"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600 font-mono">
                    {b.trip_date} {b.trip_time}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-orange-50 text-orange-600 font-medium text-xs px-2.5 py-1 rounded-md border border-orange-100">
                      {b.car_type} chỗ
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-600 text-xs">
                    {Number(b.total_price).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigateTab("bookings")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                      title="Xem chi tiết"
                    >
                      <Eye size={14} />
                      <span>Chi tiết</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

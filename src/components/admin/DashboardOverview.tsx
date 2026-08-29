"use client";

import React, { useState } from "react";
import {
  Calendar,
  Car,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
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
  created_at?: string;
}

interface DashboardOverviewProps {
  bookings: BookingOverviewItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export default function DashboardOverview({
  bookings,
  onNavigateTab,
}: DashboardOverviewProps) {
  const [selectedRange, setSelectedRange] = useState<"Hôm nay" | "Tháng này" | "Năm nay">("Tháng này");
  const now = new Date();

  const dateForBooking = (booking: BookingOverviewItem) => {
    const date = booking.created_at ? new Date(booking.created_at) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  };

  const isInMonth = (booking: BookingOverviewItem, year: number, month: number) => {
    const date = dateForBooking(booking);
    return date?.getFullYear() === year && date.getMonth() === month;
  };

  const sumRevenue = (items: BookingOverviewItem[]) =>
    items.reduce((total, booking) => total + (Number(booking.total_price) || 0), 0);

  const percentChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  };

  const dashboardData = (() => {
    const currentMonthBookings = bookings.filter((booking) =>
      isInMonth(booking, now.getFullYear(), now.getMonth())
    );
    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthBookings = bookings.filter((booking) =>
      isInMonth(booking, previousMonthDate.getFullYear(), previousMonthDate.getMonth())
    );

    const currentRevenue = sumRevenue(currentMonthBookings);
    const previousRevenue = sumRevenue(previousMonthBookings);
    const currentCustomers = new Set(
      currentMonthBookings.map((booking) => booking.phone_number || booking.customer_name).filter(Boolean)
    ).size;
    const previousCustomers = new Set(
      previousMonthBookings.map((booking) => booking.phone_number || booking.customer_name).filter(Boolean)
    ).size;

    const rangeBookings = bookings.filter((booking) => {
      const date = dateForBooking(booking);
      if (!date) return false;
      if (selectedRange === "Hôm nay") return date.toDateString() === now.toDateString();
      if (selectedRange === "Năm nay") return date.getFullYear() === now.getFullYear();
      return isInMonth(booking, now.getFullYear(), now.getMonth());
    });

    const routeCounts = new Map<string, number>();
    rangeBookings.forEach((booking) => {
      const route = [booking.from_location, booking.to_location].filter(Boolean).join(" → ");
      if (route) routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
    });
    const maxRouteCount = Math.max(...routeCounts.values(), 1);
    const colors = ["bg-orange-500", "bg-emerald-500", "bg-rose-500", "bg-sky-500", "bg-purple-500"];
    const topRoutes = [...routeCounts.entries()]
      .sort(([, left], [, right]) => right - left)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count: `${count} chuyến`,
        percent: Math.round((count / maxRouteCount) * 100),
        color: colors[index],
      }));

    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
      const revenue = sumRevenue(
        bookings.filter((booking) => isInMonth(booking, date.getFullYear(), date.getMonth()))
      );
      return { label: `Thg ${date.getMonth() + 1}`, revenue };
    });

    return {
      currentMonthBookings,
      currentRevenue,
      currentCustomers,
      revenueChange: percentChange(currentRevenue, previousRevenue),
      bookingChange: percentChange(currentMonthBookings.length, previousMonthBookings.length),
      customerChange: percentChange(currentCustomers, previousCustomers),
      topRoutes,
      monthlyRevenue,
    };
  })();

  const chartMax = Math.max(...dashboardData.monthlyRevenue.map((item) => item.revenue), 1);
  const chartPoints = dashboardData.monthlyRevenue.map((item, index) => ({
    x: (index / Math.max(dashboardData.monthlyRevenue.length - 1, 1)) * 500,
    y: 180 - (item.revenue / chartMax) * 150,
  }));
  const chartLine = chartPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const chartArea = `${chartLine} L 500 190 L 0 190 Z`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const trend = (value: number) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
      <div className={`flex items-center gap-1.5 text-xs font-semibold mt-4 ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
        <Icon size={14} />
        <span>{isPositive ? "↑" : "↓"} {Math.abs(value)}%</span>
        <span className="text-gray-400 font-normal text-[11px]">so với tháng trước</span>
      </div>
    );
  };

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
                {formatCurrency(dashboardData.currentRevenue)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
              <Calendar size={20} />
            </div>
          </div>
          {trend(dashboardData.revenueChange)}
        </div>

        {/* Card 2: Tổng cuốc xe */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                TỔNG CUỐC XE
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {dashboardData.currentMonthBookings.length} chuyến
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <Car size={20} />
            </div>
          </div>
          {trend(dashboardData.bookingChange)}
        </div>

        {/* Card 3: Khách hàng mới */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                KHÁCH HÀNG MỚI
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {dashboardData.currentCustomers} khách
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs shrink-0">
              <Users size={20} />
            </div>
          </div>
          {trend(dashboardData.customerChange)}
        </div>

        {/* Card 4: Đơn chờ xử lý */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                ĐƠN ĐẶT MỚI
              </span>
              <span className="text-xl lg:text-2xl font-bold text-gray-800 mt-1 block">
                {dashboardData.currentMonthBookings.length} đơn
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-4">
            <span>Đơn được tạo trong tháng hiện tại</span>
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
                d={chartArea}
                fill="url(#chartGradient)"
              />

              {/* Curve Line */}
              <path
                d={chartLine}
                fill="none"
                stroke="#4338ca"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Point Nodes */}
              {chartPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-white stroke-blue-700 stroke-3 transition-transform hover:scale-150"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-2 px-1">
              {dashboardData.monthlyRevenue.filter((_, index) => index % 2 === 0).map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
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
                <select
                  aria-label="Khoảng thời gian thống kê tuyến xe"
                  value={selectedRange}
                  onChange={(event) => setSelectedRange(event.target.value as typeof selectedRange)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs cursor-pointer"
                >
                  <option value="Hôm nay">Hôm nay</option>
                  <option value="Tháng này">Tháng này</option>
                  <option value="Năm nay">Năm nay</option>
                </select>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {dashboardData.topRoutes.length > 0 ? dashboardData.topRoutes.map((route, i) => (
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
              )) : <p className="text-sm text-gray-400 py-8 text-center">Chưa có dữ liệu đặt xe trong khoảng thời gian này.</p>}
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

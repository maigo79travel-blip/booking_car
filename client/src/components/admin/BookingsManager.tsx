"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  MapPin,
  RefreshCw,
  Download,
} from "lucide-react";

export interface BookingRecord {
  id?: string;
  customer_name?: string;
  phone_number?: string;
  from_location?: string;
  to_location?: string;
  car_type?: string;
  way_type?: string;
  trip_date?: string;
  trip_time?: string;
  estimated_price?: number | string;
  total_price?: number | string;
  notes?: string;
  created_at?: string;
}

interface BookingsManagerProps {
  bookings: BookingRecord[];
  onRefresh: () => void;
}

export default function BookingsManager({
  bookings,
  onRefresh,
}: BookingsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCar, setFilterCar] = useState("all");
  const [filterWay, setFilterWay] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone_number || "").includes(searchTerm) ||
      (b.from_location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.to_location || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCar = filterCar === "all" || b.car_type === filterCar;
    const matchesWay = filterWay === "all" || b.way_type === filterWay;

    return matchesSearch && matchesCar && matchesWay;
  });

  const exportCSV = () => {
    const headers = ["ID", "Khách hàng", "Số điện thoại", "Điểm đón", "Điểm đến", "Loại xe", "Loại vé", "Ngày đi", "Giờ", "Giá cước"];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customer_name || ""}"`,
      `"${b.phone_number || ""}"`,
      `"${b.from_location || ""}"`,
      `"${b.to_location || ""}"`,
      `${b.car_type} chỗ`,
      b.way_type === "two-way" ? "Hai chiều" : "Một chiều",
      b.trip_date || "",
      b.trip_time || "",
      b.total_price || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_sach_dat_xe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Đơn Đặt Xe ({bookings.length})
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Theo dõi, liên hệ và điều phối xe cho khách hàng theo thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer bg-white shadow-xs"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Xuất file Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, điểm đón/đến..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-xs md:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterCar}
            onChange={(e) => setFilterCar(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium text-gray-700 outline-none bg-white flex-1 md:flex-initial"
          >
            <option value="all">Tất cả loại xe</option>
            <option value="5">Xe 5 chỗ</option>
            <option value="7">Xe 7 chỗ</option>
            <option value="16">Xe 16 chỗ</option>
          </select>

          <select
            value={filterWay}
            onChange={(e) => setFilterWay(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium text-gray-700 outline-none bg-white flex-1 md:flex-initial"
          >
            <option value="all">Tất cả loại vé</option>
            <option value="one-way">Một chiều</option>
            <option value="two-way">Hai chiều</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-3">Điện Thoại</th>
                <th className="py-3.5 px-4">Lộ Trình Đón & Trả</th>
                <th className="py-3.5 px-3">Thời Gian Đón</th>
                <th className="py-3.5 px-3">Loại Xe</th>
                <th className="py-3.5 px-3">Giá Cước</th>
                <th className="py-3.5 px-4 text-right">Gọi Điện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b, idx) => (
                  <tr
                    key={b.id || idx}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {b.customer_name ? b.customer_name[0].toUpperCase() : "K"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {b.customer_name}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {b.id ? `ID: ${b.id.slice(0, 8)}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <a
                        href={`tel:${b.phone_number}`}
                        className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md text-xs"
                      >
                        <Phone size={12} />
                        {b.phone_number}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1 font-medium text-gray-800">
                        <MapPin size={13} className="text-orange-500 shrink-0" />
                        <span className="truncate max-w-60">{b.from_location}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-gray-600 mt-1">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        <span className="truncate max-w-60">{b.to_location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-gray-700 font-mono">
                      <div className="font-semibold text-gray-900">{b.trip_date}</div>
                      <div className="text-[11px] text-gray-400">{b.trip_time}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-orange-50 text-orange-600 font-medium text-xs px-2.5 py-1 rounded-md border border-orange-100 whitespace-nowrap">
                        {b.car_type} chỗ
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {b.way_type === "two-way" ? "Hai chiều" : "Một chiều"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-600 text-sm">
                      {Number(b.total_price || 0).toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`tel:${b.phone_number}`}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md text-xs transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Phone size={13} />
                        <span>Gọi ngay</span>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy cuốc xe nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

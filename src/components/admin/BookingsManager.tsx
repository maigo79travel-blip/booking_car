"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Car,
  Calendar,
  X,
  Loader2,
  DollarSign,
  FileText,
  AlertCircle,
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
  note?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface BookingsManagerProps {
  bookings: BookingRecord[];
  onRefresh: () => void;
  onSaveBooking?: (id: string, data: Record<string, unknown>) => Promise<void>;
  onDeleteBooking?: (id: string) => Promise<void>;
}

export default function BookingsManager({
  bookings,
  onRefresh,
  onSaveBooking,
  onDeleteBooking,
}: BookingsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCar, setFilterCar] = useState("all");
  const [filterWay, setFilterWay] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone_number || "").includes(searchTerm) ||
      (b.from_location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.to_location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCar = filterCar === "all" || b.car_type === filterCar || `${b.car_type} chỗ` === filterCar;
    const matchesWay = filterWay === "all" || b.way_type === filterWay;
    const isCompleted = b.status === "completed";
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && isCompleted) ||
      (filterStatus === "pending" && !isCompleted);

    return matchesSearch && matchesCar && matchesWay && matchesStatus;
  });

  // Toggle Complete Status directly from the table row
  const handleToggleComplete = async (b: BookingRecord) => {
    if (!b.id || !onSaveBooking) return;
    setTogglingId(b.id);
    const newStatus = b.status === "completed" ? "pending" : "completed";
    try {
      await onSaveBooking(b.id, { status: newStatus });
    } catch (err) {
      alert("Không thể cập nhật trạng thái: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTogglingId(null);
    }
  };

  // Save Booking from Edit Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || !editingBooking.id || !onSaveBooking) return;

    setIsSaving(true);
    try {
      await onSaveBooking(editingBooking.id, {
        customer_name: editingBooking.customer_name,
        phone_number: editingBooking.phone_number,
        from_location: editingBooking.from_location,
        to_location: editingBooking.to_location,
        car_type: editingBooking.car_type,
        way_type: editingBooking.way_type,
        trip_date: editingBooking.trip_date,
        trip_time: editingBooking.trip_time,
        total_price: Number(editingBooking.total_price || 0),
        status: editingBooking.status || "pending",
        note: editingBooking.note || editingBooking.notes || "",
      });
      setEditingBooking(null);
    } catch (err) {
      alert("Lỗi khi lưu đơn: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Booking
  const handleDelete = async (b: BookingRecord) => {
    if (!b.id || !onDeleteBooking) return;
    const confirm = window.confirm(`Bạn có chắc chắn muốn xóa đơn đặt xe của khách "${b.customer_name}" không?`);
    if (!confirm) return;

    try {
      await onDeleteBooking(b.id);
    } catch (err) {
      alert("Lỗi khi xóa: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "ID",
      "Khách hàng",
      "Số điện thoại",
      "Điểm đón",
      "Điểm đến",
      "Loại xe",
      "Loại vé",
      "Ngày đi",
      "Giờ đón",
      "Giá cước (VNĐ)",
      "Trạng thái",
      "Ghi chú",
      "Thời gian tạo",
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customer_name || ""}"`,
      `"${b.phone_number || ""}"`,
      `"${b.from_location || ""}"`,
      `"${b.to_location || ""}"`,
      `"${b.car_type || ""}"`,
      b.way_type === "two-way" ? "Hai chiều" : "Một chiều",
      b.trip_date || "",
      b.trip_time || "",
      b.total_price || 0,
      b.status === "completed" ? "Đã trả khách (Hoàn thành)" : "Chưa hoàn thành",
      `"${b.note || b.notes || ""}"`,
      b.created_at || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_sach_don_xe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const pendingCount = bookings.length - completedCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Quản Lý Đơn Đặt Xe
            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {bookings.length} đơn
            </span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Theo dõi, chỉnh sửa toàn bộ thông tin và đánh dấu hoàn thành khi đã trả khách
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
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Status Stats Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Tổng cuốc xe</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{bookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Car size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-700 uppercase">Chưa hoàn thành</p>
            <p className="text-xl font-bold text-amber-900 mt-0.5">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-700 uppercase">Đã trả khách (Hoàn thành)</p>
            <p className="text-xl font-bold text-emerald-900 mt-0.5">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, điểm đón, điểm đến..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-xs md:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium text-gray-700 outline-none bg-white flex-1 md:flex-initial"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Chưa hoàn thành</option>
            <option value="completed">✅ Đã trả khách (Hoàn thành)</option>
          </select>

          {/* Filter Car */}
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

          {/* Filter Way */}
          <select
            value={filterWay}
            onChange={(e) => setFilterWay(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium text-gray-700 outline-none bg-white flex-1 md:flex-initial"
          >
            <option value="all">Tất cả loại chuyến</option>
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
                <th className="py-3.5 px-3 text-center">Trạng Thái / Trả Khách</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b, idx) => {
                  const isCompleted = b.status === "completed";
                  const isToggling = togglingId === b.id;

                  return (
                    <tr
                      key={b.id || idx}
                      className={`hover:bg-blue-50/30 transition-colors group ${
                        isCompleted ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-4 text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {b.customer_name ? b.customer_name[0].toUpperCase() : "K"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                              <span>{b.customer_name}</span>
                              {isCompleted && (
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Đã hoàn thành" />
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {b.id ? `ID: ${b.id.slice(0, 8)}` : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3">
                        <a
                          href={`tel:${b.phone_number}`}
                          className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md text-xs whitespace-nowrap"
                        >
                          <Phone size={12} />
                          {b.phone_number}
                        </a>
                      </td>

                      {/* Route Locations */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-1 font-medium text-gray-800">
                          <MapPin size={13} className="text-orange-500 shrink-0" />
                          <span className="truncate max-w-55" title={b.from_location}>
                            {b.from_location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-gray-600 mt-1">
                          <MapPin size={13} className="text-red-500 shrink-0" />
                          <span className="truncate max-w-55" title={b.to_location}>
                            {b.to_location}
                          </span>
                        </div>
                        {(b.note || b.notes) && (
                          <div className="mt-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 truncate max-w-55" title={b.note || b.notes}>
                            📝 {b.note || b.notes}
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-3 text-xs text-gray-700 font-mono">
                        <div className="font-semibold text-gray-900">{b.trip_date}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Clock size={11} />
                          {b.trip_time}
                        </div>
                      </td>

                      {/* Car Type & Way */}
                      <td className="py-3.5 px-3">
                        <span className="bg-orange-50 text-orange-600 font-medium text-xs px-2 py-0.5 rounded-md border border-orange-100 whitespace-nowrap">
                          {b.car_type?.includes("chỗ") ? b.car_type : `${b.car_type} chỗ`}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {b.way_type === "two-way" ? "Hai chiều" : "Một chiều"}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 px-3 font-semibold text-emerald-600 text-sm whitespace-nowrap">
                        {Number(b.total_price || 0).toLocaleString("vi-VN")}đ
                      </td>

                      {/* Status / Quick "Hoàn Thành" Button */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleComplete(b)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                              : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200 hover:scale-102"
                          }`}
                          title={isCompleted ? "Bấm để chuyển lại về Chưa hoàn thành" : "Bấm khi lái xe đã hoàn thành trả khách"}
                        >
                          {isToggling ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          <span>{isCompleted ? "Đã trả khách" : "Hoàn thành"}</span>
                        </button>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit button */}
                          <button
                            onClick={() => setEditingBooking({ ...b })}
                            className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                            title="Chỉnh sửa toàn bộ thông tin đơn"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(b)}
                            className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Xóa đơn đặt xe"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy cuốc xe nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Edit2 size={18} className="text-blue-600" />
                  Chỉnh Sửa Toàn Bộ Đơn Đặt Xe
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: <span className="font-mono text-gray-700">{editingBooking.id}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="mt-4 space-y-4">
              {/* Row 1: Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và Tên Khách Hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBooking.customer_name || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        customer_name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số Điện Thoại Liên Hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBooking.phone_number || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        phone_number: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Ví dụ: 0928015280"
                  />
                </div>
              </div>

              {/* Row 2: Pickup Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Điểm Đón <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-2.5 text-orange-500" />
                  <input
                    type="text"
                    required
                    value={editingBooking.from_location || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        from_location: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Ví dụ: Sân bay Cam Ranh (CXR)"
                  />
                </div>
              </div>

              {/* Row 3: Drop-off Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Điểm Đến / Trả Khách <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-2.5 text-red-500" />
                  <input
                    type="text"
                    required
                    value={editingBooking.to_location || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        to_location: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Ví dụ: Khách sạn Sheraton, 28 Trần Phú, Nha Trang"
                  />
                </div>
              </div>

              {/* Row 4: Car Type, Way Type, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Loại Xe
                  </label>
                  <select
                    value={editingBooking.car_type || "5 chỗ"}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        car_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="5 chỗ">Xe 5 chỗ Sedan</option>
                    <option value="7 chỗ">Xe 7 chỗ SUV / MPV</option>
                    <option value="16 chỗ">Xe 16 chỗ Solati / Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Loại Vé
                  </label>
                  <select
                    value={editingBooking.way_type || "one-way"}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        way_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="one-way">Một chiều</option>
                    <option value="two-way">Hai chiều (Khứ hồi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tổng Cước (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3 top-2.5 text-emerald-600" />
                    <input
                      type="number"
                      required
                      step="10000"
                      value={editingBooking.total_price ?? 0}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          total_price: Number(e.target.value),
                        })
                      }
                      className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none font-semibold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Date, Time & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày Đón (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    required
                    value={editingBooking.trip_date || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        trip_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giờ Đón (HH:mm)
                  </label>
                  <input
                    type="time"
                    required
                    value={editingBooking.trip_time || ""}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        trip_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Trạng Thái Đơn
                  </label>
                  <select
                    value={editingBooking.status || "pending"}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        status: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none ${
                      editingBooking.status === "completed"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    <option value="pending">⏳ Chưa hoàn thành</option>
                    <option value="completed">✅ Đã trả khách (Hoàn thành)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Note / Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi Chú Đơn Hàng / Mã Chuyến Bay
                </label>
                <textarea
                  rows={2}
                  value={editingBooking.note || editingBooking.notes || ""}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      note: e.target.value,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 outline-none"
                  placeholder="Ví dụ: Chuyến bay VJ123 hạ cánh 10:15, khách cần ghế trẻ em..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu Thay Đổi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

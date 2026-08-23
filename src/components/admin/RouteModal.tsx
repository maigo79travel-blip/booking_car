"use client";

import React, { useState } from "react";
import { X, Save, DollarSign, MapPin } from "lucide-react";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";

interface RouteModalProps {
  route: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function RouteModal({
  route,
  onClose,
  onSave,
}: RouteModalProps) {
  const isEditing = !!route?.id;
  const [activeLang, setActiveLang] = useState<Language>("vi");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [vehicleType, setVehicleType] = useState(route?.vehicle_type || "5");
  const [tripType, setTripType] = useState(route?.trip_type || "one_way");
  const [price, setPrice] = useState(route?.price ? String(route.price) : "200000");
  const [sortOrder, setSortOrder] = useState(route?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(route?.is_active ?? true);

  // Localized fields
  const [origin, setOrigin] = useState<Record<string, string>>(
    typeof route?.origin === "object" && route?.origin ? route.origin : { vi: String(route?.origin || "Hà Nội") }
  );
  const [destination, setDestination] = useState<Record<string, string>>(
    typeof route?.destination === "object" && route?.destination ? route.destination : { vi: String(route?.destination || "Sân bay Nội Bài") }
  );

  const handleOriginChange = (val: string) => {
    setOrigin((prev) => ({ ...prev, [activeLang]: val }));
  };

  const handleDestinationChange = (val: string) => {
    setDestination((prev) => ({ ...prev, [activeLang]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      alert("Vui lòng nhập giá cước hợp lệ!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        origin,
        destination,
        vehicle_type: vehicleType,
        trip_type: tripType,
        price: Number(price),
        sort_order: Number(sortOrder),
        is_active: isActive,
        currency: "VND",
      };

      await onSave(payload);
    } catch (err: any) {
      alert(`Lỗi khi lưu tuyến xe: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-6 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <DollarSign size={22} className="text-orange-300" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {isEditing ? "Chỉnh sửa tuyến giá cước" : "Thêm tuyến xe mới"}
              </h2>
              <p className="text-xs text-blue-100">
                Cấu hình giá xe đưa đón sân bay và liên tỉnh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 p-1 rounded-lg cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Language selector for Origin & Destination */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ngôn ngữ nhập tuyến
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name}
              </span>
            </div>
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLang === lang.code
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-transparent text-gray-600 hover:bg-white/60"
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Route Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Điểm đi ({activeLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={origin[activeLang] || ""}
                onChange={(e) => handleOriginChange(e.target.value)}
                placeholder="VD: Hà Nội"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Điểm đến ({activeLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={destination[activeLang] || ""}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="VD: Sân bay Nội Bài"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          {/* Vehicle type, trip type, price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Loại xe
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none bg-white font-semibold"
              >
                <option value="5">Xe 5 chỗ</option>
                <option value="7">Xe 7 chỗ</option>
                <option value="16">Xe 16 chỗ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Loại chuyến
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none bg-white font-semibold"
              >
                <option value="one_way">Một chiều</option>
                <option value="round_trip">Hai chiều</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Giá cước (VND) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="10000"
                min="0"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-bold text-orange-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Kích hoạt
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isActive ? "✓ Đang hiển thị" : "Tạm ẩn"}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>{isSaving ? "Đang lưu..." : "Lưu tuyến xe"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

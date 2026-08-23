"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, MapPin } from "lucide-react";
import RouteModal, { RouteRecord } from "./RouteModal";

interface RoutesManagerProps {
  routes: RouteRecord[];
  onSaveRoute: (id: string | null, data: Record<string, unknown>) => Promise<void>;
  onDeleteRoute: (id: string) => Promise<void>;
}

export default function RoutesManager({
  routes,
  onSaveRoute,
  onDeleteRoute,
}: RoutesManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [editingRoute, setEditingRoute] = useState<RouteRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getLabel = (val: Record<string, string> | string | undefined) => {
    if (typeof val === "object" && val) {
      return (val as Record<string, string>).vi || (val as Record<string, string>).en || Object.values(val)[0] || "";
    }
    return String(val || "");
  };

  const filteredRoutes = routes.filter((r) => {
    const originText = getLabel(r.origin).toLowerCase();
    const destText = getLabel(r.destination).toLowerCase();
    const matchesSearch =
      originText.includes(searchTerm.toLowerCase()) ||
      destText.includes(searchTerm.toLowerCase());

    const matchesVehicle =
      vehicleFilter === "all" || String(r.vehicle_type) === vehicleFilter;

    return matchesSearch && matchesVehicle;
  });

  const handleSave = async (data: Record<string, unknown>) => {
    await onSaveRoute(editingRoute?.id || null, data);
    setEditingRoute(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string | undefined, nameStr: string) => {
    if (!id) return;
    if (confirm(`Bạn có chắc chắn muốn xóa tuyến "${nameStr}" không?`)) {
      await onDeleteRoute(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Quản Lý Bảng Giá Tuyến Xe ({routes.length})
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Cấu hình giá cước các tuyến xe sân bay Cam Ranh và các tuyến liên tỉnh
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-md text-xs md:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm Tuyến Xe Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo điểm đi hoặc điểm đến..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-xs md:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 outline-none bg-white"
          >
            <option value="all">Tất cả loại xe</option>
            <option value="5">Xe 5 chỗ</option>
            <option value="7">Xe 7 chỗ</option>
            <option value="16">Xe 16 chỗ</option>
          </select>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-4">Tuyến Đường</th>
                <th className="py-3.5 px-3">Loại Xe</th>
                <th className="py-3.5 px-3">Loại Chuyến</th>
                <th className="py-3.5 px-3">Giá Cước Niêm Yết</th>
                <th className="py-3.5 px-3">Thứ Tự</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((r) => {
                  const originStr = getLabel(r.origin);
                  const destStr = getLabel(r.destination);
                  const routeName = `${originStr} → ${destStr}`;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-orange-500 shrink-0" />
                          <span>{routeName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-md border border-blue-100 whitespace-nowrap">
                          {r.vehicle_type} chỗ
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-gray-600">
                        {r.trip_type === "round_trip" ? "Hai chiều" : "Một chiều"}
                      </td>

                      <td className="py-3.5 px-3 font-extrabold text-emerald-600 text-sm">
                        {Number(r.price || 0).toLocaleString("vi-VN")}đ
                      </td>

                      <td className="py-3.5 px-3 text-xs font-mono text-gray-500">
                        {r.sort_order ?? 0}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            r.is_active !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.is_active !== false ? "✓ Hiển thị" : "Ẩn"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingRoute(r)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Sửa giá tuyến"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id, routeName)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa tuyến"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có tuyến xe nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editor */}
      {(isCreating || editingRoute) && (
        <RouteModal
          route={editingRoute}
          onClose={() => {
            setIsCreating(false);
            setEditingRoute(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

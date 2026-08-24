"use client";

import React, { useState } from "react";
import { X, User, Key, Save, Check, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";

export interface AdminProfile {
  id?: string;
  email: string;
  display_name: string;
  phone: string;
  avatar_url: string;
}

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: AdminProfile;
  onProfileUpdated: (updated: AdminProfile) => void;
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  initialProfile,
  onProfileUpdated,
}: AdminProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          new_email: profile.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Cập nhật thông tin thất bại");
      }

      setSuccessMsg("Cập nhật thông tin tài khoản thành công!");
      onProfileUpdated(data.profile || profile);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }

      setSuccessMsg("Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Tài Khoản Quản Trị Viên
              </h3>
              <p className="text-xs text-slate-500">
                Thay đổi thông tin cá nhân & Tạo lại mật khẩu đăng nhập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("info");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User size={15} />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "password"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Key size={15} />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Feedback messages */}
        <div className="px-6 pt-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Info Form */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveInfo} className="p-6 space-y-4">
            {/* Avatar upload */}
            <div>
              <ImageUploadField
                label="Ảnh đại diện (Avatar)"
                value={profile.avatar_url}
                onChange={(url) => setProfile({ ...profile, avatar_url: url })}
                folder="maigo79/admin-avatars"
                helperText="Ảnh hiển thị ở góc trên cùng của thanh Admin"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hiển thị
              </label>
              <input
                type="text"
                required
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                placeholder="Ví dụ: Admin maigo79.com"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                  placeholder="admin@maigo79.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                  placeholder="0928015280"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving ? "Đang lưu..." : "Lưu Thông Tin"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Password Form */}
        {activeTab === "password" && (
          <form onSubmit={handleSavePassword} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                placeholder="Nhập mật khẩu đang sử dụng"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu mới (Tối thiểu 6 ký tự)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Xác nhận lại mật khẩu mới
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                placeholder="Nhập lại mật khẩu mới để xác nhận"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                <span>{isSaving ? "Đang đổi..." : "Cập Nhật Mật Khẩu"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

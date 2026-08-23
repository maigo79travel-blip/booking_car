"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Link as LinkIcon } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "maigo79",
  placeholder = "https://res.cloudinary.com/... hoặc /images/...",
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh (PNG, JPG, WEBP, JPEG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Dung lượng ảnh tối đa là 10MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Tải ảnh thất bại");
      }

      onChange(data.url);
      if (data.warning) {
        console.warn(data.warning);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể tải ảnh lên";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-extrabold text-slate-800">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tải ảnh lên
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer ${
              mode === "url"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Nhập URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
              isUploading
                ? "bg-blue-50/50 border-blue-300"
                : "bg-slate-50 hover:bg-blue-50/30 border-slate-300 hover:border-blue-500"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-xs font-bold">Đang tải ảnh lên Cloudinary...</span>
              </div>
            ) : value ? (
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-16 rounded-md overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  <Image
                    src={value}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {value.startsWith("data:") ? "Ảnh tải lên thành công" : value}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nhấp vào đây để đổi ảnh khác hoặc kéo thả ảnh mới
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3 gap-1 text-slate-500">
                <UploadCloud size={24} className="text-blue-500" />
                <p className="text-xs font-bold text-slate-700">
                  Kéo thả ảnh hoặc <span className="text-blue-600 underline">duyệt từ máy tính</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Hỗ trợ PNG, JPG, WEBP, SVG (tối đa 10MB)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <LinkIcon size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white"
            />
          </div>

          {value && (
            <div className="relative w-28 h-20 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-500 font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
}

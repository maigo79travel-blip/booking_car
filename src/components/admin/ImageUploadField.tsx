"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  imageHeight?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "maigo79",
  helperText,
  className = "",
  imageHeight = "h-28 sm:h-32",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
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
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="border border-dashed border-blue-300 bg-blue-50/50 p-6 text-center flex flex-col items-center justify-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" size={22} />
            <span className="text-xs font-bold">Đang tải ảnh lên Cloudinary...</span>
          </div>
        ) : value ? (
          <div className="space-y-1.5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full ${imageHeight} bg-slate-100/80 overflow-hidden flex items-center justify-center group cursor-pointer border border-slate-200/80 hover:border-blue-400 transition-colors`}
            >
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-contain p-1.5 group-hover:scale-105 transition-transform"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                <UploadCloud size={15} />
                <span>Đổi ảnh</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10px] text-slate-400 truncate flex-1" title={value}>
                {value.startsWith("data:") ? "Ảnh vừa tải lên" : value.split("/").pop()}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Đổi ảnh
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Xóa ảnh"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-400 p-4 text-center cursor-pointer transition-all"
          >
            <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
              <UploadCloud size={20} className="text-blue-500" />
              <p className="text-xs font-semibold text-slate-700">
                Tải ảnh lên hoặc <span className="text-blue-600 underline">chọn từ máy</span>
              </p>
              <p className="text-[10px] text-slate-400">
                PNG, JPG, WEBP (tối đa 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      )}

      {helperText && (
        <p className="text-[10px] text-slate-400 font-normal">
          {helperText}
        </p>
      )}
    </div>
  );
}

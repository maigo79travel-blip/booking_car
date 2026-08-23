"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";
import { X, Save, Image as ImageIcon, Globe, FileText, CheckCircle } from "lucide-react";

interface PostModalProps {
  post: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function PostModal({ post, onClose, onSave }: PostModalProps) {
  const isEditing = !!post?.id;
  const [activeLang, setActiveLang] = useState<Language>("vi");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [slug, setSlug] = useState(post?.slug || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [status, setStatus] = useState<"published" | "draft">(
    post?.status || "published"
  );
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at
      ? new Date(post.published_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  // Localized fields state
  const [title, setTitle] = useState<Record<string, string>>(post?.title || {});
  const [seoTitle, setSeoTitle] = useState<Record<string, string>>(
    post?.seo_title || {}
  );
  const [excerpt, setExcerpt] = useState<Record<string, string>>(
    post?.excerpt || {}
  );
  const [seoDescription, setSeoDescription] = useState<Record<string, string>>(
    post?.seo_description || {}
  );
  const [body, setBody] = useState<Record<string, string>>(post?.body || {});

  const handleTextChange = (
    field: "title" | "seoTitle" | "excerpt" | "seoDescription" | "body",
    val: string
  ) => {
    if (field === "title") {
      setTitle((prev) => ({ ...prev, [activeLang]: val }));
      if (activeLang === "vi" && !slug && !isEditing) {
        // Auto-generate slug from Vietnamese title
        const autoSlug = val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        setSlug(autoSlug);
      }
    }
    if (field === "seoTitle") setSeoTitle((prev) => ({ ...prev, [activeLang]: val }));
    if (field === "excerpt") setExcerpt((prev) => ({ ...prev, [activeLang]: val }));
    if (field === "seoDescription") setSeoDescription((prev) => ({ ...prev, [activeLang]: val }));
    if (field === "body") setBody((prev) => ({ ...prev, [activeLang]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      alert("Vui lòng nhập đường dẫn tĩnh (Slug) cho bài viết!");
      return;
    }
    if (!title.vi && !title.en) {
      alert("Vui lòng nhập tiêu đề bài viết (ít nhất Tiếng Việt hoặc Tiếng Anh)!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        slug: slug.trim(),
        cover_image: coverImage.trim() || null,
        status,
        published_at: status === "published" ? new Date(publishedAt).toISOString() : null,
        title,
        seo_title: seoTitle,
        excerpt,
        seo_description: seoDescription,
        body,
      };

      await onSave(payload);
    } catch (err: any) {
      alert(`Lỗi khi lưu bài viết: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-6 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <FileText size={22} className="text-orange-300" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {isEditing ? "Chỉnh sửa bài viết SEO" : "Thêm bài viết mới"}
              </h2>
              <p className="text-xs text-blue-100">
                Soạn thảo nội dung và tối ưu thẻ meta SEO theo 5 ngôn ngữ
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Đường dẫn tĩnh (Slug) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kinh-nghiem-dat-xe-san-bay"
                required
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Trạng thái bài viết
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    status === "published"
                      ? "bg-green-600 text-white shadow-xs"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ✓ Công khai (Published)
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    status === "draft"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Bản nháp (Draft)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Link ảnh bìa (Cover Image URL)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/images/Hero2.jpg hoặc https://..."
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Ngày xuất bản
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Language Switcher Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Globe size={14} className="text-blue-600" />
                Nội dung theo ngôn ngữ
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                Đang soạn thảo: {SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-xl">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLang === lang.code
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white/60"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {title[lang.code] && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Localized Content Inputs */}
          <div className="space-y-4 p-4 border border-blue-100 rounded-2xl bg-blue-50/20">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Tiêu đề bài viết ({activeLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={title[activeLang] || ""}
                onChange={(e) => handleTextChange("title", e.target.value)}
                placeholder={`Nhập tiêu đề bằng ${SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name}...`}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500 font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Tóm tắt ngắn (Excerpt)
              </label>
              <textarea
                rows={2}
                value={excerpt[activeLang] || ""}
                onChange={(e) => handleTextChange("excerpt", e.target.value)}
                placeholder="Mô tả ngắn hiển thị trên danh sách bài viết..."
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tiêu đề SEO (SEO Title)
                </label>
                <input
                  type="text"
                  value={seoTitle[activeLang] || ""}
                  onChange={(e) => handleTextChange("seoTitle", e.target.value)}
                  placeholder="Tiêu đề hiển thị trên Google..."
                  className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mô tả SEO (Meta Description)
                </label>
                <input
                  type="text"
                  value={seoDescription[activeLang] || ""}
                  onChange={(e) => handleTextChange("seoDescription", e.target.value)}
                  placeholder="Mô tả thẻ meta description..."
                  className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-gray-300 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Nội dung chi tiết bài viết (Body Content)
              </label>
              <textarea
                rows={10}
                value={body[activeLang] || ""}
                onChange={(e) => handleTextChange("body", e.target.value)}
                placeholder="Nhập toàn bộ nội dung bài viết..."
                className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-300 outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>{isSaving ? "Đang lưu..." : "Lưu bài viết"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

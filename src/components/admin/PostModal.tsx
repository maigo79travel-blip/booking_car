import React, { useState } from "react";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";
import { X, Save, Globe, FileText } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import ArticleEditor from "./ArticleEditor";

export interface PostRecord {
  id?: string;
  slug?: string;
  cover_image?: string | null;
  status?: "published" | "draft";
  published_at?: string | null;
  sort_order?: number | null;
  title?: Record<string, string> | string;
  seo_title?: Record<string, string> | string;
  excerpt?: Record<string, string> | string;
  seo_description?: Record<string, string> | string;
  body?: Record<string, string> | string;
}

interface PostModalProps {
  post: PostRecord | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  mode?: "modal" | "page" | "embedded";
}

const getLocalizedObject = (source: Record<string, string> | string | undefined) => {
  if (typeof source === "object" && source !== null) {
    return source as Record<string, string>;
  }

  if (typeof source === "string" && source.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(source);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
    } catch {
      // Legacy plain text is handled as Vietnamese content below.
    }
  }

  return null;
};

const getLangVal = (source: Record<string, string> | string | undefined, lang: Language): string => {
  const localized = getLocalizedObject(source);
  if (localized) return localized[lang] || "";
  return lang === "vi" && typeof source === "string" ? source : "";
};

export default function PostModal({ post, onClose, onSave, mode = "modal" }: PostModalProps) {
  const isEditing = !!post?.id;
  const isPageEditor = mode === "page";
  const isWideEditor = mode !== "modal";
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

  const [title, setTitle] = useState<Record<Language, string>>(() => ({
    vi: getLangVal(post?.title, "vi"),
    en: getLangVal(post?.title, "en"),
    ko: getLangVal(post?.title, "ko"),
    ru: getLangVal(post?.title, "ru"),
    zh: getLangVal(post?.title, "zh"),
  }));

  const [seoTitle, setSeoTitle] = useState<Record<Language, string>>(() => ({
    vi: getLangVal(post?.seo_title, "vi"),
    en: getLangVal(post?.seo_title, "en"),
    ko: getLangVal(post?.seo_title, "ko"),
    ru: getLangVal(post?.seo_title, "ru"),
    zh: getLangVal(post?.seo_title, "zh"),
  }));

  const [excerpt, setExcerpt] = useState<Record<Language, string>>(() => ({
    vi: getLangVal(post?.excerpt, "vi"),
    en: getLangVal(post?.excerpt, "en"),
    ko: getLangVal(post?.excerpt, "ko"),
    ru: getLangVal(post?.excerpt, "ru"),
    zh: getLangVal(post?.excerpt, "zh"),
  }));

  const [seoDescription, setSeoDescription] = useState<Record<Language, string>>(() => ({
    vi: getLangVal(post?.seo_description, "vi"),
    en: getLangVal(post?.seo_description, "en"),
    ko: getLangVal(post?.seo_description, "ko"),
    ru: getLangVal(post?.seo_description, "ru"),
    zh: getLangVal(post?.seo_description, "zh"),
  }));

  const [body, setBody] = useState<Record<Language, string>>(() => ({
    vi: getLangVal(post?.body, "vi"),
    en: getLangVal(post?.body, "en"),
    ko: getLangVal(post?.body, "ko"),
    ru: getLangVal(post?.body, "ru"),
    zh: getLangVal(post?.body, "zh"),
  }));

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
    if (!SUPPORTED_LANGUAGES.some((language) => title[language.code].trim())) {
      alert("Vui lòng nhập tiêu đề bài viết cho ít nhất một ngôn ngữ!");
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Lỗi khi lưu bài viết: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const hasLanguageContent = (language: Language) => Boolean(
    title[language]?.trim() ||
    excerpt[language]?.trim() ||
    seoTitle[language]?.trim() ||
    seoDescription[language]?.trim() ||
    body[language]?.trim()
  );

  return (
    <div className={isPageEditor ? "min-h-screen bg-slate-100 p-3 md:p-8" : mode === "embedded" ? "w-full" : "fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"}>
      <div className={`bg-white w-full border border-gray-100 ${isWideEditor ? "rounded-xl shadow-sm" : "max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-lg animate-in zoom-in-95 duration-200"} ${isPageEditor ? "max-w-7xl mx-auto" : ""}`}>
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {isEditing ? "Chỉnh sửa bài viết SEO" : "Thêm bài viết mới"}
              </h2>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Soạn thảo nội dung và tối ưu thẻ meta SEO theo 5 ngôn ngữ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${isWideEditor ? "p-5 md:p-8 lg:p-10" : "flex-1 overflow-y-auto p-6"}`}>
          {/* General Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                className="w-full px-3 py-2 text-sm bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500 font-mono"
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
                  className={`flex-1 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
                  className={`flex-1 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    status === "draft"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Bản nháp (Draft)
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <ImageUploadField
                label="Ảnh bìa bài viết (Cover Image)"
                value={coverImage}
                onChange={setCoverImage}
                folder="maigo79/posts"
                placeholder="/images/Hero2.jpg hoặc https://res.cloudinary.com/..."
                helperText="Ảnh bìa hiển thị nổi bật trên danh sách bài viết và thẻ xem trước mạng xã hội (OpenGraph / Facebook / Zalo)"
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
                className="w-full px-3 py-2 text-sm bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500 font-mono"
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

            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-lg">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeLang === lang.code
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white/60"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {hasLanguageContent(lang.code) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Localized Content Inputs */}
          <div className="space-y-4 p-4 border border-blue-100 rounded-lg bg-blue-50/20">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Tiêu đề bài viết ({activeLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={title[activeLang] || ""}
                onChange={(e) => handleTextChange("title", e.target.value)}
                placeholder={`Nhập tiêu đề bằng ${SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.name}...`}
                className="w-full px-3 py-2 text-sm bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500 font-bold text-gray-900"
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
                className="w-full px-3 py-2 text-sm bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500"
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
                  className="w-full px-3 py-2 text-xs bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500"
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
                  className="w-full px-3 py-2 text-xs bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Nội dung chi tiết bài viết (Body Content)
              </label>
              <ArticleEditor
                value={body[activeLang] || ""}
                onChange={(value) => handleTextChange("body", value)}
                language={SUPPORTED_LANGUAGES.find((lang) => lang.code === activeLang)?.name || activeLang}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center justify-end gap-3 pt-4 border-t border-gray-100 ${isWideEditor ? "sticky bottom-0 bg-white py-4" : ""}`}>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
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

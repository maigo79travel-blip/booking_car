"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  FileText,
} from "lucide-react";
import PostModal, { PostRecord } from "./PostModal";

interface PostsManagerProps {
  posts: PostRecord[];
  onSavePost: (id: string | null, data: Record<string, unknown>) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
}

export default function PostsManager({
  posts,
  onSavePost,
  onDeletePost,
}: PostsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPost, setEditingPost] = useState<PostRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getTitle = (p: PostRecord) => {
    if (typeof p.title === "object" && p.title) {
      const titleObj = p.title as Record<string, string>;
      return titleObj.vi || titleObj.en || Object.values(titleObj)[0] || "Không có tiêu đề";
    }
    return String(p.title || "Không có tiêu đề");
  };

  const filteredPosts = posts.filter((p) => {
    const titleText = getTitle(p).toLowerCase();
    const slugText = (p.slug || "").toLowerCase();
    const matchesSearch =
      titleText.includes(searchTerm.toLowerCase()) ||
      slugText.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSave = async (data: Record<string, unknown>) => {
    await onSavePost(editingPost?.id || null, data);
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string | undefined, titleStr: string) => {
    if (!id) return;
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${titleStr}" không?`)) {
      await onDeletePost(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Bài Viết SEO ({posts.length})
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Tạo và tối ưu hóa bài viết tin tức, cẩm nang du lịch chuẩn SEO 5 ngôn ngữ
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-md text-xs md:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Tạo Bài Viết Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-xs md:text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-200 text-xs font-medium text-gray-700 outline-none bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã công khai (Published)</option>
            <option value="draft">Bản nháp (Draft)</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-4">Bài Viết</th>
                <th className="py-3.5 px-3">Đường Dẫn (Slug)</th>
                <th className="py-3.5 px-3">Đa Ngôn Ngữ</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 px-3">Ngày Đăng</th>
                <th className="py-3.5 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((p) => {
                  const titleStr = getTitle(p);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {p.cover_image ? (
                              <Image
                                src={p.cover_image}
                                alt={titleStr}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FileText size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-70">
                              {titleStr}
                            </h3>
                            <p className="text-[11px] text-gray-400 line-clamp-1 max-w-70">
                              {typeof p.excerpt === "object" ? p.excerpt?.vi : p.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-xs font-mono text-gray-600 max-w-40 truncate">
                        /{p.slug}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex gap-1">
                          {["vi", "en", "ko", "ru", "zh"].map((code) => {
                            const hasLang = typeof p.title === "object" && !!p.title[code];
                            return (
                              <span
                                key={code}
                                className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${
                                  hasLang
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {code}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            p.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {p.status === "published" ? "✓ Công khai" : "Bản nháp"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-gray-500 font-mono">
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString("vi-VN")
                          : "Chưa đặt"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/bai-viet/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Xem trang thực tế"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => setEditingPost(p)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Sửa bài viết"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, titleStr)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa bài viết"
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
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có bài viết nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editor */}
      {(isCreating || editingPost) && (
        <PostModal
          post={editingPost}
          onClose={() => {
            setIsCreating(false);
            setEditingPost(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

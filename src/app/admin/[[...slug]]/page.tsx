"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Shield,
  Loader2,
  AlertCircle,
  Car,
} from "lucide-react";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/DashboardOverview";
import BookingsManager from "@/components/admin/BookingsManager";
import PostsManager from "@/components/admin/PostsManager";
import PostModal, { PostRecord } from "@/components/admin/PostModal";
import RoutesManager from "@/components/admin/RoutesManager";
import ContentManager from "@/components/admin/ContentManager";

export type PostItem = Record<string, unknown>;
export type RouteItem = Record<string, unknown>;
export type ContentItem = {
  id: string;
  content_key: string;
  content_type?: string;
  value: unknown;
  [key: string]: unknown;
};
export type BookingItem = Record<string, unknown>;

export type Data = {
  posts: PostItem[];
  routes: RouteItem[];
  content: ContentItem[];
  bookings: BookingItem[];
};

const emptyData: Data = {
  posts: [],
  routes: [],
  content: [],
  bookings: [],
};

export default function AdminAppPage() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const [data, setData] = useState<Data>(emptyData);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Map URL pathname to AdminTab
  const getTabFromPath = (path: string): AdminTab => {
    const parts = path.split("/").filter(Boolean);
    const segment = parts[1] || "";
    if (segment === "bookings" || segment === "don-dat-xe") return "bookings";
    if (segment === "routes" || segment === "bang-gia") return "routes";
    if (segment === "posts" || segment === "bai-viet") return "posts";
    if (segment === "content" || segment === "cau-hinh" || segment === "settings") return "content";
    return "dashboard";
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const activeTab = getTabFromPath(pathname);
  const postEditorId = activeTab === "posts" ? pathSegments[2] : undefined;
  const editingPost = postEditorId && postEditorId !== "new"
    ? (data.posts.find((post) => String(post.id) === postEditorId) as PostRecord | undefined)
    : null;

  const handleNavigateTab = (tab: AdminTab) => {
    router.push(`/admin/${tab}`);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (!res.ok) {
        setAuthorized(false);
        setLoading(false);
        return false;
      }
      const fetchedData = await res.json();
      setData(fetchedData);
      setAuthorized(true);
      setLoading(false);
      return true;
    } catch {
      setAuthorized(false);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/data")
      .then((res) => {
        if (!res.ok) {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
          }
          return null;
        }
        return res.json();
      })
      .then((fetchedData) => {
        if (isMounted && fetchedData) {
          setData(fetchedData);
          setAuthorized(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
        setIsLoggingIn(false);
      } else {
        setLoading(true);
        await load();
        setIsLoggingIn(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessage("Không thể kết nối tới máy chủ: " + errMsg);
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setData(emptyData);
    setAuthorized(false);
    setLoading(false);
  };

  const handleSavePost = async (id: string | null, postData: Record<string, unknown>) => {
    const response = await fetch("/api/admin/data", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        id
          ? { table: "posts", id, data: postData }
          : { table: "posts", data: postData }
      ),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || "Không thể lưu bài viết");
    }

    await load();
    router.push("/admin/posts");
  };

  const handleDeletePost = async (id: string) => {
    const res = await fetch(`/api/admin/data?table=posts&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) alert("Không thể xóa bài viết!");
    await load();
  };

  // CRUD Handlers for Routes
  const handleSaveRoute = async (id: string | null, routeData: Record<string, unknown>) => {
    if (id) {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "price_routes", id, data: routeData }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật tuyến xe");
    } else {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "price_routes", data: routeData }),
      });
      if (!res.ok) throw new Error("Không thể tạo tuyến xe mới");
    }
    await load();
  };

  const handleDeleteRoute = async (id: string) => {
    const res = await fetch(`/api/admin/data?table=price_routes&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) alert("Không thể xóa tuyến xe!");
    await load();
  };

  // CRUD Handlers for Bookings
  const handleSaveBooking = async (id: string, bookingData: Record<string, unknown>) => {
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "bookings", id, data: bookingData }),
    });
    if (!res.ok) throw new Error("Không thể cập nhật đơn đặt xe");
    await load();
  };

  const handleDeleteBooking = async (id: string) => {
    const res = await fetch(`/api/admin/data?table=bookings&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) alert("Không thể xóa đơn đặt xe!");
    await load();
  };

  // Handler for Content
  const handleSaveContent = async (id: string, contentData: Record<string, unknown>) => {
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "site_content", id, data: contentData }),
    });
    if (!res.ok) throw new Error("Không thể cập nhật cấu hình");
    await load();
  };

  // 1. Loading State
  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-gray-50 text-gray-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md animate-bounce">
            <Car size={24} />
          </div>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            Đang tải dữ liệu quản trị...
          </p>
        </div>
      </main>
    );
  }

  // 2. Login Screen
  if (!authorized) {
    return (
      <main className="min-h-screen grid place-items-center bg-linear-to-br from-blue-50 via-slate-100 to-indigo-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 animate-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-blue-200 mb-3.5">
              MG
            </div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
              maigo79<span className="text-blue-600 font-semibold">Admin</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 font-normal mt-1.5">
              Đăng nhập tài khoản quản trị hệ thống
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-xs text-red-800 font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tài khoản Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-3 text-gray-400"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@inoibai.vn hoặc admin@maigo79.com"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu quản trị
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-3 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-xs font-semibold text-gray-500 hover:text-blue-600 cursor-pointer"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-md shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-gray-500">
            maigo79.com • Hệ thống điều phối & quản lý xe chuyên nghiệp 24/7
          </div>
        </div>
      </main>
    );
  }

  // 3. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onLogout={logout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        bookingsCount={data.bookings.length}
        postsCount={data.posts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={logout}
          pendingCount={data.bookings.slice(0, 10).length}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          {activeTab === "dashboard" && (
            <DashboardOverview
              bookings={data.bookings}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsManager
              bookings={data.bookings}
              onRefresh={load}
              onSaveBooking={handleSaveBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === "posts" && (
            postEditorId ? (
              postEditorId !== "new" && !editingPost ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                  Không tìm thấy bài viết cần chỉnh sửa.
                </div>
              ) : (
                <PostModal
                  post={editingPost || null}
                  mode="embedded"
                  onClose={() => router.push("/admin/posts")}
                  onSave={(postData) => handleSavePost(editingPost?.id || null, postData)}
                />
              )
            ) : (
              <PostsManager
                posts={data.posts}
                onDeletePost={handleDeletePost}
              />
            )
          )}

          {activeTab === "routes" && (
            <RoutesManager
              routes={data.routes}
              onSaveRoute={handleSaveRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          )}

          {activeTab === "content" && (
            <ContentManager
              content={data.content}
              onSaveContent={handleSaveContent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

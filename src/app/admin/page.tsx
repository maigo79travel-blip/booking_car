"use client";

import React, { FormEvent, useEffect, useState } from "react";
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

export default function AdminPage() {
  const [data, setData] = useState<Data>(emptyData);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // CRUD Handlers for Posts
  const handleSavePost = async (id: string | null, postData: Record<string, unknown>) => {
    if (id) {
      // Update
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "posts", id, data: postData }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật bài viết");
    } else {
      // Create
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "posts", data: postData }),
      });
      if (!res.ok) throw new Error("Không thể tạo bài viết mới");
    }
    await load();
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
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Email Quản Trị
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="admin@maigo79.com"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 bg-white text-gray-950 text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Mật Khẩu
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu..."
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-md border border-gray-300 bg-white text-gray-950 text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-500 hover:text-gray-800 text-xs font-semibold p-1 cursor-pointer"
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
        setActiveTab={setActiveTab}
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
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsManager
              bookings={data.bookings}
              onRefresh={load}
            />
          )}

          {activeTab === "posts" && (
            <PostsManager
              posts={data.posts}
              onSavePost={handleSavePost}
              onDeletePost={handleDeletePost}
            />
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

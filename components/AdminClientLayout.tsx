"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";

type AdminClientLayoutProps = {
  children: React.ReactNode;
  fullName: string;
  role?: string;
};

export default function AdminClientLayout({
  children,
  fullName,
  role,
}: AdminClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("");
  }, [fullName]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("alumni_user");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-muted hover:bg-gray-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-muted hover:bg-gray-100"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {initials || "A"}
                </div>
                <span className="hidden text-sm font-medium sm:block">{fullName}</span>
                <ChevronDown size={14} className="hidden text-muted sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-gray-50"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-xs text-muted hover:bg-gray-50"
                  >
                    Back to home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

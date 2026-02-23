"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
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
            <h1 className="text-lg font-semibold text-foreground">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-muted hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  A
                </div>
                <span className="hidden text-sm font-medium sm:block">
                  Admin
                </span>
                <ChevronDown size={14} className="hidden text-muted sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
                  >
                    <User size={16} />
                    Profile
                  </a>
                  <div className="my-1 border-t border-border" />
                  <a
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </a>
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

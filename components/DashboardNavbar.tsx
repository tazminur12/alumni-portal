"use client";

import { useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-muted hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              A
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:block">
              Alumni User
            </span>
            <ChevronDown size={14} className="hidden text-muted sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
              <a
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
              >
                <User size={16} />
                My Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
              >
                <Settings size={16} />
                Settings
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
  );
}

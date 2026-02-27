"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [alumniUser, setAlumniUser] = useState<{
    fullName: string;
    email: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) return;

        const result = await response.json();
        if (result.user) {
          setAlumniUser({
            fullName: result.user.fullName,
            email: result.user.email,
            profilePicture: result.user.profilePicture,
          });
        }
      } catch {
        // no-op: keep fallback UI
      }
    };

    void fetchCurrentUser();
  }, []);

  const initials = useMemo(() => {
    if (!alumniUser?.fullName) return "A";
    return alumniUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("");
  }, [alumniUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("alumni_user");
      window.location.href = "/login";
    }
  };

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
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-muted hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
          >
            {alumniUser?.profilePicture ? (
              <Image
                src={alumniUser.profilePicture}
                alt={alumniUser.fullName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {initials}
              </div>
            )}
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {alumniUser?.fullName ?? "Alumni User"}
            </span>
            <ChevronDown size={14} className="hidden text-muted sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
              >
                <User size={16} />
                My Profile
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-gray-50"
              >
                <Settings size={16} />
                Settings
              </button>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

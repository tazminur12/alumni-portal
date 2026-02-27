"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  Heart,
  BarChart3,
  GraduationCap,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/event-registrations", label: "Event Registrations", icon: UserCheck },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const donationSubLinks = [
  {
    href: "/admin/donations",
    label: "Donation Campaigns",
  },
  {
    href: "/admin/donations/transparency",
    label: "Donor List Post",
  },
  {
    href: "/admin/donations/fund-usage",
    label: "Fund Usage Update Post",
  },
  {
    href: "/admin/donations/history",
    label: "Donation History",
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  role?: string;
}

export default function AdminSidebar({ open, onClose, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const isDonationRoute = pathname.startsWith("/admin/donations");
  const [donationMenuOpen, setDonationMenuOpen] = useState(isDonationRoute);

  const filteredAdminLinks = adminLinks.filter((link) => {
    if (role === "moderator") {
      return [
        "/admin",
        "/admin/users",
        "/admin/events",
        "/admin/event-registrations",
        "/admin/posts",
      ].includes(link.href);
    }
    return true;
  });

  const sidebarContent = (
    <div className="flex h-full flex-col bg-foreground text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <GraduationCap size={18} />
          </div>
          <div>
            <span className="text-sm font-bold">AMHS Admin</span>
            <p className="text-[10px] text-white/50">Control Panel</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredAdminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}

        {role !== "moderator" && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setDonationMenuOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isDonationRoute
                  ? "bg-accent text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              aria-label="Toggle donation submenu"
            >
              <span className="flex items-center gap-3">
                <Heart size={18} />
                Donations
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${donationMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {donationMenuOpen && (
              <div className="mt-1 space-y-1 pl-7">
                {donationSubLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarContent}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <aside className="relative h-full w-64">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}

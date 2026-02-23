"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  MessageSquare,
  Calendar,
  Briefcase,
  Image,
  Heart,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/directory", label: "Alumni Directory", icon: Users },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/jobs", label: "Jobs & Career", icon: Briefcase },
  { href: "/dashboard/memories", label: "Memories", icon: Image },
  { href: "/dashboard/donations", label: "Donations", icon: Heart },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-text">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <GraduationCap size={18} />
          </div>
          <span className="text-sm font-bold">AMHS Alumni</span>
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
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-sidebar-text/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-text/70 transition-colors hover:bg-white/10 hover:text-white">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarContent}</aside>

      {/* Mobile overlay */}
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

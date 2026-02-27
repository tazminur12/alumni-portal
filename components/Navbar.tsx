"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/alumni", label: "Alumni" },
  { href: "/events", label: "Events" },
  { href: "/donations", label: "Donations" },
  { href: "/memories", label: "Memories" },
  { href: "/announcements", label: "Announcements" },
  { href: "/gallery", label: "Our Gallery" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alumniUser, setAlumniUser] = useState<{
    fullName: string;
    email: string;
    role?: "super_admin" | "admin" | "moderator" | "alumni";
  } | null>(null);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (response.ok) {
          const result = await response.json();
          if (result.user?.fullName && result.user?.email) {
            const user = {
              fullName: result.user.fullName,
              email: result.user.email,
              role: result.user.role,
            };
            setAlumniUser(user);
            localStorage.setItem("alumni_user", JSON.stringify(user));
            return;
          }
        }
      } catch {
        // fallback to local cache
      }

      const rawUser = localStorage.getItem("alumni_user");
      if (!rawUser) return;
      try {
        const parsed = JSON.parse(rawUser);
        if (parsed?.fullName && parsed?.email) {
          setAlumniUser({
            fullName: parsed.fullName,
            email: parsed.email,
            role: parsed.role,
          });
        }
      } catch {
        localStorage.removeItem("alumni_user");
      }
    };

    void hydrateUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("alumni_user");
      setAlumniUser(null);
      setProfileOpen(false);
      setMobileOpen(false);
      window.location.href = "/";
    }
  };

  const isAdminRole =
    alumniUser?.role === "super_admin" ||
    alumniUser?.role === "admin" ||
    alumniUser?.role === "moderator";

  const dashboardHref = isAdminRole ? "/admin" : "/dashboard";
  const profileHref = isAdminRole ? "/admin/profile" : "/dashboard/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <GraduationCap size={20} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-primary-dark">
              Amtoli Model High School
            </p>
            <p className="text-[10px] leading-tight text-muted">
              Alumni Portal
            </p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {alumniUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {alumniUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-28 truncate text-sm font-medium text-foreground">
                  {alumniUser.fullName}
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={14} />
                    Dashboard
                  </Link>
                  <Link
                    href={profileHref}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={14} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                Join Alumni
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {alumniUser ? (
              <>
                <li className="border-t border-border pt-2">
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href={profileHref}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg bg-red-50 px-3 py-2 text-left text-sm font-medium text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-border pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white"
                  >
                    Join Alumni
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

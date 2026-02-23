"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/alumni", label: "Alumni" },
  { href: "/events", label: "Events" },
  { href: "/donations", label: "Donations" },
  { href: "/jobs", label: "Jobs & Career" },
  { href: "/memories", label: "Memories" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          </ul>
        </div>
      )}
    </header>
  );
}

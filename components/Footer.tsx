import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/alumni", label: "Alumni Directory" },
  { href: "/events", label: "Events" },
  { href: "/login", label: "Login" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">
                  Amtoli Model High School
                </p>
                <p className="text-[10px] leading-tight text-white/60">
                  Alumni Portal
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Connecting generations of alumni from Amtoli Model High School,
              Shibganj, Bogura. Building a stronger community together.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-light">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-light">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                Amtoli, Shibganj, Bogura, Bangladesh
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone size={16} className="shrink-0" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail size={16} className="shrink-0" />
                info@amtolialumni.org
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-light">
              Stay Connected
            </h3>
            <p className="mb-4 text-sm text-white/70">
              Follow us on social media to stay updated with alumni news and
              events.
            </p>
            <div className="flex gap-3">
              {["Facebook", "YouTube", "LinkedIn"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xs font-bold transition-colors hover:bg-white/20"
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Amtoli Model High School Alumni
            Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

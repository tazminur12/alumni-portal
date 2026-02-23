import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-3 text-white transition-opacity hover:opacity-80"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <GraduationCap size={22} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">
            Amtoli Model High School
          </p>
          <p className="text-[10px] leading-tight text-white/60">
            Alumni Portal
          </p>
        </div>
      </Link>
      {children}
    </div>
  );
}

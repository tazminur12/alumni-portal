"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        void Swal.fire({
          icon: "error",
          title: "Request failed",
          text: result.message || "Unable to send reset link.",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Check your email",
        text:
          result.message ||
          "If an account with that email exists, we have sent a password reset link.",
      });

      router.push("/login");
    } catch {
      void Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-4 flex justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-gray-50"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-muted">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending link..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}


"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Lock, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      void Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please make sure both passwords are the same.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        void Swal.fire({
          icon: "error",
          title: "Reset failed",
          text: result.message || "Unable to reset password.",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: result.message || "Your password has been updated. You can now log in.",
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

  if (!token || !email) {
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Invalid reset link
            </h1>
            <p className="mt-2 text-sm text-muted">
              This reset link is missing required information. Please request a
              new password reset email.
            </p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-muted">
            Choose a strong password that you don&apos;t use elsewhere.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              New password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a new password"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Confirm new password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}


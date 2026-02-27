"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Calendar,
  ArrowRight,
  Briefcase,
  School,
  Building2,
  Home,
  ImagePlus,
} from "lucide-react";

type RegisterForm = {
  fullName: string;
  batch: string;
  passingYear: string;
  email: string;
  password: string;
  collegeName: string;
  universityName: string;
  profession: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    batch: "",
    passingYear: "",
    email: "",
    password: "",
    collegeName: "",
    universityName: "",
    profession: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange =
    (field: keyof RegisterForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      void Swal.fire({
        icon: "error",
        title: "Upload setup missing",
        text: "Cloudinary environment variables are missing.",
      });
      return;
    }
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error("Upload failed");
      }

      setProfilePicture(result.secure_url);
      setPreviewUrl(result.secure_url);
      void Swal.fire({
        icon: "success",
        title: "Photo uploaded",
        text: "Profile picture uploaded successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      void Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Profile picture upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profilePicture) {
      void Swal.fire({
        icon: "warning",
        title: "Profile picture required",
        text: "Please upload a profile picture.",
      });
      return;
    }

    if (!form.collegeName.trim()) {
      void Swal.fire({
        icon: "warning",
        title: "College name required",
        text: "Please enter your college name.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          profilePicture,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        void Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: result.message || "Registration failed.",
        });
        return;
      }

      if (result.user) {
        // We don't set local storage here because they are not logged in yet
        // localStorage.setItem("alumni_user", JSON.stringify(result.user));
      }

      await Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "Your account is pending approval from a moderator. You will be able to log in once approved.",
        timer: 3000,
        showConfirmButton: true,
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
    <div className="w-full max-w-lg">
      <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-4 flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-gray-50"
          >
            <Home size={14} />
            Home
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Join Alumni Network
          </h1>
          <p className="mt-1 text-sm text-muted">
            SSC পাশ করার পর কলেজ/ইউনিভার্সিটি তথ্য দিয়ে রেজিস্টার করুন
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Profile Picture
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-50">
                <ImagePlus size={16} />
                {isUploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-12 w-12 rounded-full border border-border object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-full border border-border bg-gray-100" />
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={form.fullName}
                onChange={handleInputChange("fullName")}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Batch
              </label>
              <div className="relative">
                <GraduationCap
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={form.batch}
                  onChange={handleInputChange("batch")}
                  placeholder="e.g. 2010"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Passing Year
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={form.passingYear}
                  onChange={handleInputChange("passingYear")}
                  placeholder="e.g. 2012"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              College Name (Required)
            </label>
            <div className="relative">
              <School
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={form.collegeName}
                onChange={handleInputChange("collegeName")}
                placeholder="Enter your college name"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              University Name (Optional)
            </label>
            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={form.universityName}
                onChange={handleInputChange("universityName")}
                placeholder="If you are in university, enter name"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Profession (Optional)
            </label>
            <div className="relative">
              <Briefcase
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={form.profession}
                onChange={handleInputChange("profession")}
                placeholder="e.g. Student / Teacher / Developer"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

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
                value={form.email}
                onChange={handleInputChange("email")}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="password"
                value={form.password}
                onChange={handleInputChange("password")}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

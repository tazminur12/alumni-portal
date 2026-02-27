"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit,
  School,
  Building2,
  Save,
  X,
  UploadCloud,
} from "lucide-react";

type ProfileData = {
  fullName: string;
  email: string;
  batch: string;
  passingYear: string;
  profilePicture: string;
  collegeName: string;
  universityName: string;
  profession: string;
  phone: string;
  location: string;
  bio: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          setProfile(null);
          return;
        }

        const result = await response.json();
        const user = result.user ?? null;
        setProfile(user);
        setForm(user);
      } catch {
        setProfile(null);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const initials = useMemo(() => {
    if (!profile?.fullName) return "AU";
    return profile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile]);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.fullName,
      profile.email,
      profile.batch,
      profile.passingYear,
      profile.profilePicture,
      profile.collegeName,
      profile.universityName,
      profile.profession,
      profile.phone,
      profile.location,
      profile.bio,
    ];
    const filled = fields.filter((value) => value?.trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const completionWidthClass = useMemo(() => {
    if (completion >= 100) return "w-full";
    if (completion >= 90) return "w-11/12";
    if (completion >= 80) return "w-10/12";
    if (completion >= 70) return "w-9/12";
    if (completion >= 60) return "w-8/12";
    if (completion >= 50) return "w-7/12";
    if (completion >= 40) return "w-6/12";
    if (completion >= 30) return "w-5/12";
    if (completion >= 20) return "w-4/12";
    if (completion >= 10) return "w-3/12";
    if (completion > 0) return "w-2/12";
    return "w-0";
  }, [completion]);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string
  ) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !form) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      await Swal.fire({
        icon: "error",
        title: "Upload failed",
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

      setForm({ ...form, profilePicture: result.secure_url });
      await Swal.fire({
        icon: "success",
        title: "Photo updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Could not upload profile image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: result.message || "Could not update profile.",
        });
        return;
      }

      setProfile(result.user);
      setForm(result.user);
      setIsEditing(false);
      localStorage.setItem("alumni_user", JSON.stringify(result.user));

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-32 rounded-t-2xl bg-linear-to-r from-primary-dark to-primary" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {form?.profilePicture ? (
                <Image
                  src={form.profilePicture}
                  alt={form.fullName}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-primary text-3xl font-bold text-white shadow-lg">
                  {initials}
                </div>
              )}
              <div className="pb-1">
                <h1 className="text-xl font-bold text-foreground">
                  {form?.fullName ?? "Alumni User"}
                </h1>
                <p className="text-sm text-muted">
                  Batch {form?.batch ?? "-"} &middot; SSC {form?.passingYear ?? "-"}
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-50"
              >
                <Edit size={14} />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50">
                  <UploadCloud size={14} />
                  {isUploading ? "Uploading..." : "Change Photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted hover:bg-gray-50"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  <Save size={14} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Info and Editable Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Personal Information
          </h2>
          {isEditing && form ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <User size={12} />
                  Full Name
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    handleInputChange("fullName", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <Mail size={12} />
                  Email
                </span>
                <input
                  value={form.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-gray-100 px-3 py-2 text-sm text-muted"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <GraduationCap size={12} />
                  Batch
                </span>
                <input
                  value={form.batch}
                  onChange={(event) =>
                    handleInputChange("batch", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <GraduationCap size={12} />
                  Passing Year
                </span>
                <input
                  value={form.passingYear}
                  onChange={(event) =>
                    handleInputChange("passingYear", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <School size={12} />
                  College
                </span>
                <input
                  value={form.collegeName}
                  onChange={(event) =>
                    handleInputChange("collegeName", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <Building2 size={12} />
                  University
                </span>
                <input
                  value={form.universityName}
                  onChange={(event) =>
                    handleInputChange("universityName", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <Briefcase size={12} />
                  Profession
                </span>
                <input
                  value={form.profession}
                  onChange={(event) =>
                    handleInputChange("profession", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <Phone size={12} />
                  Phone
                </span>
                <input
                  value={form.phone}
                  onChange={(event) =>
                    handleInputChange("phone", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4 sm:col-span-2">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <MapPin size={12} />
                  Location
                </span>
                <input
                  value={form.location}
                  onChange={(event) =>
                    handleInputChange("location", event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="rounded-xl bg-background p-4 sm:col-span-2">
                <span className="mb-1 flex items-center gap-2 text-xs text-muted">
                  Bio
                </span>
                <textarea
                  value={form.bio}
                  onChange={(event) =>
                    handleInputChange("bio", event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Write a short professional bio..."
                />
              </label>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: User, label: "Full Name", value: profile?.fullName || "-" },
                { icon: Mail, label: "Email", value: profile?.email || "-" },
                {
                  icon: GraduationCap,
                  label: "Batch / Passing Year",
                  value: `Batch ${profile?.batch || "-"} / ${profile?.passingYear || "-"}`,
                },
                {
                  icon: School,
                  label: "College",
                  value: profile?.collegeName || "Not added",
                },
                {
                  icon: Building2,
                  label: "University",
                  value: profile?.universityName || "Not added",
                },
                {
                  icon: Briefcase,
                  label: "Profession",
                  value: profile?.profession || "Not added",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: profile?.phone || "Not added",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: profile?.location || "Not added",
                },
              ].map((field) => (
                <div key={field.label} className="rounded-xl bg-background p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                    <field.icon size={12} />
                    {field.label}
                  </div>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              ))}
              <div className="rounded-xl bg-background p-4 sm:col-span-2">
                <div className="mb-1 text-xs text-muted">Bio</div>
                <p className="text-sm font-medium text-foreground">
                  {profile?.bio || "No bio added yet."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Profile Completion
            </h3>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full bg-primary transition-all ${completionWidthClass}`}
              />
            </div>
            <p className="text-xs text-muted">{completion}% complete</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Account Status
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Email Verification",
                  value: "Verified",
                },
                { label: "Member Type", value: "Alumni" },
                { label: "Account", value: "Active" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

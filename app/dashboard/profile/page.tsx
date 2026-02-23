import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Edit,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-32 rounded-t-2xl bg-gradient-to-r from-primary-dark to-primary" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-primary text-3xl font-bold text-white shadow-lg">
                AU
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-foreground">
                  Alumni User
                </h1>
                <p className="text-sm text-muted">Batch 2010 &middot; SSC 2012</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-50">
              <Edit size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Personal Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: User, label: "Full Name", value: "Alumni User" },
              { icon: Mail, label: "Email", value: "alumni@example.com" },
              { icon: Phone, label: "Phone", value: "+880 1712-345678" },
              { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
              { icon: Briefcase, label: "Profession", value: "Software Engineer" },
              { icon: GraduationCap, label: "Batch", value: "2010" },
            ].map((field) => (
              <div key={field.label} className="rounded-xl bg-background p-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <field.icon size={12} />
                  {field.label}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Profile Completion
            </h3>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
            <p className="text-xs text-muted">75% complete</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Activity Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: "Connections", value: "128" },
                { label: "Events Attended", value: "12" },
                { label: "Posts Shared", value: "8" },
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

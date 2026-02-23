import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react";

const users = [
  { name: "Rafiq Ahmed", email: "rafiq@mail.com", batch: "2005", role: "Alumni", status: "Active", joined: "Jan 10, 2024" },
  { name: "Nasreen Begum", email: "nasreen@mail.com", batch: "2008", role: "Alumni", status: "Active", joined: "Feb 5, 2024" },
  { name: "Kamal Hossain", email: "kamal@mail.com", batch: "2010", role: "Alumni", status: "Active", joined: "Mar 12, 2024" },
  { name: "Fatema Khatun", email: "fatema@mail.com", batch: "2012", role: "Alumni", status: "Pending", joined: "Apr 1, 2025" },
  { name: "Mizanur Rahman", email: "mizan@mail.com", batch: "2003", role: "Alumni", status: "Active", joined: "May 20, 2024" },
  { name: "Shahana Akter", email: "shahana@mail.com", batch: "2015", role: "Alumni", status: "Suspended", joined: "Jun 8, 2024" },
  { name: "Rashed Khan", email: "rashed@mail.com", batch: "2020", role: "Alumni", status: "Pending", joined: "Jan 5, 2026" },
  { name: "Taslima Sultana", email: "taslima@mail.com", batch: "2018", role: "Alumni", status: "Active", joined: "Jan 2, 2026" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-600",
  Pending: "bg-amber-50 text-amber-600",
  Suspended: "bg-red-50 text-red-600",
};

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            User Management
          </h2>
          <p className="text-sm text-muted">
            Manage registered alumni accounts
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Batch
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Joined
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {user.batch}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {user.role}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[user.status] ?? ""}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {user.joined}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted hover:bg-gray-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Search, Filter, UserPlus, ShieldCheck } from "lucide-react";
import Image from "next/image";

type UserRole = "super_admin" | "admin" | "moderator" | "alumni";
type UserStatus = "active" | "pending" | "suspended";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  batch: string;
  passingYear: string;
  collegeName: string;
  universityName: string;
  profession: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

const statusStyles: Record<UserStatus, string> = {
  active: "bg-green-50 text-green-600",
  pending: "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-600",
};

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "alumni", label: "Alumni (Main User)" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    batch: "",
    passingYear: "",
    collegeName: "",
    universityName: "",
    profession: "",
    role: "alumni" as UserRole,
    status: "active" as UserStatus,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentUserRole(data.user?.role);
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users.");
      }

      const nextUsers: AdminUser[] = result.users ?? [];
      setUsers(nextUsers);
      if (nextUsers.length > 0 && !selectedUserId) {
        setSelectedUserId(nextUsers[0].id);
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.batch.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? null;

  const formatRole = (role: UserRole) => {
    if (role === "super_admin") return "Super Admin";
    if (role === "moderator") return "Moderator";
    if (role === "admin") return "Admin";
    return "Alumni";
  };

  const handleRoleUpdate = async (role: UserRole) => {
    if (!selectedUser) return;
    setIsRoleSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update role.");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, role } : user
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Role updated",
        text: `${selectedUser.fullName} is now ${formatRole(role)}.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error instanceof Error ? error.message : "Could not update role.",
      });
    } finally {
      setIsRoleSaving(false);
    }
  };

  const handleStatusUpdate = async (status: UserStatus) => {
    if (!selectedUser) return;
    setIsRoleSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, status } : user
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Status updated",
        text: `${selectedUser.fullName} is now ${status}.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error instanceof Error ? error.message : "Could not update status.",
      });
    } finally {
      setIsRoleSaving(false);
    }
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create user.");
      }

      setNewUser({
        fullName: "",
        email: "",
        password: "",
        batch: "",
        passingYear: "",
        collegeName: "",
        universityName: "",
        profession: "",
        role: "alumni",
        status: "active",
      });
      setIsCreateOpen(false);
      await loadUsers();

      if (result.user?.id) {
        setSelectedUserId(result.user.id);
      }

      await Swal.fire({
        icon: "success",
        title: "User created",
        text: "New user has been added successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Create failed",
        text: error instanceof Error ? error.message : "Could not create user.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted">
            View users, assign roles, and create new accounts
          </p>
        </div>
        {currentUserRole !== "moderator" && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <UserPlus size={16} />
            Create User
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <Filter size={14} className="text-muted" />
          <select
            aria-label="Filter users by role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as UserRole | "all")}
            className="bg-transparent text-sm text-foreground outline-none"
          >
            <option value="all">All Roles</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <Filter size={14} className="text-muted" />
          <select
            aria-label="Filter users by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as UserStatus | "all")}
            className="bg-transparent text-sm text-foreground outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td className="px-5 py-6 text-sm text-muted" colSpan={4}>
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td className="px-5 py-6 text-sm text-muted" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`cursor-pointer hover:bg-gray-50/50 ${
                        selectedUser?.id === user.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {user.fullName
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">
                        {user.batch}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">
                        {formatRole(user.role)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                {selectedUser.profilePicture ? (
                  <Image
                    src={selectedUser.profilePicture}
                    alt={selectedUser.fullName}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {selectedUser.fullName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-sm text-muted">{selectedUser.email}</p>
                  <p className="mt-1 text-xs text-muted">
                    Batch {selectedUser.batch} • SSC {selectedUser.passingYear}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-border pt-4">
                <div>
                  <span className="font-medium text-foreground">College:</span>{" "}
                  <span className="text-muted">{selectedUser.collegeName || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">University:</span>{" "}
                  <span className="text-muted">{selectedUser.universityName || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Profession:</span>{" "}
                  <span className="text-muted">{selectedUser.profession || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Phone:</span>{" "}
                  <span className="text-muted">{selectedUser.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Location:</span>{" "}
                  <span className="text-muted">{selectedUser.location || "N/A"}</span>
                </div>
                {selectedUser.bio && (
                  <div>
                    <span className="font-medium text-foreground block mb-1">Bio:</span>
                    <p className="text-muted text-xs bg-gray-50 p-2 rounded-lg">{selectedUser.bio}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck size={15} />
                  Assign Role
                </p>
                <div className="flex items-center gap-3">
                  <select
                    aria-label="Assign role"
                    value={selectedUser.role}
                    onChange={(event) =>
                      handleRoleUpdate(event.target.value as UserRole)
                    }
                    disabled={isRoleSaving}
                    className="flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck size={15} />
                  Account Status
                </p>
                <div className="space-y-2">
                  {(["active", "pending", "suspended"] as UserStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={isRoleSaving}
                      onClick={() => handleStatusUpdate(status)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors capitalize ${
                        selectedUser.status === status
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">
              Select a user from the list to manage role.
            </p>
          )}
        </div>
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Create User</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={newUser.fullName}
                onChange={(event) =>
                  setNewUser((prev) => ({ ...prev, fullName: event.target.value }))
                }
                placeholder="Full name"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                type="email"
                value={newUser.email}
                onChange={(event) =>
                  setNewUser((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Email"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                type="password"
                value={newUser.password}
                onChange={(event) =>
                  setNewUser((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password (min 6 chars)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={newUser.batch}
                onChange={(event) =>
                  setNewUser((prev) => ({ ...prev, batch: event.target.value }))
                }
                placeholder="Batch"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={newUser.passingYear}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    passingYear: event.target.value,
                  }))
                }
                placeholder="Passing Year"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={newUser.collegeName}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    collegeName: event.target.value,
                  }))
                }
                placeholder="College name"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={newUser.universityName}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    universityName: event.target.value,
                  }))
                }
                placeholder="University (optional)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={newUser.profession}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    profession: event.target.value,
                  }))
                }
                placeholder="Profession (optional)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                aria-label="Select role for new user"
                value={newUser.role}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    role: event.target.value as UserRole,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Select status for new user"
                value={newUser.status}
                onChange={(event) =>
                  setNewUser((prev) => ({
                    ...prev,
                    status: event.target.value as UserStatus,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {isCreating ? "Creating user..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { cookies } from "next/headers";

import { verifyAuthToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export const ADMIN_ROLES = ["super_admin", "admin", "moderator"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const payload = verifyAuthToken(token);
    await connectDb();
    const user = await User.findById(payload.userId).select("-password");

    if (!user || user.status !== "active") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function isAdminRole(role: string | undefined) {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as AdminRole);
}

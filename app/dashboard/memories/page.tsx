"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import ShareMemoryModal from "@/components/ShareMemoryModal";

type MemoryData = {
  id: string;
  title: string;
  description: string;
  date: string;
  batch: string;
  author: string;
  authorId?: string;
  imageUrl?: string;
  images?: string[];
  likes: number;
  comments: number;
  color: string;
};

type UserData = { fullName: string; id: string; role?: string } | null;

const ADMIN_ROLES = ["super_admin", "admin", "moderator"];

export default function DashboardMemoriesPage() {
  const [memories, setMemories] = useState<MemoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [memoriesRes, meRes] = await Promise.all([
        fetch("/api/memories", { cache: "no-store" }),
        fetch("/api/auth/me"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(
          meData.user
            ? {
                fullName: meData.user.fullName,
                id: meData.user.id,
                role: meData.user.role,
              }
            : null
        );
      }

      if (memoriesRes.ok) {
        const data = await memoriesRes.json();
        setMemories(data.memories ?? []);
      }
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredMemories = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return memories;
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.author.toLowerCase().includes(query) ||
        m.batch.toLowerCase().includes(query)
    );
  }, [memories, searchTerm]);

  const openShareModal = () => {
    setEditingMemory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (memory: MemoryData) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handleDelete = async (memory: MemoryData) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Delete memory?",
      text: `Are you sure you want to delete "${memory.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const response = await fetch(`/api/memories/${memory.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete.");
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });
      await loadData();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error instanceof Error ? error.message : "Could not delete memory.",
      });
    }
  };

  const canEdit = (memory: MemoryData) => {
    if (!user) return false;
    const isAdmin = user.role && ADMIN_ROLES.includes(user.role);
    if (isAdmin) return true;
    const isOwner =
      (memory.authorId && memory.authorId === user.id) ||
      memory.author === user.fullName;
    return isOwner;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Memories</h2>
          <p className="text-sm text-muted">
            Share and relive your school memories
          </p>
        </div>
        <button
          onClick={openShareModal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Share Memory
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search memories..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted">
          No memories found. Share your first memory!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="group rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-40 items-center justify-center rounded-t-2xl bg-linear-to-br ${memory.color}`}
              >
                {memory.images && memory.images.length > 0 ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={memory.images[0]}
                      alt={memory.title}
                      fill
                      className="rounded-t-2xl object-cover"
                    />
                    {memory.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                        +{memory.images.length - 1} photos
                      </div>
                    )}
                  </div>
                ) : memory.imageUrl ? (
                  <Image
                    src={memory.imageUrl}
                    alt={memory.title}
                    fill
                    className="rounded-t-2xl object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={40}
                    className="text-primary/30 transition-colors group-hover:text-primary/50"
                  />
                )}
              </div>
              <div className="relative p-5">
                {canEdit(memory) && (
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(memory)}
                      className="rounded-lg p-1.5 text-muted hover:bg-gray-100"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(memory)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="pr-16">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    Batch {memory.batch}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-foreground">
                  {memory.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                  {memory.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">{memory.date}</span>
                  <span className="text-xs text-muted">by {memory.author}</span>
                </div>
                <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Heart size={14} />
                    {memory.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <MessageCircle size={14} />
                    {memory.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ShareMemoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingMemory={editingMemory}
        userFullName={user?.fullName}
        onSubmitSuccess={loadData}
      />
    </div>
  );
}

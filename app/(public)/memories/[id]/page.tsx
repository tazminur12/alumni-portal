"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ImageIcon,
  Heart,
  MessageCircle,
  ArrowLeft,
  Camera,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const GUEST_ID_KEY = "alumni_guest_id";

function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  batch: string;
  author: string;
  imageUrl?: string;
  images?: string[];
  color: string;
};

type Comment = {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export default function MemoryDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const loadMemory = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const guestId = getOrCreateGuestId();
      const url = guestId
        ? `/api/memories/${id}?guestId=${encodeURIComponent(guestId)}`
        : `/api/memories/${id}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 404) return;
        throw new Error("Failed to load");
      }
      const data = await res.json();
      setMemory(data.memory);
      setLikes(data.likes ?? 0);
      setHasLiked(data.hasLiked ?? false);
      setComments(data.comments ?? []);
    } catch {
      setMemory(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadMemory();
  }, [loadMemory]);

  const handleLike = async () => {
    if (!id) return;
    setLikeLoading(true);
    try {
      const guestId = getOrCreateGuestId();
      const res = await fetch(`/api/memories/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setLikes(data.likes ?? likes);
      setHasLiked(data.liked ?? false);
    } catch {
      // ignore
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/memories/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText.trim(),
          authorName: commentName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
      setCommentName("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center text-muted">
          Loading...
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted">Memory not found.</p>
          <Link
            href="/memories"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Memories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/memories"
            className="mb-6 inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Memories
          </Link>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div
              className={`flex w-full items-center justify-center bg-linear-to-br min-h-50 ${
                memory.color || "from-primary/5 to-primary/10"
              }`}
            >
              {memory.images && memory.images.length > 0 ? (
                <div
                  className={`grid w-full gap-1 p-1 sm:gap-2 sm:p-2 ${
                    memory.images.length === 1
                      ? "grid-cols-1"
                      : memory.images.length === 2
                      ? "grid-cols-2"
                      : memory.images.length === 3 || memory.images.length === 4
                      ? "grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {memory.images.map((img, i) => (
                    <div
                      key={i}
                      className={`relative w-full overflow-hidden rounded-lg ${
                        memory.images!.length === 1 ? "aspect-video" : "min-h-50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${memory.title} - ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : memory.imageUrl ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={memory.imageUrl}
                    alt={memory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImageIcon
                  size={64}
                  className="text-foreground/15 min-h-50"
                />
              )}
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Batch {memory.batch}
                </span>
                <span className="text-sm text-muted">{memory.date}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {memory.title}
              </h1>
              <p className="mt-4 text-muted">by {memory.author}</p>
              <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-foreground">
                {memory.description}
              </p>

              <div className="mt-8 flex items-center gap-6 border-t border-border pt-6">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    hasLiked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-muted hover:bg-gray-200"
                  }`}
                >
                  <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                  {likes} {likes === 1 ? "Like" : "Likes"}
                </button>
              </div>
            </div>
          </article>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <MessageCircle size={20} />
              Comments ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="mb-6 space-y-3">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name (optional if logged in)"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <textarea
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={commentSubmitting}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-sm text-muted">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-border bg-gray-50/50 p-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {c.authorName}
                    </p>
                    <p className="mt-1 text-sm text-muted">{c.text}</p>
                    <p className="mt-2 text-xs text-muted">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

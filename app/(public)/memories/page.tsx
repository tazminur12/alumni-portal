"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ImageIcon,
  Heart,
  MessageCircle,
  Search,
  Camera,
} from "lucide-react";

type MemoryType = {
  id?: string;
  title: string;
  color?: string;
  batch?: string;
  date: string;
  description: string;
  author: string;
  likes: number;
  comments: number;
  imageUrl?: string;
  images?: string[];
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<MemoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsLoggedIn(true);
          }
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
    void checkAuth();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/memories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const list = (data.memories ?? []).map((m: MemoryType) => ({
            ...m,
            color: m.color || "from-primary/5 to-primary/10",
          }));
          setMemories(list);
        }
      } catch {
        setMemories([]);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredMemories = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return memories;
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        (m.batch && m.batch.toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
    );
  }, [memories, searchTerm]);

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <Camera size={16} />
              Alumni Memories
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Memories
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Relive the golden days of school life. Browse through shared
              memories from alumni across all batches.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-border bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-lg">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memories by title, author, or batch..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      {/* Memories Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted">
              Loading memories...
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted">
              No memories found.
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMemories.map((memory: MemoryType) => (
              <Link
                key={memory.id || memory.title}
                href={memory.id ? `/memories/${memory.id}` : "#"}
                className="group block rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className={`relative flex h-44 items-center justify-center overflow-hidden rounded-t-2xl bg-linear-to-br ${memory.color || "from-primary/5 to-primary/10"}`}
                >
                  {memory.images && memory.images.length > 0 ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={memory.images[0]}
                        alt={memory.title}
                        fill
                        className="object-cover"
                      />
                      {memory.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white z-10">
                          +{memory.images.length - 1} photos
                        </div>
                      )}
                    </div>
                  ) : memory.imageUrl ? (
                    <Image
                      src={memory.imageUrl}
                      alt={memory.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon
                      size={48}
                      className="text-foreground/15 transition-transform group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      Batch {memory.batch}
                    </span>
                    <span className="text-xs text-muted">{memory.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {memory.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                    {memory.description}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    by{" "}
                    <span className="font-medium text-foreground">
                      {memory.author}
                    </span>
                  </p>

                  <div className="mt-3 flex items-center gap-5 border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-sm text-muted">
                      <Heart size={16} />
                      {memory.likes ?? 0}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted">
                      <MessageCircle size={16} />
                      {memory.comments ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Camera size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Share Your Memory
          </h2>
          <p className="mt-4 text-lg text-muted">
            Have a special school memory? {isLoggedIn ? "Go to your dashboard to share it" : "Login to your dashboard and share it"} with the entire alumni community.
          </p>
          <a
            href={isLoggedIn ? "/dashboard/memories" : "/login"}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-dark"
          >
            {isLoggedIn ? "Go to Dashboard to Share Memories" : "Login to Share Memories"}
          </a>
        </div>
      </section>
    </>
  );
}

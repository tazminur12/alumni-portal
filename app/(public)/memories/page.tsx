"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Search,
  Camera,
} from "lucide-react";

const staticMemories = [
  {
    title: "Batch 2010 Farewell Party",
    description:
      "The unforgettable farewell celebration with teachers and friends. Tears, laughter, and promises to stay connected forever.",
    date: "December 2012",
    likes: 45,
    comments: 12,
    author: "Alumni User",
    batch: "2010",
    color: "from-emerald-100 to-teal-100",
  },
  {
    title: "Annual Sports Day 2009",
    description:
      "Our batch won the championship trophy! The 100m sprint final was the highlight of the day.",
    date: "February 2009",
    likes: 67,
    comments: 23,
    author: "Rafiq Ahmed",
    batch: "2005",
    color: "from-blue-100 to-indigo-100",
  },
  {
    title: "School Picnic at Mahasthangarh",
    description:
      "The most fun trip with classmates exploring the ancient ruins of Mahasthangarh. A day filled with adventure and bonding.",
    date: "November 2011",
    likes: 89,
    comments: 34,
    author: "Nasreen Begum",
    batch: "2008",
    color: "from-amber-100 to-orange-100",
  },
  {
    title: "Science Fair Exhibition",
    description:
      "Our project on solar energy won the first prize at the district level! Proud moment for the entire school.",
    date: "July 2010",
    likes: 34,
    comments: 8,
    author: "Kamal Hossain",
    batch: "2010",
    color: "from-purple-100 to-pink-100",
  },
  {
    title: "Victory Day Parade 2010",
    description:
      "Marching together on December 16th with pride and patriotism. The flag hoisting ceremony gave us goosebumps.",
    date: "December 2010",
    likes: 56,
    comments: 15,
    author: "Fatema Khatun",
    batch: "2012",
    color: "from-red-100 to-rose-100",
  },
  {
    title: "Goodbye Old Building",
    description:
      "The last look at the original school building before renovation. So many memories within those walls.",
    date: "March 2013",
    likes: 102,
    comments: 41,
    author: "Mizanur Rahman",
    batch: "2003",
    color: "from-slate-100 to-gray-200",
  },
  {
    title: "Annual Cultural Night 2008",
    description:
      "Drama, dance, and music performances that showcased the incredible talent of our students. The stage was on fire!",
    date: "October 2008",
    likes: 78,
    comments: 29,
    author: "Shahana Akter",
    batch: "2015",
    color: "from-cyan-100 to-sky-100",
  },
  {
    title: "Class 10 Group Photo",
    description:
      "The iconic group photo of Class 10 batch taken under the banyan tree in the school yard. Still brings back all the feelings.",
    date: "January 2012",
    likes: 134,
    comments: 52,
    author: "Taslima Sultana",
    batch: "2018",
    color: "from-green-100 to-emerald-100",
  },
  {
    title: "Tree Planting Day",
    description:
      "We planted 50 trees around the school campus. Most of them have grown tall now — our little legacy to the school.",
    date: "June 2011",
    likes: 42,
    comments: 11,
    author: "Abdul Hamid",
    batch: "2000",
    color: "from-lime-100 to-green-100",
  },
];

export default function MemoriesPage() {
  const [memories, setMemories] = useState(staticMemories);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/memories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const list = (data.memories ?? []).map((m: { color?: string }) => ({
            ...m,
            color: m.color || "from-primary/5 to-primary/10",
          }));
          if (list.length > 0) setMemories(list);
        }
      } catch {
        // keep static data
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
      (m: { title: string; author: string; batch?: string; description: string }) =>
        m.title.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        (m.batch && m.batch.toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
    );
  }, [memories, searchTerm]);
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
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
            {filteredMemories.map((memory: { id?: string; title: string; color?: string; batch?: string; date: string; description: string; author: string; likes: number; comments: number; imageUrl?: string }) => (
              <Link
                key={memory.id || memory.title}
                href={memory.id ? `/memories/${memory.id}` : "#"}
                className="group block rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className={`flex h-44 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br ${memory.color || "from-primary/5 to-primary/10"}`}
                >
                  {memory.imageUrl ? (
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="h-full w-full object-cover"
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
            Have a special school memory? Login to your dashboard and share it
            with the entire alumni community.
          </p>
          <a
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-dark"
          >
            Login to Share Memories
          </a>
        </div>
      </section>
    </>
  );
}

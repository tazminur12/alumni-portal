"use client";

import { useState } from "react";

export default function DonorListPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Donor List Post (Transparency Section)
        </h2>
        <p className="mt-1 text-sm text-muted">
          Publish transparent donor list updates for the public donations page.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Create Post</h3>
        <form className="mt-4 grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            className="rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <textarea
            rows={8}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write donor list update details..."
            className="resize-none rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            className="w-fit rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Publish (UI Ready)
          </button>
        </form>
      </div>
    </div>
  );
}

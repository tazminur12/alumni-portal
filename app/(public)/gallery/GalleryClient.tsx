"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
};

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
        No images in the gallery yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Image
              src={item.imageUrl}
              alt={item.caption || `Gallery image ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-center transition-transform group-hover:scale-105"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3">
                <p className="truncate text-left text-sm font-medium text-white">
                  {item.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[lightboxIndex]?.imageUrl ?? ""}
              alt={items[lightboxIndex]?.caption || "Gallery image"}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
            />
            {items[lightboxIndex]?.caption && (
              <p className="mt-3 text-center text-sm text-white">
                {items[lightboxIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

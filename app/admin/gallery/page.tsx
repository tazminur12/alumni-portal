"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Images, Plus, Trash2, Upload } from "lucide-react";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/gallery", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load gallery.");
      }
      setItems(result.items ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load gallery.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are missing.");
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body,
      }
    );

    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      throw new Error("Upload failed.");
    }

    return String(result.secure_url);
  };

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid file",
        text: "Please select an image file (JPG, PNG, etc.).",
      });
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      const order = items.length;

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption: "", order }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add image.");
      }

      await Swal.fire({
        icon: "success",
        title: "Image added",
        text: "The image will appear on the public gallery page.",
        timer: 1500,
        showConfirmButton: false,
      });

      await loadItems();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: error instanceof Error ? error.message : "Could not add image.",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete image?",
      text: "This image will be removed from the gallery.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmation.isConfirmed) return;

    setDeletingId(item.id);
    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete image.");
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });

      await loadItems();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error instanceof Error ? error.message : "Could not delete image.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Our Gallery</h2>
          <p className="text-sm text-muted">
            Upload images for the public gallery page. These will be shown at
            /gallery.
          </p>
        </div>
        <div>
          <label htmlFor="gallery-upload" className="sr-only">
            Upload gallery image
          </label>
          <input
            id="gallery-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading…
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Image
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Images size={48} className="mx-auto text-muted" />
          <p className="mt-3 text-sm font-medium text-foreground">
            No gallery images yet
          </p>
          <p className="mt-1 text-sm text-muted">
            Upload images to display on the public gallery page
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            <Upload size={16} />
            Upload first image
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.imageUrl}
                  alt={item.caption || "Gallery"}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="absolute right-3 top-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 disabled:opacity-60"
                >
                  {deletingId === item.id ? "Deleting…" : "Delete"}
                </button>
              </div>
              {item.caption && (
                <p className="p-3 text-sm text-muted line-clamp-2">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

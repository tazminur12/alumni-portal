"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

type MemoryData = {
  id?: string;
  title: string;
  description: string;
  date: string;
  batch: string;
  images?: string[];
};

interface ShareMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMemory?: MemoryData | null;
  userFullName?: string | null;
  onSubmitSuccess?: () => void;
}

export default function ShareMemoryModal({
  isOpen,
  onClose,
  editingMemory,
  userFullName,
  onSubmitSuccess,
}: ShareMemoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<MemoryData>({
    title: "",
    description: "",
    date: "",
    batch: "",
    images: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editingMemory?.id;

  const parseDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
    return dateStr;
  };

  useEffect(() => {
    if (isOpen) {
      if (editingMemory) {
        setForm({
          title: editingMemory.title,
          description: editingMemory.description,
          date: parseDateForInput(editingMemory.date),
          batch: editingMemory.batch,
          images: editingMemory.images || [],
        });
      } else {
        setForm({
          title: "",
          description: "",
          date: new Date().toISOString().slice(0, 10),
          batch: "",
          images: [],
        });
      }
    }
  }, [isOpen, editingMemory, userFullName]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const filesArray = Array.from(files);

    if (form.images && form.images.length + filesArray.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (jpg, png, gif, webp)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Each image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(String(reader.result));
        if (newImages.length === filesArray.length) {
          setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date.trim(),
        batch: form.batch.trim(),
        images: form.images || [],
      };

      if (isEdit && editingMemory?.id) {
        const response = await fetch(`/api/memories/${editingMemory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Update failed.");
      } else {
        const response = await fetch("/api/memories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Share failed.");
      }

      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {isEdit ? "Edit Memory" : "Share Memory"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Images (optional, max 10)
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {form.images?.map((img, index) => (
                <div key={index} className="relative inline-block">
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-xl border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {(!form.images || form.images.length < 10) && (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-gray-50 py-8 transition-colors hover:border-primary hover:bg-primary/5">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Upload size={24} className="text-muted" />
                <span className="text-sm text-muted">
                  Click to upload images (max 2MB each)
                </span>
                <span className="text-xs text-muted">JPG, PNG, GIF, WebP ({10 - (form.images?.length || 0)} remaining)</span>
              </label>
            )}
          </div>
          <div>
            <label
              htmlFor="memory-title"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Title
            </label>
            <input
              id="memory-title"
              required
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. Batch 2010 Farewell Party"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="memory-description"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="memory-description"
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe your memory..."
              className="w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="memory-date"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Date
              </label>
              <input
                id="memory-date"
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="memory-batch"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Batch
              </label>
              <input
                id="memory-batch"
                required
                value={form.batch}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, batch: e.target.value }))
                }
                placeholder="e.g. 2010"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Memory"
                : "Share Memory"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  X,
  Edit,
  Trash,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  status: string;
  bannerImage?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Published: "bg-green-50 text-green-600",
  Draft: "bg-gray-100 text-gray-600",
  Review: "bg-amber-50 text-amber-600",
};

const categoryColors: Record<string, string> = {
  Announcement: "bg-primary/10 text-primary",
  Career: "bg-blue-50 text-blue-600",
  News: "bg-purple-50 text-purple-600",
  Events: "bg-pink-50 text-pink-600",
  Story: "bg-amber-50 text-amber-700",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Announcement",
    status: "Draft",
    bannerImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const uploadPostBanner = async (file: File) => {
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentPost) {
        // Update
        const res = await fetch(`/api/admin/posts/${currentPost._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updatedPost = await res.json();
          setPosts(posts.map((p) => (p._id === currentPost._id ? updatedPost : p)));
          closeModal();
        }
      } else {
        // Create
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const newPost = await res.json();
          setPosts([newPost, ...posts]);
          closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to save post", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (post?: Post) => {
    if (post) {
      setCurrentPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status,
        bannerImage: post.bannerImage || "",
      });
    } else {
      setCurrentPost(null);
      setFormData({
        title: "",
        content: "",
        category: "Announcement",
        status: "Published",
        bannerImage: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
    setFormData({
      title: "",
      content: "",
      category: "Announcement",
      status: "Draft",
      bannerImage: "",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      post.title.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Posts & Announcements
          </h2>
          <p className="text-sm text-muted">
            Publish updates that will appear on the public Announcements page.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Post
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Author
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
                    Loading posts...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                          {post.bannerImage ? (
                            <Image
                              src={post.bannerImage}
                              alt={post.title}
                              width={36}
                              height={36}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <FileText size={16} />
                          )}
                        </div>
                        <div>
                          <p className="max-w-xs truncate text-sm font-medium text-foreground">
                            {post.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {post.author}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          categoryColors[post.category] ?? ""
                        }`}
                      >
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          statusColors[post.status] ?? ""
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(post)}
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          title="Delete Post"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {currentPost ? "Edit Post" : "Create Post"}
                </h3>
                <p className="text-xs text-muted">
                  These posts will be shown on the public Announcements page.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted hover:bg-gray-100"
                title="Close Modal"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 px-5 py-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Career">Career</option>
                  <option value="News">News</option>
                  <option value="Events">Events</option>
                  <option value="Story">Story</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Featured image (optional)
                </label>
                <input
                  value={formData.bannerImage}
                  disabled
                  placeholder="Image URL will appear here after upload"
                  className="w-full rounded-xl border border-border bg-gray-50 p-2.5 text-xs text-muted outline-none"
                />
                <label className="mt-1 flex cursor-pointer items-center justify-between rounded-xl border border-border px-3 py-2 text-xs text-foreground">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <ImageIcon size={14} />
                    Upload image
                  </span>
                  <span className="text-[11px] text-muted">
                    {isImageUploading ? "Uploading..." : "Choose file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setIsImageUploading(true);
                      try {
                        const url = await uploadPostBanner(file);
                        setFormData((prev) => ({ ...prev, bannerImage: url }));
                      } catch (error) {
                        console.error(error);
                        alert(
                          error instanceof Error
                            ? error.message
                            : "Could not upload image."
                        );
                      } finally {
                        setIsImageUploading(false);
                        event.target.value = "";
                      }
                    }}
                    disabled={isImageUploading}
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

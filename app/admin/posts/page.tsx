import { Plus, Search, MoreHorizontal, FileText } from "lucide-react";

const posts = [
  { title: "Welcome to Alumni Portal 2026", author: "Admin", date: "Jan 1, 2026", category: "Announcement", status: "Published" },
  { title: "Career Tips for Fresh Graduates", author: "Rafiq Ahmed", date: "Jan 15, 2026", category: "Career", status: "Published" },
  { title: "School Renovation Update", author: "Admin", date: "Feb 1, 2026", category: "News", status: "Published" },
  { title: "Batch 2020 Reunion Planning", author: "Rashed Khan", date: "Feb 10, 2026", category: "Events", status: "Draft" },
  { title: "Interview with Successful Alumni", author: "Shahana Akter", date: "Feb 15, 2026", category: "Story", status: "Review" },
];

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
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Post Management
          </h2>
          <p className="text-sm text-muted">Manage alumni posts and articles</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
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
              {posts.map((post) => (
                <tr key={post.title} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {post.author}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[post.category] ?? ""}`}
                    >
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">{post.date}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[post.status] ?? ""}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted hover:bg-gray-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

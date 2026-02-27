import Image from "next/image";
import Link from "next/link";

import { connectDb } from "@/lib/db";
import Post, { IPost } from "@/models/Post";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  bannerImage?: string;
  createdAt: Date;
};

export default async function AnnouncementsPage() {
  await connectDb();

  const rawPosts = (await Post.find({ status: "Published" })
    .sort({ createdAt: -1 })
    .lean()) as (IPost & { _id: unknown; bannerImage?: string })[];

  const announcements: Announcement[] = rawPosts.map((post) => ({
    id: String(post._id),
    title: post.title,
    content: post.content,
    category: post.category,
    bannerImage: post.bannerImage,
    createdAt: post.createdAt,
  }));

  return (
    <>
      <section className="bg-linear-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Announcements
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Latest news, updates and stories from the alumni community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {announcements.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
              No announcements have been published yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((post) => (
                <Link
                  key={post.id}
                  href={`/announcements/${post.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  {post.bannerImage && (
                    <div className="relative w-full overflow-hidden bg-gray-100 pb-[56.25%]">
                      <Image
                        src={post.bannerImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {post.category}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-foreground sm:text-lg group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.content}
                    </p>
                    <p className="mt-3 text-xs text-muted">
                      {post.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}


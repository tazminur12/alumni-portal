import Link from "next/link";
import Image from "next/image";

import { ArrowLeft, Calendar, User } from "lucide-react";
import { connectDb } from "@/lib/db";
import Post from "@/models/Post";

type Props = { params: Promise<{ id: string }> };

export default async function AnnouncementDetailsPage({ params }: Props) {
  const { id } = await params;
  await connectDb();

  const post = await Post.findOne({
    _id: id,
    status: "Published",
  }).lean();

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-linear-to-br from-primary-dark to-primary py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Announcements
            </Link>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted">Announcement not found or not published.</p>
          <Link
            href="/announcements"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  const bannerImage = (post as { bannerImage?: string }).bannerImage;
  const category = post.category as string;
  const author = post.author as string;
  const createdAt = post.createdAt as Date;

  return (
    <>
      <section className="bg-linear-to-br from-primary-dark to-primary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Announcements
          </Link>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {bannerImage && (
              <div className="relative w-full overflow-hidden bg-gray-100 pb-[42%]">
                <Image
                  src={bannerImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  {category}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-muted">
                  <Calendar size={12} />
                  {new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {author && (
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-muted">
                    <User size={12} />
                    {author}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {post.title}
              </h1>

              <div className="mt-6">
                <div className="prose prose-gray max-w-none text-base leading-relaxed">
                  <p className="whitespace-pre-wrap text-foreground">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-8">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={14} />
              View all announcements
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

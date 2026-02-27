import { connectDb } from "@/lib/db";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await connectDb();

  const rawItems = await Gallery.find()
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const items = rawItems.map((item) => ({
    id: String(item._id),
    imageUrl: item.imageUrl,
    caption: item.caption || "",
  }));

  return (
    <>
      <section className="bg-linear-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Our Gallery
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Memories and moments from our school community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryClient items={items} />
        </div>
      </section>
    </>
  );
}

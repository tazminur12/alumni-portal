import { Image as ImageIcon, Plus, Heart, MessageCircle } from "lucide-react";

const memories = [
  {
    title: "Batch 2010 Farewell Party",
    description: "The unforgettable farewell celebration with teachers and friends.",
    date: "December 2012",
    likes: 45,
    comments: 12,
    author: "Alumni User",
  },
  {
    title: "Annual Sports Day 2009",
    description: "Our batch won the championship trophy! What a proud moment.",
    date: "February 2009",
    likes: 67,
    comments: 23,
    author: "Rafiq Ahmed",
  },
  {
    title: "School Picnic at Mahasthangarh",
    description: "The most fun trip with classmates exploring the ancient ruins.",
    date: "November 2011",
    likes: 89,
    comments: 34,
    author: "Nasreen Begum",
  },
  {
    title: "Science Fair Exhibition",
    description: "Our project on solar energy won the first prize at the district level.",
    date: "July 2010",
    likes: 34,
    comments: 8,
    author: "Kamal Hossain",
  },
  {
    title: "Victory Day Parade",
    description: "Marching together on December 16th with pride and patriotism.",
    date: "December 2010",
    likes: 56,
    comments: 15,
    author: "Fatema Khatun",
  },
  {
    title: "Goodbye Old Building",
    description: "The last look at the original school building before renovation.",
    date: "March 2013",
    likes: 102,
    comments: 41,
    author: "Mizanur Rahman",
  },
];

export default function MemoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Memories</h2>
          <p className="text-sm text-muted">
            Share and relive your school memories
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus size={16} />
          Share Memory
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <div
            key={memory.title}
            className="group rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-40 items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/5 to-primary/10">
              <ImageIcon
                size={40}
                className="text-primary/30 transition-colors group-hover:text-primary/50"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground">{memory.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {memory.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted">{memory.date}</span>
                <span className="text-xs text-muted">by {memory.author}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500">
                  <Heart size={14} />
                  {memory.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-primary">
                  <MessageCircle size={14} />
                  {memory.comments}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

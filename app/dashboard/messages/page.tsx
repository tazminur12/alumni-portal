import { Search, Send } from "lucide-react";

const conversations = [
  { name: "Rafiq Ahmed", lastMsg: "See you at the reunion!", time: "2m ago", unread: 2, initials: "RA" },
  { name: "Nasreen Begum", lastMsg: "Thanks for the career advice", time: "1h ago", unread: 0, initials: "NB" },
  { name: "Kamal Hossain", lastMsg: "Let me share the project details", time: "3h ago", unread: 1, initials: "KH" },
  { name: "Batch 2010 Group", lastMsg: "Who's coming to the meetup?", time: "5h ago", unread: 5, initials: "B10" },
  { name: "Fatema Khatun", lastMsg: "The library needs more books", time: "1d ago", unread: 0, initials: "FK" },
];

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-sm text-muted">
          Chat with your alumni connections
        </p>
      </div>

      <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-3">
        {/* Conversation List */}
        <div className="border-r border-border lg:col-span-1">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {conversations.map((convo, i) => (
              <button
                key={convo.name}
                className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {convo.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {convo.name}
                    </span>
                    <span className="text-[10px] text-muted">{convo.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted">
                    {convo.lastMsg}
                  </p>
                </div>
                {convo.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {convo.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col lg:col-span-2">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Rafiq Ahmed
            </h3>
            <p className="text-xs text-muted">Online</p>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-3 p-4">
            <div className="flex justify-start">
              <div className="max-w-xs rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5 text-sm text-foreground">
                Hey! Are you coming to the annual reunion this year?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-xs rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">
                Absolutely! I already registered. It&apos;s going to be great!
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xs rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5 text-sm text-foreground">
                See you at the reunion! 🎉
              </div>
            </div>
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

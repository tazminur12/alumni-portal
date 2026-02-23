import { Search, Filter, MapPin, Briefcase } from "lucide-react";

const alumni = [
  { name: "Rafiq Ahmed", batch: "2005", profession: "Software Engineer", location: "Dhaka", initials: "RA" },
  { name: "Nasreen Begum", batch: "2008", profession: "Doctor", location: "Dhaka", initials: "NB" },
  { name: "Kamal Hossain", batch: "2010", profession: "Civil Engineer", location: "Bogura", initials: "KH" },
  { name: "Fatema Khatun", batch: "2012", profession: "Teacher", location: "Shibganj", initials: "FK" },
  { name: "Mizanur Rahman", batch: "2003", profession: "Banker", location: "Rajshahi", initials: "MR" },
  { name: "Shahana Akter", batch: "2015", profession: "Journalist", location: "Dhaka", initials: "SA" },
];

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Alumni Directory
          </h2>
          <p className="text-sm text-muted">
            Browse and connect with fellow alumni
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search by name, batch, or profession..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alumni.map((person) => (
          <div
            key={person.name}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {person.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{person.name}</h3>
              <p className="text-xs font-medium text-primary">
                Batch {person.batch}
              </p>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <Briefcase size={11} />
                  {person.profession}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <MapPin size={11} />
                  {person.location}
                </p>
              </div>
              <button className="mt-3 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

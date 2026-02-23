import { Search, Filter } from "lucide-react";

const alumniList = [
  { name: "Rafiq Ahmed", batch: "2005", profession: "Software Engineer", location: "Dhaka", initials: "RA" },
  { name: "Nasreen Begum", batch: "2008", profession: "Doctor", location: "Dhaka", initials: "NB" },
  { name: "Kamal Hossain", batch: "2010", profession: "Civil Engineer", location: "Bogura", initials: "KH" },
  { name: "Fatema Khatun", batch: "2012", profession: "Teacher", location: "Shibganj", initials: "FK" },
  { name: "Mizanur Rahman", batch: "2003", profession: "Banker", location: "Rajshahi", initials: "MR" },
  { name: "Shahana Akter", batch: "2015", profession: "Journalist", location: "Dhaka", initials: "SA" },
  { name: "Abdul Hamid", batch: "2000", profession: "Businessman", location: "Bogura", initials: "AH" },
  { name: "Taslima Sultana", batch: "2018", profession: "Student (BUET)", location: "Dhaka", initials: "TS" },
];

export default function AlumniPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Alumni Directory
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Find and connect with fellow alumni from Amtoli Model High School
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search alumni by name, batch, or profession..."
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-gray-50">
              <Filter size={16} />
              Filter by Batch
            </button>
          </div>

          {/* Alumni Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {alumniList.map((alumni) => (
              <div
                key={alumni.name}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {alumni.initials}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {alumni.name}
                </h3>
                <p className="text-sm font-medium text-primary">
                  Batch {alumni.batch}
                </p>
                <p className="mt-1 text-sm text-muted">{alumni.profession}</p>
                <p className="text-sm text-muted">{alumni.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

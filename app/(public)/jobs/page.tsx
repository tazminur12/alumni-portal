import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  ExternalLink,
  Building,
} from "lucide-react";

const jobs = [
  {
    title: "Software Engineer",
    company: "TechCorp Bangladesh",
    location: "Dhaka",
    type: "Full-time",
    salary: "৳50,000 - ৳80,000",
    posted: "2 days ago",
    postedBy: "Rafiq Ahmed",
    batch: "2005",
    description:
      "Looking for a passionate full-stack developer with experience in React, Node.js, and MongoDB. Great opportunity to work on cutting-edge products.",
  },
  {
    title: "Medical Officer",
    company: "Bogura General Hospital",
    location: "Bogura",
    type: "Full-time",
    salary: "৳40,000 - ৳60,000",
    posted: "5 days ago",
    postedBy: "Nasreen Begum",
    batch: "2008",
    description:
      "Seeking a qualified MBBS doctor for the outpatient department. Experience in emergency medicine is a plus.",
  },
  {
    title: "Junior Accountant",
    company: "ABC Finance Ltd.",
    location: "Rajshahi",
    type: "Full-time",
    salary: "৳25,000 - ৳35,000",
    posted: "1 week ago",
    postedBy: "Mizanur Rahman",
    batch: "2003",
    description:
      "Entry-level accounting position for recent graduates. Knowledge of Tally and Excel required.",
  },
  {
    title: "Freelance Content Writer",
    company: "Remote",
    location: "Remote",
    type: "Freelance",
    salary: "Negotiable",
    posted: "1 week ago",
    postedBy: "Shahana Akter",
    batch: "2015",
    description:
      "Write engaging blog posts, articles, and social media content for various clients. Excellent Bangla and English writing skills required.",
  },
  {
    title: "High School Teacher (Math)",
    company: "Sunrise Academy",
    location: "Shibganj, Bogura",
    type: "Full-time",
    salary: "৳20,000 - ৳30,000",
    posted: "3 days ago",
    postedBy: "Fatema Khatun",
    batch: "2012",
    description:
      "Experienced math teacher needed for classes 6-10. Must have B.Sc in Mathematics and B.Ed.",
  },
  {
    title: "Civil Site Engineer",
    company: "BuildRight Construction",
    location: "Dhaka",
    type: "Full-time",
    salary: "৳45,000 - ৳65,000",
    posted: "4 days ago",
    postedBy: "Kamal Hossain",
    batch: "2010",
    description:
      "Site engineer role for residential building projects. BSc in Civil Engineering with 2+ years experience required.",
  },
  {
    title: "Graphic Designer (Part-time)",
    company: "CreativeHub Agency",
    location: "Remote",
    type: "Part-time",
    salary: "৳15,000 - ৳25,000",
    posted: "6 days ago",
    postedBy: "Sumaiya Islam",
    batch: "2019",
    description:
      "Part-time graphic designer for social media creatives, branding, and print design. Proficiency in Adobe Suite and Figma needed.",
  },
  {
    title: "Bank Officer (Trainee)",
    company: "Sonali Bank PLC",
    location: "Bogura",
    type: "Full-time",
    salary: "৳30,000 - ৳40,000",
    posted: "2 weeks ago",
    postedBy: "Jahangir Alam",
    batch: "2014",
    description:
      "Trainee officer position for graduates. Banking diploma or BBA preferred. Government benefits included.",
  },
];

const typeColors: Record<string, string> = {
  "Full-time": "bg-green-50 text-green-600",
  "Part-time": "bg-blue-50 text-blue-600",
  Freelance: "bg-purple-50 text-purple-600",
};

export default function JobsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <Briefcase size={16} />
              Alumni Career Network
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Jobs & Career
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Discover job opportunities shared by fellow alumni. Help each
              other grow professionally and build careers together.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-border bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              Showing <span className="font-semibold text-foreground">{jobs.length}</span> job opportunities
            </p>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.title + job.company}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Building size={14} />
                        {job.company}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {job.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <MapPin size={12} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <DollarSign size={12} />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <Clock size={12} />
                          {job.posted}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        Shared by{" "}
                        <span className="font-medium text-foreground">
                          {job.postedBy}
                        </span>{" "}
                        (Batch {job.batch})
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[job.type] ?? "bg-gray-50 text-gray-600"}`}
                    >
                      {job.type}
                    </span>
                    <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                      Apply
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Briefcase size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Have a Job to Share?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Help your fellow alumni by posting job openings from your company.
            Login to your dashboard to share opportunities.
          </p>
          <a
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-dark"
          >
            Login to Post a Job
          </a>
        </div>
      </section>
    </>
  );
}

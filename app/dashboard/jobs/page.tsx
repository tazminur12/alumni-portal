import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
} from "lucide-react";

const jobs = [
  {
    title: "Software Engineer",
    company: "TechCorp Bangladesh",
    location: "Dhaka",
    type: "Full-time",
    salary: "৳50,000 - ৳80,000",
    posted: "2 days ago",
    postedBy: "Rafiq Ahmed (Batch 2005)",
  },
  {
    title: "Medical Officer",
    company: "Bogura General Hospital",
    location: "Bogura",
    type: "Full-time",
    salary: "৳40,000 - ৳60,000",
    posted: "5 days ago",
    postedBy: "Nasreen Begum (Batch 2008)",
  },
  {
    title: "Junior Accountant",
    company: "ABC Finance Ltd.",
    location: "Rajshahi",
    type: "Full-time",
    salary: "৳25,000 - ৳35,000",
    posted: "1 week ago",
    postedBy: "Mizanur Rahman (Batch 2003)",
  },
  {
    title: "Freelance Content Writer",
    company: "Remote",
    location: "Remote",
    type: "Freelance",
    salary: "Negotiable",
    posted: "1 week ago",
    postedBy: "Shahana Akter (Batch 2015)",
  },
];

const typeColors: Record<string, string> = {
  "Full-time": "bg-green-50 text-green-600",
  "Part-time": "bg-blue-50 text-blue-600",
  Freelance: "bg-purple-50 text-purple-600",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Jobs & Career</h2>
          <p className="text-sm text-muted">
            Job opportunities shared by fellow alumni
          </p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          Post a Job
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {job.title}
                  </h3>
                  <p className="text-sm text-primary">{job.company}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <MapPin size={12} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <DollarSign size={12} />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />
                      {job.posted}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Shared by {job.postedBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[job.type] ?? "bg-gray-50 text-gray-600"}`}
                >
                  {job.type}
                </span>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                  Apply
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

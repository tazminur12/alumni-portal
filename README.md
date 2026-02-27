# 🎓 Amtoli Model High School — Alumni Portal

A modern, responsive alumni web application for **Amtoli Model High School, Shibganj, Bogura**. Built to connect generations of alumni, foster community engagement, and support school development initiatives.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🌐 Public Pages
- **Home** — Hero with slideshow or fallback image, Featured Alumni, stats, upcoming events, CTA
- **About** — School history, mission/vision/values, milestones timeline
- **Alumni Directory** — Searchable alumni listing with batch & profession filters
- **Events** — Upcoming events with registration, type badges, and details
- **Donations** — Active fundraising campaigns with progress tracking
- **Announcements** — Published posts as news and updates with detail view
- **Our Gallery** — Public gallery with grid view and lightbox for full-size images
- **Jobs & Career** — Job opportunities shared by alumni with apply actions
- **Memories** — Shared school memories with likes, comments, and batch tags

### 🔐 Authentication
- **Login** — Clean centered card with email/password fields
- **Register** — Full registration with Name, Batch, Passing Year, Email, Password
- **Forgot Password** — Request password reset link via email
- **Reset Password** — Set new password using token from email link

### 📊 User Dashboard
- **Dashboard** — Stats overview, recent activity feed, upcoming events
- **My Profile** — Editable profile with Cloudinary photo upload, completion tracker
- **Alumni Directory** — Connect with alumni from within the dashboard
- **Messages** — Split-panel real-time chat interface
- **Events** — Browse & register for alumni events
- **Jobs & Career** — Job listings with posting capability
- **Memories** — Photo memory cards with social interactions
- **Donations** — Campaign progress bars & personal donation history

### 🛡️ Admin Panel
- **Dashboard** — Overview stats with trends, recent registrations, quick actions
- **User Management** — Full CRUD with role assignment (super_admin, admin, moderator, alumni)
- **Event Management** — Create and manage events with status tracking
- **Post Management** — Manage announcements/posts with category & review workflow
- **Featured Alumni** — Mark alumni as featured for homepage display
- **Slideshow** — Manage hero images on homepage (upload, reorder, delete)
- **Our Gallery** — Upload images for public gallery; manage and delete
- **Donation Management** — Campaigns, donor list, history, fund usage
- **Admin Profile** — Profile page for super_admin, admin, moderator with role badges
- **Analytics** — Batch distribution charts, monthly activity, top donors

---

## 🔄 কিভাবে কাজ করে (How It Works)

### Role-based Access
- **super_admin / admin / moderator** → `/admin` dashboard, `/admin/profile`, limited sidebar for moderator
- **alumni** → `/dashboard`, `/dashboard/profile`
- Navbar "Profile" & "Dashboard" links route based on logged-in user role

### Hero & Slideshow
- Admin uploads images at `/admin/slideshow` (Cloudinary)
- Home shows slideshow if images exist; otherwise fallback `Hero.jpg` or env image
- Full image visible (`object-contain`), responsive height and spacing

### Gallery System
- Admin uploads at `/admin/gallery` → saved to MongoDB (Cloudinary URLs)
- Public views at `/gallery` in grid; click opens lightbox for full-size

### Forgot / Reset Password
1. User enters email at `/forgot-password`
2. Server sends reset link with token + email to user inbox
3. User clicks link → `/reset-password?token=...&email=...`
4. User sets new password; token validated via API

### Featured Alumni
- Admin marks users as featured at `/admin/Featured-Alumni`
- Homepage displays featured alumni cards with profile links

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|:-------------|:------------------------------------|
| Framework    | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library   | [React 19](https://react.dev/)      |
| Styling      | [Tailwind CSS 4](https://tailwindcss.com/) |
| Icons        | [Lucide React](https://lucide.dev/) |
| Language     | [TypeScript 5](https://www.typescriptlang.org/) |
| Linting      | [ESLint 9](https://eslint.org/)     |

---

## 📁 Project Structure

```
alumni-portal/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Tailwind theme & global styles
│   │
│   ├── (public)/                   # Public pages (Navbar + Footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Home (hero, slideshow, featured alumni)
│   │   ├── about/page.tsx
│   │   ├── alumni/page.tsx, alumni/[id]/page.tsx
│   │   ├── events/page.tsx
│   │   ├── donations/page.tsx
│   │   ├── announcements/page.tsx, announcements/[id]/page.tsx
│   │   ├── gallery/page.tsx        # Public gallery (grid + lightbox)
│   │   ├── jobs/page.tsx
│   │   └── memories/page.tsx, memories/[id]/page.tsx
│   │
│   ├── (auth)/                     # Authentication (centered card layout)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── dashboard/                  # User dashboard (sidebar + top nav)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile/page.tsx
│   │   ├── directory/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── events/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── memories/page.tsx
│   │   └── donations/page.tsx
│   │
│   └── admin/                      # Admin panel (dark sidebar)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── users/page.tsx
│       ├── events/page.tsx
│       ├── event-registrations/page.tsx
│       ├── posts/page.tsx
│       ├── Featured-Alumni/page.tsx
│       ├── slideshow/page.tsx      # Hero slideshow management
│       ├── gallery/page.tsx        # Gallery upload & management
│       ├── profile/page.tsx        # Admin profile (role badges)
│       ├── donations/page.tsx, donor-list/, history/, fund-usage/
│       └── analytics/page.tsx
│
├── components/
│   ├── Navbar.tsx                  # Role-based Profile/Dashboard links
│   ├── Footer.tsx
│   ├── DashboardSidebar.tsx
│   ├── DashboardNavbar.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminClientLayout.tsx
│   ├── HeroSlideshow.tsx           # Home hero slideshow
│   └── FeaturedAlumni.tsx
│
├── models/
│   ├── User.ts, Post.ts, Event.ts
│   ├── Donation.ts, DonationCampaign.ts
│   ├── Slideshow.ts
│   └── Gallery.ts
│
├── app/api/                        # REST APIs (auth, admin, public)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 Design System

| Token            | Value       | Usage                        |
|:-----------------|:------------|:-----------------------------|
| `primary`        | `#0d6b58`   | Buttons, links, active states |
| `primary-dark`   | `#064e3b`   | Hero gradients, sidebar, footer |
| `primary-light`  | `#10b981`   | Gradient endpoints, accents   |
| `accent`         | `#d97706`   | CTA buttons, highlights, badges |
| `accent-light`   | `#fbbf24`   | Hero title highlights         |
| `foreground`     | `#1e293b`   | Primary text                  |
| `muted`          | `#64748b`   | Secondary text, descriptions  |
| `border`         | `#e2e8f0`   | Card borders, dividers        |
| `card`           | `#ffffff`   | Card backgrounds              |
| `background`     | `#f8fafc`   | Page background               |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

| Variable                        | Required | Description                          |
|:--------------------------------|:--------|:------------------------------------|
| `MONGO_URI`                     | Yes     | MongoDB connection string           |
| `NEXTAUTH_SECRET`               | Yes     | Secret for JWT/auth tokens          |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name           |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Cloudinary upload preset     |
| `APP_EMAIL`                     | Forgot pwd | Email for sending reset links   |
| `APP_PASSWORD`                  | Forgot pwd | App password (e.g. Gmail)      |
| `NEXT_PUBLIC_APP_URL`           | Optional | App URL (e.g. https://yoursite.com) |
| `NEXT_PUBLIC_HERO_IMAGE`        | Optional | Fallback hero image URL if no slideshow |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18 or later
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/alumni-portal.git
cd alumni-portal

# Install dependencies
npm install

# Create .env with the variables listed in Environment Variables

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📜 Available Scripts

| Command          | Description                     |
|:-----------------|:--------------------------------|
| `npm run dev`    | Start development server        |
| `npm run build`  | Create optimized production build |
| `npm start`      | Start production server          |
| `npm run lint`   | Run ESLint for code quality      |

---

## 🗺️ Route Map

| Route               | Layout    | Description                |
|:--------------------|:----------|:---------------------------|
| `/`                 | Public    | Home (hero, slideshow, featured alumni) |
| `/about`            | Public    | About the school           |
| `/alumni`            | Public    | Alumni directory           |
| `/alumni/[id]`       | Public    | Alumni profile             |
| `/events`            | Public    | Events listing             |
| `/donations`         | Public    | Donation campaigns         |
| `/announcements`     | Public    | Announcements / news       |
| `/announcements/[id]`| Public    | Announcement detail        |
| `/gallery`           | Public    | Our Gallery (grid + lightbox) |
| `/jobs`              | Public    | Jobs & career board        |
| `/memories`          | Public    | Shared memories            |
| `/login`             | Auth      | User login                 |
| `/register`          | Auth      | User registration          |
| `/forgot-password`   | Auth      | Request password reset     |
| `/reset-password`    | Auth      | Set new password (token)    |
| `/dashboard`         | Dashboard | User dashboard home        |
| `/dashboard/profile` | Dashboard | My profile                 |
| `/dashboard/directory` | Dashboard | Alumni directory (auth)  |
| `/dashboard/messages` | Dashboard | Messaging                 |
| `/dashboard/events`  | Dashboard | Events (auth)              |
| `/dashboard/jobs`    | Dashboard | Jobs & career (auth)       |
| `/dashboard/memories`| Dashboard | Memories (auth)            |
| `/dashboard/donations`| Dashboard | Donations (auth)          |
| `/admin`             | Admin     | Admin dashboard            |
| `/admin/users`       | Admin     | User management            |
| `/admin/events`      | Admin     | Event management           |
| `/admin/event-registrations` | Admin | Event registrations  |
| `/admin/posts`       | Admin     | Post / announcements       |
| `/admin/Featured-Alumni` | Admin | Featured alumni on home |
| `/admin/slideshow`   | Admin     | Hero slideshow images      |
| `/admin/gallery`     | Admin     | Gallery upload & management |
| `/admin/profile`     | Admin     | Admin profile (role badges) |
| `/admin/donations`   | Admin     | Donation campaigns         |
| `/admin/donations/donor-list` | Admin | Donor list           |
| `/admin/donations/history`    | Admin | Donation history     |
| `/admin/donations/fund-usage` | Admin | Fund usage updates  |
| `/admin/analytics`   | Admin     | Analytics & insights       |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Built with ❤️ for the alumni community of **Amtoli Model High School, Shibganj, Bogura, Bangladesh**.

---

> _"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."_

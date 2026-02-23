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
- **Home** — Hero banner, alumni highlights, upcoming events, call-to-action
- **About** — School history, mission/vision/values, milestones timeline
- **Alumni Directory** — Searchable alumni listing with batch & profession filters
- **Events** — Upcoming events with registration, type badges, and details
- **Donations** — Active fundraising campaigns with progress tracking
- **Jobs & Career** — Job opportunities shared by alumni with apply actions
- **Memories** — Shared school memories with likes, comments, and batch tags

### 🔐 Authentication
- **Login** — Clean centered card with email/password fields
- **Register** — Full registration with Name, Batch, Passing Year, Email, Password

### 📊 User Dashboard
- **Dashboard** — Stats overview, recent activity feed, upcoming events
- **My Profile** — Profile header with banner, personal info grid, completion tracker
- **Alumni Directory** — Connect with alumni from within the dashboard
- **Messages** — Split-panel real-time chat interface
- **Events** — Browse & register for alumni events
- **Jobs & Career** — Job listings with posting capability
- **Memories** — Photo memory cards with social interactions
- **Donations** — Campaign progress bars & personal donation history

### 🛡️ Admin Panel
- **Dashboard** — Overview stats with trends, recent registrations, quick actions
- **User Management** — Full CRUD table with search, filter, status badges
- **Event Management** — Create and manage events with status tracking
- **Post Management** — Manage alumni posts with category & review workflow
- **Donation Management** — Track donations with summary analytics
- **Analytics** — Batch distribution charts, monthly activity, top donors

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
│   │   ├── page.tsx                # Home
│   │   ├── about/page.tsx
│   │   ├── alumni/page.tsx
│   │   ├── events/page.tsx
│   │   ├── donations/page.tsx
│   │   ├── jobs/page.tsx
│   │   └── memories/page.tsx
│   │
│   ├── (auth)/                     # Authentication (centered card layout)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── dashboard/                  # User dashboard (sidebar + top nav)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard home
│   │   ├── profile/page.tsx
│   │   ├── directory/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── events/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── memories/page.tsx
│   │   └── donations/page.tsx
│   │
│   └── admin/                      # Admin panel (dark sidebar + table views)
│       ├── layout.tsx
│       ├── page.tsx                # Admin dashboard
│       ├── users/page.tsx
│       ├── events/page.tsx
│       ├── posts/page.tsx
│       ├── donations/page.tsx
│       └── analytics/page.tsx
│
├── components/                     # Reusable layout components
│   ├── Navbar.tsx                  # Public navigation bar
│   ├── Footer.tsx                  # Public footer
│   ├── DashboardSidebar.tsx        # User dashboard sidebar
│   ├── DashboardNavbar.tsx         # User dashboard top navbar
│   └── AdminSidebar.tsx            # Admin panel sidebar
│
├── package.json
├── tsconfig.json
├── tailwind v4 (via postcss)
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
|:---------------------|:----------|:---------------------------|
| `/`                  | Public    | Home page                  |
| `/about`             | Public    | About the school           |
| `/alumni`            | Public    | Alumni directory           |
| `/events`            | Public    | Events listing             |
| `/donations`         | Public    | Donation campaigns         |
| `/jobs`              | Public    | Jobs & career board        |
| `/memories`          | Public    | Shared memories            |
| `/login`             | Auth      | User login                 |
| `/register`          | Auth      | User registration          |
| `/dashboard`         | Dashboard | User dashboard home        |
| `/dashboard/profile` | Dashboard | My profile                 |
| `/dashboard/directory` | Dashboard | Alumni directory (auth)  |
| `/dashboard/messages` | Dashboard | Messaging                 |
| `/dashboard/events`  | Dashboard | Events (auth)              |
| `/dashboard/jobs`    | Dashboard | Jobs & career (auth)       |
| `/dashboard/memories`| Dashboard | Memories (auth)            |
| `/dashboard/donations`| Dashboard| Donations (auth)           |
| `/admin`             | Admin     | Admin dashboard            |
| `/admin/users`       | Admin     | User management            |
| `/admin/events`      | Admin     | Event management           |
| `/admin/posts`       | Admin     | Post management            |
| `/admin/donations`   | Admin     | Donation management        |
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

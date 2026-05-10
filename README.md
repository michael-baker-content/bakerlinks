# BakerLinks 🔗

A bold, expressive link-in-bio platform. Share one URL. Connect everything.

**Live at [bakerlinks.com](https://bakerlinks.com)**

---

## What is BakerLinks?

BakerLinks gives you a single, beautiful page at `bakerlinks.com/username` that you can share anywhere — your Instagram bio, Twitter profile, email signature, or anywhere else you only get one link. Add all your links once, and anyone who visits your page can find everything you want to share.

---

## Features

### Links
- Add, edit, delete, reorder, and toggle visibility without deleting
- Drag to reorder on desktop, tap up/down buttons on mobile
- Link descriptions and favicons displayed on your profile
- Click analytics with time-series charts and per-link breakdowns

### Customization
- **3 layouts** — Card (background image at top), Immersive (full-screen background with frosted glass panel), and Minimal (clean, no background)
- **6 themes** — Electric, Neon, Earthy, Light, Pastel, and a fully Custom theme with a color picker and WCAG contrast checking
- **4 fonts** — Default (Space Grotesk), Serif (Playfair Display), Mono (JetBrains Mono), and Rounded (Nunito)
- Upload a profile picture and background image, or search Unsplash
- Social links — 18 platforms, drag-to-reorder, positioned above or below your links

### About page
- Optional second tab on your profile with a custom title
- Write in markdown — headings, bold, italic, lists, blockquotes
- Stored as both raw markdown and rendered HTML

### Analytics
- Total clicks per link
- Time-series line chart for 7, 30, and 90 day ranges
- Per-link bar chart

### Account
- Email/password, Google OAuth, GitHub OAuth
- Change email or password in-dashboard
- Account deletion with username confirmation gate

---

## Stack

- **Next.js 16** — App Router, React 19, TypeScript
- **Tailwind CSS** — with @tailwindcss/typography for markdown rendering
- **Supabase** — Postgres, Auth, Row-Level Security, Storage
- **Vercel** — hosting
- **Resend** — transactional email with custom SMTP
- **Google Fonts** via next/font — Space Grotesk, Syne, Playfair Display, Lora, JetBrains Mono, Nunito
- **@dnd-kit** — drag-and-drop link and social link reordering
- **recharts** — analytics charts
- **@uiw/react-md-editor + marked** — markdown editing and rendering
- **react-icons** — social platform icons
- **Unsplash API** — background image search
- **Playwright** — end-to-end tests

---

## Self-hosting

### Prerequisites

- Node.js 18+
- Supabase project
- Vercel account (or any Next.js-compatible host)
- Resend account for transactional email (optional but recommended)
- Unsplash API key for background image search (optional)

### Setup

```bash
git clone https://github.com/michael-baker-content/bakerlinks.git
cd bakerlinks
npm install
```

Run the schema in Supabase SQL Editor:

```bash
# Copy contents of supabase-schema.sql and run in Supabase → Database → SQL Editor
```

Set environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

Configure Supabase Auth:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`, `https://yourdomain.com/auth/reset`

For OAuth, enable Google and/or GitHub under **Authentication → Providers** and add your credentials.

For email, go to **Project Settings → Authentication → SMTP Settings** and add your Resend credentials.

```bash
npm run dev
```

Deploy by pushing to GitHub and importing on Vercel. All environment variables are set as Sensitive in the Vercel dashboard.

---

## Roadmap

- Link scheduling — show and hide links on a date range
- Custom domains
- More layouts
- Password-protected links

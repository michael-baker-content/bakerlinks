# LinkForge 🔗

A bold, expressive link-in-bio platform built with Next.js + Supabase. Share one URL. Connect everything.

## Features

- **Auth** — Email/password + Google & GitHub OAuth via Supabase
- **Link management** — Add, edit, delete, hide, drag-to-reorder
- **Click tracking** — See how many times each link was clicked
- **5 themes** — Electric, Lava, Forest, Ocean, Void
- **Public profiles** — `yourdomain.com/username`
- **Fully deployable** — Vercel + Supabase (both free tiers)

---

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Open **Database → SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy your project URL and anon key

### 2. Enable OAuth providers (optional)

In Supabase: **Authentication → Providers**
- Enable Google — add your Google OAuth credentials
- Enable GitHub — add your GitHub OAuth app credentials

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

**Set your Supabase redirect URLs:**
In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## Project Structure

```
linkforge/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # Sign in / sign up
│   ├── dashboard/page.tsx    # Protected dashboard
│   └── [username]/page.tsx   # Public profile page
├── components/
│   ├── DashboardClient.tsx   # Dashboard UI + link management
│   └── PublicProfile.tsx     # Public-facing profile
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   └── server.ts         # Server Supabase client
│   ├── themes.ts             # Theme configs
│   └── types.ts              # TypeScript types
├── middleware.ts              # Auth redirect middleware
└── supabase-schema.sql        # Database schema (run once)
```

---

## Customization Ideas

- Add avatar upload (Supabase Storage)
- Add social icons / icon picker per link
- Analytics dashboard with charts
- Custom domains
- Link scheduling (time-based visibility)
- Password-protected links

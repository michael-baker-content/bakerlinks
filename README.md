# BakerLinks 🔗

A bold, expressive link-in-bio platform. Share one URL. Connect everything.

**Live at [bakerlinks.com](https://bakerlinks.com)**

## Features

- **Auth** — Email/password, Google OAuth, GitHub OAuth
- **Email verification** — Transactional email via Resend
- **Forgot password** — Full reset flow with branded email
- **Link management** — Add, edit, delete, hide, drag-to-reorder
- **Click tracking** — See how many times each link was clicked
- **5 themes** — Electric, Lava, Forest, Ocean, Void
- **Public profiles** — `bakerlinks.com/username`
- **Password change** — In-dashboard password management
- **Pixel art branding** — Custom NES-style logo

## Tech Stack

- **Frontend** — Next.js 16, React, Tailwind CSS, TypeScript
- **Backend** — Supabase (Postgres, Auth, RLS)
- **Email** — Resend (custom SMTP)
- **Hosting** — Vercel
- **Drag and drop** — @dnd-kit

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Open **Database → SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy your project URL and anon key

### 2. Configure Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Copy your API key

### 3. Configure OAuth (optional)

In Supabase → **Authentication → Providers**:

- Enable Google — add your Google Cloud OAuth credentials
- Enable GitHub — add your GitHub OAuth app credentials

### 4. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

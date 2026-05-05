# BakerLinks 🔗

A bold, expressive link-in-bio platform. Share one URL. Connect everything.

**Live at [bakerlinks.com](https://bakerlinks.com)**

## Features

- **Auth** — Email/password, Google OAuth, GitHub OAuth
- **Email verification** — Transactional email via Resend
- **Forgot/reset password** — Full reset flow with branded email
- **Link management** — Add, edit, delete, hide, drag-to-reorder
- **Click tracking** — See how many times each link was clicked
- **5 themes** — Electric, Neon, Earthy, Light, Pastel (dark/light mode support)
- **Public profiles** — `bakerlinks.com/username`
- **Avatar & background images** — Upload or search Unsplash
- **Social links** — Platform icons with theme-matched colors
- **Password & email change** — In-dashboard account management
- **Delete account** — With username confirmation gate
- **Onboarding flow** — Guided empty state for new users
- **Open Graph** — Profile meta tags for rich social sharing
- **Mobile optimized** — Responsive dashboard with dropdown menu
- **Pixel art branding** — Custom NES-style logo

## Tech Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS, TypeScript
- **Backend** — Supabase (Postgres, Auth, RLS, Storage)
- **Email** — Resend (custom SMTP, branded templates)
- **Hosting** — Vercel
- **Drag and drop** — @dnd-kit
- **Icons** — react-icons (Simple Icons, Font Awesome 6)
- **Images** — Unsplash API

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **Database → SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy your project URL and anon key

### 2. Configure Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Copy your API key
4. In Supabase go to **Project Settings → Authentication → SMTP Settings** and enter your Resend credentials

### 3. Configure OAuth (optional)

In Supabase go to **Authentication → Providers**:
- Enable Google — add your Google Cloud OAuth credentials
- Enable GitHub — add your GitHub OAuth app credentials

### 4. Configure Unsplash (optional)

1. Create an account at [unsplash.com/developers](https://unsplash.com/developers)
2. Create a new application and copy the Access Key

### 5. Environment variables

Copy the example file and fill in your values:

```
cp .env.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

### 6. Run locally

```
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import project at vercel.com
3. Add environment variables in the Vercel dashboard
4. Deploy

Update Supabase under **Authentication → URL Configuration**:
- Site URL: https://yourdomain.com
- Redirect URLs: https://yourdomain.com/auth/callback and https://yourdomain.com/auth/reset

## Project Structure

```
bakerlinks/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── auth/
│   │   ├── page.tsx                  # Sign in / sign up
│   │   ├── callback/route.ts         # OAuth + email callback
│   │   └── reset/page.tsx            # Password reset
│   ├── dashboard/page.tsx            # Protected dashboard
│   ├── [username]/page.tsx           # Public profile page
│   └── api/
│       └── delete-account/route.ts   # Account deletion API
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx       # Top navigation bar
│   │   ├── LinksTab.tsx              # Link management tab
│   │   ├── ProfileTab.tsx            # Profile settings tab
│   │   ├── EmailSection.tsx          # Email change form
│   │   ├── PasswordSection.tsx       # Password change form
│   │   └── DeleteAccountSection.tsx  # Danger zone
│   ├── DashboardClient.tsx           # Dashboard orchestrator
│   ├── PublicProfile.tsx             # Public-facing profile
│   ├── ImageUpload.tsx               # Avatar/background uploader
│   ├── UnsplashPicker.tsx            # Unsplash search modal
│   ├── SocialIcon.tsx                # Social platform icon renderer
│   ├── SocialLinksEditor.tsx         # Social links dashboard editor
│   └── SocialLinksDisplay.tsx        # Social icons on public profile
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client
│   ├── themes.ts                     # Theme configs (5 themes)
│   ├── social-platforms.ts           # Platform definitions and URL templates
│   └── types.ts                      # TypeScript types
├── public/
│   ├── bakerlinks-logo-A.svg         # Primary logo (purple)
│   └── bakerlinks-logo-B.svg         # Alternate logo (dark)
├── proxy.ts                          # Auth session middleware
└── supabase-schema.sql               # Database schema (run once)
```

## Roadmap

- Custom domains for users
- Analytics dashboard with charts
- Link scheduling
- Password-protected links
- Avatar uploads via camera on mobile
- Email template customization UI

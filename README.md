# BakerLinks 🔗

A bold, expressive link-in-bio platform. Share one URL. Connect everything.

**Live at [bakerlinks.com](https://bakerlinks.com)**

---

## What is BakerLinks?

BakerLinks gives you a single, beautiful page at `bakerlinks.com/username` that you can share anywhere — your Instagram bio, Twitter profile, email signature, or anywhere else you only get one link. Add all your links once, and anyone who visits your page can find everything you want to share.

---

## Features

### Links
- Add, edit, delete, and reorder your links
- Show or hide individual links without deleting them
- Drag to reorder on desktop, tap up/down buttons on mobile
- Link descriptions and favicons displayed on your profile
- Click analytics — see how many times each link has been clicked

### Customization
- **3 layouts** — Card, Immersive, and Minimal
- **6 themes** — Electric, Neon, Earthy, Light, Pastel, and a fully Custom theme with a color picker
- **4 fonts** — Default, Serif, Mono, and Rounded
- Upload a profile picture and background image, or search Unsplash
- Social links — 18 platforms, reorderable, positioned above or below your links

### About page
- Optional second tab on your profile
- Write in markdown — supports headings, bold, italic, lists, and blockquotes
- Give context to your links, describe your work, or tell your story

### Analytics
- See total clicks and clicks over the last 7, 30, or 90 days
- Per-link bar chart to see what's performing best

### Account
- Sign up with email, Google, or GitHub
- Change your email or password at any time
- Delete your account with a confirmation gate

---

## Tech Stack

- **Frontend** — Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** — Supabase (Postgres, Auth, Row-Level Security, Storage)
- **Email** — Resend with custom branded templates
- **Hosting** — Vercel
- **Fonts** — Google Fonts via next/font
- **Drag and drop** — @dnd-kit
- **Charts** — recharts
- **Markdown** — @uiw/react-md-editor, marked
- **Icons** — react-icons
- **Images** — Unsplash API

---

## Self-hosting

BakerLinks is open source. You can run your own instance.

### Requirements

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (or any Next.js host)
- A [Resend](https://resend.com) account for transactional email (optional)
- An [Unsplash](https://unsplash.com/developers) API key for background image search (optional)

### 1. Clone and install

```
git clone https://github.com/michael-baker-content/bakerlinks.git
cd bakerlinks
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open **Database → SQL Editor** and run `supabase-schema.sql`
3. Go to **Settings → API** and copy your project URL and anon key

### 3. Configure OAuth (optional)

In Supabase go to **Authentication → Providers**:
- Enable Google — add your Google Cloud OAuth credentials
- Enable GitHub — add your GitHub OAuth app credentials

### 4. Configure Resend (optional)

1. Create an account at [resend.com](https://resend.com) and verify your domain
2. In Supabase go to **Project Settings → Authentication → SMTP Settings** and enter your Resend credentials

### 5. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

### 6. Run locally

```
npm run dev
```

### 7. Deploy

Push to GitHub, import at [vercel.com](https://vercel.com), add your environment variables, and deploy.

Update Supabase under **Authentication → URL Configuration**:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback` and `https://yourdomain.com/auth/reset`

---

## Roadmap

- Link scheduling — show and hide links on a date range
- Custom domains
- More layouts
- Password-protected links

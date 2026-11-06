# BakerLinks

Make a personal page for your projects, social links, and story. Share it at one address and discover what other people are making.

[Visit BakerLinks](https://bakerlinks.com) · [See Michael’s profile](https://bakerlinks.com/michael)

## What you can do

- **Build your page.** Add and reorder links, write descriptions, and hide links you want to keep for later. Choose a Card, Immersive, or Minimal layout, then customize the theme, font, and images.
- **Tell your story.** Add a Markdown About tab and give people ways to find you on social platforms.
- **Discover people.** Browse photo cards in the directory at `/site/directory`, search by name, username, or bio, and filter for About tabs or social links. A profile appears when an admin verifies it and its owner opts in from the dashboard’s **Profile** tab. Owners can opt out without changing their public profile URL.
- **See what people click.** The dashboard shows per-link totals and trends over 7, 30, or 90 days. Opening a profile or directory card does not add an outbound link click.

BakerLinks uses Next.js 16, React 19, TypeScript, Tailwind CSS, and Supabase for Auth, Postgres, and Storage. The live app runs on Vercel.

## Run locally

You’ll need **Node.js 22.12 or newer**, npm, and a Supabase project. Resend is optional for custom SMTP, and an Unsplash access key is optional for background image search.

### 1. Install dependencies

```sh
git clone https://github.com/michael-baker-content/bakerlinks.git
cd bakerlinks
npm ci
```

### 2. Set up Supabase

In a **new Supabase project**, run these files in order in the SQL Editor:

1. [supabase-schema.sql](supabase-schema.sql) creates the base tables, access policies, and signup trigger.
2. [supabase-profile-customization.sql](supabase-profile-customization.sql) adds fields for styling, social links, and About, plus policies for profile images.
3. [supabase-link-analytics.sql](supabase-link-analytics.sql) adds click history and records an event and total together.
4. [supabase-profile-directory.sql](supabase-profile-directory.sql) adds verification and owner opt-in.

If your project already has the base tables, skip the base script and apply any missing follow-up scripts. These preserve existing profile values, click totals, and verification records.

In **Storage**, create two **public** buckets named `avatars` and `backgrounds`. Use the settings below for new buckets. Existing buckets must be public for uploaded images to display on public profiles.

| Bucket | File size limit | Allowed MIME types |
| --- | --- | --- |
| `avatars` | 2 MB | `image/jpeg`, `image/png`, `image/webp` |
| `backgrounds` | 5 MB | `image/jpeg`, `image/png`, `image/webp` |

The upload policy limits image changes to the signed-in user’s folder. [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

### 3. Configure the environment

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-or-service-role-key

# Optional
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
BAKERLINKS_ADMIN_USER_IDS=your-supabase-user-uid
```

The variable names match the app. Supabase’s newer publishable and secret keys can be used in the existing variables. `NEXT_PUBLIC_` values are sent to the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` and `BAKERLINKS_ADMIN_USER_IDS` on the server and out of Git. The elevated Supabase key is used for verification and account deletion. [Supabase API key guide](https://supabase.com/docs/guides/getting-started/api-keys)

### 4. Configure sign-in and start the app

In **Authentication → URL Configuration**, use `http://localhost:3000` as the Site URL for a local-only project and add these allowed redirect URLs:

- `http://localhost:3000/auth/callback` for sign-up confirmation and OAuth
- `http://localhost:3000/auth/reset` for password recovery

Enable Google or GitHub in Supabase if you want OAuth, and configure custom SMTP if you’re using Resend.

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Grant admin access

Copy the intended account’s **User UID** from Supabase **Authentication → Users**. In the SQL Editor, replace the placeholder with that UID:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"bakerlinks_admin": true}'::jsonb
where id = 'paste-the-user-uid-here'::uuid
returning id, raw_app_meta_data -> 'bakerlinks_admin' as bakerlinks_admin;
```

The account sees **Validation** in its dashboard. An admin can approve their own profile or search for another profile and verify or revoke it. Set the flag to `false` to revoke admin access, even if the UID is also in an environment allowlist.

Accounts without a flag can still use `BAKERLINKS_ADMIN_USER_IDS`. Set it to one or more comma-separated User UIDs in the server environment for each deployment that should recognize them.

## Deploy

Import the repository into Vercel or another Next.js host that supports Node.js 22.12 or newer. Apply the database and storage setup to the Supabase project that deployment uses, and configure the environment variables for that deployment.

Set the Supabase Site URL to the production origin and allow its `/auth/callback` and `/auth/reset` URLs. Add preview origins only if you intend to test authentication there. Keep the localhost URLs allowed if you also use that Supabase project for local development.

For a separate installation, update the hard-coded BakerLinks domain and branding, the `/michael` example links, and the operator and support details on the Contact, Privacy, and Terms pages before publishing.

## Checks and browser tests

```sh
npm run lint
npm run build
npx playwright install chromium
npx playwright test tests/landing.spec.ts
```

Playwright uses `http://localhost:3000` and can start the dev server. For the full suite, seed an email/password test account and a public profile in a test Supabase project, then set these values in the ignored `.env.test.local` file or in your CI environment:

```dotenv
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-account-password
TEST_USERNAME=your-public-test-profile
```

Run `npx playwright test`. Tests that need a fixture skip when its variables are missing. Use a test Supabase project for the app’s `.env.local` when running signed-in tests.

## Roadmap

- Scheduled links
- Custom domains
- More layouts
- Password-protected links

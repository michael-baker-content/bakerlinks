import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy | BakerLinks' }

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy</h1>
      <p>BakerLinks lets you create a public page for your links and profile. Here’s what the app uses to run your account and page.</p>

      <h2>Account and sign-in</h2>
      <p>BakerLinks uses your email address for your account. Supabase handles authentication and uses cookies to keep you signed in. If you choose Google or GitHub sign-in, that provider shares account information with Supabase so you can sign in.</p>

      <h2>Your public page</h2>
      <p>Your username, display name, bio, photos, About content, social links, and active links can appear publicly. The initial username and display name may be based on the part of your email address before the @ sign. You can edit them in the dashboard.</p>
      <p>If an admin verifies your page and you opt in, the directory lists your name, username, profile picture, and bio. You can opt out in your dashboard. Your profile remains accessible by its direct link.</p>

      <h2>Click analytics</h2>
      <p>When someone clicks a link on a public profile, BakerLinks attempts to record the link and the profile it belongs to. Profile owners can see click counts and trends in their dashboard. Linked sites handle visits under their own privacy practices.</p>

      <h2>Managing your information</h2>
      <p>Use the dashboard to edit your profile, hide or remove links, or request account deletion. For questions about information associated with your account or a public page, <Link href="/site/contact">contact BakerLinks</Link>.</p>
    </>
  )
}

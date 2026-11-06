import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Contact | BakerLinks' }

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>
      <p>For help with BakerLinks, a privacy question, or to report a public page, contact Michael Baker on LinkedIn.</p>
      <p><a href="https://www.linkedin.com/in/michael-baker-content/">Find Michael on LinkedIn</a></p>

      <h2>Account help</h2>
      <p>If you forgot your password, select the password reset option on the <Link href="/auth">sign-in page</Link>. If you still need help, include your BakerLinks username and a short description of what happened. Keep passwords and reset links private.</p>

      <h2>Report a page</h2>
      <p>Include the BakerLinks page URL and explain what you’re reporting. If a specific link is involved, include its title or destination.</p>
    </>
  )
}

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-[#05050a] noise overflow-hidden relative flex flex-col">
      {/* Background gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="font-display text-2xl font-bold text-white tracking-tight">
          Baker<span className="text-purple-400">Links</span>
        </span>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="px-5 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth?mode=signup"
            className="px-5 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Your link in bio, the Baker way
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 max-w-4xl">
          One link.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            Everything you are.
          </span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Build a bold, expressive link page that actually looks like <em>you</em>.
          Share one URL. Connect everything.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/auth?mode=signup"
            className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-purple-100 transition-all text-lg hover:scale-105 active:scale-95"
          >
            Forge yours free →
          </Link>
          <span className="text-white/30 text-sm">No credit card needed</span>
        </div>

        {/* Demo preview */}
        <div className="mt-20 w-full max-w-sm mx-auto">
          <div className="relative rounded-2xl border border-purple-500/20 bg-[#0e0e1a] p-6 text-left shadow-2xl shadow-purple-500/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg font-display">
                A
              </div>
              <div>
                <p className="text-white font-semibold text-sm">@yourname</p>
                <p className="text-white/40 text-xs">Designer & maker</p>
              </div>
            </div>
            {[
              { label: '🎨 My Portfolio', accent: 'border-purple-500/50' },
              { label: '🐦 Twitter / X', accent: 'border-pink-500/50' },
              { label: '📸 Instagram', accent: 'border-orange-500/50' },
              { label: '💼 LinkedIn', accent: 'border-blue-500/50' },
            ].map((item, i) => (
              <div
                key={i}
                className={`mb-2 px-4 py-3 rounded-xl border ${item.accent} bg-white/5 text-white text-sm font-medium link-card hover:bg-white/10 cursor-pointer`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

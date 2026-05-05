'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import SocialIcon from '@/components/SocialIcon'

const demoLinks = [
  { id: '1', title: '🎨 My Portfolio', url: '#', description: 'Design work & case studies' },
  { id: '2', title: '✍️ My Blog', url: '#', description: 'Thoughts on design & tech' },
  { id: '3', title: '📬 Newsletter', url: '#', description: 'Subscribe for weekly updates' },
]

const demoSocials = [
  { platform: 'twitter', icon: 'FaXTwitter' },
  { platform: 'instagram', icon: 'FaInstagram' },
  { platform: 'dribbble', icon: 'FaDribbble' },
  { platform: 'github', icon: 'FaGithub' },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  function scrollToDemo() {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToHero() {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main
      className="bg-[#05050a] text-white overflow-x-hidden"
      style={{
        height: '100dvh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Screen 1 */}
      <section
        ref={heroRef}
        className="relative flex flex-col noise"
        style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-pink-600/8 blur-[120px] pointer-events-none" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
          <span className="font-display text-2xl font-bold tracking-tight">
            Baker<span className="text-purple-400">Links</span>
          </span>
          <div className="flex gap-3">
            <Link
              href="/auth"
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors font-medium"
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Your link in bio
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.0] tracking-tight mb-5 max-w-xl">
            All your links.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              One beautiful page.
            </span>
          </h1>

          <p className="text-white/50 text-lg max-w-xs mx-auto mb-10 leading-relaxed">
            Create your page in minutes. Share one link everywhere.
          </p>

          <Link
            href="/auth?mode=signup"
            className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-purple-100 transition-all text-base hover:scale-105 active:scale-95"
          >
            Create your page
          </Link>
        </div>

        <div className="relative z-10 flex justify-center pb-8">
          <button
            onClick={scrollToDemo}
            className="text-white/20 hover:text-white/50 transition-colors animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* Screen 2 */}
      <section
        ref={demoRef}
        className="relative flex flex-col noise"
        style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        {/* Up arrow */}
        <div className="relative z-10 flex justify-center pt-6">
          <button
            onClick={scrollToHero}
            className="text-white/20 hover:text-white/50 transition-colors"
            aria-label="Scroll up"
          >
            <ChevronUp size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Example profile</p>

          {/* Phone frame */}
          <div className="relative w-full max-w-[300px] rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10">

            {/* Background gradient — full color layer */}
            <div
              className="absolute top-0 left-0 right-0 h-32"
              style={{
                background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #db2777 70%, #ea580c 100%)',
              }}
            />
            {/* Fade to dark at bottom of gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-32"
              style={{
                background: 'linear-gradient(to bottom, transparent 50%, #0e0e1a 100%)',
              }}
            />

            {/* Notch superimposed over gradient */}
            <div className="relative z-10 flex justify-center pt-3">
              <div className="w-20 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Spacer behind gradient */}
            <div className="h-20" />

            {/* Avatar — transparent background so gradient shows through */}
            <div className="relative z-10 flex flex-col items-center -mt-7 px-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-lg mb-3 ring-2 ring-[#0e0e1a]">
                AR
              </div>
              <h2 className="font-display text-base font-bold text-white">Alex Rivera</h2>
              <p className="text-white/40 text-xs mt-0.5">@alexrivera</p>
              <p className="text-white/50 text-xs text-center mt-1.5 leading-relaxed">
                Designer & maker. Building things that matter.
              </p>
            </div>

            {/* Rest of content with solid background */}
            <div className="relative z-10 px-5 pb-6 bg-[#0e0e1a]">
              <div className="flex justify-center gap-3 my-4">
                {demoSocials.map(s => (
                  <div key={s.platform} className="p-2 rounded-xl border border-white/10 bg-white/5">
                    <SocialIcon iconName={s.icon} size={16} color="#a78bfa" />
                  </div>
                ))}
              </div>

              <div className="space-y-2 w-full">
                {demoLinks.map(link => (
                  <div key={link.id} className="px-3 py-2.5 rounded-xl border border-[#7c3aed]/40 bg-[#13131f]">
                    <p className="text-white font-semibold text-xs">{link.title}</p>
                    {link.description && (
                      <p className="text-white/40 text-xs mt-0.5">{link.description}</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-white/20 text-xs mt-4">
                Powered by <span className="font-display font-semibold">BakerLinks</span>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-6">Ready to create yours?</p>
            <Link
              href="/auth?mode=signup"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 text-base"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

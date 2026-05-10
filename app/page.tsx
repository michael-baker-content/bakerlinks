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
  const featuresRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  function scrollToFeatures() { featuresRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  function scrollToDemo() { demoRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  function scrollToHero() { heroRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  function scrollToFeaturesFromDemo() { featuresRef.current?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <main
  className="bg-[#05050a] text-white overflow-x-hidden min-w-[320px]"
  style={{ height: '100dvh', overflowY: 'scroll', scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}
>
      {/* Screen 1 — Hero */}
      <section
        ref={heroRef}
        className="relative flex flex-col wave-bg"
        style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-pink-600/8 blur-[120px] pointer-events-none" />

        <nav className="relative z-10 flex items-center justify-between px-4 py-4 max-w-5xl mx-auto w-full">
          <span className="font-display text-lg font-bold tracking-tight flex-shrink-0">
            Baker<span className="text-purple-400">Links</span>
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="hidden min-[350px]:block px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors font-medium"
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
          <h1 className="font-serif-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-5 max-w-xl">
            One link for everything — {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              your portfolio, socials, blog, and more
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xs mx-auto mb-10 leading-relaxed">
            Create your page in minutes. Share one link everywhere.
          </p>
          <Link href="/auth?mode=signup" className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-purple-100 transition-all text-base hover:scale-105 active:scale-95">
            Create your page
          </Link>
        </div>

        <div className="relative z-10 flex justify-center pb-8">
          <button onClick={scrollToFeatures} className="text-white/20 hover:text-white/50 transition-colors animate-bounce" aria-label="Scroll down">
            <ChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* Screen 2 — Features */}
      <section
        ref={featuresRef}
        className="relative flex flex-col wave-bg"
        style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex justify-center pt-6">
          <button onClick={scrollToHero} className="text-white/20 hover:text-white/50 transition-colors" aria-label="Scroll up">
            <ChevronUp size={28} />
          </button>
        </div>

        <div
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 40px)' }}
        >
          <p className="text-white/30 text-xs uppercase tracking-widest mb-6">Built for you</p>

          <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 md:gap-6">

            {/* Themes */}
            <div className="flex-1 flex flex-row md:flex-col items-center gap-4 md:gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
                <div className="w-12 rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0f]">
                  <div className="flex justify-center py-1"><div className="w-6 h-0.5 rounded-full bg-white/20" /></div>
                  <div className="px-1 pb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-0.5" />
                    <div className="h-2 rounded bg-[#13131f] border border-purple-500/30 mb-0.5" />
                    <div className="h-2 rounded bg-[#13131f] border border-purple-500/30 mb-0.5" />
                    <div className="h-2 rounded bg-[#13131f] border border-purple-500/30" />
                  </div>
                </div>
                <div className="w-12 rounded-xl border border-white/10 overflow-hidden bg-[#fffbf0]">
                  <div className="flex justify-center py-1 bg-[#fffbf0]"><div className="w-6 h-0.5 rounded-full bg-black/15" /></div>
                  <div className="px-1 pb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-0.5" />
                    <div className="h-2 rounded bg-white border border-amber-400 mb-0.5" />
                    <div className="h-2 rounded bg-white border border-amber-400 mb-0.5" />
                    <div className="h-2 rounded bg-white border border-amber-400" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:text-center">
                <p className="text-white font-semibold text-sm mb-1">In living color</p>
                <p className="text-white/50 text-xs leading-relaxed">Choose from dark, light, and pastel themes. Your page can feel minimal and clean, bold and dramatic, or warm and approachable.</p>
              </div>
            </div>

            {/* Layouts */}
            <div className="flex-1 flex flex-row md:flex-col items-center gap-4 md:gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
                <div className="w-12 rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0f]">
                  <div className="h-6 bg-gradient-to-b from-purple-900/60 to-[#0a0a0f] relative">
                    <div className="absolute top-1 left-0 right-0 flex justify-center"><div className="w-6 h-0.5 rounded-full bg-white/20" /></div>
                  </div>
                  <div className="px-1 pb-1.5 -mt-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-0.5 ring-1 ring-[#0a0a0f]" />
                    <div className="h-2 rounded bg-[#13131f] border border-purple-500/30 mb-0.5" />
                    <div className="h-2 rounded bg-[#13131f] border border-purple-500/30" />
                  </div>
                </div>
                <div className="w-12 rounded-xl border border-white/10 overflow-hidden relative" style={{ minHeight: '70px' }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #db2777)' }} />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10">
                    <div className="flex justify-center py-1"><div className="w-6 h-0.5 rounded-full bg-white/20" /></div>
                    <div className="mx-1 mb-1 rounded-lg bg-black/30 p-1">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-0.5" />
                      <div className="h-2 rounded bg-white/10 border border-white/20 mb-0.5" />
                      <div className="h-2 rounded bg-white/10 border border-white/20" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:text-center">
                <p className="text-white font-semibold text-sm mb-1">New perspectives</p>
                <p className="text-white/50 text-xs leading-relaxed">Pick a layout that fits your personality. The Card layout is clean and structured. Immersive lets your background image take center stage.</p>
              </div>
            </div>

            {/* About page */}
            <div className="flex-1 flex flex-row md:flex-col items-center gap-4 md:gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="w-12 rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0f] flex-shrink-0">
                <div className="flex justify-center py-1"><div className="w-6 h-0.5 rounded-full bg-white/20" /></div>
                <div className="px-1 pb-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-0.5" />
                  <div className="flex gap-0.5 mb-1">
                    <div className="flex-none px-1 py-0.5 rounded bg-purple-600" style={{ fontSize: '4px', color: 'white' }}>Links</div>
                    <div className="flex-1 py-0.5 rounded bg-white/10 text-center" style={{ fontSize: '4px', color: 'rgba(255,255,255,0.4)' }}>About</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1 rounded bg-white/20 w-full" />
                    <div className="h-1 rounded bg-white/15 w-4/5" />
                    <div className="h-1 rounded bg-white/10 w-full" />
                    <div className="h-1 rounded bg-white/10 w-3/5" />
                    <div className="h-1 rounded bg-white/10 w-4/5" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:text-center">
                <p className="text-white font-semibold text-sm mb-1">Tell your story</p>
                <p className="text-white/50 text-xs leading-relaxed">Add a second tab to your profile where you can describe your work, share your background, or give context to your links — written in markdown.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/auth?mode=signup"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 text-base"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-6">
          <button onClick={scrollToDemo} className="text-white/20 hover:text-white/50 transition-colors animate-bounce" aria-label="Scroll down">
            <ChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* Screen 3 — Demo */}
      <section
        ref={demoRef}
        className="relative flex flex-col wave-bg"
        style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex justify-center pt-6">
          <button onClick={scrollToFeaturesFromDemo} className="text-white/20 hover:text-white/50 transition-colors" aria-label="Scroll up">
            <ChevronUp size={28} />
          </button>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4" style={{ paddingBottom: 'env(safe-area-inset-bottom, 80px)' }}>
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Example profile</p>
          <div className="relative w-full max-w-[300px] rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10 bg-[#0a0a0f]">
            <div className="absolute top-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #db2777 70%, #ea580c 100%)' }} />
            <div className="absolute top-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent 50%, #0a0a0f 100%)' }} />
            <div className="relative z-10 flex justify-center pt-3"><div className="w-20 h-1.5 rounded-full bg-white/20" /></div>
<div className="h-20" />
<div className="relative z-10 flex flex-col items-center -mt-7 px-5">
  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-lg mb-3 ring-2 ring-[#0a0a0f]">AR</div>
  <h2 className="font-display text-base font-bold text-white">Alex Rivera</h2>
              <p className="text-white/40 text-xs mt-0.5">@alexrivera</p>
              <p className="text-white/50 text-xs text-center mt-1.5 leading-relaxed">Designer & maker. Building things that matter.</p>
            </div>
            <div className="relative z-10 px-5 pb-6 bg-[#0a0a0f]">
              <div className="flex justify-center gap-3 my-4">
                {demoSocials.map(s => (
                  <div key={s.platform} className="p-2 rounded-xl border border-white/10 bg-white/5">
                    <SocialIcon iconName={s.icon} size={16} color="#a78bfa" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {demoLinks.map(link => (
                  <div key={link.id} className="px-3 py-2.5 rounded-xl border border-[#7c3aed]/40 bg-[#13131f]">
                    <p className="text-white font-semibold text-xs">{link.title}</p>
                    {link.description && <p className="text-white/40 text-xs mt-0.5">{link.description}</p>}
                  </div>
                ))}
              </div>
              <p className="text-center text-white/20 text-xs mt-4">Powered by <span className="font-display font-semibold">BakerLinks</span></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

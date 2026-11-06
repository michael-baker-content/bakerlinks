import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import styles from './home.module.css'
import { SiteFooter, SiteHeader } from './site-chrome'

const signup = '/auth?mode=signup'
const example = '/michael'

const layouts = [
  { name: 'Card', description: 'A framed introduction with room for a favorite photo.', style: 'card' },
  { name: 'Immersive', description: 'A full-bleed backdrop that sets the mood.', style: 'immersive' },
  { name: 'Minimal', description: 'A quiet canvas that puts the links first.', style: 'minimal' },
] as const

export default function Home() {
  return (
    <div className={styles.home}>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <section className={styles.shell + ' ' + styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <h1 id="home-title">It all adds up<br />to you.</h1>
            <p className={styles.intro}>Give your projects, socials, and story a page of their own.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={signup}>Create your page <ArrowRight size={18} /></Link>
              <Link className={styles.secondary} href={example}>See a live example <ArrowUpRight size={17} /></Link>
            </div>
            <p className={styles.note}><Check size={15} /> Free to use <span /> <Check size={15} /> Ad-free</p>
          </div>

          <Link className={styles.poster} href={example} aria-label="See how Michael brings his work, links, and story together at bakerlinks.com/michael">
            <svg viewBox="0 0 560 400" aria-hidden="true">
              <rect x="24" y="48" width="216" height="216" fill="var(--clay)" />
              <circle cx="336" cy="136" r="112" fill="var(--ochre)" />
              <rect x="168" y="200" width="336" height="168" fill="var(--lilac)" />

              <g fill="currentColor" className={styles.posterLabel}>
                <text x="48" y="88">Work</text>
                <text x="336" y="92" textAnchor="middle">Links</text>
                <text x="192" y="336">About</text>
              </g>
              <g fill="currentColor">
                <path d="M48 112h96v56H48zm8 16v32h80v-32z" fillRule="evenodd" />
                <path d="M376 296h96v8h-96zm0 16h72v8h-72zm0 16h88v8h-88z" />
              </g>
              <g fill="none" stroke="currentColor" strokeWidth="8">
                <rect x="296" y="120" width="48" height="24" rx="12" />
                <rect x="328" y="120" width="48" height="24" rx="12" />
              </g>

              <path className={styles.posterStrip} d="M56 192h440v-16l56 48-56 48v-16H56z" />
              <text className={styles.posterAddress} x="80" y="233">bakerlinks.com/michael</text>
            </svg>
          </Link>
        </section>

        <section id="layouts" className={styles.shell + ' ' + styles.section} aria-labelledby="layouts-title">
          <div className={styles.sectionHeading}>
            <h2 id="layouts-title">Choose a layout.</h2>
            <p>Make it yours with a theme, a font, and your own photos.</p>
          </div>
          <div className={styles.layoutGrid}>
            {layouts.map(({ name, description, style }, index) => (
              <article key={name} className={styles.layoutItem}>
                <div className={styles.layoutArt + ' ' + styles[style]} aria-hidden="true">
                  <span className={styles.layoutIndex}>0{index + 1}</span>
                  <div className={styles.miniPage}>
                    <div className={styles.miniCover} />
                    <div className={styles.miniAvatar} />
                    <div className={styles.miniName} />
                    <div className={styles.miniLinks}><i /><i /><i /></div>
                  </div>
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className={styles.aboutNote}>Add an <strong>About tab</strong> to introduce yourself and tell the story behind your links.</p>
        </section>

        <section className={styles.shell + ' ' + styles.closing} aria-labelledby="closing-title">
          <h2 id="closing-title">What will you share?</h2>
          <Link className={styles.primary} href={signup}>Get started for free <ArrowRight size={18} /></Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

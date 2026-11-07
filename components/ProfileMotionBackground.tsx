'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { getProfileBackground } from '@/lib/profile-backgrounds'
import styles from './ProfileMotionBackground.module.css'

interface Props {
  backgroundId: string | null | undefined
  thumbnail?: boolean
}

export default function ProfileMotionBackground({ backgroundId, thumbnail = false }: Props) {
  const background = getProfileBackground(backgroundId)
  const videoRef = useRef<HTMLVideoElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [canAnimate, setCanAnimate] = useState(false)
  const [visible, setVisible] = useState(true)
  const [failedSource, setFailedSource] = useState<string | undefined>()

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const update = () => setCanAnimate(!preference.matches && !connection?.saveData)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const surface = surfaceRef.current
    if (!surface) return
    let inView = true
    const update = () => setVisible(inView && !document.hidden)
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting
      update()
    })
    observer.observe(surface)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const playing = canAnimate && !paused && visible && !thumbnail
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) void video.play().catch(() => { /* Keep the poster if autoplay is unavailable. */ })
    else video.pause()
  }, [playing, backgroundId])

  if (!background) return null

  const colors = {
    '--motion-base': background.colors[0],
    '--motion-one': background.colors[1],
    '--motion-two': background.colors[2],
  } as CSSProperties

  return (
    <>
      <div ref={surfaceRef} className={styles.surface} style={colors} data-pattern={background.pattern} data-paused={!playing} aria-hidden="true">
        {background.kind === 'video' ? (
          <>
            {/* The still is visible before playback, for reduced motion, and on video failure. */}
            {background.poster && <img className={styles.poster} src={background.poster} alt="" />}
            {!thumbnail && canAnimate && failedSource !== background.src && (
              <video ref={videoRef} src={background.src} poster={background.poster} muted loop playsInline preload="none"
                onError={() => setFailedSource(background.src)} />
            )}
          </>
        ) : <><span className={styles.shape} /><span className={styles.shape} /><span className={styles.shape} /></>}
        <div className={styles.shade} />
      </div>
      {!thumbnail && canAnimate && (background.kind === 'abstract' || failedSource !== background.src) && (
        <button type="button" className={styles.control} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          {paused ? 'Play background' : 'Pause background'}
        </button>
      )}
      {!thumbnail && background.credit && (
        <span className={styles.credit}><a href={background.credit.url} target="_blank" rel="noopener noreferrer">Video / {background.credit.name}</a></span>
      )}
    </>
  )
}

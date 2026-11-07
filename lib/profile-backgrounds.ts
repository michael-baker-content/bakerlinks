export interface ProfileBackground {
  id: string
  name: string
  description: string
  kind: 'abstract' | 'video'
  colors: [string, string, string]
  pattern?: 'orbits' | 'ribbons' | 'tide' | 'prism' | 'eclipse'
  src?: string
  poster?: string
  credit?: { name: string; url: string }
}

// Only this curated catalog supplies motion sources. Profiles store an ID, never a video URL.
export const profileBackgrounds: ProfileBackground[] = [
  { id: 'clay-orbits', name: 'Clay orbits', description: 'Terracotta circles in a slow orbit.', kind: 'abstract', colors: ['#30262f', '#b36c54', '#cfab77'], pattern: 'orbits' },
  { id: 'silk-ribbons', name: 'Silk ribbons', description: 'Soft folds of plum and dusty lilac.', kind: 'abstract', colors: ['#30283e', '#837094', '#b595a0'], pattern: 'ribbons' },
  { id: 'tidal', name: 'Tidal', description: 'Layered teal forms drifting like water.', kind: 'abstract', colors: ['#183a3d', '#4b7d79', '#92aaa1'], pattern: 'tide' },
  { id: 'paper-prism', name: 'Paper prism', description: 'Ochre and slate shapes in balance.', kind: 'abstract', colors: ['#333946', '#b6985f', '#768c9a'], pattern: 'prism' },
  { id: 'eclipse', name: 'Eclipse', description: 'A warm halo against midnight blue.', kind: 'abstract', colors: ['#192737', '#a77956', '#c7aa7b'], pattern: 'eclipse' },
  { id: 'cloud-drift', name: 'Cloud drift', description: 'White clouds crossing an open blue sky.', kind: 'video', colors: ['#314d68', '#7198b4', '#d5e0e4'], src: '/backgrounds/cloud-drift.mp4', poster: '/backgrounds/cloud-drift.jpg', credit: { name: 'Mixkit', url: 'https://mixkit.co/free-stock-video/white-clouds-moving-across-a-clear-blue-sky-51102/' } },
  { id: 'forest-mist', name: 'Forest mist', description: 'A quiet forest wrapped in drifting mist.', kind: 'video', colors: ['#203e3b', '#547465', '#94a196'], src: '/backgrounds/forest-mist.mp4', poster: '/backgrounds/forest-mist.jpg', credit: { name: 'Mixkit', url: 'https://mixkit.co/free-stock-video/gloomy-forest-full-of-trees-during-a-rainy-afternoon-22729/' } },
  { id: 'rain-ripples', name: 'Rain ripples', description: 'Soft raindrops meeting the surface of a lake.', kind: 'video', colors: ['#3c4b54', '#829196', '#b7c3c3'], src: '/backgrounds/rain-ripples.mp4', poster: '/backgrounds/rain-ripples.jpg', credit: { name: 'Mixkit', url: 'https://mixkit.co/free-stock-video/rain-falling-on-the-water-of-a-lake-seen-up-18312/' } },
  { id: 'alpine-air', name: 'Alpine air', description: 'Cloud shadows passing over the Alps.', kind: 'video', colors: ['#394b56', '#78928b', '#b0bec3'], src: '/backgrounds/alpine-air.mp4', poster: '/backgrounds/alpine-air.jpg', credit: { name: 'Mixkit', url: 'https://mixkit.co/free-stock-video/mountainous-area-in-the-alps-4132/' } },
  { id: 'sea-at-dusk', name: 'Sea at dusk', description: 'Gentle water beneath a warm evening sky.', kind: 'video', colors: ['#40383e', '#aa7d67', '#c9a385'], src: '/backgrounds/sea-at-dusk.mp4', poster: '/backgrounds/sea-at-dusk.jpg', credit: { name: 'Mixkit', url: 'https://mixkit.co/free-stock-video/stunning-sunset-seen-from-the-sea-4119/' } },
]

export function getProfileBackground(id: string | null | undefined) {
  return profileBackgrounds.find(background => background.id === id)
}

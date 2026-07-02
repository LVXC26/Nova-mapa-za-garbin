import type { MetadataRoute } from 'next'
import { mockPlovila, mockCharterji, mockSkiperji } from '@/data/mock'
import { mockNovice } from '@/data/mock'
import { forumKategorije } from '@/data/forum'

const BASE = 'https://garbin.si'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/plovila`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/charterji`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/skiperji`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/rezervni-deli`, priority: 0.7, changeFrequency: 'daily' as const },
    { url: `${BASE}/novice`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE}/forum`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE}/zemljevid`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/paketi`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE}/promocije`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${BASE}/o-nas`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/kontakt`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/faq`, priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  const plovila = mockPlovila.map(p => ({
    url: `${BASE}/plovila/${p.id}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const charterji = mockCharterji.map(c => ({
    url: `${BASE}/charterji/${c.id}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const skiperji = mockSkiperji.map(s => ({
    url: `${BASE}/skiperji/${s.id}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }))

  const novice = mockNovice.map(n => ({
    url: `${BASE}/novice/${n.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }))

  const forumKat = forumKategorije.map(k => ({
    url: `${BASE}/forum/${k.slug}`,
    priority: 0.6,
    changeFrequency: 'daily' as const,
  }))

  return [...staticPages, ...plovila, ...charterji, ...skiperji, ...novice, ...forumKat]
}

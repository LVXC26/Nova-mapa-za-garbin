import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import NovicaVsebina from './NovicaVsebina'

// SEO ovoj — glej isti vzorec/razlago v src/app/plovila/[id]/page.tsx.
// Resnična stran ostaja v NovicaVsebina.tsx.
async function najdiNovico(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('novice')
    .select('naslov, povzetek, vsebina, slika_url')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const n = await najdiNovico(slug)
  if (!n) return { title: 'Novica ni najdena | Garbin' }

  const opis = (n.povzetek?.trim() || n.vsebina.replace(/<[^>]+>/g, '').slice(0, 160))
  const naslov = `${n.naslov} | Novice | Garbin`

  return {
    title: naslov,
    description: opis,
    openGraph: {
      title: n.naslov,
      description: opis,
      images: n.slika_url ? [{ url: n.slika_url }] : undefined,
      type: 'article',
    },
    twitter: {
      card: n.slika_url ? 'summary_large_image' : 'summary',
      title: n.naslov,
      description: opis,
      images: n.slika_url ? [n.slika_url] : undefined,
    },
  }
}

export default function NovicaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <NovicaVsebina params={params} />
}

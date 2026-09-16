import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CharterVsebina from './CharterVsebina'

// SEO ovoj — glej isti vzorec/razlago v src/app/plovila/[id]/page.tsx.
// Resnična stran (interaktivnost, flota, ocene) ostaja v CharterVsebina.tsx.
async function najdiCharter(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('charterji_javno')
    .select('naziv, opis, lokacija, st_plovil')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const c = await najdiCharter(id)
  if (!c) return { title: 'Charter ni najden | Garbin' }

  const naslov = `${c.naziv}${c.lokacija ? ` — ${c.lokacija}` : ''} | Charter | Garbin`
  const opis = c.opis?.trim()
    ? c.opis.slice(0, 160)
    : `${c.naziv}${c.st_plovil ? ` — flota ${c.st_plovil} plovil` : ''}. Najem plovil prek Garbin, slovenskega tržišča plovil.`

  return {
    title: naslov,
    description: opis,
    openGraph: { title: c.naziv, description: opis, type: 'website' },
    twitter: { card: 'summary', title: c.naziv, description: opis },
  }
}

export default function CharterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CharterVsebina params={params} />
}

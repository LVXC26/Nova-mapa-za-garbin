import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SkipperVsebina from './SkipperVsebina'

// SEO ovoj — glej isti vzorec/razlago v src/app/plovila/[id]/page.tsx.
// Resnična stran (interaktivnost, ocene, koledar) ostaja v SkipperVsebina.tsx.
async function najdiSkiperja(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('skiperji_javno')
    .select('ime, opis, lokacija, izkusnje_let, tip_skiper, naziv_agencije')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const s = await najdiSkiperja(id)
  if (!s) return { title: 'Skiper ni najden | Garbin' }

  const ime = s.tip_skiper === 'agencija' && s.naziv_agencije ? s.naziv_agencije : s.ime
  const naslov = `${ime}${s.lokacija ? ` — ${s.lokacija}` : ''} | Skiper | Garbin`
  const opis = s.opis?.trim()
    ? s.opis.slice(0, 160)
    : `${ime} — ${s.izkusnje_let ? `${s.izkusnje_let} let izkušenj, ` : ''}skiper na voljo za najem prek Garbin, slovenskega tržišča plovil.`

  return {
    title: naslov,
    description: opis,
    openGraph: { title: ime, description: opis, type: 'profile' },
    twitter: { card: 'summary', title: ime, description: opis },
  }
}

export default function SkipperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <SkipperVsebina params={params} />
}

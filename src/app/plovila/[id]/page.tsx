import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PloviloVsebina from './PloviloVsebina'

// SEO: /plovila/[id] je bila do zdaj cela 'use client' stran (glej
// PloviloVsebina.tsx — interaktivnost, galerija, primerjava... se ne
// spreminja), zato ni imela NOBENIH lastnih meta podatkov — Google in
// družbena omrežja so za VSAKO plovilo prikazovali isti splošni naslov
// "Garbin — Vaš zaupanja vredni pomorski portal", podedovan iz korenskega
// layouta. To je tanek server-component ovoj samo za generateMetadata —
// resnična stran (nalaganje podatkov, interaktivnost) ostaja nespremenjena
// v PloviloVsebina.tsx.
async function najdiPlovilo(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('plovila_javno')
    .select('naziv, opis, slike, cena, cena_na_zahtevo, lokacija, tip, tip_oglasa, dolzina_m')
    .eq('id', id)
    .maybeSingle()
  return data
}

function formatCenaMeta(cena: number, naZahtevo: boolean): string {
  if (naZahtevo) return 'Cena na zahtevo'
  return `${cena.toLocaleString('sl-SI')} €`
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const p = await najdiPlovilo(id)
  if (!p) return { title: 'Plovilo ni najdeno | Garbin' }

  const cenaTekst = formatCenaMeta(p.cena, p.cena_na_zahtevo ?? false)
  const naslov = `${p.naziv} — ${cenaTekst}${p.lokacija ? ` — ${p.lokacija}` : ''} | Garbin`
  const opis = p.opis?.trim()
    ? p.opis.slice(0, 160)
    : `${p.naziv}${p.dolzina_m ? `, ${p.dolzina_m} m` : ''} — ${cenaTekst}. ${p.tip_oglasa === 'najem' ? 'Na voljo za najem' : 'Naprodaj'} na Garbin, slovenskem tržišču plovil.`
  const slika = p.slike?.[0]

  return {
    title: naslov,
    description: opis,
    openGraph: {
      title: `${p.naziv} — ${cenaTekst}`,
      description: opis,
      images: slika ? [{ url: slika }] : undefined,
      type: 'website',
    },
    twitter: {
      card: slika ? 'summary_large_image' : 'summary',
      title: `${p.naziv} — ${cenaTekst}`,
      description: opis,
      images: slika ? [slika] : undefined,
    },
  }
}

export default function PloviloDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PloviloVsebina params={params} />
}

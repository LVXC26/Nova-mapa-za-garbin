'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Banner } from '@/types/database'

// Admin (/admin/bannerji) je lahko od nekdaj ustvarjal bannerje z izbrano
// pozicijo, a nikjer na javni strani se niso dejansko izrisali — obstajala
// sta samo dva staticna "Oglasevalski prostor" placeholderja, ki iz baze
// nista brala nicesar. Ta komponenta je edino mesto, ki dejansko prikaze
// aktiven banner za dano pozicijo (ali se skrije, ce ga ni).
export default function OglasniBanner({ pozicija, className }: { pozicija: string; className: string }) {
  const [banner, setBanner] = useState<Banner | null | undefined>(undefined)

  useEffect(() => {
    createClient()
      .from('bannerji')
      .select('*')
      .eq('pozicija', pozicija)
      .eq('aktiven', true)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setBanner(data))
  }, [pozicija])

  if (!banner?.slika_url) return null

  const slika = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={banner.slika_url} alt={banner.naziv} className="w-full h-full object-cover rounded-2xl" />
  )

  return (
    <div className={className}>
      {banner.link_url ? (
        <a href={banner.link_url} target="_blank" rel="noopener noreferrer sponsored" className="block w-full h-full">
          {slika}
        </a>
      ) : slika}
    </div>
  )
}

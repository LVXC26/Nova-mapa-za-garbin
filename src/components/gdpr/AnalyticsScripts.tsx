'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const COOKIE_KEY = 'garbin_cookie_consent'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

type Soglasje = { analytics: boolean; marketing: boolean }

function preberiSoglasje(): Soglasje {
  try {
    const shranjeno = localStorage.getItem(COOKIE_KEY)
    if (!shranjeno) return { analytics: false, marketing: false }
    const p = JSON.parse(shranjeno)
    return { analytics: !!p.analytics, marketing: !!p.marketing }
  } catch {
    return { analytics: false, marketing: false }
  }
}

// VARNOSTNI/GDPR POPRAVEK: GA4/Meta Pixel sta se prej nalagala VEDNO, takoj
// ko je bila nastavljena okoljska spremenljivka — CookieBanner.tsx je pisal
// izbiro uporabnika v localStorage, a nihče je nikoli ni prebral, zato je
// "Samo nujni"/zavrnitev v pasici bila brez učinka na dejansko sledenje.
// Ta komponenta zdaj skrpta naloži šele, ko je za to dana prava privolitev,
// in se odzove na spremembo brez ponovnega nalaganja strani.
export default function AnalyticsScripts() {
  const [soglasje, setSoglasje] = useState<Soglasje>({ analytics: false, marketing: false })

  // Branje v efektu (ne v lazy initializerju) je tu namerno: localStorage ni
  // na voljo med SSR, lazy initializer pa bi na klientu takoj po hidraciji
  // vrnil drugačen rezultat kot strežnik in sprožil hydration mismatch. Enak
  // vzorec (in isto eslint opozorilo) že uporablja CookieBanner.tsx.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoglasje(preberiSoglasje())
    function onChange() { setSoglasje(preberiSoglasje()) }
    window.addEventListener('garbin-cookie-consent-updated', onChange)
    return () => window.removeEventListener('garbin-cookie-consent-updated', onChange)
  }, [])

  return (
    <>
      {GA_ID && soglasje.analytics && (
        <Script src={`/scripts/ga4-init.js?id=${encodeURIComponent(GA_ID)}`} strategy="afterInteractive" id="ga4-script" />
      )}
      {META_PIXEL_ID && soglasje.marketing && (
        <Script src={`/scripts/meta-pixel-init.js?id=${encodeURIComponent(META_PIXEL_ID)}`} strategy="afterInteractive" id="meta-pixel-script" />
      )}
    </>
  )
}

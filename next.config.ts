import type { NextConfig } from "next";

// Content-Security-Policy — našteje SAMO domene, ki jih stran dejansko
// uporablja (preverjeno s pregledom kode): Supabase (slike/REST/auth),
// OpenStreetMap ploščice (/zemljevid), Unsplash (nekaj demo slik), Google
// Fonts, ter GA4/Meta Pixel skripta (naložena samo, če uporabnik dejansko
// privoli — glej AnalyticsScripts.tsx — in kot zunanji /scripts/*.js
// datoteki, ne inline, torej moja lastna koda inline skriptov ne potrebuje).
// A: Next.js App Router sam vstavlja inline <script> za hidracijo
// (self.__next_f RSC payload) — brez 'unsafe-inline' na script-src stran
// v produkcijskem buildu ne hidrira (preverjeno: "Invariant: Expected a
// request ID..."). Pravi popravek je nonce prek middleware.ts (Next.js to
// podpira), a to je večji poseg v obstoječi middleware (admin/dashboard
// avtentikacija) brez možnosti, da bi preveril prijavljene strani — zato je
// 'unsafe-inline' tu namerna, dokumentirana kompromisna odločitev; CSP še
// vedno omeji externe <script src> in vse ostalo spodaj.
// style-src ima 'unsafe-inline', ker več komponent in Leaflet uporabljajo
// React inline style={{...}} — odstranitev vseh bi bil velik, tvegan poseg
// za majhno dodatno korist (inline CSS ne izvaja kode, za razliko od JS).
// V razvoju (npm run dev) Next/Turbopack dodatno potrebuje 'unsafe-eval'.
const jeRazvoj = process.env.NODE_ENV === 'development'
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net${jeRazvoj ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // blob: je nujen za predogled lokalno izbranih slik (URL.createObjectURL v
  // obrazcih za nalaganje slik/stiskanje pred nalaganjem) — brez njega CSP
  // tiho blokira <img>/Image() na blob: URL, kar je izgledalo kot da se
  // izbrane slike sploh ne prikažejo/naložijo. Ni varnostno tveganje: blob:
  // URL je vedno generiran s strani lastnega JS iz datoteke, ki jo je
  // uporabnik sam izbral, ne zunanji vir.
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://plus.unsplash.com https://*.tile.openstreetmap.org https://www.facebook.com",
  "connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com",
].join('; ')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
  images: {
    // Ta (novejsa) verzija Next.js privzeto dovoli SAMO quality=75 za
    // next/image, tudi ce komponenta zahteva drugo vrednost (tiho pade
    // nazaj na 75, samo v dev konzoli opozori) — brez tega vnosa bi bil
    // "quality={90}" na PloviloKartica.tsx brez ucinka.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;

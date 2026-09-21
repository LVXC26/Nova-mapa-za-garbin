import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { PrimerjaProvider } from '@/context/PrimerjaContext'
import CookieBanner from '@/components/gdpr/CookieBanner'
import AnalyticsScripts from '@/components/gdpr/AnalyticsScripts'
import TawkChat from '@/components/support/TawkChat'
import OglasniBanner from '@/components/oglasi/OglasniBanner'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://garbin.net'),
  title: 'Garbin — Vaš zaupanja vredni pomorski portal',
  description: 'Kupite ali prodajte jadrnico, motorni čoln ali gumenjak. Najdite charter in skiperja. Slovensko tržišče plovil.',
  openGraph: {
    title: 'Garbin — Vaš zaupanja vredni pomorski portal',
    description: 'Slovensko tržišče plovil. Jadrnice, motorni čolni, charter, skiperji.',
    type: 'website',
    locale: 'sl_SI',
  },
}

async function getInitialUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getInitialUser()

  return (
    <html lang="sl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={user}>
          <PrimerjaProvider>
          <LocaleProvider>
            {children}
            {/* Stranska "skyscraper" bannerja — fiksno pripeta na rob
                zaslona, vidna samo na zelo širokih zaslonih (2xl = 1536px+),
                kjer je poleg vsebine (max-w-7xl = 1280px) dovolj prostora,
                da ne prekrivata ničesar. */}
            <div className="hidden 2xl:block fixed left-4 top-1/2 -translate-y-1/2 z-20">
              <OglasniBanner pozicija="Stranski pas levo" className="w-[160px] h-[600px]" />
            </div>
            <div className="hidden 2xl:block fixed right-4 top-1/2 -translate-y-1/2 z-20">
              <OglasniBanner pozicija="Stranski pas desno" className="w-[160px] h-[600px]" />
            </div>
            <CookieBanner />
            {/* Naložita se šele, ko uporabnik dejansko privoli — glej AnalyticsScripts.tsx */}
            <AnalyticsScripts />
            {/* Živi klepet za podporo — naložen vedno, glej TawkChat.tsx zakaj ni vezan na GDPR soglasje */}
            <TawkChat />
            {/* Vercel Web Analytics — brez piškotkov in brez osebnih podatkov
                (samo anonimni/agregirani ogledi strani), zato ni vezano na
                GDPR soglasje kot GA4/Meta Pixel zgoraj (glej AnalyticsScripts.tsx). */}
            <Analytics />
          </LocaleProvider>
          </PrimerjaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { PrimerjaProvider } from '@/context/PrimerjaContext'
import CookieBanner from '@/components/gdpr/CookieBanner'
import AnalyticsScripts from '@/components/gdpr/AnalyticsScripts'

export const metadata: Metadata = {
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
            {children}
            <CookieBanner />
            {/* Naložita se šele, ko uporabnik dejansko privoli — glej AnalyticsScripts.tsx */}
            <AnalyticsScripts />
          </PrimerjaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

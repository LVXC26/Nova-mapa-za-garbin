import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { PrimerjaProvider } from '@/context/PrimerjaContext'
import CookieBanner from '@/components/gdpr/CookieBanner'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

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
      <head>
        {/* Google Analytics 4 — aktivira se ko uporabnik sprejme cookies */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
              id="ga4-script"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
          </>
        )}
        {/* Meta Pixel */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={user}>
          <PrimerjaProvider>
            {children}
            <CookieBanner />
          </PrimerjaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

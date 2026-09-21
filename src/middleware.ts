import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const KANONICNI_HOST = 'garbin.net'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // SEO: garbin.net je bil hkrati dosegljiv tudi na www.garbin.net IN na
  // Vercelovem privzetem garbin-tau.vercel.app aliasu, oba brez preusmeritve
  // — Google Search Console je zato javljal "Duplicate without user-selected
  // canonical" (ista vsebina na 3 razlicnih domenah). Trajna (308)
  // preusmeritev vsega na en sam kanonicni host to reši. localhost izvzet,
  // da lokalni razvoj ne konca na produkciji.
  const host = request.headers.get('host') ?? ''
  if (host !== KANONICNI_HOST && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    const url = new URL(request.url)
    url.protocol = 'https:'
    url.host = KANONICNI_HOST
    url.port = ''
    return NextResponse.redirect(url, 308)
  }

  let supabaseResponse = NextResponse.next({ request })

  // Admin zaščita — vedno preveri
  if (pathname.startsWith('/admin')) {
    // Supabase ni konfiguriran — brez seje ni mogoče preveriti is_admin, zato zavrni dostop
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.redirect(new URL('/prijava?admin=1', request.url))
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/prijava?admin=1', request.url))
    }

    // Preveri is_admin iz profiles
    const { data: profil } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profil?.is_admin) {
      return NextResponse.redirect(new URL('/?napaka=ni_dostopa', request.url))
    }

    return supabaseResponse
  }

  // Dashboard zaščita
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/prijava', request.url))
  }

  if (user && (pathname === '/prijava' || pathname === '/registracija')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

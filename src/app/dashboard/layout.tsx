'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Anchor, LayoutDashboard, Ship, PlusCircle, List, Settings, LogOut, ChevronRight,
  UserCircle, MessageCircle, Star, Heart, Compass, Zap, Image
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'

type NavItem = { href: string; label: string; ikona: React.ElementType; exact?: boolean }

function getNavLinks(vloga: string | null): NavItem[] {
  switch (vloga) {
    case 'charter':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/moja-plovila', label: 'Moja plovila', ikona: Ship },
        { href: '/dashboard/dodaj-plovilo', label: 'Dodaj plovilo', ikona: PlusCircle },
        { href: '/dashboard/profil', label: 'Moj profil', ikona: UserCircle },
        { href: '/dashboard/feed', label: 'Feed & objave', ikona: Image },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    case 'skipper':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/profil', label: 'Moj profil', ikona: UserCircle },
        { href: '/dashboard/feed', label: 'Feed & objave', ikona: Image },
        { href: '/dashboard/ocene', label: 'Moje ocene', ikona: Star },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    case 'kupec':
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/priljubljeni', label: 'Priljubljeni', ikona: Heart },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
    default: // prodajalec
      return [
        { href: '/dashboard', label: 'Pregled', ikona: LayoutDashboard, exact: true },
        { href: '/dashboard/moja-plovila', label: 'Moji oglasi', ikona: List },
        { href: '/dashboard/dodaj-plovilo', label: 'Dodaj oglas', ikona: PlusCircle },
        { href: '/chat', label: 'Sporočila', ikona: MessageCircle },
        { href: '/dashboard/paket', label: 'Paket', ikona: Zap },
        { href: '/dashboard/nastavitve', label: 'Nastavitve', ikona: Settings },
      ]
  }
}

const vlogaLabele: Record<string, { label: string; barva: string }> = {
  charter: { label: 'Charter', barva: 'bg-blue-500' },
  skipper: { label: 'Skipper', barva: 'bg-[#c9a84c]' },
  prodajalec: { label: 'Prodajalec', barva: 'bg-emerald-500' },
  kupec: { label: 'Kupec', barva: 'bg-purple-500' },
  oba: { label: 'Charter & Prodajalec', barva: 'bg-[#c9a84c]' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, vloga, demoMode, odjavaDemo } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/prijava')
  }, [user, router])

  async function odjava() {
    if (demoMode) {
      odjavaDemo()
    } else {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.refresh()
    }
    router.push('/')
  }

  const navLinks = getNavLinks(vloga)
  const ime = user?.user_metadata?.ime ?? user?.email ?? 'Uporabnik'
  const inicialke = ime.split(' ').map((d: string) => d[0]).slice(0, 2).join('').toUpperCase()
  const vlogaInfo = vlogaLabele[vloga ?? 'prodajalec'] ?? vlogaLabele.prodajalec

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0c2340] flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-white/10 group">
          <Anchor className="w-5 h-5 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-lg font-semibold text-white">Garbin</span>
        </Link>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-sm font-bold shrink-0">
              {inicialke || <UserCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{ime}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${vlogaInfo.barva}`} />
                <span className="text-xs text-white/50">{vlogaInfo.label}</span>
                {demoMode && (
                  <span className="text-xs text-amber-400 font-medium">DEMO</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigacija */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label, ikona: Ikona, exact }) => {
            const aktiven = exact ? pathname === href : pathname.startsWith(href) && href !== '/dashboard'
            const jeExact = exact && pathname === href
            const isAktiven = aktiven || jeExact

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isAktiven
                    ? 'bg-[#c9a84c] text-[#0c2340]'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                <Ikona className="w-4 h-4 shrink-0" />
                {label}
                {isAktiven && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Odjava */}
        <div className="px-3 pb-5">
          <button
            onClick={odjava}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {demoMode ? 'Izhod iz demo' : 'Odjava'}
          </button>
        </div>
      </aside>

      {/* VSEBINA */}
      <main className="flex-1 ml-64 min-h-screen">
        {demoMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">Demo način — prijavljen kot {vlogaInfo.label}</span>
            <button onClick={() => router.push('/prijava')} className="ml-auto text-xs text-amber-600 underline hover:text-amber-800">
              Zamenjaj vlogo
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}

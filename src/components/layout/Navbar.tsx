'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Anchor, UserCircle, MessageCircle, Map, Globe, ChevronDown, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/plovila', label: 'Plovila' },
  { href: '/charterji', label: 'Charter' },
  { href: '/skiperji', label: 'Skiperji' },
  { href: '/rezervni-deli', label: 'Deli' },
  { href: '/forum', label: 'Forum' },
  { href: '/novice', label: 'Novice' },
  { href: '/zemljevid', label: 'Zemljevid', ikona: Map },
]

const jeziki = [
  { koda: 'SLO', label: 'Slovenščina', zastava: '🇸🇮' },
  { koda: 'HR', label: 'Hrvaščina', zastava: '🇭🇷' },
  { koda: 'IT', label: 'Italijanščina', zastava: '🇮🇹' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [jezikOpen, setJezikOpen] = useState(false)
  const [izbranJezik, setIzbranJezik] = useState(jeziki[0])
  const [iskalnoQ, setIskalnoQ] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (iskalnoQ.trim()) {
      router.push(`/iskanje?q=${encodeURIComponent(iskalnoQ.trim())}`)
      setIskalnoQ('')
    }
  }
  const { user } = useAuth()
  const pathname = usePathname()

  const inicialke = user?.user_metadata?.ime
    ? user.user_metadata.ime.split(' ').map((d: string) => d[0]).slice(0, 2).join('').toUpperCase()
    : null

  const unread = 0

  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c2340]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Anchor className="w-6 h-6 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display text-xl font-semibold text-white tracking-wide">Garbin</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => {
              const active = isActive(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-[#c9a84c] bg-white/8'
                      : 'text-white/80 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {l.ikona && <l.ikona className="w-3.5 h-3.5" />}
                  {l.label}
                  {active && <span className="w-1 h-1 rounded-full bg-[#c9a84c] ml-0.5" />}
                </Link>
              )
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              value={iskalnoQ}
              onChange={e => setIskalnoQ(e.target.value)}
              placeholder="Išči..."
              className="w-44 pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#c9a84c] focus:w-56 transition-all duration-200"
            />
          </form>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setJezikOpen(!jezikOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{izbranJezik.zastava} {izbranJezik.koda}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${jezikOpen ? 'rotate-180' : ''}`} />
              </button>
              {jezikOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#0c2340] border border-white/15 rounded-xl shadow-xl overflow-hidden min-w-[160px] z-50">
                  {jeziki.map(j => (
                    <button
                      key={j.koda}
                      onClick={() => { setIzbranJezik(j); setJezikOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
                        j.koda === izbranJezik.koda
                          ? 'text-[#c9a84c] bg-white/8'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{j.zastava}</span>
                      <span>{j.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  href="/chat"
                  className={`relative p-2 rounded-full transition-all ${
                    isActive('/chat')
                      ? 'text-[#c9a84c] bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a84c] text-[#0c2340] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full transition-all ${
                    isActive('/dashboard')
                      ? 'text-[#c9a84c] border-[#c9a84c]/40 bg-white/8'
                      : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  {inicialke ? (
                    <span className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-xs font-bold">
                      {inicialke}
                    </span>
                  ) : (
                    <UserCircle className="w-4 h-4" />
                  )}
                  Moj panel
                </Link>
              </>
            ) : (
              <>
                <Link href="/prijava" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Prijava
                </Link>
                <Link
                  href="/registracija"
                  className="px-4 py-2 text-sm font-semibold text-[#0c2340] bg-[#c9a84c] hover:bg-[#e8c76d] rounded-full transition-all duration-200 hover:scale-105"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0c2340] border-t border-white/10 px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'text-[#c9a84c] bg-white/8' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setOpen(false)}
              >
                {l.ikona && <l.ikona className="w-4 h-4" />}
                {l.label}
              </Link>
            )
          })}

          {/* Mobile jezik switcher */}
          <div className="border-t border-white/10 pt-3 mt-2">
            <p className="text-xs text-white/40 uppercase tracking-wide px-3 mb-2">Jezik</p>
            <div className="flex gap-2">
              {jeziki.map(j => (
                <button
                  key={j.koda}
                  onClick={() => setIzbranJezik(j)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    j.koda === izbranJezik.koda
                      ? 'bg-[#c9a84c] text-[#0c2340]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {j.zastava} {j.koda}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Sporočila
                  {unread > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-[#c9a84c] text-[#0c2340] text-xs font-bold rounded-full">
                      {unread}
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Moj panel
                </Link>
              </>
            ) : (
              <>
                <Link href="/prijava" className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white" onClick={() => setOpen(false)}>
                  Prijava
                </Link>
                <Link
                  href="/registracija"
                  className="px-4 py-2.5 text-sm font-semibold text-center text-[#0c2340] bg-[#c9a84c] rounded-full hover:bg-[#e8c76d]"
                  onClick={() => setOpen(false)}
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close language dropdown */}
      {jezikOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setJezikOpen(false)} />
      )}
    </nav>
  )
}

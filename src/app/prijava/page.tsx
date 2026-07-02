'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff, AlertCircle, Ship, Compass, Tag, ShoppingBag, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import type { Vloga } from '@/components/providers/AuthProvider'

const demoVloge: { vloga: Vloga; label: string; opis: string; ikona: React.ElementType; barva: string }[] = [
  {
    vloga: 'charter',
    label: 'Charter podjetje',
    opis: 'Adriatic Sail d.o.o. — marina Portorož',
    ikona: Ship,
    barva: 'bg-[#0c2340] text-white',
  },
  {
    vloga: 'skipper',
    label: 'Skipper',
    opis: 'Marko Horvat — 18 let izkušenj',
    ikona: Compass,
    barva: 'bg-[#1e3a5f] text-white',
  },
  {
    vloga: 'prodajalec',
    label: 'Prodajalec',
    opis: 'Janez Novak — zasebni prodajalec',
    ikona: Tag,
    barva: 'bg-[#c9a84c] text-[#0c2340]',
  },
  {
    vloga: 'kupec',
    label: 'Kupec',
    opis: 'Ana Kovač — išče jadrnico',
    ikona: ShoppingBag,
    barva: 'bg-emerald-600 text-white',
  },
]

export default function PrijavaPage() {
  const router = useRouter()
  const { prijavaDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [prikaziGeslo, setPrikaziGeslo] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [prikaziDemo, setPrikaziDemo] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: geslo })

    if (error) {
      setNapaka('Napačen email ali geslo.')
      setNalaga(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  function handleDemo(vloga: Vloga) {
    prijavaDemo(vloga)
    router.push('/dashboard')
  }

  function handleAdminDemo() {
    document.cookie = 'garbin_admin_demo=1; path=/; max-age=3600'
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Anchor className="w-7 h-7 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-2xl font-semibold text-[#0c2340]">Garbin</span>
        </Link>

        {/* Demo login */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
          <button
            onClick={() => setPrikaziDemo(!prikaziDemo)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800 text-sm">Demo prijava — za testiranje</span>
            </div>
            <span className="text-amber-600 text-xs">{prikaziDemo ? '▲ Skrij' : '▼ Prikaži'}</span>
          </button>

          {prikaziDemo && (
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              {demoVloge.map(({ vloga, label, opis, ikona: Ikona, barva }) => (
                <button
                  key={vloga}
                  onClick={() => handleDemo(vloga)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all hover:scale-[1.02] hover:shadow-md ${barva}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Ikona className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{label}</p>
                    <p className="text-xs opacity-75 mt-0.5">{opis}</p>
                  </div>
                  <span className="ml-auto text-xs opacity-60 shrink-0">→</span>
                </button>
              ))}
              <button
                onClick={handleAdminDemo}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-gray-800 text-white hover:bg-gray-700 transition-all text-xs"
              >
                <span>🔐</span>
                <div>
                  <p className="font-semibold">Admin panel</p>
                  <p className="opacity-60">Samo za razvoj</p>
                </div>
              </button>
              <p className="text-xs text-amber-600/70 text-center mt-1">
                Brez Supabase — mock podatki za prikaz
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Dobrodošli nazaj</h1>
          <p className="text-gray-500 text-sm mb-6">Prijavite se v vaš račun</p>

          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {napaka}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@primer.si"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Geslo</label>
              <div className="relative">
                <input
                  required
                  type={prikaziGeslo ? 'text' : 'password'}
                  value={geslo}
                  onChange={(e) => setGeslo(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPrikaziGeslo(!prikaziGeslo)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {prikaziGeslo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={nalaga}
              className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-xl transition-all hover:scale-[1.01] shadow-sm"
            >
              {nalaga ? 'Prijavljam...' : 'Prijava'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/pozabljeno-geslo" className="text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">
              Pozabljeno geslo?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Nimate računa?{' '}
            <Link href="/registracija" className="font-semibold text-[#0c2340] hover:text-[#c9a84c] transition-colors">
              Registracija
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

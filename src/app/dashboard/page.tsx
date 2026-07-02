'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  PlusCircle, List, Ship, Heart, ArrowRight,
  MessageCircle, Compass, Calendar,
  CheckCircle, Activity, Star, TrendingUp
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { mockPlovila, mockSkiperji, mockCharterji } from '@/data/mock'
import { createClient } from '@/lib/supabase/client'

function usePovprasevanjaCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    createClient()
      .from('povprasevanja')
      .select('*', { count: 'exact', head: true })
      .then(({ count: c }) => setCount(c ?? 0))
  }, [])

  return count
}

// ─── CHARTER DASHBOARD ───────────────────────────────────────────────
function CharterDashboard({ ime }: { ime: string }) {
  const charter = mockCharterji.find(c => c.naziv.includes('Adriatic')) ?? mockCharterji[0]
  const povprasevanjaCount = usePovprasevanjaCount()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#0c2340] mb-1">Dober dan! 👋</h1>
        <p className="text-gray-500">{ime} · Charter podjetje</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Prejetih povpraševanj', vrednost: povprasevanjaCount ?? '…', ikona: MessageCircle, barva: 'bg-emerald-50 text-emerald-600' },
          { label: 'Priljubljenosti', vrednost: '—', ikona: Heart, barva: 'bg-rose-50 text-rose-500' },
          { label: 'Status profila', vrednost: 'Aktivno', ikona: Activity, barva: 'bg-blue-50 text-blue-600', zelena: true },
        ].map(({ label, vrednost, ikona: Ikona, barva, zelena }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${barva}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <p className={`font-display text-2xl font-bold ${zelena ? 'text-emerald-600' : 'text-[#0c2340]'}`}>{vrednost}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Hiter dostop */}
      <h2 className="font-semibold text-[#0c2340] mb-4">Hitri dostop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/dashboard/dodaj-plovilo', label: 'Dodaj plovilo', opis: 'Razširi svojo floto', ikona: PlusCircle, cls: 'bg-[#0c2340] text-white' },
          { href: '/dashboard/moja-plovila', label: 'Moja plovila', opis: `${charter.st_plovil} aktivnih`, ikona: Ship, cls: 'bg-[#c9a84c] text-[#0c2340]' },
          { href: '/chat', label: 'Sporočila', opis: '3 neprebrana', ikona: MessageCircle, cls: 'bg-white border border-gray-200 text-[#0c2340]' },
        ].map(({ href, label, opis, ikona: Ikona, cls }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md group ${cls}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cls.includes('white') ? 'bg-gray-100' : 'bg-white/20'}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{label}</p>
              <p className={`text-xs mt-0.5 ${cls.includes('white') ? 'text-gray-500' : 'opacity-70'}`}>{opis}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Moja plovila preview */}
      <h2 className="font-semibold text-[#0c2340] mb-4">Vaša plovila</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {mockPlovila.filter(p => p.tip === 'jadrnica').slice(0, 3).map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 p-4 ${i < 2 ? 'border-b border-gray-50' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-[#0c2340]/5 flex items-center justify-center text-lg shrink-0">⛵</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0c2340] text-sm truncate">{p.naziv}</p>
              <p className="text-xs text-gray-500">{p.lokacija} · {p.letnik}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">Aktivno</span>
          </div>
        ))}
        <div className="p-4 border-t border-gray-50">
          <Link href="/dashboard/moja-plovila" className="text-sm text-[#c9a84c] font-medium hover:underline">
            Vsa plovila →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── SKIPPER DASHBOARD ────────────────────────────────────────────────
function SkipperDashboard({ ime }: { ime: string }) {
  const skipper = mockSkiperji.find(s => s.ime === 'Marko Horvat') ?? mockSkiperji[0]
  const povprasevanjaCount = usePovprasevanjaCount()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#0c2340] mb-1">Dober dan! 🧭</h1>
        <p className="text-gray-500">{ime} · Skipper</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Prejetih povpraševanj', vrednost: povprasevanjaCount ?? '…', ikona: MessageCircle, barva: 'bg-purple-50 text-purple-600', zelena: false },
          { label: 'Priljubljenosti', vrednost: '—', ikona: Heart, barva: 'bg-rose-50 text-rose-500', zelena: false },
          { label: 'Status profila', vrednost: 'Aktivno', ikona: Activity, barva: 'bg-blue-50 text-blue-600', zelena: true },
        ].map(({ label, vrednost, ikona: Ikona, barva, zelena }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${barva}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <p className={`font-display text-2xl font-bold ${zelena ? 'text-emerald-600' : 'text-[#0c2340]'}`}>{vrednost}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Hiter dostop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { href: '/dashboard/profil', label: 'Uredi profil', opis: 'Posodobi certifikate in bio', ikona: Compass, cls: 'bg-[#0c2340] text-white' },
          { href: '/chat', label: 'Sporočila', opis: '2 neprebrani', ikona: MessageCircle, cls: 'bg-[#c9a84c] text-[#0c2340]' },
        ].map(({ href, label, opis, ikona: Ikona, cls }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 group ${cls}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cls.includes('white') ? 'bg-gray-100' : 'bg-white/20'}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs mt-0.5 opacity-70">{opis}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Profil povzetek */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-[#0c2340] mb-4">Vaš skipper profil</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0c2340]/10 flex items-center justify-center text-3xl">👨‍✈️</div>
          <div>
            <p className="font-bold text-[#0c2340]">{skipper.ime}</p>
            <p className="text-sm text-gray-500">{skipper.lokacija} · {skipper.izkusnje_let} let izkušenj</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({length: 5}).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(skipper.ocena) ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">{skipper.ocena.toFixed(1)} ({skipper.st_ocen} ocen)</span>
            </div>
          </div>
          <div className="ml-auto">
            {skipper.verified && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Verificiran
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skipper.certifikati.map(c => (
            <span key={c} className="text-xs px-2.5 py-1 bg-[#0c2340]/5 text-[#0c2340] rounded-full font-medium">{c}</span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">Cena: <span className="font-bold text-[#0c2340]">{skipper.cena_dan} € / dan</span></p>
          <Link href={`/skiperji/${skipper.id}`} className="text-sm text-[#c9a84c] font-medium hover:underline">
            Oglej profil →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── KUPEC DASHBOARD ──────────────────────────────────────────────────
function KupecDashboard({ ime }: { ime: string }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#0c2340] mb-1">Dober dan! 🚢</h1>
        <p className="text-gray-500">{ime} · Kupec</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/plovila', label: 'Išči plovila', opis: 'Poiščite svojo jadrnico', ikona: Ship, cls: 'bg-[#0c2340] text-white' },
          { href: '/charterji', label: 'Charter ponudbe', opis: 'Prevereni ponudniki najema', ikona: Calendar, cls: 'bg-[#c9a84c] text-[#0c2340]' },
          { href: '/skiperji', label: 'Najdi skipperja', opis: 'Profesionalni vodniki plovil', ikona: Compass, cls: 'bg-white border border-gray-200 text-[#0c2340]' },
        ].map(({ href, label, opis, ikona: Ikona, cls }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 group ${cls}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cls.includes('white') ? 'bg-gray-100' : 'bg-white/20'}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{label}</p>
              <p className={`text-xs mt-0.5 ${cls.includes('white') ? 'text-gray-500' : 'opacity-70'}`}>{opis}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Priljubljena plovila */}
      <h2 className="font-semibold text-[#0c2340] mb-4">Priljubljena plovila</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="font-medium text-gray-400 mb-1">Nimate shranjenih plovil</p>
        <p className="text-sm text-gray-300 mb-5">Kliknite ❤ na katerikoli kartici plovila.</p>
        <Link href="/plovila"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0c2340] font-semibold text-sm rounded-full hover:bg-[#e8c76d] transition-all hover:scale-105">
          <Ship className="w-4 h-4" /> Išči plovila
        </Link>
      </div>
    </div>
  )
}

// ─── PRODAJALEC DASHBOARD ─────────────────────────────────────────────
function ProdajalecDashboard({ ime, vloga }: { ime: string; vloga: string | null }) {
  const povprasevanjaCount = usePovprasevanjaCount()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#0c2340] mb-1">
          Dober dan, {ime.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500">
          {vloga === 'charter' || vloga === 'oba' ? 'Upravljajte svoje oglase in charter ponudbo.' : 'Upravljajte svoje oglase na Garbin.'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Aktivnih oglasov', vrednost: '0', ikona: List, barva: 'bg-blue-50 text-blue-600' },
          { label: 'Prejetih povpraševanj', vrednost: povprasevanjaCount ?? '…', ikona: MessageCircle, barva: 'bg-emerald-50 text-emerald-600' },
          { label: 'Shranjenih s strani kupcev', vrednost: '0', ikona: TrendingUp, barva: 'bg-amber-50 text-amber-600' },
        ].map(({ label, vrednost, ikona: Ikona, barva }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${barva}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-[#0c2340]">{vrednost}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-[#0c2340] mb-4">Hitri dostop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/dashboard/dodaj-plovilo', label: 'Dodaj plovilo za prodajo', opis: 'Objavi oglas v manj kot 5 minutah', ikona: PlusCircle, cls: 'bg-[#0c2340] text-white' },
          { href: '/dashboard/moja-plovila', label: 'Moji oglasi', opis: 'Upravljajte obstoječe oglase', ikona: List, cls: 'bg-white border border-gray-200 text-[#0c2340]' },
        ].map(({ href, label, opis, ikona: Ikona, cls }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 group ${cls}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cls.includes('white') ? 'bg-gray-100' : 'bg-white/20'}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{label}</p>
              <p className={`text-xs mt-0.5 ${cls.includes('white') ? 'text-gray-500' : 'opacity-70'}`}>{opis}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      <h2 className="font-semibold text-[#0c2340] mb-4">Vaši oglasi</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">⚓</div>
        <p className="font-medium text-gray-500 mb-1">Nimate še nobenih oglasov</p>
        <p className="text-sm text-gray-400 mb-5">Dodajte svoje prvo plovilo in začnite prodajati.</p>
        <Link href="/dashboard/dodaj-plovilo"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-105">
          <PlusCircle className="w-4 h-4" /> Dodaj plovilo
        </Link>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, vloga } = useAuth()
  const ime = user?.user_metadata?.ime ?? 'Uporabnik'

  if (vloga === 'charter') return <CharterDashboard ime={ime} />
  if (vloga === 'skipper') return <SkipperDashboard ime={ime} />
  if (vloga === 'kupec') return <KupecDashboard ime={ime} />
  return <ProdajalecDashboard ime={ime} vloga={vloga} />
}

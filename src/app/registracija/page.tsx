'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff, AlertCircle, Ship, Tag, Layers, Compass } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Vloga = 'prodajalec' | 'charter' | 'skipper' | 'kupec'

const vloge: { vrednost: Vloga; label: string; opis: string; ikona: React.ElementType }[] = [
  {
    vrednost: 'prodajalec',
    label: 'Prodajalec',
    opis: 'Oglašujem plovila za prodajo',
    ikona: Tag,
  },
  {
    vrednost: 'charter',
    label: 'Charter',
    opis: 'Oddajam plovila v najem — podjetje ali zasebnik',
    ikona: Ship,
  },
  {
    vrednost: 'skipper',
    label: 'Skipper',
    opis: 'Ponujam profesionalne storitve vodenja plovil',
    ikona: Compass,
  },
  {
    vrednost: 'kupec',
    label: 'Kupec / Najemnik',
    opis: 'Iščem plovilo za nakup ali najem',
    ikona: Layers,
  },
]

type TipSkiper = 'samostojni' | 'agencija'

export default function RegistracijaPage() {
  const router = useRouter()
  const [korak, setKorak] = useState<1 | 1.5 | 2>(1)
  const [vloga, setVloga] = useState<Vloga>('prodajalec')
  const [tipSkiper, setTipSkiper] = useState<TipSkiper>('samostojni')
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [prikaziGeslo, setPrikaziGeslo] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)

  const skupajKorakov = vloga === 'skipper' ? 3 : 2
  const koraki = vloga === 'skipper' ? [1, 1.5, 2] : [1, 2]
  const korrakSt = koraki.indexOf(korak) + 1

  function naKorak2() {
    if (vloga === 'skipper') {
      setKorak(1.5)
    } else {
      setKorak(2)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password: geslo,
      options: {
        data: { vloga, ime, tip_skiper: vloga === 'skipper' ? tipSkiper : undefined },
      },
    })

    if (error) {
      setNapaka(error.message === 'User already registered'
        ? 'Ta e-mail je že registriran. Prijavite se.'
        : 'Prišlo je do napake. Poskusite znova.'
      )
      setNalaga(false)
      return
    }

    if (vloga === 'charter' || vloga === 'skipper') {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Anchor className="w-7 h-7 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-2xl font-semibold text-[#0c2340]">Garbin</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#0c2340]">Korak {korrakSt} od {skupajKorakov}</span>
              <span className="text-xs text-gray-400">
                {korak === 1 ? 'Tip računa' : korak === 1.5 ? 'Tip skiperja' : 'Podatki'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
                style={{ width: `${(korrakSt / skupajKorakov) * 100}%` }}
              />
            </div>
          </div>

          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {napaka}
            </div>
          )}

          {/* KORAK 1 — Izbira vloge */}
          {korak === 1 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Ustvarite račun</h1>
              <p className="text-gray-500 text-sm mb-6">Izberite tip vašega računa</p>

              <div className="flex flex-col gap-3 mb-6">
                {vloge.map(({ vrednost, label, opis, ikona: Ikona }) => (
                  <button
                    key={vrednost}
                    type="button"
                    onClick={() => setVloga(vrednost)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      vloga === vrednost
                        ? 'border-[#c9a84c] bg-[#c9a84c]/8'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      vloga === vrednost ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Ikona className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{opis}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={naKorak2}
                className="w-full py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-xl transition-all"
              >
                Naprej →
              </button>
            </div>
          )}

          {/* KORAK 1.5 — Skipper sub-tip */}
          {korak === 1.5 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Kakšen tip skiperja ste?</h1>
              <p className="text-gray-500 text-sm mb-6">Izberite, kako boste nastopali na platformi.</p>
              <div className="flex flex-col gap-3 mb-6">
                {([
                  {
                    vrednost: 'samostojni' as TipSkiper,
                    label: 'Samostojni skipper',
                    opis: 'Osebni profil — kontakt samo za prijavljene uporabnike',
                    ikona: '👤',
                  },
                  {
                    vrednost: 'agencija' as TipSkiper,
                    label: 'Skipper agencija',
                    opis: 'Firmski profil z ekipo — javen kontakt (email + telefon)',
                    ikona: '🏢',
                  },
                ]).map(({ vrednost, label, opis, ikona }) => (
                  <button
                    key={vrednost}
                    type="button"
                    onClick={() => setTipSkiper(vrednost)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      tipSkiper === vrednost
                        ? 'border-[#c9a84c] bg-[#c9a84c]/8'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      tipSkiper === vrednost ? 'bg-[#c9a84c]/20' : 'bg-gray-100'
                    }`}>
                      {ikona}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opis}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setKorak(1)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  ← Nazaj
                </button>
                <button
                  onClick={() => setKorak(2)}
                  className="flex-1 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-xl transition-all"
                >
                  Naprej →
                </button>
              </div>
            </div>
          )}

          {/* KORAK 2 — Podatki */}
          {korak === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Vaši podatki</h1>
                <p className="text-gray-500 text-sm mb-5">
                  Registracija kot{' '}
                  <span className="font-semibold text-[#0c2340]">
                    {vloge.find(v => v.vrednost === vloga)?.label}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  {vloga === 'charter' ? 'Naziv podjetja / ime' : 'Ime in priimek'}
                </label>
                <input
                  required
                  value={ime}
                  onChange={(e) => setIme(e.target.value)}
                  placeholder={vloga === 'charter' ? 'Adriatic Sail d.o.o.' : 'Janez Novak'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>

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
                    minLength={6}
                    type={prikaziGeslo ? 'text' : 'password'}
                    value={geslo}
                    onChange={(e) => setGeslo(e.target.value)}
                    placeholder="Min. 6 znakov"
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

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setKorak(vloga === 'skipper' ? 1.5 : 1)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  ← Nazaj
                </button>
                <button
                  type="submit"
                  disabled={nalaga}
                  className="flex-1 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-xl transition-all hover:scale-[1.01]"
                >
                  {nalaga ? 'Ustvarjam...' : 'Ustvari račun'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Že imate račun?{' '}
            <Link href="/prijava" className="font-semibold text-[#0c2340] hover:text-[#c9a84c] transition-colors">
              Prijava
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

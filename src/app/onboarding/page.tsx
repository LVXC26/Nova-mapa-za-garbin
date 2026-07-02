'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Anchor, CheckCircle, ArrowRight, Ship, Award, Globe, MapPin, Phone } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function OnboardingPage() {
  const { user, vloga } = useAuth()
  const router = useRouter()
  const [korak, setKorak] = useState(1)

  const isCharter = vloga === 'charter' || vloga === 'oba'
  const isSkipper = vloga === 'skipper'

  // Charter forma
  const [charterForma, setCharterForma] = useState({
    naziv: user?.user_metadata?.ime ?? '',
    opis: '',
    lokacija: '',
    telefon: '',
    spletna_stran: '',
  })

  // Skipper forma
  const [skipperForma, setSkipperForma] = useState({
    bio: '',
    certifikati: '',
    jeziki: [] as string[],
    cena_dan: '',
    tip_plovil: [] as string[],
    izkusnje_let: '',
    obmocje: '',
  })

  const SKUPAJ = 3

  if (!user || (!isCharter && !isSkipper)) {
    router.push('/dashboard')
    return null
  }

  function toggleJezik(j: string) {
    setSkipperForma(f => ({
      ...f,
      jeziki: f.jeziki.includes(j) ? f.jeziki.filter(x => x !== j) : [...f.jeziki, j]
    }))
  }

  function togglePlovilo(t: string) {
    setSkipperForma(f => ({
      ...f,
      tip_plovil: f.tip_plovil.includes(t) ? f.tip_plovil.filter(x => x !== t) : [...f.tip_plovil, t]
    }))
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#0c2340] py-5 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-[#c9a84c]" />
            <span className="font-display text-lg font-semibold text-white">Garbin</span>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-white/50 hover:text-white text-sm transition-colors">
            Preskoči onboarding →
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#0c2340]">Korak {korak} od {SKUPAJ}</span>
            <span className="text-xs text-gray-500">
              {isCharter
                ? ['Podatki podjetja', 'Prvo plovilo', 'Paket'][korak - 1]
                : ['Podatki profila', 'Specializacija', 'Paket'][korak - 1]
              }
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
              style={{ width: `${(korak / SKUPAJ) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {Array.from({ length: SKUPAJ }, (_, i) => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 < korak ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0c2340]'
                  : i + 1 === korak ? 'bg-white border-[#c9a84c] text-[#c9a84c]'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {i + 1 < korak ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          {/* ─── CHARTER ─── */}
          {isCharter && korak === 1 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Podatki podjetja</h1>
              <p className="text-gray-500 text-sm mb-6">Ti podatki bodo vidni na vašem javnem profilu.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Naziv podjetja *</label>
                  <input value={charterForma.naziv} onChange={e => setCharterForma(f => ({...f, naziv: e.target.value}))}
                    placeholder="Adriatic Sail d.o.o."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Opis podjetja</label>
                  <textarea rows={3} value={charterForma.opis} onChange={e => setCharterForma(f => ({...f, opis: e.target.value}))}
                    placeholder="Kratko opišite vaše podjetje, plovila in storitve..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                      <MapPin className="inline w-3.5 h-3.5 mr-1" />Lokacija / Marina
                    </label>
                    <input value={charterForma.lokacija} onChange={e => setCharterForma(f => ({...f, lokacija: e.target.value}))}
                      placeholder="Marina Portorož"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                      <Phone className="inline w-3.5 h-3.5 mr-1" />Telefon
                    </label>
                    <input type="tel" value={charterForma.telefon} onChange={e => setCharterForma(f => ({...f, telefon: e.target.value}))}
                      placeholder="+386 5 ..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                    <Globe className="inline w-3.5 h-3.5 mr-1" />Spletna stran
                  </label>
                  <input type="url" value={charterForma.spletna_stran} onChange={e => setCharterForma(f => ({...f, spletna_stran: e.target.value}))}
                    placeholder="https://vasepodjetje.si"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                </div>
              </div>
            </div>
          )}

          {isCharter && korak === 2 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Dodajte prvo plovilo</h1>
              <p className="text-gray-500 text-sm mb-6">Kasneje dodate več plovil v dashboardu.</p>
              <div className="bg-gray-50 rounded-2xl p-6 text-center mb-4">
                <Ship className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">Plovilo dodajte prek dashboarda po zaključku onboardinga.</p>
                <Link href="/dashboard/dodaj-plovilo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white text-sm font-medium rounded-full hover:bg-[#1e3a5f] transition-all">
                  Dodaj plovilo → <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-gray-400 text-center">Ali preskočite ta korak in dodajte plovilo kasneje.</p>
            </div>
          )}

          {/* ─── SKIPPER ─── */}
          {isSkipper && korak === 1 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Podatki profila</h1>
              <p className="text-gray-500 text-sm mb-6">Vaš javni skipper profil.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Bio / Kratka predstavitev</label>
                  <textarea rows={3} value={skipperForma.bio} onChange={e => setSkipperForma(f => ({...f, bio: e.target.value}))}
                    placeholder="Opišite vaše izkušnje in specializacijo..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                    <Award className="inline w-3.5 h-3.5 mr-1" />Certifikati (ločite z vejico)
                  </label>
                  <input value={skipperForma.certifikati} onChange={e => setSkipperForma(f => ({...f, certifikati: e.target.value}))}
                    placeholder="ICC, VHF SRC, RYA Day Skipper..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Cena / dan (€)</label>
                    <input type="number" value={skipperForma.cena_dan} onChange={e => setSkipperForma(f => ({...f, cena_dan: e.target.value}))}
                      placeholder="150"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Leta izkušenj</label>
                    <input type="number" value={skipperForma.izkusnje_let} onChange={e => setSkipperForma(f => ({...f, izkusnje_let: e.target.value}))}
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-2">Jeziki</label>
                  <div className="flex flex-wrap gap-2">
                    {['slovenščina', 'angleščina', 'hrvaščina', 'nemščina', 'italijanščina'].map(j => (
                      <button key={j} type="button" onClick={() => toggleJezik(j)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                          skipperForma.jeziki.includes(j) ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {j}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSkipper && korak === 2 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Specializacija</h1>
              <p className="text-gray-500 text-sm mb-6">Kaj vodite in kje delujete.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-2">Tip plovil ki jih vodite</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { v: 'jadrnica', i: '⛵' }, { v: 'motorni', i: '🚤' },
                      { v: 'katamaran', i: '⛵' }, { v: 'jahta', i: '🛥️' }, { v: 'gumenjak', i: '🛟' }
                    ].map(({ v, i }) => (
                      <button key={v} type="button" onClick={() => togglePlovilo(v)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                          skipperForma.tip_plovil.includes(v) ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {i} {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Območje delovanja</label>
                  <input value={skipperForma.obmocje} onChange={e => setSkipperForma(f => ({...f, obmocje: e.target.value}))}
                    placeholder="npr. Slovensko primorje, Kvarner, Dalmacija..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* ─── KORAK 3: Paket (obe vlogi) ─── */}
          {korak === 3 && (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Profil je skoraj pripravljen!</h1>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Izberite paket ali začnite brezplačno. Cene bodo objavljene ob uradnem zagonu platforme.
              </p>
              <div className="bg-[#0c2340] rounded-2xl p-6 mb-4 text-left">
                <p className="font-semibold text-[#c9a84c] text-sm mb-2">
                  {isCharter ? '⛵ Charter paket' : '🧭 Skipper paket'} — Kmalu
                </p>
                <ul className="space-y-2">
                  {(isCharter ? [
                    'Neomejeno plovil v floti',
                    'Verified badge na profilu',
                    'Prioritetni prikaz v iskanju',
                    'Real-time chat s strankami',
                  ] : [
                    'Profesionalni skipper profil',
                    'Rating in reviews sistem',
                    'Prioriteta v iskalnih rezultatih',
                    'Real-time chat s strankami',
                  ]).map(b => (
                    <li key={b} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#c9a84c] shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-bold rounded-xl transition-all hover:scale-[1.01] mb-3"
              >
                Začni brezplačno obdobje →
              </button>
              <Link href="/paketi" className="text-sm text-gray-400 hover:text-[#0c2340] transition-colors">
                Oglej si pakete in cene
              </Link>
            </div>
          )}

          {/* Navigation buttons */}
          {korak < 3 && (
            <div className="flex gap-3 mt-6">
              {korak > 1 && (
                <button
                  onClick={() => setKorak(k => k - 1 as 1 | 2 | 3)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  ← Nazaj
                </button>
              )}
              <button
                onClick={() => setKorak(k => k + 1 as 1 | 2 | 3)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-xl transition-all"
              >
                {korak === 2 ? 'Izberi paket' : 'Naprej'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

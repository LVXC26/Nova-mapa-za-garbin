'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Award } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

const JEZIKI = ['slovenščina', 'angleščina', 'hrvaščina', 'nemščina', 'italijanščina']
const TIPI_PLOVIL = [
  { v: 'jadrnica', i: '⛵' }, { v: 'motorni', i: '🚤' },
  { v: 'katamaran', i: '⛵' }, { v: 'jahta', i: '🛥️' }, { v: 'gumenjak', i: '🛟' },
]

// Enak razlog/vzorec kot dashboard/postani-charter — glej opombo tam.
export default function PostaniSkipperPage() {
  const { user, demoMode, imaSkipperProfil, refreshProfili } = useAuth()
  const router = useRouter()
  const [preverjeno, setPreverjeno] = useState(false)
  const [forma, setForma] = useState({
    bio: '', certifikati: '', jeziki: [] as string[],
    cena_dan: '', tip_plovil: [] as string[], izkusnje_let: '', obmocje: '',
  })
  const [nalaga, setNalaga] = useState(false)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    if (!user) { router.push('/prijava'); return }
    if (imaSkipperProfil) { router.push('/dashboard'); return }
    setPreverjeno(true)
  }, [user, imaSkipperProfil, router])

  if (!preverjeno) return null

  function toggleJezik(j: string) {
    setForma(f => ({ ...f, jeziki: f.jeziki.includes(j) ? f.jeziki.filter(x => x !== j) : [...f.jeziki, j] }))
  }
  function togglePlovilo(t: string) {
    setForma(f => ({ ...f, tip_plovil: f.tip_plovil.includes(t) ? f.tip_plovil.filter(x => x !== t) : [...f.tip_plovil, t] }))
  }

  async function shrani() {
    if (!forma.bio.trim()) { setNapaka('Vpišite kratko predstavitev.'); return }
    if (demoMode) { setNapaka('V demo načinu ni mogoče ustvariti novega profila. Prijavite se z resničnim računom.'); return }
    setNapaka('')
    setNalaga(true)
    const supabase = createClient()
    const { error } = await supabase.from('skiperji').upsert({
      user_id: user!.id,
      ime: user!.user_metadata?.ime ?? 'Skipper',
      lokacija: forma.obmocje || '',
      opis: forma.bio,
      cena_dan: forma.cena_dan ? Number(forma.cena_dan) : 0,
      izkusnje_let: forma.izkusnje_let ? Number(forma.izkusnje_let) : 0,
      tip_plovila: forma.tip_plovil,
      jeziki: forma.jeziki,
      certifikati: forma.certifikati ? forma.certifikati.split(',').map(c => c.trim()).filter(Boolean) : [],
      verified: false,
      ocena: 0,
      st_ocen: 0,
      tip_skiper: 'samostojni',
    }, { onConflict: 'user_id' })
    setNalaga(false)
    if (error) { setNapaka('Napaka pri shranjevanju profila. Poskusite znova.'); return }
    refreshProfili()
    router.push('/dashboard')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Ustvarite skipper profil</h1>
          <p className="text-gray-500 text-sm mb-6">
            Poleg vašega obstoječega profila dobite tudi skipper profil, viden na /skiperji.
          </p>

          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {napaka}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Bio / Kratka predstavitev *</label>
              <textarea rows={3} value={forma.bio} onChange={e => setForma(f => ({ ...f, bio: e.target.value }))}
                placeholder="Opišite vaše izkušnje in specializacijo..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                <Award className="inline w-3.5 h-3.5 mr-1" />Certifikati (ločite z vejico)
              </label>
              <input value={forma.certifikati} onChange={e => setForma(f => ({ ...f, certifikati: e.target.value }))}
                placeholder="ICC, VHF SRC, RYA Day Skipper..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Cena / dan (€)</label>
                <input type="number" value={forma.cena_dan} onChange={e => setForma(f => ({ ...f, cena_dan: e.target.value }))}
                  placeholder="150"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Leta izkušenj</label>
                <input type="number" value={forma.izkusnje_let} onChange={e => setForma(f => ({ ...f, izkusnje_let: e.target.value }))}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-2">Jeziki</label>
              <div className="flex flex-wrap gap-2">
                {JEZIKI.map(j => (
                  <button key={j} type="button" onClick={() => toggleJezik(j)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${forma.jeziki.includes(j) ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {j}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-2">Tip plovil ki jih vodite</label>
              <div className="flex flex-wrap gap-2">
                {TIPI_PLOVIL.map(({ v, i }) => (
                  <button key={v} type="button" onClick={() => togglePlovilo(v)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${forma.tip_plovil.includes(v) ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {i} {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Območje delovanja</label>
              <input value={forma.obmocje} onChange={e => setForma(f => ({ ...f, obmocje: e.target.value }))}
                placeholder="npr. Slovensko primorje, Kvarner, Dalmacija..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
            </div>
          </div>

          <button
            onClick={shrani}
            disabled={nalaga}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-bold rounded-xl transition-all hover:scale-[1.01]"
          >
            {nalaga ? 'Shranjujem...' : 'Ustvari skipper profil'} <ArrowRight className="w-4 h-4" />
          </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Eye, BadgeCheck, Star, Pencil, X, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Skipper } from '@/types/database'

const TIPI_PLOVIL = ['jadrnica', 'motorni', 'katamaran', 'jahta', 'gumenjak']
const JEZIKI = ['slovenščina', 'angleščina', 'hrvaščina', 'nemščina', 'italijanščina']

interface UrediForma {
  ime: string
  lokacija: string
  izkusnje_let: number
  cena_dan: string
  opis: string
  tip_plovila: string[]
  jeziki: string[]
  certifikati: string[]
  verified: boolean
  aktiven: boolean
}

export default function AdminSkiperjiPage() {
  const [skiperji, setSkiperji] = useState<Skipper[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [urejaId, setUrejaId] = useState<string | null>(null)
  const [forma, setForma] = useState<UrediForma | null>(null)
  const [noviCertifikat, setNoviCertifikat] = useState('')
  const [shranjuje, setShranjuje] = useState(false)
  const [napaka, setNapaka] = useState('')

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const { data } = await supabase.from('skiperji').select('*').order('created_at', { ascending: false })
    setSkiperji(data ?? [])
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  async function potrdi(id: string) {
    await supabase.from('skiperji').update({ verified: true }).eq('id', id)
    nalozi()
  }

  async function zavrni(id: string) {
    if (!confirm('Odstrani verified status oziroma zavrni ta profil?')) return
    await supabase.from('skiperji').update({ verified: false }).eq('id', id)
    nalozi()
  }

  function zacniUrejanje(s: Skipper) {
    setUrejaId(s.id)
    setNapaka('')
    setNoviCertifikat('')
    setForma({
      ime: s.ime ?? '',
      lokacija: s.lokacija ?? '',
      izkusnje_let: s.izkusnje_let ?? 0,
      cena_dan: s.cena_dan != null ? String(s.cena_dan) : '',
      opis: s.opis ?? '',
      tip_plovila: s.tip_plovila ?? [],
      jeziki: s.jeziki ?? [],
      certifikati: s.certifikati ?? [],
      verified: !!s.verified,
      aktiven: s.aktiven !== false,
    })
  }

  function preklici() {
    setUrejaId(null)
    setForma(null)
    setNapaka('')
  }

  function toggle(polje: 'tip_plovila' | 'jeziki', v: string) {
    setForma(f => f && ({
      ...f,
      [polje]: f[polje].includes(v) ? f[polje].filter(x => x !== v) : [...f[polje], v],
    }))
  }

  function dodajCertifikat() {
    const c = noviCertifikat.trim()
    setForma(f => {
      if (!f || !c || f.certifikati.includes(c)) return f
      return { ...f, certifikati: [...f.certifikati, c] }
    })
    setNoviCertifikat('')
  }

  async function shrani() {
    if (!urejaId || !forma) return
    setNapaka('')
    setShranjuje(true)
    const { error } = await supabase.from('skiperji').update({
      ime: forma.ime,
      lokacija: forma.lokacija,
      izkusnje_let: forma.izkusnje_let,
      cena_dan: forma.cena_dan ? Number(forma.cena_dan) : 0,
      opis: forma.opis,
      tip_plovila: forma.tip_plovila,
      jeziki: forma.jeziki,
      certifikati: forma.certifikati,
      verified: forma.verified,
      aktiven: forma.aktiven,
    }).eq('id', urejaId)
    setShranjuje(false)
    if (error) { setNapaka('Napaka pri shranjevanju: ' + error.message); return }
    preklici()
    nalozi()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Skiperji</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled, urejanje in dodelitev verified badge</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Ime</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Lokacija</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Izkušnje</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Ocena</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Cena/dan</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {skiperji.map(s => (
              <Fragment key={s.id}>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{s.ime}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.lokacija}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.izkusnje_let} let</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Star className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c]" />
                      {s.ocena.toFixed(1)} ({s.st_ocen})
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{s.cena_dan ?? 0} €</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`flex items-center gap-1 text-xs font-medium w-fit px-2.5 py-1 rounded-full ${s.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.verified && <BadgeCheck className="w-3.5 h-3.5" />}
                        {s.verified ? 'Preverjeno' : 'V pregledu'}
                      </span>
                      {s.aktiven === false && (
                        <span className="text-xs font-medium w-fit px-2.5 py-1 rounded-full bg-red-50 text-red-600">Neaktiven</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => (urejaId === s.id ? preklici() : zacniUrejanje(s))} className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors" title="Uredi profil"><Pencil className="w-4 h-4" /></button>
                      <Link href={`/skiperji/${s.id}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></Link>
                      {!s.verified && (
                        <button onClick={() => potrdi(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Potrdi (verified)"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => zavrni(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Odstrani verified"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
                {urejaId === s.id && forma && (
                  <tr>
                    <td colSpan={7} className="px-5 py-5 bg-gray-50/70">
                      <div className="max-w-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Uredi profil skiperja</h3>
                          <button onClick={preklici} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                        </div>
                        {napaka && <p className="text-sm text-red-600">{napaka}</p>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Ime</label>
                            <input value={forma.ime} onChange={e => setForma(f => f && ({ ...f, ime: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Lokacija / Marina</label>
                            <input value={forma.lokacija} onChange={e => setForma(f => f && ({ ...f, lokacija: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Leta izkušenj</label>
                            <input type="number" min={0} value={forma.izkusnje_let} onChange={e => setForma(f => f && ({ ...f, izkusnje_let: Number(e.target.value) }))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Cena / dan (€) — interno</label>
                            <input type="number" min={0} value={forma.cena_dan} onChange={e => setForma(f => f && ({ ...f, cena_dan: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / opis</label>
                          <textarea rows={3} value={forma.opis} onChange={e => setForma(f => f && ({ ...f, opis: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Plovila ki jih vodi</label>
                          <div className="flex flex-wrap gap-2">
                            {TIPI_PLOVIL.map(t => (
                              <button key={t} type="button" onClick={() => toggle('tip_plovila', t)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${forma.tip_plovila.includes(t) ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Jeziki</label>
                          <div className="flex flex-wrap gap-2">
                            {JEZIKI.map(j => (
                              <button key={j} type="button" onClick={() => toggle('jeziki', j)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${forma.jeziki.includes(j) ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {j}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Certifikati</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {forma.certifikati.map(c => (
                              <div key={c} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                                <Award className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-800">{c}</span>
                                <button type="button" onClick={() => setForma(f => f && ({ ...f, certifikati: f.certifikati.filter(x => x !== c) }))} className="text-emerald-400 hover:text-red-500 text-xs ml-0.5">✕</button>
                              </div>
                            ))}
                            {forma.certifikati.length === 0 && <span className="text-xs text-gray-400">Ni certifikatov</span>}
                          </div>
                          <div className="flex gap-2">
                            <input value={noviCertifikat} onChange={e => setNoviCertifikat(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); dodajCertifikat() } }}
                              placeholder="npr. RYA Yachtmaster Offshore"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                            <button type="button" onClick={dodajCertifikat} className="px-3 py-2 bg-[#0c2340] text-white rounded-lg text-xs font-medium hover:bg-[#1e3a5f]">Dodaj</button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={forma.verified} onChange={e => setForma(f => f && ({ ...f, verified: e.target.checked }))} className="rounded" />
                            Preverjen (verified badge)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={forma.aktiven} onChange={e => setForma(f => f && ({ ...f, aktiven: e.target.checked }))} className="rounded" />
                            Aktiven — prikazan v javnem seznamu (/skiperji, iskanje)
                          </label>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button onClick={shrani} disabled={shranjuje} className="px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full">
                            {shranjuje ? 'Shranjujem...' : 'Shrani spremembe'}
                          </button>
                          <button onClick={preklici} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-full hover:bg-gray-50">Prekliči</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!nalaga && skiperji.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni zadetkov</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

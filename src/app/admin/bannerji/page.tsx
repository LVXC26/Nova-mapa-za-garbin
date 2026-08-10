'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Banner } from '@/types/database'

const pozicije = ['Homepage top', 'Homepage mid', 'Plovila sidebar', 'Charterji sidebar', 'Detail stran']

const PRAZNA_FORMA = { naziv: '', pozicija: pozicije[0], dimenzije: '', slika_url: '', link_url: '' }

export default function AdminBannerjiPage() {
  const [bannerji, setBannerji] = useState<Banner[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [napaka, setNapaka] = useState('')
  const [urejaId, setUrejaId] = useState<string | null>(null)
  const [obrazecOdprt, setObrazecOdprt] = useState(false)
  const [forma, setForma] = useState(PRAZNA_FORMA)

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const { data } = await supabase.from('bannerji').select('*').order('created_at', { ascending: false })
    setBannerji(data ?? [])
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  async function toggleAktiven(b: Banner) {
    setBannerji(prev => prev.map(x => x.id === b.id ? { ...x, aktiven: !x.aktiven } : x))
    const { error } = await supabase.from('bannerji').update({ aktiven: !b.aktiven }).eq('id', b.id)
    if (error) nalozi()
  }

  function zacniUrejanje(b: Banner) {
    setUrejaId(b.id)
    setForma({ naziv: b.naziv, pozicija: b.pozicija, dimenzije: b.dimenzije ?? '', slika_url: b.slika_url ?? '', link_url: b.link_url ?? '' })
    setObrazecOdprt(true)
  }

  function preklici() {
    setObrazecOdprt(false)
    setUrejaId(null)
    setForma(PRAZNA_FORMA)
    setNapaka('')
  }

  async function shrani() {
    setNapaka('')
    if (!forma.naziv) { setNapaka('Vpišite naziv.'); return }

    const polja = {
      naziv: forma.naziv,
      pozicija: forma.pozicija,
      dimenzije: forma.dimenzije || null,
      slika_url: forma.slika_url || null,
      link_url: forma.link_url || null,
    }

    const { error } = urejaId
      ? await supabase.from('bannerji').update(polja).eq('id', urejaId)
      : await supabase.from('bannerji').insert({ ...polja, aktiven: true })

    if (error) { setNapaka('Napaka pri shranjevanju.'); return }
    preklici()
    nalozi()
  }

  async function izbrisi(id: string) {
    if (!confirm('Izbriši ta banner?')) return
    await supabase.from('bannerji').delete().eq('id', id)
    nalozi()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Oglaševalski bannerji</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje oglasnih prostorov</p>
        </div>
        <button onClick={() => (obrazecOdprt ? preklici() : setObrazecOdprt(true))} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Dodaj banner
        </button>
      </div>

      {/* Pozicije info */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {pozicije.map(p => {
          const zaseden = bannerji.some(b => b.pozicija === p && b.aktiven)
          return (
            <div key={p} className={`bg-white rounded-xl border border-dashed p-4 text-center ${zaseden ? 'border-emerald-200' : 'border-gray-200'}`}>
              <p className="text-xs font-medium text-gray-500">{p}</p>
              <p className={`text-xs mt-1 ${zaseden ? 'text-emerald-500 font-medium' : 'text-gray-300'}`}>{zaseden ? 'Zasedeno' : 'Prosto'}</p>
            </div>
          )
        })}
      </div>

      {obrazecOdprt && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{urejaId ? 'Uredi banner' : 'Nov banner'}</h3>
            <button onClick={preklici} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><X className="w-4 h-4" /></button>
          </div>
          {napaka && <p className="text-sm text-red-600 mb-3">{napaka}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Naziv</label>
              <input value={forma.naziv} onChange={e => setForma(f => ({ ...f, naziv: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pozicija</label>
              <select value={forma.pozicija} onChange={e => setForma(f => ({ ...f, pozicija: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]">
                {pozicije.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dimenzije</label>
              <input value={forma.dimenzije} onChange={e => setForma(f => ({ ...f, dimenzije: e.target.value }))} placeholder="728×90" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Povezava (link)</label>
              <input value={forma.link_url} onChange={e => setForma(f => ({ ...f, link_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL slike</label>
              <input value={forma.slika_url} onChange={e => setForma(f => ({ ...f, slika_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={shrani} className="px-4 py-2 bg-[#c9a84c] text-[#0c2340] font-semibold text-sm rounded-full">Shrani</button>
            <button onClick={preklici} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-full hover:bg-gray-50">Prekliči</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Naziv</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Pozicija</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Dimenzije</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Aktiven</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bannerji.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{b.naziv}</td>
                <td className="px-5 py-3.5 text-gray-600">{b.pozicija}</td>
                <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{b.dimenzije}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleAktiven(b)} className="transition-colors">
                    {b.aktiven
                      ? <ToggleRight className="w-6 h-6 text-emerald-500" />
                      : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => zacniUrejanje(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => izbrisi(b.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!nalaga && bannerji.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni bannerjev</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

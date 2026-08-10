'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/AuthProvider'
import type { Novica, NovicaKategorija } from '@/types/database'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const PRAZNA_FORMA = { naslov: '', povzetek: '', vsebina: '', kategorija_id: '' }

export default function AdminNovicePage() {
  const { user } = useAuth()
  const [novice, setNovice] = useState<(Novica & { kategorija?: NovicaKategorija })[]>([])
  const [kategorije, setKategorije] = useState<NovicaKategorija[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [napaka, setNapaka] = useState('')
  const [urejaId, setUrejaId] = useState<string | null>(null)
  const [obrazecOdprt, setObrazecOdprt] = useState(false)
  const [forma, setForma] = useState(PRAZNA_FORMA)

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const { data } = await supabase
      .from('novice')
      .select('*, kategorija:novice_kategorije(*)')
      .order('created_at', { ascending: false })
    setNovice((data ?? []) as (Novica & { kategorija?: NovicaKategorija })[])
    const { data: kats } = await supabase.from('novice_kategorije').select('*')
    setKategorije(kats ?? [])
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  function zacniUrejanje(n: Novica) {
    setUrejaId(n.id)
    setForma({ naslov: n.naslov, povzetek: n.povzetek ?? '', vsebina: n.vsebina, kategorija_id: n.kategorija_id ?? '' })
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
    if (!forma.naslov || !forma.vsebina) { setNapaka('Izpolnite naslov in vsebino.'); return }

    const polja = {
      naslov: forma.naslov,
      povzetek: forma.povzetek || null,
      vsebina: forma.vsebina,
      kategorija_id: forma.kategorija_id || null,
    }

    const { error } = urejaId
      ? await supabase.from('novice').update(polja).eq('id', urejaId)
      : await supabase.from('novice').insert({
          ...polja,
          slug: slugify(forma.naslov) + '-' + Date.now().toString(36),
          avtor: user?.user_metadata?.ime ?? user?.email ?? 'Admin',
          slika_url: null,
          published_at: null,
        })

    if (error) { setNapaka('Napaka pri shranjevanju.'); return }
    preklici()
    nalozi()
  }

  async function preklopiObjavo(n: Novica) {
    await supabase.from('novice').update({ published_at: n.published_at ? null : new Date().toISOString() }).eq('id', n.id)
    nalozi()
  }

  async function izbrisi(id: string) {
    if (!confirm('Izbriši to novico?')) return
    await supabase.from('novice').delete().eq('id', id)
    nalozi()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Novice</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje blog novic</p>
        </div>
        <button onClick={() => (obrazecOdprt ? preklici() : setObrazecOdprt(true))} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Nova novica
        </button>
      </div>

      {obrazecOdprt && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{urejaId ? 'Uredi novico' : 'Nova novica'}</h3>
            <button onClick={preklici} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><X className="w-4 h-4" /></button>
          </div>
          {napaka && <p className="text-sm text-red-600 mb-3">{napaka}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Naslov</label>
              <input value={forma.naslov} onChange={e => setForma(f => ({ ...f, naslov: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategorija</label>
              <select value={forma.kategorija_id} onChange={e => setForma(f => ({ ...f, kategorija_id: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]">
                <option value="">Brez kategorije</option>
                {kategorije.map(k => <option key={k.id} value={k.id}>{k.naziv}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Povzetek</label>
              <textarea rows={2} value={forma.povzetek} onChange={e => setForma(f => ({ ...f, povzetek: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vsebina</label>
              <textarea rows={8} value={forma.vsebina} onChange={e => setForma(f => ({ ...f, vsebina: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none font-mono" />
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
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Naslov</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Kategorija</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Avtor</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {novice.map(n => (
              <tr key={n.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs truncate">{n.naslov}</td>
                <td className="px-5 py-3.5">
                  {n.kategorija && (
                    <span className="text-xs px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: n.kategorija.barva ?? '#0c2340' }}>
                      {n.kategorija.naziv}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{n.avtor}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => preklopiObjavo(n)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${n.published_at ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {n.published_at ? 'Objavljeno' : 'Osnutek'}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {n.published_at && (
                      <Link href={`/novice/${n.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></Link>
                    )}
                    <button onClick={() => zacniUrejanje(n)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => izbrisi(n.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!nalaga && novice.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni novic</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

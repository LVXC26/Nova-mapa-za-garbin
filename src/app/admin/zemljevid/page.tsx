'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ZemljevidTocka } from '@/types/database'

const tipEmoji: Record<string, string> = { marina: '⚓', otok: '🏝️', restavracija: '🍽️', nevarno: '⚠️' }
const TIPI = ['marina', 'otok', 'restavracija', 'nevarno'] as const

const PRAZNA_FORMA = { naziv: '', tip: 'marina' as ZemljevidTocka['tip'], lat: '', lng: '', opis: '' }

export default function AdminZemljevidPage() {
  const [tocke, setTocke] = useState<ZemljevidTocka[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [napaka, setNapaka] = useState('')
  const [dodaj, setDodaj] = useState(false)
  const [urejaId, setUrejaId] = useState<string | null>(null)
  const [forma, setForma] = useState(PRAZNA_FORMA)

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const { data } = await supabase.from('zemljevid_tocke').select('*').order('naziv')
    setTocke(data ?? [])
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  function zacniUrejanje(t: ZemljevidTocka) {
    setUrejaId(t.id)
    setForma({ naziv: t.naziv, tip: t.tip, lat: String(t.lat), lng: String(t.lng), opis: t.opis ?? '' })
    setDodaj(true)
  }

  function preklici() {
    setDodaj(false)
    setUrejaId(null)
    setForma(PRAZNA_FORMA)
  }

  async function shrani() {
    setNapaka('')
    if (!forma.naziv || !forma.lat || !forma.lng) { setNapaka('Izpolnite naziv in koordinate.'); return }

    const polja = {
      naziv: forma.naziv,
      tip: forma.tip,
      lat: Number(forma.lat),
      lng: Number(forma.lng),
      opis: forma.opis || null,
    }

    const { error } = urejaId
      ? await supabase.from('zemljevid_tocke').update(polja).eq('id', urejaId)
      : await supabase.from('zemljevid_tocke').insert({ ...polja, link: null })

    if (error) { setNapaka('Napaka pri shranjevanju.'); return }
    preklici()
    nalozi()
  }

  async function izbrisi(id: string) {
    if (!confirm('Izbriši to točko z zemljevida?')) return
    await supabase.from('zemljevid_tocke').delete().eq('id', id)
    nalozi()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Zemljevid točke</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje točk na interaktivnem zemljevidu</p>
        </div>
        <button onClick={() => (dodaj ? preklici() : setDodaj(true))} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Dodaj točko
        </button>
      </div>

      {dodaj && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{urejaId ? 'Uredi točko' : 'Nova točka'}</h3>
          {napaka && <p className="text-sm text-red-600 mb-3">{napaka}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Naziv</label>
              <input value={forma.naziv} onChange={e => setForma(f => ({ ...f, naziv: e.target.value }))} placeholder="Marina Portorož" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tip</label>
              <select value={forma.tip} onChange={e => setForma(f => ({ ...f, tip: e.target.value as ZemljevidTocka['tip'] }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]">
                {TIPI.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
              <input value={forma.lat} onChange={e => setForma(f => ({ ...f, lat: e.target.value }))} placeholder="45.5133" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
              <input value={forma.lng} onChange={e => setForma(f => ({ ...f, lng: e.target.value }))} placeholder="13.5903" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Opis</label>
              <textarea rows={2} value={forma.opis} onChange={e => setForma(f => ({ ...f, opis: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
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
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tip</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Koordinate</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tocke.map(t => (
              <tr key={t.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900 flex items-center gap-2">
                  <span>{tipEmoji[t.tip] ?? '📍'}</span> {t.naziv}
                </td>
                <td className="px-5 py-3.5 text-gray-500 capitalize">{t.tip}</td>
                <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{t.lat}, {t.lng}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => zacniUrejanje(t)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => izbrisi(t.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!nalaga && tocke.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni točk na zemljevidu</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

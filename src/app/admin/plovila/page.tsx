'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Eye, Search, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Plovilo } from '@/types/database'

export default function AdminPlovilaPage() {
  const [iskanje, setIskanje] = useState('')
  const [filter, setFilter] = useState<'vsi' | 'nepotrjeni' | 'potrjeni'>('vsi')
  const [plovila, setPlovila] = useState<Plovilo[]>([])
  const [nalaga, setNalaga] = useState(true)
  // user_id -> e-mail lastnika. Plovila sama nimajo e-maila shranjenega —
  // pridobimo ga prek /api/admin/uporabniki (ze obstoječ endpoint, uporablja
  // service role za dostop do auth.users, ki ga iz klienta ni mogoče
  // neposredno poizvedovati).
  const [lastniki, setLastniki] = useState<Record<string, string>>({})
  const [izbrani, setIzbrani] = useState<Set<string>>(new Set())
  const [brisanjeVteku, setBrisanjeVteku] = useState(false)

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const [{ data: plovilaData }, uporabnikiRes] = await Promise.all([
      supabase.from('plovila').select('*').order('created_at', { ascending: false }),
      fetch('/api/admin/uporabniki').then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
    ])
    setPlovila(plovilaData ?? [])
    const mapa: Record<string, string> = {}
    for (const u of uporabnikiRes.data ?? []) mapa[u.id] = u.email
    setLastniki(mapa)
    setIzbrani(new Set())
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  async function potrdi(id: string) {
    await supabase.from('plovila').update({ potrjeno: true }).eq('id', id)
    nalozi()
  }

  async function zavrni(id: string) {
    if (!confirm('Zavrni in izbriši ta oglas?')) return
    await supabase.from('plovila').delete().eq('id', id)
    nalozi()
  }

  function preklopiIzbor(id: string) {
    setIzbrani(prev => {
      const nov = new Set(prev)
      if (nov.has(id)) nov.delete(id); else nov.add(id)
      return nov
    })
  }

  async function izbrisiIzbrane() {
    if (izbrani.size === 0) return
    if (!confirm(`Izbrišete ${izbrani.size} izbranih plovil? Tega ni mogoče razveljaviti.`)) return
    setBrisanjeVteku(true)
    const { error } = await supabase.from('plovila').delete().in('id', Array.from(izbrani))
    setBrisanjeVteku(false)
    if (error) { alert('Napaka pri brisanju: ' + error.message); return }
    nalozi()
  }

  const filtrirani = useMemo(() => plovila.filter(p => {
    if (filter === 'nepotrjeni' && p.potrjeno) return false
    if (filter === 'potrjeni' && !p.potrjeno) return false
    if (!iskanje.trim()) return true
    const q = iskanje.toLowerCase()
    const lastnikEmail = (p.user_id && lastniki[p.user_id]) || ''
    return p.naziv.toLowerCase().includes(q) || lastnikEmail.toLowerCase().includes(q)
  }), [plovila, filter, iskanje, lastniki])

  const vsiIzbrani = filtrirani.length > 0 && filtrirani.every(p => izbrani.has(p.id))

  function preklopiVse() {
    setIzbrani(prev => {
      if (vsiIzbrani) return new Set()
      const nov = new Set(prev)
      filtrirani.forEach(p => nov.add(p.id))
      return nov
    })
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Plovila</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled objavljenih oglasov plovil — nova plovila so vidna takoj, tu jih lahko po potrebi umaknete.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={iskanje} onChange={e => setIskanje(e.target.value)}
            placeholder="Išči po nazivu plovila ali e-mailu lastnika..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['vsi', 'nepotrjeni', 'potrjeni'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {izbrani.size > 0 && (
        <div className="flex items-center justify-between gap-3 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{izbrani.size} {izbrani.size === 1 ? 'plovilo izbrano' : 'plovil izbranih'}</p>
          <button
            onClick={izbrisiIzbrane}
            disabled={brisanjeVteku}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> {brisanjeVteku ? 'Brišem...' : 'Izbriši izbrana'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-10 pl-5">
                <input type="checkbox" checked={vsiIzbrani} onChange={preklopiVse} className="rounded" />
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Plovilo</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Lastnik</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tip</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Cena</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Oglas</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrirani.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50/50 ${izbrani.has(p.id) ? 'bg-[#c9a84c]/5' : ''}`}>
                <td className="pl-5">
                  <input type="checkbox" checked={izbrani.has(p.id)} onChange={() => preklopiIzbor(p.id)} className="rounded" />
                </td>
                <td className="px-5 py-3.5 font-medium text-gray-900">{p.naziv}</td>
                <td className="px-5 py-3.5 text-gray-500">{(p.user_id && lastniki[p.user_id]) || '—'}</td>
                <td className="px-5 py-3.5 text-gray-500 capitalize">{p.tip}</td>
                <td className="px-5 py-3.5 text-gray-700">{p.cena.toLocaleString('sl-SI')} €</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.tip_oglasa === 'najem' ? 'bg-[#c9a84c]/15 text-[#9a7a2e]' : 'bg-[#0c2340]/10 text-[#0c2340]'}`}>
                    {p.tip_oglasa}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.potrjeno ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {p.potrjeno ? 'Aktivno' : 'V pregledu'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/plovila/${p.id}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Oglej si">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {!p.potrjeno && (
                      <button onClick={() => potrdi(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Potrdi">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => zavrni(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Zavrni">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {!nalaga && filtrirani.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni zadetkov</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

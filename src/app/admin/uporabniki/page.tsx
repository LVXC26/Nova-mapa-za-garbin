'use client'

import { useState, useEffect } from 'react'
import { Shield, Ban, CheckCircle, Mail, MessageSquareWarning, Star } from 'lucide-react'

interface Uporabnik {
  id: string
  ime: string
  email: string
  vloga: string
  created: string
  aktiven: boolean
  isAdmin: boolean
  isModerator: boolean
  autoPromocija: boolean
}

const vlogaBarva: Record<string, string> = {
  prodajalec: 'bg-[#0c2340]/10 text-[#0c2340]',
  charter: 'bg-blue-50 text-blue-700',
  skipper: 'bg-[#c9a84c]/15 text-[#9a7a2e]',
  kupec: 'bg-gray-100 text-gray-600',
  oba: 'bg-purple-50 text-purple-700',
}

export default function AdminUporabnikiPage() {
  const [uporabniki, setUporabniki] = useState<Uporabnik[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [napaka, setNapaka] = useState('')

  async function nalozi() {
    setNalaga(true)
    setNapaka('')
    const res = await fetch('/api/admin/uporabniki')
    const json = await res.json()
    if (!res.ok) { setNapaka(json.error ?? 'Napaka pri nalaganju'); setNalaga(false); return }
    setUporabniki(json.data)
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  async function spremeniVlogo(userId: string, vloga: string) {
    setUporabniki(prev => prev.map(u => u.id === userId ? { ...u, vloga } : u))
    const res = await fetch('/api/admin/uporabniki', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, vloga }),
    })
    if (!res.ok) await nalozi()
  }

  async function preklopiBlokado(userId: string, trenutnoAktiven: boolean) {
    setUporabniki(prev => prev.map(u => u.id === userId ? { ...u, aktiven: !trenutnoAktiven } : u))
    const res = await fetch('/api/admin/uporabniki', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, aktiven: !trenutnoAktiven }),
    })
    if (!res.ok) await nalozi()
  }

  async function preklopiAdmina(userId: string, trenutnoAdmin: boolean) {
    setUporabniki(prev => prev.map(u => u.id === userId ? { ...u, isAdmin: !trenutnoAdmin } : u))
    const res = await fetch('/api/admin/uporabniki', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isAdmin: !trenutnoAdmin }),
    })
    if (!res.ok) await nalozi()
  }

  async function preklopiModeratorja(userId: string, trenutno: boolean) {
    setUporabniki(prev => prev.map(u => u.id === userId ? { ...u, isModerator: !trenutno } : u))
    const res = await fetch('/api/admin/uporabniki', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isModerator: !trenutno }),
    })
    if (!res.ok) await nalozi()
  }

  async function preklopiAvtoPromocijo(userId: string, trenutno: boolean) {
    setUporabniki(prev => prev.map(u => u.id === userId ? { ...u, autoPromocija: !trenutno } : u))
    const res = await fetch('/api/admin/uporabniki', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, autoPromocija: !trenutno }),
    })
    if (!res.ok) await nalozi()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Uporabniki</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled računov, sprememba vloge, blokiranje</p>
      </div>

      {napaka && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{napaka}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Ime</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">E-mail</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Vloga</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Registriran</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {uporabniki.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{u.ime}</td>
                <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={u.vloga}
                    onChange={e => spremeniVlogo(u.id, e.target.value)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${vlogaBarva[u.vloga] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    <option value="prodajalec">Prodajalec</option>
                    <option value="charter">Charter</option>
                    <option value="skipper">Skipper</option>
                    <option value="kupec">Kupec</option>
                    <option value="oba">Prodajalec & Charter</option>
                  </select>
                  {u.isAdmin && (
                    <span className="ml-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">Admin</span>
                  )}
                  {u.isModerator && (
                    <span className="ml-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Moderator</span>
                  )}
                  {u.autoPromocija && (
                    <span className="ml-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Auto-promo</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-500">{new Date(u.created).toLocaleDateString('sl-SI')}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.aktiven ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {u.aktiven ? 'Aktiven' : 'Blokiran'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <a href={`mailto:${u.email}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Pošlji email"><Mail className="w-4 h-4" /></a>
                    <button
                      onClick={() => preklopiAdmina(u.id, u.isAdmin)}
                      className={`p-1.5 rounded-lg transition-colors ${u.isAdmin ? 'text-[#c9a84c] bg-amber-50' : 'text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50'}`}
                      title={u.isAdmin ? 'Odstrani admin dostop' : 'Nastavi kot admin'}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => preklopiModeratorja(u.id, u.isModerator)}
                      className={`p-1.5 rounded-lg transition-colors ${u.isModerator ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                      title={u.isModerator ? 'Odstrani moderatorske pravice' : 'Nastavi kot moderatorja (lahko briše objave/komentarje povsod)'}
                    >
                      <MessageSquareWarning className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => preklopiAvtoPromocijo(u.id, u.autoPromocija)}
                      className={`p-1.5 rounded-lg transition-colors ${u.autoPromocija ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'}`}
                      title={u.autoPromocija ? 'Odstrani samodejno promocijo' : 'Vsi oglasi tega računa vedno brezplačno promovirani'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button onClick={() => preklopiBlokado(u.id, u.aktiven)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={u.aktiven ? 'Blokiraj' : 'Odblokiraj'}>
                      {u.aktiven ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!nalaga && uporabniki.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni uporabnikov</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>
    </div>
  )
}

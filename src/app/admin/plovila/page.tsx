'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react'
import { mockPlovila } from '@/data/mock'

export default function AdminPlovilaPage() {
  const [iskanje, setIskanje] = useState('')
  const [filter, setFilter] = useState<'vsi' | 'nepotrjeni' | 'potrjeni'>('vsi')

  const filtrirani = mockPlovila.filter(p => {
    if (filter === 'nepotrjeni' && p.potrjeno) return false
    if (filter === 'potrjeni' && !p.potrjeno) return false
    return p.naziv.toLowerCase().includes(iskanje.toLowerCase())
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Plovila</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled in odobritev oglasov plovil</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={iskanje} onChange={e => setIskanje(e.target.value)}
            placeholder="Išči plovila..."
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

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Plovilo</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tip</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Cena</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Oglas</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrirani.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{p.naziv}</td>
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
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Oglej si">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Potrdi">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Zavrni">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrirani.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni zadetkov</div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

const pozicije = ['Homepage top', 'Homepage mid', 'Plovila sidebar', 'Charterji sidebar', 'Detail stran']

const mockBannerji = [
  { id: 'b1', naziv: 'Premium oglasnik 1', pozicija: 'Homepage top', dimenzije: '728×90', aktiven: true, klikCena: 0 },
  { id: 'b2', naziv: 'Sidebar partner', pozicija: 'Plovila sidebar', dimenzije: '300×250', aktiven: false, klikCena: 0 },
]

export default function AdminBannerjiPage() {
  const [bannerji, setBannerji] = useState(mockBannerji)

  function toggleAktiven(id: string) {
    setBannerji(prev => prev.map(b => b.id === id ? { ...b, aktiven: !b.aktiven } : b))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Oglaševalski bannerji</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje oglasnih prostorov</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Dodaj banner
        </button>
      </div>

      {/* Pozicije info */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {pozicije.map(p => (
          <div key={p} className="bg-white rounded-xl border border-dashed border-gray-200 p-4 text-center">
            <p className="text-xs font-medium text-gray-500">{p}</p>
            <p className="text-xs text-gray-300 mt-1">Prosto</p>
          </div>
        ))}
      </div>

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
                  <button onClick={() => toggleAktiven(b.id)} className="transition-colors">
                    {b.aktiven
                      ? <ToggleRight className="w-6 h-6 text-emerald-500" />
                      : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

const mockTocke = [
  { id: 'm1', naziv: 'Marina Portorož', tip: 'marina', lat: 45.5133, lng: 13.5903 },
  { id: 'm2', naziv: 'Marina Izola', tip: 'marina', lat: 45.5440, lng: 13.6621 },
  { id: 'o1', naziv: 'Brijuni', tip: 'otok', lat: 44.9167, lng: 13.7667 },
  { id: 'r1', naziv: 'Restavracija Stoja', tip: 'restavracija', lat: 44.8636, lng: 13.8461 },
  { id: 'n1', naziv: 'Plitčine Sv. Nikola', tip: 'nevarno', lat: 45.4800, lng: 13.5200 },
]

const tipEmoji: Record<string, string> = { marina: '⚓', otok: '🏝️', restavracija: '🍽️', nevarno: '⚠️' }

export default function AdminZemljevidPage() {
  const [tocke] = useState(mockTocke)
  const [dodaj, setDodaj] = useState(false)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Zemljevid točke</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje točk na interaktivnem zemljevidu</p>
        </div>
        <button onClick={() => setDodaj(!dodaj)} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Dodaj točko
        </button>
      </div>

      {dodaj && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Nova točka</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Naziv', placeholder: 'Marina Portorož' },
              { label: 'Tip', placeholder: 'marina / otok / restavracija / nevarno' },
              { label: 'Latitude', placeholder: '45.5133' },
              { label: 'Longitude', placeholder: '13.5903' },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input placeholder={placeholder} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Opis</label>
              <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-[#c9a84c] text-[#0c2340] font-semibold text-sm rounded-full">Shrani</button>
            <button onClick={() => setDodaj(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-full hover:bg-gray-50">Prekliči</button>
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

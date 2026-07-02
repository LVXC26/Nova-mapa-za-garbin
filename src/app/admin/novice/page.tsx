'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { mockNovice } from '@/data/mock'

export default function AdminNovicePage() {
  const [novice] = useState(mockNovice)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Novice</h1>
          <p className="text-gray-500 text-sm mt-1">Upravljanje blog novic</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
          <Plus className="w-4 h-4" /> Nova novica
        </button>
      </div>

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
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${n.published_at ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {n.published_at ? 'Objavljeno' : 'Osnutek'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></button>
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

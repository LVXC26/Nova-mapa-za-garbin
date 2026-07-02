'use client'

import { CheckCircle, XCircle, Eye, BadgeCheck, Star } from 'lucide-react'
import { mockSkiperji } from '@/data/mock'

export default function AdminSkiperjiPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Skiperji</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled skiperjev in dodelitev verified badge</p>
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
            {mockSkiperji.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{s.ime}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.lokacija}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.izkusnje_let} let</td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1 text-gray-700">
                    <Star className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c]" />
                    {s.ocena.toFixed(1)} ({s.st_ocen})
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-700">{s.cena_dan} €</td>
                <td className="px-5 py-3.5">
                  <span className={`flex items-center gap-1 text-xs font-medium w-fit px-2.5 py-1 rounded-full ${s.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.verified && <BadgeCheck className="w-3.5 h-3.5" />}
                    {s.verified ? 'Preverjeno' : 'V pregledu'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><XCircle className="w-4 h-4" /></button>
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

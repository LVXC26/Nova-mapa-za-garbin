'use client'

import { Shield, Ban, Mail } from 'lucide-react'

const mockUporabniki = [
  { id: 'u1', ime: 'Janez Novak', email: 'janez@primer.si', vloga: 'prodajalec', created: '2024-01-15', aktiven: true },
  { id: 'u2', ime: 'Adriatic Sail d.o.o.', email: 'info@adriaticsail.si', vloga: 'charter', created: '2024-01-20', aktiven: true },
  { id: 'u3', ime: 'Marko Horvat', email: 'marko@primer.si', vloga: 'skipper', created: '2024-02-01', aktiven: true },
  { id: 'u4', ime: 'Ana Kovač', email: 'ana@primer.si', vloga: 'kupec', created: '2024-02-10', aktiven: false },
]

const vlogaBarva: Record<string, string> = {
  prodajalec: 'bg-[#0c2340]/10 text-[#0c2340]',
  charter: 'bg-blue-50 text-blue-700',
  skipper: 'bg-[#c9a84c]/15 text-[#9a7a2e]',
  kupec: 'bg-gray-100 text-gray-600',
  admin: 'bg-red-50 text-red-700',
}

export default function AdminUporabnikiPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Uporabniki</h1>
        <p className="text-gray-500 text-sm mt-1">Pregled računov, sprememba vloge, blokiranje</p>
      </div>

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
            {mockUporabniki.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{u.ime}</td>
                <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <select defaultValue={u.vloga} className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${vlogaBarva[u.vloga] ?? 'bg-gray-100 text-gray-600'}`}>
                    <option value="prodajalec">Prodajalec</option>
                    <option value="charter">Charter</option>
                    <option value="skipper">Skipper</option>
                    <option value="kupec">Kupec</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-3.5 text-gray-500">{u.created}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.aktiven ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {u.aktiven ? 'Aktiven' : 'Blokiran'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Pošlji email"><Mail className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors" title="Admin vloga"><Shield className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Blokiraj"><Ban className="w-4 h-4" /></button>
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

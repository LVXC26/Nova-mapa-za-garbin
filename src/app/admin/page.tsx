'use client'

import { Ship, Users, MessageCircle, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const stats = [
  { label: 'Skupaj uporabnikov', vrednost: '0', ikona: Users, barva: 'bg-blue-50 text-blue-600', sprememba: '+0 ta teden' },
  { label: 'Aktivnih oglasov', vrednost: '0', ikona: Ship, barva: 'bg-emerald-50 text-emerald-600', sprememba: '+0 ta teden' },
  { label: 'Sporočil danes', vrednost: '0', ikona: MessageCircle, barva: 'bg-purple-50 text-purple-600', sprememba: '+0 ta teden' },
  { label: 'Oglasov v pregledu', vrednost: '0', ikona: Clock, barva: 'bg-amber-50 text-amber-600', sprememba: 'Čaka odobritev' },
]

const recentActions = [
  { tip: 'Novo plovilo', naziv: 'Bavaria Cruiser 46', cas: 'Pred 2 min', status: 'v pregledu' },
  { tip: 'Nov charter', naziv: 'Blue Sail d.o.o.', cas: 'Pred 15 min', status: 'v pregledu' },
  { tip: 'Nov skipper', naziv: 'Janez Novak', cas: 'Pred 1 uro', status: 'potrjeno' },
  { tip: 'Nova novica', naziv: 'Trg plovil 2024', cas: 'Pred 3 ur', status: 'objavljeno' },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Garbin platforma — upravljalska plošča</p>
      </div>

      {/* Opozorilo — Supabase */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Supabase ni povezan</p>
          <p className="text-xs text-amber-600">Dodajte NEXT_PUBLIC_SUPABASE_URL in NEXT_PUBLIC_SUPABASE_ANON_KEY v .env.local za prave podatke.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, vrednost, ikona: Ikona, barva, sprememba }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${barva}`}>
              <Ikona className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">{vrednost}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className="text-xs text-emerald-600 mt-1">{sprememba}</p>
          </div>
        ))}
      </div>

      {/* Zadnje aktivnosti */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Zadnje aktivnosti</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActions.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{a.tip}</p>
                <p className="font-medium text-gray-900 text-sm">{a.naziv}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  a.status === 'potrjeno' ? 'bg-emerald-50 text-emerald-700'
                    : a.status === 'objavljeno' ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {a.status}
                </span>
                <span className="text-xs text-gray-400">{a.cas}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

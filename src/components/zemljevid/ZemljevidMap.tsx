'use client'

import { useState, useEffect } from 'react'
import { MapPin, Anchor, Ship, Utensils, AlertTriangle, Filter } from 'lucide-react'

type TipTocke = 'marina' | 'otok' | 'restavracija' | 'nevarno'

interface ZemljevidTocka {
  id: string
  naziv: string
  tip: TipTocke
  lat: number
  lng: number
  opis: string
  link?: string
}

const mockTocke: ZemljevidTocka[] = [
  // Marine
  { id: 'm1', naziv: 'Marina Portorož', tip: 'marina', lat: 45.5133, lng: 13.5903, opis: 'Največja marina v slovenskem primorju. 1.000 mest, servisi, gostilna.', link: '#' },
  { id: 'm2', naziv: 'Marina Izola', tip: 'marina', lat: 45.5440, lng: 13.6621, opis: 'Moderna marina sredi zgodovinskega Izole. 260 mest.', link: '#' },
  { id: 'm3', naziv: 'Marina Koper', tip: 'marina', lat: 45.5449, lng: 13.7294, opis: 'Prometna marina v Kopru z dostopom do mesta.', link: '#' },
  { id: 'm4', naziv: 'Marina Rovinj', tip: 'marina', lat: 45.0786, lng: 13.6278, opis: 'Slikovita marina pri starem mestu Rovinj. 500 mest.', link: '#' },
  { id: 'm5', naziv: 'Marina Pula', tip: 'marina', lat: 44.8785, lng: 13.8517, opis: 'Velika marina v Puli. Blizu rimskega amfiteatra.', link: '#' },
  { id: 'm6', naziv: 'Marina Zadar', tip: 'marina', lat: 44.1194, lng: 15.2422, opis: 'Moderna marina v Zadru. Dobre storitve, dober dostop.', link: '#' },
  { id: 'm7', naziv: 'Marina Split', tip: 'marina', lat: 43.5081, lng: 16.4402, opis: 'Centralna marina Splita. Blizu Dioklecijanove palače.', link: '#' },
  { id: 'm8', naziv: 'Marina Dubrovnik', tip: 'marina', lat: 42.6469, lng: 18.0731, opis: 'Ekskluzivna marina pri stari Dubrovnik. 200 mest.', link: '#' },
  // Otoki
  { id: 'o1', naziv: 'Brijuni', tip: 'otok', lat: 44.9167, lng: 13.7667, opis: 'Narodni park Brijuni. 14 otokov z raznoliko favno.', link: '#' },
  { id: 'o2', naziv: 'Cres', tip: 'otok', lat: 44.9600, lng: 14.3900, opis: 'Največji hrvaški otok. Naravna lepota in netaknjeni zalivi.', link: '#' },
  { id: 'o3', naziv: 'Krk', tip: 'otok', lat: 45.0200, lng: 14.5700, opis: 'Največji jadran. island. Dobro dostopen, lepe plaže.', link: '#' },
  { id: 'o4', naziv: 'Hvar', tip: 'otok', lat: 43.1728, lng: 16.4418, opis: 'Sončni otok z razkošnimi lagunami in živahnim nočnim življenjem.', link: '#' },
  { id: 'o5', naziv: 'Brač', tip: 'otok', lat: 43.3078, lng: 16.6642, opis: 'Znan po plaži Zlatni rat. Čisto morje in miren ambient.', link: '#' },
  { id: 'o6', naziv: 'Kornati', tip: 'otok', lat: 43.8394, lng: 15.3269, opis: 'Nacionalni park Kornati — arhipelag 140 otokov.', link: '#' },
  // Restavracije
  { id: 'r1', naziv: 'Restavracija Stoja', tip: 'restavracija', lat: 44.8636, lng: 13.8461, opis: 'Odlična riba in morski sadeži v Puli. Priljubljena med jadralci.', link: '#' },
  { id: 'r2', naziv: 'Konoba Škojera', tip: 'restavracija', lat: 45.0783, lng: 13.6346, opis: 'Tradicionalna istrska kuhinja v Rovinju. Direktno ob morju.', link: '#' },
  { id: 'r3', naziv: 'Ribič Piran', tip: 'restavracija', lat: 45.5293, lng: 13.5697, opis: 'Sveža riba in morski sadeži v starem Piranu.', link: '#' },
  // Nevarne cone
  { id: 'n1', naziv: 'Plitčine Sv. Nikola', tip: 'nevarno', lat: 45.4800, lng: 13.5200, opis: 'Plitčine nevarne pri nizkem plimovanju. Minimalna globina 1.2m.', link: undefined },
  { id: 'n2', naziv: 'Rt Kamenjak — veter', tip: 'nevarno', lat: 44.7667, lng: 13.9167, opis: 'Nevarno območje pri jugovzhodnem vetru. Previdnost na morju.', link: undefined },
]

const tipConfig: Record<TipTocke, { label: string; barva: string; ikona: string; emoji: string }> = {
  marina: { label: 'Marine', barva: 'bg-[#0c2340]', ikona: 'text-[#0c2340]', emoji: '⚓' },
  otok: { label: 'Otoki', barva: 'bg-emerald-600', ikona: 'text-emerald-600', emoji: '🏝️' },
  restavracija: { label: 'Restavracije', barva: 'bg-amber-500', ikona: 'text-amber-600', emoji: '🍽️' },
  nevarno: { label: 'Nevarno', barva: 'bg-red-500', ikona: 'text-red-600', emoji: '⚠️' },
}

export default function ZemljevidMap() {
  const [Map, setMap] = useState<React.ComponentType<{tocke: ZemljevidTocka[]; filtri: TipTocke[]}> | null>(null)
  const [aktivniFilter, setAktivniFilter] = useState<Set<TipTocke>>(new Set(['marina', 'otok', 'restavracija', 'nevarno']))
  const [izbranaT, setIzbranaT] = useState<ZemljevidTocka | null>(null)

  useEffect(() => {
    // Dynamic import Leaflet only on client
    import('./LeafletMap').then(m => setMap(() => m.default))
  }, [])

  function toggleFilter(tip: TipTocke) {
    setAktivniFilter(prev => {
      const next = new Set(prev)
      next.has(tip) ? next.delete(tip) : next.add(tip)
      return next
    })
  }

  const filtrirane = mockTocke.filter(t => aktivniFilter.has(t.tip))

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-[#0c2340] py-6 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#c9a84c]" /> Interaktivni zemljevid Jadrana
            </h1>
            <p className="text-white/60 text-sm mt-1">Marine, otoki, restavracije in nevarne cone</p>
          </div>

          {/* Filtri */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(tipConfig) as TipTocke[]).map((tip) => (
              <button
                key={tip}
                onClick={() => toggleFilter(tip)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  aktivniFilter.has(tip)
                    ? `${tipConfig[tip].barva} text-white`
                    : 'bg-white/10 text-white/50 border border-white/20'
                }`}
              >
                <span>{tipConfig[tip].emoji}</span>
                {tipConfig[tip].label}
                <span className="ml-1 opacity-70">{mockTocke.filter(t => t.tip === tip).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 shrink-0 bg-white border-r border-gray-100 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <p className="text-sm font-semibold text-[#0c2340]">
              {filtrirane.length} točk na karti
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {filtrirane.map((t) => (
              <button
                key={t.id}
                onClick={() => setIzbranaT(izbranaT?.id === t.id ? null : t)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                  izbranaT?.id === t.id ? 'bg-[#0c2340]/5' : ''
                }`}
              >
                <span className="text-xl shrink-0">{tipConfig[t.tip].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0c2340] text-sm truncate">{t.naziv}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{t.opis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative bg-[#e8f0f5]">
          {Map ? (
            <Map tocke={filtrirane} filtri={[...aktivniFilter]} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-[#0c2340] font-medium text-sm">Nalagam zemljevid...</p>
              </div>
            </div>
          )}

          {/* Popup za izbrano točko (mobile) */}
          {izbranaT && (
            <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tipConfig[izbranaT.tip].emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0c2340]">{izbranaT.naziv}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{izbranaT.opis}</p>
                  {izbranaT.link && (
                    <a href={izbranaT.link} className="text-xs text-[#c9a84c] font-medium mt-2 inline-block">Več info →</a>
                  )}
                </div>
                <button onClick={() => setIzbranaT(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

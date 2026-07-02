'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Ship, MapPin, Calendar, Ruler, Trash2 } from 'lucide-react'
import { mockPlovila } from '@/data/mock'
import { formatCena } from '@/lib/utils'
import type { Plovilo } from '@/types/database'

export default function PriljubljeniPage() {
  const [priljubljeni, setPriljubljeni] = useState<Plovilo[]>([])

  useEffect(() => {
    const saved = mockPlovila.filter(p => localStorage.getItem(`garbin_fav_${p.id}`) === '1')
    setPriljubljeni(saved)
  }, [])

  function odstrani(id: string) {
    localStorage.removeItem(`garbin_fav_${id}`)
    setPriljubljeni(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2340]">Priljubljena plovila</h1>
          <p className="text-gray-500 text-sm mt-1">Plovila ki ste jih shranili z ❤️</p>
        </div>
        {priljubljeni.length > 0 && (
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-[#0c2340]">{priljubljeni.length}</span> shranjenih
          </span>
        )}
      </div>

      {priljubljeni.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-gray-400 mb-1">Nimate shranjenih plovil</p>
          <p className="text-sm text-gray-300 mb-6">Kliknite ❤️ na kartici plovila, da ga shranite.</p>
          <Link
            href="/plovila"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0c2340] text-white font-medium text-sm rounded-full hover:bg-[#1e3a5f] transition-all hover:scale-105"
          >
            <Ship className="w-4 h-4" /> Išči plovila
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {priljubljeni.map(plovilo => (
            <div key={plovilo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center text-2xl shrink-0">
                {plovilo.tip === 'jadrnica' ? '⛵' : plovilo.tip === 'motorni' ? '🚤' : '🛟'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-[#0c2340] truncate">{plovilo.naziv}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    plovilo.tip_oglasa === 'najem' ? 'bg-[#c9a84c]/15 text-[#9a7a2e]' : 'bg-[#0c2340]/10 text-[#0c2340]'
                  }`}>
                    {plovilo.tip_oglasa === 'najem' ? 'Najem' : 'Prodaja'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {plovilo.lokacija && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{plovilo.lokacija}</span>}
                  {plovilo.letnik && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{plovilo.letnik}</span>}
                  {plovilo.dolzina_m && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{plovilo.dolzina_m}m</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-[#0c2340]">{formatCena(plovilo.cena)}</p>
                {plovilo.tip_oglasa === 'najem' && <p className="text-xs text-gray-400">/ teden</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/plovila/${plovilo.id}`}
                  className="px-3 py-1.5 bg-[#0c2340] text-white text-xs font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
                  Oglej si
                </Link>
                <button onClick={() => odstrani(plovilo.id)}
                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

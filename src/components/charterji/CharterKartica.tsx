'use client'

import Link from 'next/link'
import { Star, MapPin, Ship, CheckCircle, ArrowRight, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Charter } from '@/types/database'

function useFavorite(id: string) {
  const key = `garbin_charter_fav_${id}`
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setIsFav(localStorage.getItem(key) === '1')
  }, [key])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !isFav
    setIsFav(next)
    if (next) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  }

  return { isFav, toggle }
}

const tipIkone: Record<string, string> = {
  jahta: '🛥️',
  jadrnica: '⛵',
  motorni: '🚤',
  gumenjak: '🛟',
}

export default function CharterKartica({ charter }: { charter: Charter }) {
  const zvezdice = Array.from({ length: 5 }, (_, i) => i < Math.round(charter.ocena))
  const { isFav, toggle } = useFavorite(charter.id)

  return (
    <Link
      href={`/charterji/${charter.id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group"
    >
      {/* Header image */}
      <div className="h-32 relative overflow-hidden bg-gradient-to-br from-[#0c2340] to-[#1e3a5f]">
        <img
          src="https://images.unsplash.com/photo-1519789110440-4b90d6f7e65b?auto=format&fit=crop&w=600&q=70"
          alt={charter.naziv}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/80 to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          {charter.verified && (
            <span className="flex items-center gap-1 text-xs text-emerald-300 font-medium">
              <CheckCircle className="w-3 h-3" /> Verificirano
            </span>
          )}
        </div>
        <div className={`absolute top-0 left-0 right-0 h-1 ${charter.tip === 'podjetje' ? 'bg-[#c9a84c]' : 'bg-emerald-400'}`} />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                charter.tip === 'podjetje'
                  ? 'bg-[#0c2340]/10 text-[#0c2340]'
                  : 'bg-[#c9a84c]/15 text-[#9a7a2e]'
              }`}>
                {charter.tip === 'podjetje' ? '🏢 Podjetje' : '👤 Zasebnik'}
              </span>
              {charter.verified && (
                <span title="Preverjeno">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </span>
              )}
            </div>
            <h3 className="font-display text-base font-semibold text-[#0c2340] leading-tight group-hover:text-[#1e3a5f] truncate">{charter.naziv}</h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggle}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
            </button>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#c9a84c] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Location + plovila */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
            {charter.lokacija}
          </span>
          <span className="flex items-center gap-1.5">
            <Ship className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
            {charter.st_plovil} {charter.st_plovil === 1 ? 'plovilo' : charter.st_plovil < 5 ? 'plovila' : 'plovil'}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {zvezdice.map((poln, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${poln ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{charter.ocena.toFixed(1)}</span>
          <span className="text-xs text-gray-400">• max {charter.max_oseb} <Users className="w-3 h-3 inline" /></span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{charter.opis}</p>

        {/* Tip plovil */}
        <div className="flex flex-wrap gap-1.5">
          {charter.tip_plovila.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 capitalize"
            >
              {tipIkone[t] ?? '⚓'} {t}
            </span>
          ))}
          {charter.tip_plovila.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-400">
              +{charter.tip_plovila.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

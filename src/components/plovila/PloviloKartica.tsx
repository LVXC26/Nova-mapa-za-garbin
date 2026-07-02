'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Ruler, Heart, GitCompare } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Plovilo } from '@/types/database'
import { formatCena } from '@/lib/utils'
import { usePrimerjava } from '@/context/PrimerjaContext'

const tipLabel: Record<string, string> = {
  jadrnica: 'Jadrnica',
  motorni: 'Motorni čoln',
  gumenjak: 'Gumenjak',
  katamaran: 'Katamaran',
  jet: 'Jet ski',
  drugo: 'Drugo',
}

const stanjeKlasa: Record<string, string> = {
  'odlično': 'bg-emerald-100 text-emerald-800',
  'dobro': 'bg-blue-100 text-blue-800',
  'potrebuje popravilo': 'bg-amber-100 text-amber-800',
}

const tipIkone: Record<string, string> = {
  jadrnica: '⛵',
  motorni: '🚤',
  gumenjak: '🛟',
  katamaran: '⛵',
  jet: '💨',
  drugo: '⚓',
}

function useFavorite(id: string) {
  const key = `garbin_fav_${id}`
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

interface Props {
  plovilo: Plovilo
  promoted?: boolean
  prikaziOglede?: boolean
}

export default function PloviloKartica({ plovilo, promoted = false, prikaziOglede = false }: Props) {
  const mockOgledi = prikaziOglede ? (parseInt(plovilo.id.replace(/\D/g, '') || '7') * 17 + 23) % 191 + 10 : null
  const { isFav, toggle } = useFavorite(plovilo.id)
  const { dodajVPrimerjavo, odstraniIzPrimerjave, jePrimerjavno, primerjava } = usePrimerjava()
  const vPrimerjavi = jePrimerjavno(plovilo.id)
  const primerjavaPolna = primerjava.length >= 3 && !vPrimerjavi

  function togglePrimerjava(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (vPrimerjavi) {
      odstraniIzPrimerjave(plovilo.id)
    } else if (!primerjavaPolna) {
      dodajVPrimerjavo(plovilo)
    }
  }

  return (
    <Link href={`/plovila/${plovilo.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="relative h-48 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] flex items-center justify-center overflow-hidden img-placeholder">
          {plovilo.slike && plovilo.slike.length > 0 ? (
            <Image
              src={plovilo.slike[0]}
              alt={plovilo.naziv}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <span className="text-6xl opacity-15">{tipIkone[plovilo.tip] ?? '⚓'}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Prodano overlay */}
          {plovilo.prodano && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
              <span className="px-4 py-2 bg-[#0c2340] text-white font-bold text-sm rounded-full border-2 border-white/30 rotate-[-8deg]">PRODANO</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-20">
            {plovilo.urgentno && !plovilo.prodano && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded-full shadow-lg">
                ⚡ Nujno
              </span>
            )}
            {promoted && !plovilo.urgentno && !plovilo.prodano && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#c9a84c] text-[#0c2340] rounded-full shadow-lg">
                ★ Promoted
              </span>
            )}
            {!promoted && !plovilo.urgentno && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full">
                {tipLabel[plovilo.tip] ?? plovilo.tip}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={togglePrimerjava}
              title={vPrimerjavi ? 'Odstrani iz primerjave' : primerjavaPolna ? 'Max 3 plovila' : 'Dodaj v primerjavo'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                vPrimerjavi
                  ? 'bg-[#c9a84c] text-[#0c2340] scale-110'
                  : primerjavaPolna
                  ? 'bg-black/30 text-white/30 cursor-not-allowed'
                  : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFav
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
              }`}
              title={isFav ? 'Odstrani iz priljubljenih' : 'Dodaj v priljubljene'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {plovilo.stanje && (
            <div className="absolute bottom-3 left-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${stanjeKlasa[plovilo.stanje]}`}>
                {plovilo.stanje}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 right-3">
            {plovilo.cena_na_zahtevo ? (
              <span className="text-sm font-display font-bold text-white drop-shadow-lg bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">Cena na zahtevo</span>
            ) : (
              <span className="text-xl font-display font-bold text-white drop-shadow-lg">
                {formatCena(plovilo.cena)}
              </span>
            )}
          </div>
          {prikaziOglede && mockOgledi !== null && (
            <div className="absolute bottom-3 left-3">
              <span className="text-xs font-medium text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                👁 {mockOgledi} ogledov
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-[#0c2340] group-hover:text-[#c9a84c] transition-colors line-clamp-1 mb-1">
            {plovilo.naziv}
          </h3>
          {plovilo.opis && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2 mb-3">{plovilo.opis}</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {plovilo.lokacija && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                <span className="truncate">{plovilo.lokacija}</span>
              </div>
            )}
            {plovilo.letnik && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                <span>{plovilo.letnik}</span>
              </div>
            )}
            {plovilo.dolzina_m && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Ruler className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                <span>{plovilo.dolzina_m} m</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${
                plovilo.tip_oglasa === 'najem'
                  ? 'bg-[#c9a84c]/15 text-[#9a7a2e]'
                  : 'bg-[#0c2340]/8 text-[#0c2340]'
              }`}>
                {plovilo.tip_oglasa === 'najem' ? 'Najem' : 'Prodaja'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

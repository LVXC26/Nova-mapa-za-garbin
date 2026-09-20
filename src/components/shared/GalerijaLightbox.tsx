'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function GalerijaLightbox({ slike, naziv, zacetniIndeks, onClose }: {
  slike: string[]
  naziv: string
  zacetniIndeks: number
  onClose: () => void
}) {
  const [indeks, setIndeks] = useState(zacetniIndeks)

  const naprej = useCallback(() => setIndeks(i => (i + 1) % slike.length), [slike.length])
  const nazaj = useCallback(() => setIndeks(i => (i - 1 + slike.length) % slike.length), [slike.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') naprej()
      if (e.key === 'ArrowLeft') nazaj()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, naprej, nazaj])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10">
        <X className="w-7 h-7" />
      </button>
      <div className="absolute top-4 left-4 text-white/70 text-sm">{indeks + 1} / {slike.length}</div>

      {slike.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); nazaj() }}
          className="absolute left-2 sm:left-6 text-white/70 hover:text-white transition-colors z-10 p-2"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slike[indeks]}
        alt={`${naziv} — slika ${indeks + 1}`}
        className="max-w-[92vw] max-h-[88vh] object-contain"
        onClick={e => e.stopPropagation()}
      />

      {slike.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); naprej() }}
          className="absolute right-2 sm:right-6 text-white/70 hover:text-white transition-colors z-10 p-2"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      )}
    </div>
  )
}

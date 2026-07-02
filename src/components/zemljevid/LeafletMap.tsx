'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const tipBarve: Record<TipTocke, string> = {
  marina: '#0c2340',
  otok: '#16a34a',
  restavracija: '#d97706',
  nevarno: '#dc2626',
}

const tipEmoji: Record<TipTocke, string> = {
  marina: '⚓',
  otok: '🏝️',
  restavracija: '🍽️',
  nevarno: '⚠️',
}

function makeIcon(tip: TipTocke) {
  const barva = tipBarve[tip]
  const emoji = tipEmoji[tip]
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;
      background:${barva};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;display:block;text-align:center;line-height:32px;">${emoji}</span></div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  })
}

export default function LeafletMap({ tocke, filtri }: { tocke: ZemljevidTocka[]; filtri: TipTocke[] }) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapRef.current = L.map(containerRef.current, {
      center: [44.5, 14.5],
      zoom: 7,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    tocke.forEach(t => {
      const marker = L.marker([t.lat, t.lng], { icon: makeIcon(t.tip) })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width:180px;font-family:system-ui,sans-serif">
            <div style="font-weight:700;color:#0c2340;margin-bottom:4px">${t.naziv}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px">${t.opis}</div>
            ${t.link ? `<a href="${t.link}" style="font-size:12px;color:#c9a84c;font-weight:600">Več info →</a>` : ''}
          </div>
        `, { maxWidth: 220 })

      markersRef.current.push(marker)
    })
  }, [tocke])

  return <div ref={containerRef} className="w-full h-full" />
}

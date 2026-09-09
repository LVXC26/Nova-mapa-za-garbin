'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ZemljevidTocka as ZemljevidTockaDB, ZemljevidPosebnost as ZemljevidPosebnostDB } from '@/types/database'

type TipTocke = ZemljevidTockaDB['tip']
type TipPosebnosti = ZemljevidPosebnostDB['tip']

interface ZemljevidTocka {
  id: string
  naziv: string
  tip: TipTocke
  lat: number
  lng: number
  opis: string | null
  link?: string | null
}

interface PosebnostPrikaz {
  id: string
  naziv: string
  tip: TipPosebnosti
  lat: number
  lng: number
  opis: string | null
  slika: string | null
  avtorIme: string
  moreIzbrisati: boolean
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

// Posebnosti (uporabniško dodane točke) so vizualno ločene od uradnih
// (krog + zlat obroč namesto kapljice) — na prvi pogled naj bo jasno, da
// gre za skupnostno, ne uredniško preverjeno vsebino.
const posebnostBarve: Record<TipPosebnosti, string> = {
  sidrisce: '#0c2340',
  potapljanje: '#0e7490',
  plaza: '#d97706',
  gostilna: '#b45309',
  nevarnost: '#dc2626',
  drugo: '#6b7280',
}

const posebnostEmoji: Record<TipPosebnosti, string> = {
  sidrisce: '⚓',
  potapljanje: '🤿',
  plaza: '🏖️',
  gostilna: '🍽️',
  nevarnost: '⚠️',
  drugo: '📍',
}

function escapeHtml(besedilo: string): string {
  const el = document.createElement('div')
  el.textContent = besedilo
  return el.innerHTML
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

function makePosebnostIcon(tip: TipPosebnosti) {
  const barva = posebnostBarve[tip]
  const emoji = posebnostEmoji[tip]
  return L.divIcon({
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${barva};
      border:3px solid #c9a84c;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="font-size:14px;">${emoji}</span></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

interface Props {
  tocke: ZemljevidTocka[]
  posebnosti: PosebnostPrikaz[]
  dodajanjeAktivno?: boolean
  onKlikZemljevid?: (lat: number, lng: number) => void
  onIzbrisiPosebnost?: (id: string) => void
}

export default function LeafletMap({ tocke, posebnosti, dodajanjeAktivno, onKlikZemljevid, onIzbrisiPosebnost }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const posebnostMarkersRef = useRef<L.Marker[]>([])
  // Refs za callback/zastavico znotraj enkrat-registriranega map click
  // listenerja — brez tega bi listener videl samo vrednosti iz prvega
  // rendera (stale closure).
  const dodajanjeAktivnoRef = useRef(dodajanjeAktivno)
  const onKlikZemljevidRef = useRef(onKlikZemljevid)
  useEffect(() => {
    dodajanjeAktivnoRef.current = dodajanjeAktivno
    onKlikZemljevidRef.current = onKlikZemljevid
  })

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

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      if (dodajanjeAktivnoRef.current) onKlikZemljevidRef.current?.(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Kurzor kot vizualni namig, da je zemljevid v "dodajanje" načinu.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.style.cursor = dodajanjeAktivno ? 'crosshair' : ''
  }, [dodajanjeAktivno])

  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    tocke.forEach(t => {
      const marker = L.marker([t.lat, t.lng], { icon: makeIcon(t.tip) })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width:180px;font-family:system-ui,sans-serif">
            <div style="font-weight:700;color:#0c2340;margin-bottom:4px">${escapeHtml(t.naziv)}</div>
            ${t.opis ? `<div style="font-size:12px;color:#6b7280;margin-bottom:8px">${escapeHtml(t.opis)}</div>` : ''}
            ${t.link ? `<a href="${t.link}" style="font-size:12px;color:#c9a84c;font-weight:600">Več info →</a>` : ''}
          </div>
        `, { maxWidth: 220 })

      markersRef.current.push(marker)
    })
  }, [tocke])

  useEffect(() => {
    if (!mapRef.current) return

    posebnostMarkersRef.current.forEach(m => m.remove())
    posebnostMarkersRef.current = []

    posebnosti.forEach(p => {
      const gumbId = `posebnost-izbrisi-${p.id}`
      const marker = L.marker([p.lat, p.lng], { icon: makePosebnostIcon(p.tip) })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width:180px;max-width:220px;font-family:system-ui,sans-serif">
            <div style="font-weight:700;color:#0c2340;margin-bottom:4px">${escapeHtml(p.naziv)}</div>
            ${p.slika ? `<img src="${escapeHtml(p.slika)}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px" />` : ''}
            ${p.opis ? `<div style="font-size:12px;color:#6b7280;margin-bottom:6px">${escapeHtml(p.opis)}</div>` : ''}
            <div style="font-size:11px;color:#9ca3af;margin-bottom:${p.moreIzbrisati ? '8px' : '0'}">Dodal: ${escapeHtml(p.avtorIme)}</div>
            ${p.moreIzbrisati ? `<button id="${gumbId}" style="font-size:11px;color:#dc2626;font-weight:600;background:none;border:none;padding:0;cursor:pointer">Izbriši</button>` : ''}
          </div>
        `, { maxWidth: 220 })

      if (p.moreIzbrisati) {
        marker.on('popupopen', () => {
          document.getElementById(gumbId)?.addEventListener('click', () => onIzbrisiPosebnost?.(p.id))
        })
      }

      posebnostMarkersRef.current.push(marker)
    })
  }, [posebnosti, onIzbrisiPosebnost])

  return <div ref={containerRef} className="w-full h-full" />
}

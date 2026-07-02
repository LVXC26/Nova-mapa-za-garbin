'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, X, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { usePrimerjava } from '@/context/PrimerjaContext'
import { formatCena } from '@/lib/utils'

const opremaLabele: Record<string, string> = {
  gps: 'GPS / Chartplotter',
  radar: 'Radar',
  vhf: 'VHF radio',
  autopilot: 'Autopilot',
  generator: 'Generator',
  klima: 'Klimatska naprava',
  rib: 'Pnevmatični čoln',
  epirb: 'EPIRB',
}

const specFields = [
  { kljuc: 'cena', label: 'Cena', format: (p: any) => formatCena(p.cena) },
  { kljuc: 'tip', label: 'Tip plovila', format: (p: any) => p.tip },
  { kljuc: 'tip_oglasa', label: 'Tip oglasa', format: (p: any) => p.tip_oglasa === 'najem' ? 'Najem' : 'Prodaja' },
  { kljuc: 'letnik', label: 'Letnik', format: (p: any) => p.letnik ?? '—' },
  { kljuc: 'dolzina_m', label: 'Dolžina', format: (p: any) => p.dolzina_m ? `${p.dolzina_m} m` : '—' },
  { kljuc: 'stanje', label: 'Stanje', format: (p: any) => p.stanje ?? '—' },
  { kljuc: 'lokacija', label: 'Lokacija', format: (p: any) => p.lokacija ?? '—' },
]

export default function PrimerjavaPlovilPage() {
  const { primerjava, odstraniIzPrimerjave, pocistiPrimerjavo } = usePrimerjava()

  if (primerjava.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <div className="text-5xl mb-4">⚓</div>
            <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Ni plovil za primerjavo</h1>
            <p className="text-gray-500 mb-8">Dodajte plovila v primerjavo s klikom na gumb "Primerjaj" na kartici plovila.</p>
            <Link href="/plovila" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c2340] text-white font-medium rounded-full hover:bg-[#1e3a5f] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Poglej plovila
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const vsa_oprema = Array.from(new Set(
    primerjava.flatMap(p => Object.keys(p.oprema ?? {}))
  ))

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[#0c2340] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/plovila" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Nazaj na plovila
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="font-display text-3xl font-bold text-white">Primerjava plovil</h1>
              <button onClick={pocistiPrimerjavo} className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full transition-all">
                <X className="w-4 h-4" /> Počisti primerjavo
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-5 w-48 bg-gray-50 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Specifikacije
                      </th>
                      {primerjava.map(p => (
                        <th key={p.id} className="p-5 text-left min-w-[220px]">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-lg font-semibold text-[#0c2340] leading-tight">{p.naziv}</p>
                              <p className="text-sm text-[#c9a84c] font-semibold mt-0.5">{formatCena(p.cena)}</p>
                            </div>
                            <button
                              onClick={() => odstraniIzPrimerjave(p.id)}
                              className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <Link
                            href={`/plovila/${p.id}`}
                            className="inline-flex items-center gap-1 mt-3 text-xs text-[#0c2340] hover:text-[#c9a84c] font-medium transition-colors"
                          >
                            Oglej si <ArrowRight className="w-3 h-3" />
                          </Link>
                        </th>
                      ))}
                      {primerjava.length < 3 && (
                        <th className="p-5 min-w-[220px]">
                          <Link
                            href="/plovila"
                            className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all text-sm font-medium gap-2"
                          >
                            <span className="text-2xl">+</span>
                            Dodaj plovilo
                          </Link>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {specFields.map(({ kljuc, label, format }) => (
                      <tr key={kljuc} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-5 bg-gray-50 text-sm font-semibold text-gray-600">{label}</td>
                        {primerjava.map(p => (
                          <td key={p.id} className="p-5 text-sm text-gray-700 capitalize">
                            {format(p)}
                          </td>
                        ))}
                        {primerjava.length < 3 && <td className="p-5" />}
                      </tr>
                    ))}

                    {/* Oprema sekcija */}
                    <tr className="bg-[#0c2340]/5">
                      <td colSpan={primerjava.length + 2} className="p-4 text-xs font-bold text-[#0c2340] uppercase tracking-widest">
                        Oprema
                      </td>
                    </tr>
                    {vsa_oprema.map(kljuc => (
                      <tr key={kljuc} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-5 bg-gray-50 text-sm font-medium text-gray-600">
                          {opremaLabele[kljuc] ?? kljuc}
                        </td>
                        {primerjava.map(p => (
                          <td key={p.id} className="p-5">
                            {p.oprema?.[kljuc] ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <X className="w-5 h-5 text-gray-200" />
                            )}
                          </td>
                        ))}
                        {primerjava.length < 3 && <td className="p-5" />}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

'use client'

import Link from 'next/link'
import { CheckCircle, Zap, Clock, ArrowRight, Ship, Compass, Tag, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

const paketiBenefiti: Record<string, { naziv: string; ikona: string; benefiti: string[] }> = {
  charter: {
    naziv: 'Charter paket',
    ikona: '⛵',
    benefiti: [
      'Neomejeno plovil v floti',
      'Verified badge na profilu',
      'Prioritetni prikaz v iskanju',
      'Real-time chat s strankami',
      'Analitika povpraševanj',
      'Podpora 7 dni v tednu',
    ],
  },
  skipper: {
    naziv: 'Skipper paket',
    ikona: '🧭',
    benefiti: [
      'Profesionalni skipper profil',
      'Prikaz certifikatov in ocen',
      'Verified badge',
      'Real-time chat s strankami',
      'Rating in reviews sistem',
      'Prioriteta v iskalnih rezultatih',
    ],
  },
  prodajalec: {
    naziv: 'Oglas za plovilo',
    ikona: '🏷️',
    benefiti: [
      'Oglas viden 90 dni',
      'Do 20 fotografij + video',
      'Kontaktna forma za kupce',
      'Delitev na socialnih omrežjih',
      'Email notifikacije',
      'Promoted opcija (doplačilo)',
    ],
  },
}

// Mock paket status
const mockStatus = {
  paket: 'Brezplačno obdobje',
  zacetek: '1. junij 2026',
  potek: 'Ob uradnem zagonu',
  status: 'aktiven' as 'aktiven' | 'poteceKmalu' | 'potek',
}

export default function DashboardPaketPage() {
  const { vloga } = useAuth()
  const paket = paketiBenefiti[vloga ?? 'prodajalec'] ?? paketiBenefiti.prodajalec

  if (vloga === 'kupec') {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Paket</h1>
        <p className="text-gray-500 text-sm mb-8">Status vašega paketa</p>
        <div className="bg-[#0c2340] rounded-2xl p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-[#c9a84c] mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-white mb-2">Brskanje je brezplačno</h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto mb-5">
            Kot kupec/najemnik imate brezplačen dostop do vseh oglasov, charterjev in skiperjev. Za pošiljanje sporočil se morate prijaviti.
          </p>
          <Link href="/plovila" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold rounded-full transition-all hover:scale-105">
            Išči plovila <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = {
    aktiven: { barva: 'bg-emerald-100 text-emerald-800 border-emerald-200', ikona: CheckCircle, tekst: 'Aktivno' },
    poteceKmalu: { barva: 'bg-amber-100 text-amber-800 border-amber-200', ikona: Clock, tekst: 'Poteče kmalu' },
    potek: { barva: 'bg-red-100 text-red-800 border-red-200', ikona: Clock, tekst: 'Poteklo' },
  }[mockStatus.status]

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Moj paket</h1>
      <p className="text-gray-500 text-sm mb-8">Status in pregled vašega paketa</p>

      {/* Aktivni paket */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-[#0c2340] p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl mb-2">{paket.ikona}</div>
              <h2 className="font-display text-xl font-bold text-white">{paket.naziv}</h2>
              <p className="text-white/60 text-sm mt-1">Beta / Brezplačno obdobje</p>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.barva}`}>
              <statusConfig.ikona className="w-3.5 h-3.5" />
              {statusConfig.tekst}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Začetek</p>
              <p className="font-semibold text-[#0c2340]">{mockStatus.zacetek}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Potek</p>
              <p className="font-semibold text-[#0c2340]">{mockStatus.potek}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0c2340] mb-3">Vključene ugodnosti</p>
            <ul className="space-y-2">
              {paket.benefiti.map(b => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Info boks */}
      <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#0c2340] text-sm mb-1">Beta faza — brezplačen dostop</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              Platforma je v beta fazi. Vse funkcije so trenutno brezplačne. Cene paketov bodo objavljene ob uradnem zagonu. Zgodnji uporabniki bodo deležni posebnih pogojev.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link href="/paketi"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold rounded-xl transition-all hover:scale-[1.01]">
        Oglej si pakete in cene <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

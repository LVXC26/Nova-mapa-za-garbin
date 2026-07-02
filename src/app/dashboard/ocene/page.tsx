'use client'

import { Star, TrendingUp, Users } from 'lucide-react'
import { mockSkiperji } from '@/data/mock'
import { useAuth } from '@/components/providers/AuthProvider'

const mockOcene = [
  { id: '1', ime: 'Janez K.', ocena: 5, datum: 'Junij 2024', komentar: 'Odličen skipper! Izjemno poznavanje Jadrana, varen in profesionalen. Priporočam vsem.' },
  { id: '2', ime: 'Maria S.', ocena: 5, datum: 'Maj 2024', komentar: 'Fantastična izkušnja z našo skupino. Izkušen in prijazen, naučil nas je osnov jadralnega plovila.' },
  { id: '3', ime: 'Peter N.', ocena: 4, datum: 'Avgust 2023', komentar: 'Zelo zadovoljen z izletom. Dobro poznavanje lokalnih otokov in zatok.' },
  { id: '4', ime: 'Tina B.', ocena: 5, datum: 'Julij 2023', komentar: 'Profesionalen, točen in odličen sogovornik. Definitivno ga bomo spet najeli.' },
  { id: '5', ime: 'Rok V.', ocena: 5, datum: 'Junij 2023', komentar: 'Top izkušnja! Varno, zabavno in poučno jadralsko potovanje.' },
]

function Stars({ n, size = 'sm' }: { n: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${cls} ${i < n ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

export default function OcenePage() {
  const { user } = useAuth()
  const ime = user?.user_metadata?.ime ?? ''
  const skipper = mockSkiperji.find(s => s.ime === ime) ?? mockSkiperji[0]

  const povprecje = mockOcene.reduce((acc, o) => acc + o.ocena, 0) / mockOcene.length
  const distribucija = [5, 4, 3, 2, 1].map(n => ({
    ocena: n,
    stevilo: mockOcene.filter(o => o.ocena === n).length,
    odstotek: Math.round((mockOcene.filter(o => o.ocena === n).length / mockOcene.length) * 100),
  }))

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Moje ocene</h1>
      <p className="text-gray-500 text-sm mb-8">Ocene in komentarji vaših strank</p>

      {/* Povzetek */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center sm:col-span-1">
          <p className="font-display text-5xl font-bold text-[#0c2340] mb-2">{povprecje.toFixed(1)}</p>
          <Stars n={Math.round(povprecje)} size="lg" />
          <p className="text-sm text-gray-500 mt-2">{mockOcene.length} ocen skupaj</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:col-span-2">
          <p className="text-sm font-semibold text-[#0c2340] mb-3">Distribucija ocen</p>
          {distribucija.map(({ ocena, stevilo, odstotek }) => (
            <div key={ocena} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500 w-4 shrink-0">{ocena}</span>
              <Star className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c] shrink-0" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: `${odstotek}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right shrink-0">{stevilo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Skupaj ocen', vrednost: mockOcene.length, ikona: Star },
          { label: 'Ta mesec', vrednost: 3, ikona: TrendingUp },
          { label: 'Ponovnih strank', vrednost: '68%', ikona: Users },
        ].map(({ label, vrednost, ikona: Ikona }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Ikona className="w-5 h-5 text-[#c9a84c] mb-2" />
            <p className="font-display text-2xl font-bold text-[#0c2340]">{vrednost}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Ocene */}
      <h2 className="font-semibold text-[#0c2340] mb-4">Komentarji strank</h2>
      <div className="space-y-4">
        {mockOcene.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-sm font-bold text-[#0c2340]">
                  {o.ime[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#0c2340] text-sm">{o.ime}</p>
                  <p className="text-xs text-gray-400">{o.datum}</p>
                </div>
              </div>
              <Stars n={o.ocena} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{o.komentar}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

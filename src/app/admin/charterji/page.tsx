'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Eye, BadgeCheck, Gift, X, Calendar, AlertTriangle } from 'lucide-react'
import { mockCharterji } from '@/data/mock'
import type { Charter } from '@/types/database'

type TrialStatus = Record<string, { meseci: number; konec: Date } | null>

function formatDatum(d: Date) {
  return d.toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TrialModal({
  charter,
  obstojeciTrial,
  onZapri,
  onPotrdi,
}: {
  charter: Charter
  obstojeciTrial: { meseci: number; konec: Date } | null
  onZapri: () => void
  onPotrdi: (meseci: number, opomba: string) => void
}) {
  const [meseci, setMeseci] = useState(2)
  const [opomba, setOpomba] = useState('')
  const konecTriala = new Date()
  konecTriala.setMonth(konecTriala.getMonth() + meseci)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Dodeli brezplačni dostop</h3>
              <p className="text-xs text-gray-500">{charter.naziv}</p>
            </div>
          </div>
          <button onClick={onZapri} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {obstojeciTrial && (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Aktiven trial</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {obstojeciTrial.meseci} mes. — poteče {formatDatum(obstojeciTrial.konec)}
                </p>
                <p className="text-xs text-amber-600">Nova podelitev bo prepisala obstoječega.</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Število mesecev</label>
            <div className="flex gap-2">
              {[1, 2, 3, 6].map(m => (
                <button
                  key={m}
                  onClick={() => setMeseci(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    meseci === m
                      ? 'bg-[#0c2340] text-white border-[#0c2340]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#0c2340]'
                  }`}
                >
                  {m} mes.
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 rounded-xl">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700">
              Trial poteče: <span className="font-semibold">{formatDatum(konecTriala)}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Opomba (neobvezno)</label>
            <textarea
              value={opomba}
              onChange={e => setOpomba(e.target.value)}
              rows={2}
              placeholder="Npr. dogovor s sejma, priporočilo..."
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340]"
            />
          </div>
        </div>

        <div className="flex gap-2.5 px-5 pb-5">
          <button
            onClick={onZapri}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Prekliči
          </button>
          <button
            onClick={() => onPotrdi(meseci, opomba)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Dodeli {meseci} mes. brezplačno
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCharterjiPage() {
  const [izbraniCharter, setIzbraniCharter] = useState<Charter | null>(null)
  const [triali, setTriali] = useState<TrialStatus>({})
  const [verificirani, setVerificirani] = useState<Record<string, boolean>>(
    Object.fromEntries(mockCharterji.map(c => [c.id, c.verified]))
  )
  const [obvestilo, setObvestilo] = useState<{ tip: 'ok' | 'napaka'; sporocilo: string } | null>(null)

  function prikaziObvestilo(tip: 'ok' | 'napaka', sporocilo: string) {
    setObvestilo({ tip, sporocilo })
    setTimeout(() => setObvestilo(null), 4000)
  }

  async function potrdiTrial(meseci: number, opomba: string) {
    if (!izbraniCharter) return
    const id = izbraniCharter.id

    // V dev modu (brez Supabase) posodobi lokalno stanje
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const konec = new Date()
      konec.setMonth(konec.getMonth() + meseci)
      setTriali(prev => ({ ...prev, [id]: { meseci, konec } }))
      setIzbraniCharter(null)
      prikaziObvestilo('ok', `✓ ${izbraniCharter.naziv} — ${meseci} mes. brezplačno dodeljeno (demo)`)
      return
    }

    try {
      const res = await fetch('/api/admin/dodeli-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charter_id: id, meseci, opomba }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      const konec = new Date(json.data.trial_konec)
      setTriali(prev => ({ ...prev, [id]: { meseci, konec } }))
      setIzbraniCharter(null)
      prikaziObvestilo('ok', `✓ ${izbraniCharter.naziv} — ${meseci} mes. brezplačno dodeljeno`)
    } catch (e: unknown) {
      prikaziObvestilo('napaka', `Napaka: ${e instanceof Error ? e.message : 'Neznana napaka'}`)
    }
  }

  function preklopi_verified(id: string) {
    setVerificirani(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="p-8">
      {/* Toast obvestilo */}
      {obvestilo && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
          obvestilo.tip === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {obvestilo.sporocilo}
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Charterji</h1>
        <p className="text-gray-500 text-sm mt-1">Upravljanje charter podjetij — verified badge in brezplačni dostop</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Naziv</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tip</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Lokacija</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Plovil</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Verified</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Trial</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockCharterji.map(c => {
              const trial = triali[c.id]
              const jeVerificiran = verificirani[c.id] ?? c.verified
              const trialAktiven = trial && trial.konec > new Date()

              return (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{c.naziv}</p>
                    <p className="text-xs text-gray-400">{c.kontakt_email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 capitalize">{c.tip}</td>
                  <td className="px-5 py-3.5 text-gray-600">{c.lokacija}</td>
                  <td className="px-5 py-3.5 text-gray-600">{c.st_plovil}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1 text-xs font-medium w-fit px-2.5 py-1 rounded-full ${jeVerificiran ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {jeVerificiran && <BadgeCheck className="w-3.5 h-3.5" />}
                      {jeVerificiran ? 'Preverjeno' : 'Nepreverjeno'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {trialAktiven ? (
                      <div>
                        <span className="flex items-center gap-1 text-xs font-medium w-fit px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          <Gift className="w-3 h-3" />
                          {trial!.meseci} mes. free
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5 pl-1">
                          do {formatDatum(trial!.konec)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Oglej profil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => preklopi_verified(c.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          jeVerificiran
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={jeVerificiran ? 'Odstrani verified' : 'Dodeli verified'}
                      >
                        {jeVerificiran ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIzbraniCharter(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#c9a84c] hover:bg-amber-50 transition-colors"
                        title="Dodeli brezplačni dostop"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Preklopi verified</div>
        <div className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-amber-500" /> Dodeli brezplačni dostop</div>
      </div>

      {/* Modal */}
      {izbraniCharter && (
        <TrialModal
          charter={izbraniCharter}
          obstojeciTrial={triali[izbraniCharter.id] ?? null}
          onZapri={() => setIzbraniCharter(null)}
          onPotrdi={potrdiTrial}
        />
      )}
    </div>
  )
}

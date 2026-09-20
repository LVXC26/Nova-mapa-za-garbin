'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Eye, BadgeCheck, Gift, X, Calendar, AlertTriangle, Trash2, ChevronDown, ChevronRight, Ship } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Charter, Plovilo } from '@/types/database'
import { formatCena } from '@/lib/utils'

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
  const [charterji, setCharterji] = useState<Charter[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [izbraniCharter, setIzbraniCharter] = useState<Charter | null>(null)
  const [triali, setTriali] = useState<TrialStatus>({})
  const [obvestilo, setObvestilo] = useState<{ tip: 'ok' | 'napaka'; sporocilo: string } | null>(null)
  // Razsirjena vrstica (id charterja) - prikaze NJEGOVA PRAVA, ZIVA plovila
  // (uporabnik: incident, ko je stolpec "Plovil" (st_plovil - rocno/zastarelo
  // polje) kazal "0", dejansko brisanje pa je odneslo vec pravih oglasov,
  // ker se ni nikoli ujemalo z resnicnim stanjem). Zdaj admin PRED brisanjem
  // vidi resnicen seznam in lahko vsako plovilo izbrise posebej.
  const [razsirjenId, setRazsirjenId] = useState<string | null>(null)
  const [plovilaPoCharterju, setPlovilaPoCharterju] = useState<Record<string, Plovilo[]>>({})
  const [nalagaPlovila, setNalagaPlovila] = useState<string | null>(null)

  const supabase = createClient()

  async function nalozi() {
    setNalaga(true)
    const { data } = await supabase.from('charterji').select('*').order('created_at', { ascending: false })
    setCharterji(data ?? [])
    setNalaga(false)
  }

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [])

  function prikaziObvestilo(tip: 'ok' | 'napaka', sporocilo: string) {
    setObvestilo({ tip, sporocilo })
    setTimeout(() => setObvestilo(null), 4000)
  }

  async function preklopiRazsiritev(c: Charter) {
    if (razsirjenId === c.id) { setRazsirjenId(null); return }
    setRazsirjenId(c.id)
    if (!c.user_id || plovilaPoCharterju[c.id]) return
    setNalagaPlovila(c.id)
    // Charter posluje izkljucno z najemom (glej dashboard/dodaj-plovilo,
    // CharterVsebina.tsx - charterjeva javna "flota" je vedno filtrirana na
    // tip_oglasa=najem) - brez tega filtra bi se tu prikazalo tudi
    // morebitno plovilo za PRODAJO pod istim racunom, kar ni del njegove
    // charter flote.
    const { data } = await supabase.from('plovila').select('*').eq('user_id', c.user_id).eq('tip_oglasa', 'najem').order('created_at', { ascending: false })
    setPlovilaPoCharterju(prev => ({ ...prev, [c.id]: data ?? [] }))
    setNalagaPlovila(null)
  }

  async function izbrisiPlovilo(charterId: string, plovilo: Plovilo) {
    if (!confirm(`Izbrišete plovilo "${plovilo.naziv}"? Tega ni mogoče razveljaviti.`)) return
    const { error } = await supabase.from('plovila').delete().eq('id', plovilo.id)
    if (error) { prikaziObvestilo('napaka', 'Napaka pri brisanju: ' + error.message); return }
    setPlovilaPoCharterju(prev => ({ ...prev, [charterId]: (prev[charterId] ?? []).filter(p => p.id !== plovilo.id) }))
    prikaziObvestilo('ok', `✓ Plovilo "${plovilo.naziv}" izbrisano`)
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

  async function preklopi_verified(id: string, trenutno: boolean) {
    await supabase.from('charterji').update({ verified: !trenutno }).eq('id', id)
    nalozi()
  }

  // POMEMBNO (po incidentu): brisanje charter PROFILA ne sme vec avtomatsko
  // odnesti tudi plovil/objav s sabo — admin naj to naredi zavestno, po
  // eno plovilo naenkrat (glej razsirjena vrstica zgoraj), ali pa uporabi
  // "Izbriši uporabnika" na /admin/uporabniki, ce res zeli izbrisati vse.
  async function izbrisi(c: Charter) {
    const stOglasov = plovilaPoCharterju[c.id]?.length
    const opozoriloOglasi = stOglasov ? ` Ima ${stOglasov} plovil, ki NE bodo izbrisana skupaj s profilom.` : ''
    if (!confirm(`Izbrišete SAMO profil "${c.naziv}"?${opozoriloOglasi} Za brisanje celotnega računa (vključno s plovili) uporabi "Izbriši uporabnika" na strani Uporabniki.`)) return
    const { error } = await supabase.from('charterji').delete().eq('id', c.id)
    if (error) { prikaziObvestilo('napaka', 'Napaka pri brisanju: ' + error.message); return }
    nalozi()
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
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-8"></th>
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
            {charterji.map(c => {
              const trial = triali[c.id]
              const jeVerificiran = c.verified
              const trialAktiven = trial && trial.konec > new Date()
              const jeRazsirjen = razsirjenId === c.id
              const njegovaPlovila = plovilaPoCharterju[c.id]

              return (
                <Fragment key={c.id}>
                <tr className="hover:bg-gray-50/50">
                  <td className="pl-5">
                    <button onClick={() => preklopiRazsiritev(c)} className="p-1 rounded text-gray-400 hover:text-[#0c2340]" title="Prikaži njegova plovila">
                      {jeRazsirjen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{c.naziv}</p>
                    <p className="text-xs text-gray-400">{c.kontakt_email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 capitalize">{c.tip}</td>
                  <td className="px-5 py-3.5 text-gray-600">{c.lokacija}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {c.st_plovil}
                    <span className="text-xs text-gray-300" title="Ročno polje, ni nujno živo stanje — klikni puščico za dejanski seznam"> (info)</span>
                  </td>
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
                      <Link
                        href={`/charterji/${c.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Oglej profil"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => preklopi_verified(c.id, jeVerificiran)}
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
                      <button
                        onClick={() => izbrisi(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Izbriši SAMO profil (plovila ostanejo)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {jeRazsirjen && (
                  <tr>
                    <td colSpan={8} className="bg-gray-50/70 px-5 py-4">
                      {nalagaPlovila === c.id ? (
                        <p className="text-xs text-gray-400">Nalagam plovila...</p>
                      ) : !njegovaPlovila || njegovaPlovila.length === 0 ? (
                        <p className="text-xs text-gray-400 flex items-center gap-1.5"><Ship className="w-3.5 h-3.5" /> Ta charter nima nobenega plovila.</p>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-gray-500 mb-2">{njegovaPlovila.length} plovil — vsako lahko izbrišete posamično:</p>
                          {njegovaPlovila.map(p => (
                            <div key={p.id} className="flex items-center justify-between gap-3 bg-white rounded-lg border border-gray-100 px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Ship className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-800 truncate">{p.naziv}</span>
                                <span className="text-xs text-gray-400 shrink-0">{p.cena_na_zahtevo ? 'Cena na zahtevo' : formatCena(p.cena)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Link href={`/plovila/${p.id}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Oglej"><Eye className="w-3.5 h-3.5" /></Link>
                                <button onClick={() => izbrisiPlovilo(c.id, p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50" title="Izbriši to plovilo"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        </div>
        {!nalaga && charterji.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Ni zadetkov</div>
        )}
        {nalaga && (
          <div className="py-12 text-center text-gray-400 text-sm">Nalagam...</div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs text-gray-400 flex-wrap">
        <div className="flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5" /> Prikaži plovila</div>
        <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Preklopi verified</div>
        <div className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-amber-500" /> Dodeli brezplačni dostop</div>
        <div className="flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5 text-red-500" /> Izbriši SAMO profil (plovila ostanejo — briši jih posamično zgoraj)</div>
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

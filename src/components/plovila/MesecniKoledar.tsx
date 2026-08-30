'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DNEVI_V_TEDNU = ['Po', 'To', 'Sr', 'Če', 'Pe', 'So', 'Ne']
const MESECI = [
  'Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij',
  'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December',
]

export function danString(d: Date): string {
  const leto = d.getFullYear()
  const mesec = String(d.getMonth() + 1).padStart(2, '0')
  const dan = String(d.getDate()).padStart(2, '0')
  return `${leto}-${mesec}-${dan}`
}

export function formatDan(dan: string): string {
  const [l, m, d] = dan.split('-')
  return `${parseInt(d)}. ${parseInt(m)}. ${l}`
}

function dnevniRazpon(od: string, do_: string): string[] {
  const rezultat: string[] = []
  const zac = new Date(od)
  const kon = new Date(do_)
  for (let d = zac; d <= kon; d.setDate(d.getDate() + 1)) {
    rezultat.push(danString(d))
  }
  return rezultat
}

// Izbira termina podpira dva enakovredna načina, kot na večini rezervacijskih
// strani: (1) klik na začetni dan, nato klik na končni dan, ali (2) klik in
// povleci od začetnega do končnega dneva v eni potezi (miška navzdol na
// začetku, drži, spusti na koncu).
export default function MesecniKoledar({
  mesec,
  onMesecChange,
  zasedeniDnevi,
  onIzbira,
}: {
  mesec: Date
  onMesecChange: (m: Date) => void
  zasedeniDnevi: Set<string>
  onIzbira: (zacetek: string, konec: string) => void
}) {
  const [od, setOd] = useState<string | null>(null)
  const [hoverDan, setHoverDan] = useState<string | null>(null)
  const [zacetnoDejanje, setZacetnoDejanje] = useState(false)
  const [miskaDol, setMiskaDol] = useState(false)
  const [napaka, setNapaka] = useState('')

  const leto = mesec.getFullYear()
  const mesecIdx = mesec.getMonth()
  const prviDan = new Date(leto, mesecIdx, 1)
  const steviloDni = new Date(leto, mesecIdx + 1, 0).getDate()
  // ponedeljek = 0 ... nedelja = 6
  const offset = (prviDan.getDay() + 6) % 7
  const danes = danString(new Date())

  const celice: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: steviloDni }, (_, i) => danString(new Date(leto, mesecIdx, i + 1))),
  ]

  const izbraniDnevi: Set<string> = (() => {
    if (!od) return new Set()
    const konec = hoverDan ?? od
    const [zac, kon] = konec < od ? [konec, od] : [od, konec]
    return new Set(dnevniRazpon(zac, kon))
  })()

  function zacniIzbiro(dan: string, onemogocen: boolean) {
    // Nove izbire ni mogoče začeti na zasedenem/preteklem dnevu — a gumb
    // namerno ni pravi `disabled` (brskalnik onemogočenim elementom ne
    // pošlje mouseenter/mouseup, zaradi česar bi vlečenje, ki se konča nad
    // takim dnevom, "obtičalo") — zato tu samo tiho ignoriramo mousedown.
    if (onemogocen && !od) return
    setMiskaDol(true)
    if (!od) {
      setOd(dan)
      setHoverDan(dan)
      setZacetnoDejanje(true)
      setNapaka('')
    } else {
      setHoverDan(dan)
      setZacetnoDejanje(false)
    }
  }

  function ohNaDan(dan: string) {
    // Med vlečenjem sledimo tudi zasedenim/preteklim dnevom, da se ob
    // spustu pravilno zazna prekrivanje in prikaže napaka.
    if (miskaDol) setHoverDan(dan)
  }

  const koncajIzbiro = useCallback(() => {
    setMiskaDol((jeDol) => (jeDol ? false : jeDol))
    if (!miskaDol) return
    if (!od) return

    const konec = hoverDan ?? od
    // Prvi (samostojni) klik brez vlečenja — počakamo na drugi klik/vlečenje.
    if (zacetnoDejanje && konec === od) return

    const [zac, kon] = konec < od ? [konec, od] : [od, konec]
    const razpon = dnevniRazpon(zac, kon)
    if (razpon.some((d) => zasedeniDnevi.has(d))) {
      setNapaka('V izbranem obdobju je plovilo delno zasedeno — izberite drug termin.')
      setOd(konec)
      setHoverDan(konec)
      setZacetnoDejanje(true)
      return
    }
    setNapaka('')
    setOd(zac)
    setHoverDan(kon)
    onIzbira(zac, kon)
  }, [miskaDol, od, hoverDan, zacetnoDejanje, zasedeniDnevi, onIzbira])

  // Varovalka: brskalnik ne sproži mouseup/mouseenter na onemogočenih
  // (zasedenih) gumbih, zato bi lahko vlečenje, ki se konča točno nad
  // zasedenim dnevom, pustilo izbiro "obtičalo". Globalni listener to
  // vedno ujame, ne glede na to, kje se miška dejansko spusti.
  useEffect(() => {
    if (!miskaDol) return
    document.addEventListener('mouseup', koncajIzbiro)
    return () => document.removeEventListener('mouseup', koncajIzbiro)
  }, [miskaDol, koncajIzbiro])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onMesecChange(new Date(leto, mesecIdx - 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-semibold text-[#0c2340]">{MESECI[mesecIdx]} {leto}</p>
        <button
          type="button"
          onClick={() => onMesecChange(new Date(leto, mesecIdx + 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0c2340] hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DNEVI_V_TEDNU.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 select-none">
        {celice.map((dan, i) => {
          if (!dan) return <div key={`prazno-${i}`} />
          const zaseden = zasedeniDnevi.has(dan)
          const izbran = izbraniDnevi.has(dan)
          const pretekel = dan < danes
          const onemogocen = zaseden || pretekel

          return (
            <button
              key={dan}
              type="button"
              aria-disabled={onemogocen}
              onMouseDown={() => zacniIzbiro(dan, onemogocen)}
              onMouseEnter={() => ohNaDan(dan)}
              title={zaseden ? 'Zasedeno' : undefined}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                zaseden
                  ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                  : pretekel
                  ? 'text-gray-300 cursor-not-allowed'
                  : izbran
                  ? 'bg-[#c9a84c] text-[#0c2340] font-bold'
                  : 'text-[#0c2340] hover:bg-gray-100'
              }`}
            >
              {parseInt(dan.split('-')[2])}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#c9a84c]" /> Izbrano</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200" /> Zasedeno</span>
      </div>

      {napaka && <p className="mt-2 text-xs text-red-600">{napaka}</p>}
    </div>
  )
}

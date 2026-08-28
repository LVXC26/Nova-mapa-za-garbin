'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Upload, MapPin, Phone, Globe, Award, Ship } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { TipCharterPlovila } from '@/types/database'

const TIPI_PLOVIL = ['jadrnica', 'motorni', 'katamaran', 'jahta', 'gumenjak']
const JEZIKI = ['slovenščina', 'angleščina', 'hrvaščina', 'nemščina', 'italijanščina']

export default function ProfilPage() {
  const { user, vloga, demoMode } = useAuth()
  const [uspesno, setUspesno] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [nalagaProfil, setNalagaProfil] = useState(true)
  const [tab, setTab] = useState<'osnovno' | 'specializacija' | 'certifikati'>('osnovno')

  const ime = user?.user_metadata?.ime ?? ''
  const email = user?.email ?? ''

  const [forma, setForma] = useState({
    ime,
    email,
    telefon: '',
    lokacija: '',
    opis: '',
    spletna_stran: '',
    cena_dan: '',
  })
  const [tipPlovila, setTipPlovila] = useState<string[]>([])
  const [jeziki, setJeziki] = useState<string[]>([])
  const [izkusnjeLet, setIzkusnjeLet] = useState(0)
  const [certifikati, setCertifikati] = useState<string[]>([])
  const [noviCertifikat, setNoviCertifikat] = useState('')
  const [stPlovil, setStPlovil] = useState(0)
  const [obstajaProfil, setObstajaProfil] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!user || demoMode) { setNalagaProfil(false); return }
      const supabase = createClient()

      if (vloga === 'skipper') {
        const { data } = await supabase.from('skiperji').select('*').eq('user_id', user.id).maybeSingle()
        if (data) {
          setForma(f => ({ ...f, lokacija: data.lokacija, opis: data.opis, cena_dan: String(data.cena_dan) }))
          setTipPlovila(data.tip_plovila)
          setJeziki(data.jeziki)
          setIzkusnjeLet(data.izkusnje_let)
          setCertifikati(data.certifikati)
          setObstajaProfil(true)
        }
        setNalagaProfil(false)
      } else if (vloga === 'charter' || vloga === 'oba') {
        const { data } = await supabase.from('charterji').select('*').eq('user_id', user.id).maybeSingle()
        if (data) {
          setForma(f => ({ ...f, telefon: data.kontakt_tel, lokacija: data.lokacija, opis: data.opis ?? '', spletna_stran: data.spletna_stran ?? '' }))
          setTipPlovila(data.tip_plovila)
          setStPlovil(data.st_plovil)
          setObstajaProfil(true)
        }
        setNalagaProfil(false)
      } else {
        setNalagaProfil(false)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, vloga])

  function toggleTipPlovila(t: string) {
    setTipPlovila(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function toggleJezik(j: string) {
    setJeziki(prev => prev.includes(j) ? prev.filter(x => x !== j) : [...prev, j])
  }

  function dodajCertifikat() {
    const c = noviCertifikat.trim()
    if (!c || certifikati.includes(c)) return
    setCertifikati(prev => [...prev, c])
    setNoviCertifikat('')
  }

  function odstraniCertifikat(c: string) {
    setCertifikati(prev => prev.filter(x => x !== c))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setNapaka('')

    if (demoMode) {
      setNapaka('Spremembe v demo načinu se ne shranijo. Prijavite se z resničnim računom.')
      return
    }

    setNalaga(true)
    const supabase = createClient()

    if (vloga === 'skipper') {
      const polja = {
        ime: forma.ime || ime,
        lokacija: forma.lokacija,
        opis: forma.opis,
        cena_dan: forma.cena_dan ? Number(forma.cena_dan) : 0,
        izkusnje_let: izkusnjeLet,
        tip_plovila: tipPlovila,
        jeziki,
        certifikati,
      }
      const { error } = obstajaProfil
        ? await supabase.from('skiperji').update(polja).eq('user_id', user.id)
        : await supabase.from('skiperji').insert({
            ...polja,
            user_id: user.id,
            verified: false,
            ocena: 0,
            st_ocen: 0,
            tip_skiper: 'samostojni',
          })
      setNalaga(false)
      if (error) { setNapaka('Napaka pri shranjevanju profila.'); return }
      setObstajaProfil(true)
    } else if (vloga === 'charter' || vloga === 'oba') {
      const polja = {
        naziv: forma.ime || ime,
        lokacija: forma.lokacija,
        opis: forma.opis,
        kontakt_email: forma.email || email,
        kontakt_tel: forma.telefon,
        spletna_stran: forma.spletna_stran || null,
        tip_plovila: tipPlovila as TipCharterPlovila[],
        st_plovil: stPlovil,
      }
      const { error } = obstajaProfil
        ? await supabase.from('charterji').update(polja).eq('user_id', user.id)
        : await supabase.from('charterji').insert({
            ...polja,
            user_id: user.id,
            tip: 'podjetje',
            verified: false,
            ocena: 0,
            st_ocen: 0,
            max_oseb: 0,
            max_dolzina_m: 0,
          })
      setNalaga(false)
      if (error) { setNapaka('Napaka pri shranjevanju profila.'); return }
      setObstajaProfil(true)
      if (error) { setNapaka('Napaka pri shranjevanju profila.'); return }
    } else {
      setNalaga(false)
    }

    setUspesno(true)
    setTimeout(() => setUspesno(false), 3000)
  }

  const tabs = vloga === 'skipper'
    ? [
        { vrednost: 'osnovno', label: 'Osnovno' },
        { vrednost: 'specializacija', label: 'Specializacija' },
        { vrednost: 'certifikati', label: 'Certifikati' },
      ]
    : [
        { vrednost: 'osnovno', label: 'Osnovno' },
        { vrednost: 'specializacija', label: 'Plovila & storitve' },
      ]

  if (nalagaProfil) {
    return (
      <div className="p-8 max-w-3xl flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">
        {vloga === 'charter' ? 'Profil podjetja' : 'Skipper profil'}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {vloga === 'charter' ? 'Podatki vašega charter podjetja' : 'Vaš profesionalni skipper profil'}
      </p>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-[#0c2340]/10 flex items-center justify-center text-4xl relative">
          {vloga === 'charter' ? '🏢' : '👨‍✈️'}
          <button type="button" className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center shadow-sm hover:bg-[#e8c76d] transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#0c2340]" />
          </button>
        </div>
        <div>
          <p className="font-bold text-[#0c2340]">{forma.ime}</p>
          <p className="text-sm text-gray-500">{forma.lokacija}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-display font-bold text-[#0c2340]">
            {vloga === 'skipper' ? `${forma.cena_dan || 0} € / dan` : `${stPlovil} plovil`}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {vloga === 'skipper' ? 'Vaša cena' : 'V floti'}
          </p>
        </div>
      </div>

      {uspesno && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 mb-5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profil uspešno posodobljen!
        </div>
      )}
      {napaka && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {napaka}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-full w-fit mb-6">
        {tabs.map(t => (
          <button
            key={t.vrednost}
            type="button"
            onClick={() => setTab(t.vrednost as typeof tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t.vrednost ? 'bg-white text-[#0c2340] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {tab === 'osnovno' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  {vloga === 'charter' ? 'Naziv podjetja' : 'Ime in priimek'}
                </label>
                <input value={forma.ime} onChange={e => setForma(f => ({...f, ime: e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
                <input type="email" value={forma.email} onChange={e => setForma(f => ({...f, email: e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  <Phone className="inline w-3.5 h-3.5 mr-1" />Telefon
                </label>
                <input type="tel" value={forma.telefon} onChange={e => setForma(f => ({...f, telefon: e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />Lokacija / Marina
                </label>
                <input value={forma.lokacija} onChange={e => setForma(f => ({...f, lokacija: e.target.value}))}
                  placeholder="Marina Portorož"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              {vloga === 'charter' && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                    <Globe className="inline w-3.5 h-3.5 mr-1" />Spletna stran
                  </label>
                  <input type="url" value={forma.spletna_stran} onChange={e => setForma(f => ({...f, spletna_stran: e.target.value}))}
                    placeholder="https://vašapodjetje.si"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                </div>
              )}
              {vloga === 'skipper' && (
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Cena / dan (€)</label>
                  <input type="number" value={forma.cena_dan} onChange={e => setForma(f => ({...f, cena_dan: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                {vloga === 'charter' ? 'Opis podjetja' : 'Bio / O sebi'}
              </label>
              <textarea rows={4} value={forma.opis} onChange={e => setForma(f => ({...f, opis: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
            </div>
          </>
        )}

        {tab === 'specializacija' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-3">
                <Ship className="inline w-4 h-4 mr-1" />Plovila ki jih {vloga === 'charter' ? 'oddajate' : 'vodite'}
              </label>
              <div className="flex flex-wrap gap-2">
                {TIPI_PLOVIL.map(t => {
                  const aktiven = tipPlovila.includes(t)
                  return (
                    <button key={t} type="button" onClick={() => toggleTipPlovila(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${aktiven ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
            {vloga === 'skipper' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-3">Jeziki</label>
                  <div className="flex flex-wrap gap-2">
                    {JEZIKI.map(j => {
                      const aktiven = jeziki.includes(j)
                      return (
                        <button key={j} type="button" onClick={() => toggleJezik(j)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${aktiven ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {j}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Leta izkušenj</label>
                  <input type="number" value={izkusnjeLet} min={0} onChange={e => setIzkusnjeLet(Number(e.target.value))}
                    className="w-full sm:w-48 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
                </div>
              </>
            )}
            {vloga === 'charter' && (
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Število plovil v floti</label>
                <input type="number" value={stPlovil} min={0} onChange={e => setStPlovil(Number(e.target.value))}
                  className="w-full sm:w-48 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
            )}
          </div>
        )}

        {tab === 'certifikati' && vloga === 'skipper' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {certifikati.map(c => (
                <div key={c} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-800">{c}</span>
                  <button type="button" onClick={() => odstraniCertifikat(c)} className="text-emerald-400 hover:text-red-400 transition-colors text-xs ml-1">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={noviCertifikat}
                onChange={e => setNoviCertifikat(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); dodajCertifikat() } }}
                placeholder="Dodaj certifikat (npr. RYA Offshore Skipper)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              <button type="button" onClick={dodajCertifikat} className="px-4 py-3 bg-[#0c2340] text-white rounded-xl text-sm font-medium hover:bg-[#1e3a5f] transition-colors">
                Dodaj
              </button>
            </div>
            <p className="text-xs text-gray-400">Certifikati se prikazujejo na vašem javnem profilu.</p>
          </div>
        )}

        <button type="submit" disabled={nalaga}
          className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
          {nalaga ? 'Shranjujem...' : 'Shrani spremembe'}
        </button>
      </form>
    </div>
  )
}

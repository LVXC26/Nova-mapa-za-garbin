'use client'

import { useState } from 'react'
import { CheckCircle, Upload, MapPin, Phone, Globe, Award, Ship } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { mockSkiperji, mockCharterji } from '@/data/mock'

export default function ProfilPage() {
  const { user, vloga } = useAuth()
  const [uspesno, setUspesno] = useState(false)
  const [tab, setTab] = useState<'osnovno' | 'specializacija' | 'certifikati'>('osnovno')

  const ime = user?.user_metadata?.ime ?? ''
  const email = user?.email ?? ''

  const skipper = mockSkiperji.find(s => s.ime === ime) ?? mockSkiperji[0]
  const charter = mockCharterji.find(c => c.naziv.includes('Adriatic')) ?? mockCharterji[0]

  const [forma, setForma] = useState({
    ime,
    email,
    telefon: vloga === 'charter' ? charter.kontakt_tel : '+386 41 123 456',
    lokacija: vloga === 'charter' ? charter.lokacija : vloga === 'skipper' ? skipper.lokacija : '',
    opis: vloga === 'charter' ? charter.opis : vloga === 'skipper' ? skipper.opis : '',
    spletna_stran: vloga === 'charter' ? (charter.spletna_stran ?? '') : '',
    cena_dan: vloga === 'skipper' ? String(skipper.cena_dan) : '',
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
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
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center shadow-sm hover:bg-[#e8c76d] transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#0c2340]" />
          </button>
        </div>
        <div>
          <p className="font-bold text-[#0c2340]">{forma.ime}</p>
          <p className="text-sm text-gray-500">{forma.lokacija}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Verificiran profil
            </span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-display font-bold text-[#0c2340]">
            {vloga === 'skipper' ? `${forma.cena_dan} € / dan` : `${charter.st_plovil} plovil`}
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-full w-fit mb-6">
        {tabs.map(t => (
          <button
            key={t.vrednost}
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

        {tab === 'specializacija' && vloga === 'skipper' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-3">
                <Ship className="inline w-4 h-4 mr-1" />Plovila ki jih vodite
              </label>
              <div className="flex flex-wrap gap-2">
                {['jadrnica', 'motorni', 'katamaran', 'jahta', 'gumenjak'].map(t => {
                  const aktiven = skipper.tip_plovila.includes(t)
                  return (
                    <button key={t} type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${aktiven ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-3">Jeziki</label>
              <div className="flex flex-wrap gap-2">
                {['slovenščina', 'angleščina', 'hrvaščina', 'nemščina', 'italijanščina'].map(j => {
                  const aktiven = skipper.jeziki.includes(j)
                  return (
                    <button key={j} type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${aktiven ? 'bg-[#c9a84c] text-[#0c2340]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {j}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Leta izkušenj</label>
              <input type="number" defaultValue={skipper.izkusnje_let} min={0}
                className="w-full sm:w-48 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
          </div>
        )}

        {tab === 'certifikati' && vloga === 'skipper' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {skipper.certifikati.map(c => (
                <div key={c} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-800">{c}</span>
                  <button type="button" className="text-emerald-400 hover:text-red-400 transition-colors text-xs ml-1">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input placeholder="Dodaj certifikat (npr. RYA Offshore Skipper)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              <button type="button" className="px-4 py-3 bg-[#0c2340] text-white rounded-xl text-sm font-medium hover:bg-[#1e3a5f] transition-colors">
                Dodaj
              </button>
            </div>
            <p className="text-xs text-gray-400">Certifikati se prikazujejo na vašem javnem profilu.</p>
          </div>
        )}

        <button type="submit"
          className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
          Shrani spremembe
        </button>
      </form>
    </div>
  )
}

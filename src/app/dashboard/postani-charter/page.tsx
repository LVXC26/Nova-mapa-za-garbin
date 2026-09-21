'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, MapPin, Phone, Globe } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

// Za racun, ki ze ima svojo prvotno vlogo (npr. prodajalec) in zeli
// DODATNO postati tudi charter - /onboarding je namenjen samo prvi
// registraciji (gated na vloga==='charter'/'oba' iz user_metadata) in bi
// tak racun preusmeril nazaj na /dashboard. Ta stran naredi isti insert kot
// onboarding (glej shraniProfil tam), ne da bi karkoli spreminjala na
// "vloga" - charterji vrstica je edini pravi vir resnice za "ima charter
// profil" (glej AuthProvider.imaCharterProfil).
export default function PostaniCharterPage() {
  const { user, demoMode, imaCharterProfil, refreshProfili } = useAuth()
  const router = useRouter()
  const [preverjeno, setPreverjeno] = useState(false)
  const [forma, setForma] = useState({
    naziv: user?.user_metadata?.ime ?? '',
    opis: '',
    lokacija: '',
    telefon: '',
    spletna_stran: '',
  })
  const [nalaga, setNalaga] = useState(false)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    if (!user) { router.push('/prijava'); return }
    if (imaCharterProfil) { router.push('/dashboard'); return }
    setPreverjeno(true)
  }, [user, imaCharterProfil, router])

  if (!preverjeno) return null

  async function shrani() {
    if (!forma.naziv.trim()) { setNapaka('Vpišite naziv podjetja.'); return }
    if (demoMode) { setNapaka('V demo načinu ni mogoče ustvariti novega profila. Prijavite se z resničnim računom.'); return }
    setNapaka('')
    setNalaga(true)
    const supabase = createClient()
    const { error } = await supabase.from('charterji').upsert({
      user_id: user!.id,
      naziv: forma.naziv,
      opis: forma.opis,
      lokacija: forma.lokacija || '',
      kontakt_email: user!.email ?? '',
      kontakt_tel: forma.telefon || '',
      spletna_stran: forma.spletna_stran || null,
      tip: 'podjetje',
      tip_plovila: [],
      st_plovil: 0,
      verified: false,
      ocena: 0,
      st_ocen: 0,
      max_oseb: 0,
      max_dolzina_m: 0,
    }, { onConflict: 'user_id' })
    setNalaga(false)
    if (error) { setNapaka('Napaka pri shranjevanju profila. Poskusite znova.'); return }
    refreshProfili()
    router.push('/dashboard')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Ustvarite charter profil</h1>
          <p className="text-gray-500 text-sm mb-6">
            Poleg vašega obstoječega profila dobite tudi charter profil — vaša plovila za najem bodo vidna na /charterji.
          </p>

          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {napaka}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Naziv podjetja *</label>
              <input value={forma.naziv} onChange={e => setForma(f => ({ ...f, naziv: e.target.value }))}
                placeholder="Adriatic Sail d.o.o."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Opis podjetja</label>
              <textarea rows={3} value={forma.opis} onChange={e => setForma(f => ({ ...f, opis: e.target.value }))}
                placeholder="Kratko opišite vaše podjetje, plovila in storitve..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />Lokacija / Marina
                </label>
                <input value={forma.lokacija} onChange={e => setForma(f => ({ ...f, lokacija: e.target.value }))}
                  placeholder="Marina Portorož"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                  <Phone className="inline w-3.5 h-3.5 mr-1" />Telefon
                </label>
                <input type="tel" value={forma.telefon} onChange={e => setForma(f => ({ ...f, telefon: e.target.value }))}
                  placeholder="+386 5 ..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">
                <Globe className="inline w-3.5 h-3.5 mr-1" />Spletna stran
              </label>
              <input type="url" value={forma.spletna_stran} onChange={e => setForma(f => ({ ...f, spletna_stran: e.target.value }))}
                placeholder="https://vasepodjetje.si"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
            </div>
          </div>

          <button
            onClick={shrani}
            disabled={nalaga}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-bold rounded-xl transition-all hover:scale-[1.01]"
          >
            {nalaga ? 'Shranjujem...' : 'Ustvari charter profil'} <ArrowRight className="w-4 h-4" />
          </button>
      </div>
    </div>
  )
}

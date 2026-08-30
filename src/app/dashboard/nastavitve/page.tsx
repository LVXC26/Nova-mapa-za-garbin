'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle, User, Lock, Bell, Camera, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

const MAX_SLIKA_MB = 8

const NOTIFIKACIJE_OPCIJE = [
  { kljuc: 'novo_sporocilo', label: 'E-mail obvestila ob novem sporočilu', opis: 'Prejmite email ko prejmete novo sporočilo' },
  { kljuc: 'potrditev_oglasa', label: 'Obvestilo ob potrditvi oglasa', opis: 'Ko admin potrdi vaš oglas' },
  { kljuc: 'newsletter', label: 'Newsletter', opis: 'Tedenske novice o trgu plovil' },
] as const

export default function NastavitveProfilaPage() {
  const { user, vloga, demoMode } = useAuth()
  const [tab, setTab] = useState<'profil' | 'geslo' | 'notifikacije'>('profil')
  const [uspesno, setUspesno] = useState('')
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [slikaUrl, setSlikaUrl] = useState<string | null>(null)
  const [nalagaSliko, setNalagaSliko] = useState(false)
  const datotekaRef = useRef<HTMLInputElement>(null)
  const [forma, setForma] = useState({
    ime: user?.user_metadata?.ime ?? '',
    email: user?.email ?? '',
    telefon: '',
    opis: '',
    spletna_stran: '',
  })
  const [notifikacije, setNotifikacije] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFIKACIJE_OPCIJE.map(o => [o.kljuc, true]))
  )
  const [trenutnoGeslo, setTrenutnoGeslo] = useState('')
  const [novoGeslo, setNovoGeslo] = useState('')
  const [potrdiGeslo, setPotrdiGeslo] = useState('')

  useEffect(() => {
    if (!user || demoMode) return
    const supabase = createClient()
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (!data) return
      setForma(f => ({
        ...f,
        ime: data.ime ?? f.ime,
        telefon: data.telefon ?? '',
        opis: data.opis ?? '',
        spletna_stran: data.spletna_stran ?? '',
      }))
      setSlikaUrl(data.slika_url ?? null)
      if (data.notifikacije) {
        setNotifikacije(n => ({ ...n, ...data.notifikacije }))
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setNapaka('')
    setUspesno('')

    if (demoMode) {
      setNapaka('Spremembe v demo načinu se ne shranijo. Prijavite se z resničnim računom.')
      return
    }

    setNalaga(true)
    const supabase = createClient()

    const { error: profilError } = await supabase.from('profiles').update({
      ime: forma.ime || null,
      telefon: forma.telefon || null,
      opis: forma.opis || null,
      spletna_stran: forma.spletna_stran || null,
    }).eq('id', user.id)

    // Ime se povsod drugod po strani (navigacija, forum, feed ...) bere iz
    // user_metadata, ne iz profiles tabele — brez tega bi ostalo prikazano
    // staro ime kljub uspešnemu shranjevanju zgoraj.
    if (!profilError && forma.ime && forma.ime !== user.user_metadata?.ime) {
      await supabase.auth.updateUser({ data: { ime: forma.ime } })
    }

    let emailError: string | null = null
    if (forma.email && forma.email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email: forma.email })
      if (error) emailError = error.message
    }

    setNalaga(false)
    if (profilError) { setNapaka('Napaka pri shranjevanju profila.'); return }
    if (emailError) { setNapaka(`Profil shranjen, e-mail pa ni bil spremenjen: ${emailError}`); return }
    setUspesno(
      forma.email !== user.email
        ? 'Shranjeno. Za potrditev nove e-pošte preverite oba poštna predala.'
        : 'Spremembe so bile uspešno shranjene.'
    )
    setTimeout(() => setUspesno(''), 4000)
  }

  async function naloziSliko(e: React.ChangeEvent<HTMLInputElement>) {
    const datoteka = e.target.files?.[0]
    e.target.value = ''
    if (!datoteka || !user) return
    setNapaka('')
    setUspesno('')

    if (demoMode) { setNapaka('Nalaganje slike v demo načinu ni mogoče. Prijavite se z resničnim računom.'); return }
    if (!datoteka.type.startsWith('image/')) { setNapaka(`"${datoteka.name}" ni slikovna datoteka.`); return }
    if (datoteka.size > MAX_SLIKA_MB * 1024 * 1024) { setNapaka(`Slika presega ${MAX_SLIKA_MB} MB.`); return }

    setNalagaSliko(true)
    const supabase = createClient()
    const pot = `${user.id}/${crypto.randomUUID()}-${datoteka.name}`
    const { error: uploadError } = await supabase.storage.from('profilne-slike').upload(pot, datoteka)
    if (uploadError) {
      setNalagaSliko(false)
      setNapaka('Napaka pri nalaganju slike: ' + uploadError.message)
      return
    }
    const { data } = supabase.storage.from('profilne-slike').getPublicUrl(pot)
    const { error: profilError } = await supabase.from('profiles').update({ slika_url: data.publicUrl }).eq('id', user.id)
    setNalagaSliko(false)
    if (profilError) { setNapaka('Slika je bila naložena, a shranjevanje ni uspelo.'); return }
    setSlikaUrl(data.publicUrl)
    setUspesno('Profilna slika je bila posodobljena.')
    setTimeout(() => setUspesno(''), 4000)
  }

  async function odstraniSliko() {
    if (!user) return
    if (demoMode) { setNapaka('Spremembe v demo načinu se ne shranijo. Prijavite se z resničnim računom.'); return }
    setNapaka('')
    setUspesno('')
    const prejsnja = slikaUrl
    setSlikaUrl(null)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ slika_url: null }).eq('id', user.id)
    if (error) { setSlikaUrl(prejsnja); setNapaka('Napaka pri odstranjevanju slike.'); return }
    setUspesno('Profilna slika je bila odstranjena.')
    setTimeout(() => setUspesno(''), 4000)
  }

  async function handleGeslo(e: React.FormEvent) {
    e.preventDefault()
    setNapaka('')
    setUspesno('')

    if (demoMode) {
      setNapaka('Spremembe v demo načinu se ne shranijo. Prijavite se z resničnim računom.')
      return
    }
    if (novoGeslo.length < 6) { setNapaka('Novo geslo mora imeti vsaj 6 znakov.'); return }
    if (novoGeslo !== potrdiGeslo) { setNapaka('Gesli se ne ujemata.'); return }
    if (!user?.email) return

    setNalaga(true)
    const supabase = createClient()

    const { error: prijavaError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: trenutnoGeslo,
    })
    if (prijavaError) {
      setNalaga(false)
      setNapaka('Trenutno geslo ni pravilno.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: novoGeslo })
    setNalaga(false)
    if (error) { setNapaka('Napaka pri spreminjanju gesla.'); return }

    setTrenutnoGeslo('')
    setNovoGeslo('')
    setPotrdiGeslo('')
    setUspesno('Geslo je bilo uspešno spremenjeno.')
    setTimeout(() => setUspesno(''), 4000)
  }

  async function handleNotifikacije() {
    setNapaka('')
    setUspesno('')
    if (!user) return

    if (demoMode) {
      setNapaka('Spremembe v demo načinu se ne shranijo. Prijavite se z resničnim računom.')
      return
    }

    setNalaga(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ notifikacije }).eq('id', user.id)
    setNalaga(false)
    if (error) { setNapaka('Napaka pri shranjevanju nastavitev.'); return }
    setUspesno('Nastavitve obvestil so bile shranjene.')
    setTimeout(() => setUspesno(''), 4000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Nastavitve profila</h1>
      <p className="text-gray-500 text-sm mb-8">Posodobite podatke vašega računa</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-full w-fit mb-8">
        {([
          { vrednost: 'profil', label: 'Profil', ikona: User },
          { vrednost: 'geslo', label: 'Geslo', ikona: Lock },
          { vrednost: 'notifikacije', label: 'Notifikacije', ikona: Bell },
        ] as { vrednost: typeof tab; label: string; ikona: React.ElementType }[]).map(({ vrednost, label, ikona: Ikona }) => (
          <button
            key={vrednost}
            onClick={() => { setTab(vrednost); setNapaka(''); setUspesno('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === vrednost ? 'bg-white text-[#0c2340] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Ikona className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {uspesno && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {uspesno}
        </div>
      )}
      {napaka && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {napaka}
        </div>
      )}

      {tab === 'profil' && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Vloga badge */}
          <div className="flex items-center gap-4 p-4 bg-[#0c2340]/5 rounded-xl">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-2xl font-bold overflow-hidden">
                {slikaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slikaUrl} alt="Profilna slika" className="w-full h-full object-cover" />
                ) : (
                  forma.ime ? forma.ime[0].toUpperCase() : '?'
                )}
              </div>
              <button
                type="button"
                onClick={() => datotekaRef.current?.click()}
                disabled={nalagaSliko}
                title="Naloži profilno sliko"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0c2340] text-white flex items-center justify-center border-2 border-white hover:bg-[#1e3a5f] transition-colors disabled:opacity-60"
              >
                {nalagaSliko ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              {slikaUrl && !nalagaSliko && (
                <button
                  type="button"
                  onClick={odstraniSliko}
                  title="Odstrani profilno sliko"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-gray-400 flex items-center justify-center border border-gray-200 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <input ref={datotekaRef} type="file" accept="image/*" onChange={naloziSliko} className="hidden" />
            </div>
            <div>
              <p className="font-semibold text-[#0c2340]">{forma.ime || 'Vaše ime'}</p>
              <p className="text-sm text-gray-500 capitalize">
                {vloga === 'prodajalec' ? 'Prodajalec' : vloga === 'charter' ? 'Charter' : vloga === 'oba' ? 'Prodajalec & Charter' : 'Kupec'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ime in priimek</label>
              <input
                value={forma.ime}
                onChange={e => setForma(f => ({...f, ime: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
              <input
                type="email"
                value={forma.email}
                onChange={e => setForma(f => ({...f, email: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Telefon</label>
              <input
                type="tel"
                value={forma.telefon}
                onChange={e => setForma(f => ({...f, telefon: e.target.value}))}
                placeholder="+386 41 ..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Spletna stran</label>
              <input
                type="url"
                value={forma.spletna_stran}
                onChange={e => setForma(f => ({...f, spletna_stran: e.target.value}))}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">O meni / podjetju</label>
            <textarea
              rows={3}
              value={forma.opis}
              onChange={e => setForma(f => ({...f, opis: e.target.value}))}
              placeholder="Kratek opis vas ali vašega podjetja..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
            />
          </div>

          <button type="submit" disabled={nalaga} className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
            {nalaga ? 'Shranjujem...' : 'Shrani spremembe'}
          </button>
        </form>
      )}

      {tab === 'geslo' && (
        <form onSubmit={handleGeslo} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Trenutno geslo</label>
            <input required type="password" placeholder="••••••••" value={trenutnoGeslo}
              onChange={e => setTrenutnoGeslo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Novo geslo</label>
            <input required type="password" placeholder="••••••••" value={novoGeslo}
              onChange={e => setNovoGeslo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Potrdi novo geslo</label>
            <input required type="password" placeholder="••••••••" value={potrdiGeslo}
              onChange={e => setPotrdiGeslo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
          </div>
          <button type="submit" disabled={nalaga} className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full transition-all">
            {nalaga ? 'Spreminjam...' : 'Spremeni geslo'}
          </button>
        </form>
      )}

      {tab === 'notifikacije' && (
        <div className="space-y-4">
          {NOTIFIKACIJE_OPCIJE.map(({ kljuc, label, opis }) => (
            <div key={kljuc} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl gap-4">
              <div>
                <p className="font-medium text-[#0c2340] text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opis}</p>
              </div>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={notifikacije[kljuc] ?? true}
                  onChange={e => setNotifikacije(n => ({ ...n, [kljuc]: e.target.checked }))}
                  className="sr-only peer"
                  id={kljuc}
                />
                <label htmlFor={kljuc} className="w-11 h-6 bg-gray-200 peer-checked:bg-[#c9a84c] rounded-full cursor-pointer block transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
              </div>
            </div>
          ))}
          <button onClick={handleNotifikacije} disabled={nalaga} className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold text-sm rounded-full transition-all">
            {nalaga ? 'Shranjujem...' : 'Shrani nastavitve'}
          </button>
        </div>
      )}
    </div>
  )
}

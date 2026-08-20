'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { StanjeDela, KategorijaDela } from '@/types/database'

const kategorije: { vrednost: KategorijaDela; label: string }[] = [
  { vrednost: 'motor', label: 'Motor' },
  { vrednost: 'elektronika', label: 'Elektronika' },
  { vrednost: 'jadra', label: 'Jadra' },
  { vrednost: 'trup', label: 'Trup' },
  { vrednost: 'sidrna oprema', label: 'Sidrna oprema' },
  { vrednost: 'drugo', label: 'Drugo' },
]

export default function NovRezervniDelPage() {
  const { user, demoMode } = useAuth()

  const [forma, setForma] = useState({
    naziv: '', opis: '', cena: '', stanje: 'rabljeno' as StanjeDela, kategorija: 'drugo' as KategorijaDela,
    tip_plovila: '', lokacija: '', kontakt_email: user?.email ?? '', kontakt_tel: '',
  })
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [uspesno, setUspesno] = useState(false)

  function posodobi(polje: string, vrednost: string) {
    setForma((f) => ({ ...f, [polje]: vrednost }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forma.naziv || !forma.cena) { setNapaka('Vpišite naziv in ceno.'); return }
    if (!user) { setNapaka('Za objavo oglasa se morate prijaviti.'); return }
    if (demoMode) { setNapaka('Objava v demo načinu ni mogoča. Prijavite se z resničnim računom.'); return }

    setNapaka('')
    setNalaga(true)
    const supabase = createClient()
    const { error } = await supabase.from('rezervni_deli').insert({
      naziv: forma.naziv,
      opis: forma.opis || null,
      cena: Number(forma.cena),
      stanje: forma.stanje,
      kategorija: forma.kategorija,
      tip_plovila: forma.tip_plovila || null,
      slika_url: null,
      kontakt_email: forma.kontakt_email || null,
      kontakt_tel: forma.kontakt_tel || null,
      lokacija: forma.lokacija || null,
      potrjeno: true,
      user_id: user.id,
    })

    setNalaga(false)
    if (error) { setNapaka('Napaka pri shranjevanju. Poskusite znova.'); return }
    setUspesno(true)
  }

  if (uspesno) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Oglas dodan!</h2>
              <p className="text-gray-500 mb-6">Vaš oglas je objavljen in takoj viden vsem obiskovalcem.</p>
              <Link href="/rezervni-deli" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#0c2340] font-semibold text-sm rounded-full hover:bg-[#e8c76d]">
                Vsi rezervni deli
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="p-8 max-w-2xl mx-auto">
          <Link href="/rezervni-deli" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0c2340] mb-6">
            <ArrowLeft className="w-4 h-4" /> Nazaj na rezervne dele
          </Link>
          <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Objavi oglas za rezervni del</h1>
          <p className="text-gray-500 text-sm mb-8">Izpolnite podatke o delu. Oglas bo aktiven po pregledu.</p>

          {!user && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Za objavo oglasa se morate <Link href="/prijava?redirect=/rezervni-deli/novo" className="underline font-medium">prijaviti</Link>.
            </div>
          )}
          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" /> {napaka}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Naziv *</label>
              <input required value={forma.naziv} onChange={e => posodobi('naziv', e.target.value)}
                placeholder="npr. Yamaha 150HP zunajbordni motor"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Opis</label>
              <textarea rows={3} value={forma.opis} onChange={e => posodobi('opis', e.target.value)}
                placeholder="Opišite stanje, letnik, posebnosti..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Cena (€) *</label>
                <input required type="number" min="0" value={forma.cena} onChange={e => posodobi('cena', e.target.value)}
                  placeholder="450"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Stanje</label>
                <select value={forma.stanje} onChange={e => posodobi('stanje', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]">
                  <option value="novo">Novo</option>
                  <option value="rabljeno">Rabljeno</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Kategorija</label>
                <select value={forma.kategorija} onChange={e => posodobi('kategorija', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]">
                  {kategorije.map(k => <option key={k.vrednost} value={k.vrednost}>{k.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Tip plovila</label>
                <input value={forma.tip_plovila} onChange={e => posodobi('tip_plovila', e.target.value)}
                  placeholder="npr. motorni"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Lokacija</label>
              <input value={forma.lokacija} onChange={e => posodobi('lokacija', e.target.value)}
                placeholder="Koper"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
                <input type="email" value={forma.kontakt_email} onChange={e => posodobi('kontakt_email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Telefon</label>
                <input type="tel" value={forma.kontakt_tel} onChange={e => posodobi('kontakt_tel', e.target.value)}
                  placeholder="+386 41 ..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
            </div>

            <button type="submit" disabled={nalaga || !user}
              className="w-full py-4 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-bold rounded-2xl transition-all hover:scale-[1.01] shadow-sm text-base">
              {nalaga ? 'Shranjujem...' : '✓ Objavi oglas'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

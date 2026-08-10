'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Anchor, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PonastaviGesloPage() {
  const router = useRouter()
  const [preverjaSejo, setPreverjaSejo] = useState(true)
  const [imaSejo, setImaSejo] = useState(false)
  const [geslo, setGeslo] = useState('')
  const [geslo2, setGeslo2] = useState('')
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)
  const [uspesno, setUspesno] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setImaSejo(!!data.session)
      setPreverjaSejo(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (geslo.length < 6) { setNapaka('Geslo mora imeti vsaj 6 znakov.'); return }
    if (geslo !== geslo2) { setNapaka('Gesli se ne ujemata.'); return }
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: geslo })

    setNalaga(false)
    if (error) { setNapaka('Napaka pri ponastavitvi gesla. Poskusite znova.'); return }
    setUspesno(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Anchor className="w-7 h-7 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-2xl font-semibold text-[#0c2340]">Garbin</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {preverjaSejo ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-4 border-[#c9a84c] border-t-transparent animate-spin" />
            </div>
          ) : !imaSejo ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Povezava je potekla</h1>
              <p className="text-gray-500 text-sm mb-6">
                Povezava za ponastavitev gesla ni več veljavna. Zahtevajte nov e-mail.
              </p>
              <Link
                href="/pozabljeno-geslo"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold text-sm rounded-xl transition-all"
              >
                Zahtevaj nov e-mail
              </Link>
            </div>
          ) : uspesno ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Geslo ponastavljeno!</h1>
              <p className="text-gray-500 text-sm">Preusmerjamo vas na vaš račun...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Nastavite novo geslo</h1>
                <p className="text-gray-500 text-sm">Vnesite novo geslo za vaš račun.</p>
              </div>

              {napaka && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {napaka}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Novo geslo</label>
                  <input
                    required
                    type="password"
                    value={geslo}
                    onChange={e => setGeslo(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Ponovite geslo</label>
                  <input
                    required
                    type="password"
                    value={geslo2}
                    onChange={e => setGeslo2(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={nalaga}
                  className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-xl transition-all hover:scale-[1.01]"
                >
                  {nalaga ? 'Shranjujem...' : 'Nastavi novo geslo'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

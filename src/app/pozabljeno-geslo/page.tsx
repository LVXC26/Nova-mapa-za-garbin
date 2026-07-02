'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Anchor, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function PozabljenoGesloPage() {
  const [email, setEmail] = useState('')
  const [napaka, setNapaka] = useState('')
  const [poslano, setPoslano] = useState(false)
  const [nalaga, setNalaga] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNapaka('')
    setNalaga(true)

    // Ko bo Supabase: supabase.auth.resetPasswordForEmail(email)
    await new Promise(r => setTimeout(r, 800))
    setNalaga(false)
    setPoslano(true)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Anchor className="w-7 h-7 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-2xl font-semibold text-[#0c2340]">Garbin</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {poslano ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-2">Preverite e-pošto</h1>
              <p className="text-gray-500 text-sm mb-2">
                Poslali smo navodila za ponastavitev gesla na:
              </p>
              <p className="font-semibold text-[#0c2340] mb-6">{email}</p>
              <p className="text-xs text-gray-400 mb-8">
                E-pošte niste prejeli? Preverite mapo z nezaželeno pošto ali poskusite znova čez nekaj minut.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setPoslano(false); setEmail('') }}
                  className="w-full py-3 border border-gray-200 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-50 transition-all"
                >
                  Poskusi z drugim e-mailom
                </button>
                <Link
                  href="/prijava"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0c2340] hover:bg-[#1e3a5f] text-white font-semibold text-sm rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Nazaj na prijavo
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Pozabljeno geslo?</h1>
                <p className="text-gray-500 text-sm">
                  Vnesite vaš e-mail naslov in poslali vam bomo navodila za ponastavitev gesla.
                </p>
              </div>

              {napaka && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {napaka}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail naslov</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ime@primer.si"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={nalaga}
                  className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-xl transition-all hover:scale-[1.01]"
                >
                  {nalaga ? 'Pošiljam...' : 'Pošlji navodila'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/prijava"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0c2340] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Nazaj na prijavo
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

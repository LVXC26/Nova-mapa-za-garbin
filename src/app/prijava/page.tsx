'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PrijavaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [prikaziGeslo, setPrikaziGeslo] = useState(false)
  const [napaka, setNapaka] = useState('')
  const [nalaga, setNalaga] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNapaka('')
    setNalaga(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: geslo })

    if (error) {
      setNapaka('Napačen email ali geslo.')
      setNalaga(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Anchor className="w-7 h-7 text-[#c9a84c] group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-display text-2xl font-semibold text-[#0c2340]">Garbin</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-display text-2xl font-bold text-[#0c2340] mb-1">Dobrodošli nazaj</h1>
          <p className="text-gray-500 text-sm mb-6">Prijavite se v vaš račun</p>

          {napaka && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {napaka}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@primer.si"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">Geslo</label>
              <div className="relative">
                <input
                  required
                  type={prikaziGeslo ? 'text' : 'password'}
                  value={geslo}
                  onChange={(e) => setGeslo(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPrikaziGeslo(!prikaziGeslo)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {prikaziGeslo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={nalaga}
              className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-60 text-[#0c2340] font-semibold rounded-xl transition-all hover:scale-[1.01] shadow-sm"
            >
              {nalaga ? 'Prijavljam...' : 'Prijava'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/pozabljeno-geslo" className="text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">
              Pozabljeno geslo?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Nimate računa?{' '}
            <Link href="/registracija" className="font-semibold text-[#0c2340] hover:text-[#c9a84c] transition-colors">
              Registracija
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

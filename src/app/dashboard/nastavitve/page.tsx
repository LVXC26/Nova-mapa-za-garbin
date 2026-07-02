'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, User, Lock, Bell } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function NastavitveProfilaPage() {
  const { user, vloga } = useAuth()
  const [tab, setTab] = useState<'profil' | 'geslo' | 'notifikacije'>('profil')
  const [uspesno, setUspesno] = useState(false)
  const [forma, setForma] = useState({
    ime: user?.user_metadata?.ime ?? '',
    email: user?.email ?? '',
    telefon: '',
    opis: '',
    spletna_stran: '',
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUspesno(true)
    setTimeout(() => setUspesno(false), 3000)
    // Ko bo Supabase: supabase.from('profiles').update(...)
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
            onClick={() => setTab(vrednost)}
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
          Spremembe so bile uspešno shranjene.
        </div>
      )}

      {tab === 'profil' && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Vloga badge */}
          <div className="flex items-center gap-3 p-4 bg-[#0c2340]/5 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] text-xl font-bold">
              {forma.ime ? forma.ime[0].toUpperCase() : '?'}
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

          <button type="submit" className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02]">
            Shrani spremembe
          </button>
        </form>
      )}

      {tab === 'geslo' && (
        <div className="space-y-4">
          {['Trenutno geslo', 'Novo geslo', 'Potrdi novo geslo'].map(label => (
            <div key={label}>
              <label className="block text-sm font-semibold text-[#0c2340] mb-1.5">{label}</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>
          ))}
          <button className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
            Spremeni geslo
          </button>
        </div>
      )}

      {tab === 'notifikacije' && (
        <div className="space-y-4">
          {[
            { label: 'E-mail obvestila ob novem sporočilu', opis: 'Prejmite email ko prejmete novo sporočilo' },
            { label: 'Obvestilo ob potrditvi oglasa', opis: 'Ko admin potrdi vaš oglas' },
            { label: 'Newsletter', opis: 'Tedenske novice o trgu plovil' },
          ].map(({ label, opis }) => (
            <div key={label} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl gap-4">
              <div>
                <p className="font-medium text-[#0c2340] text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opis}</p>
              </div>
              <div className="relative shrink-0">
                <input type="checkbox" defaultChecked className="sr-only peer" id={label} />
                <label htmlFor={label} className="w-11 h-6 bg-gray-200 peer-checked:bg-[#c9a84c] rounded-full cursor-pointer block transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
              </div>
            </div>
          ))}
          <button className="px-6 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all">
            Shrani nastavitve
          </button>
        </div>
      )}
    </div>
  )
}

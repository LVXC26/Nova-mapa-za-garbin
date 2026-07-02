'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, MessageCircle, Search, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

interface Sporocilo {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

interface Konverzacija {
  user_id: string
  ime: string
  zadnje_sporocilo: string
  cas: string
  neprebrana: number
}

// Mock konverzacije za prikaz ko Supabase ni povezan
const mockKonverzacije: Konverzacija[] = [
  { user_id: 'u1', ime: 'Janez Novak', zadnje_sporocilo: 'Zanima me Bavaria Cruiser 46...', cas: '14:32', neprebrana: 2 },
  { user_id: 'u2', ime: 'Adriatic Sail d.o.o.', zadnje_sporocilo: 'Plovilo je še na voljo!', cas: '11:15', neprebrana: 0 },
  { user_id: 'u3', ime: 'Marko Horvat (Skipper)', zadnje_sporocilo: 'Jutri sem na voljo.', cas: 'Včeraj', neprebrana: 1 },
]

const mockSporocila: Record<string, Sporocilo[]> = {
  u1: [
    { id: 'm1', sender_id: 'u1', receiver_id: 'me', content: 'Zanima me Bavaria Cruiser 46, ali je še naprodaj?', created_at: '2024-03-15T14:30:00Z', read: true },
    { id: 'm2', sender_id: 'me', receiver_id: 'u1', content: 'Ja, plovilo je še dostopno. Kdaj bi si ga radi ogledali?', created_at: '2024-03-15T14:31:00Z', read: true },
    { id: 'm3', sender_id: 'u1', receiver_id: 'me', content: 'Bi prišel v sredo popoldne.', created_at: '2024-03-15T14:32:00Z', read: false },
  ],
  u2: [
    { id: 'm4', sender_id: 'me', receiver_id: 'u2', content: 'Ali imate na voljo jadrnico za teden dni julija?', created_at: '2024-03-15T11:10:00Z', read: true },
    { id: 'm5', sender_id: 'u2', receiver_id: 'me', content: 'Plovilo je še na voljo!', created_at: '2024-03-15T11:15:00Z', read: true },
  ],
  u3: [
    { id: 'm6', sender_id: 'u3', receiver_id: 'me', content: 'Jutri sem na voljo za plovbo.', created_at: '2024-03-14T18:00:00Z', read: false },
  ],
}

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [aktivnaKonv, setAktivnaKonv] = useState<string | null>(null)
  const [sporocila, setSporocila] = useState<Sporocilo[]>([])
  const [novoSporocilo, setNovoSporocilo] = useState('')
  const [iskanje, setIskanje] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/prijava?redirect=/chat')
    }
  }, [user, router])

  useEffect(() => {
    if (aktivnaKonv) {
      setSporocila(mockSporocila[aktivnaKonv] ?? [])
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [aktivnaKonv])

  function posljiSporocilo() {
    if (!novoSporocilo.trim() || !aktivnaKonv) return
    const novo: Sporocilo = {
      id: `m${Date.now()}`,
      sender_id: 'me',
      receiver_id: aktivnaKonv,
      content: novoSporocilo,
      created_at: new Date().toISOString(),
      read: true,
    }
    setSporocila(prev => [...prev, novo])
    setNovoSporocilo('')
    // Ko bo Supabase povezan: supabase.from('messages').insert(...)
  }

  const filtrirane = mockKonverzacije.filter(k =>
    k.ime.toLowerCase().includes(iskanje.toLowerCase())
  )

  const aktivnaKonvData = mockKonverzacije.find(k => k.user_id === aktivnaKonv)

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="pt-16 h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 gap-4">

          {/* LEVA STRAN — konverzacije */}
          <div className={`w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col ${aktivnaKonv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-[#0c2340] mb-3">Sporočila</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Išči konverzacije..."
                  value={iskanje}
                  onChange={e => setIskanje(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtrirane.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Ni konverzacij</p>
                </div>
              ) : (
                filtrirane.map((k) => (
                  <button
                    key={k.user_id}
                    onClick={() => setAktivnaKonv(k.user_id)}
                    className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      aktivnaKonv === k.user_id ? 'bg-[#0c2340]/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0c2340] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {k.ime[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[#0c2340] text-sm truncate">{k.ime}</p>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{k.cas}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{k.zadnje_sporocilo}</p>
                    </div>
                    {k.neprebrana > 0 && (
                      <span className="w-5 h-5 bg-[#c9a84c] text-[#0c2340] text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                        {k.neprebrana}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* DESNA STRAN — chat window */}
          <div className={`flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col ${!aktivnaKonv ? 'hidden md:flex' : 'flex'}`}>
            {!aktivnaKonv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageCircle className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-400 mb-1">Izberite konverzacijo</h3>
                <p className="text-sm text-gray-300">Kliknite na konverzacijo na levi, da jo odprete</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <button
                    onClick={() => setAktivnaKonv(null)}
                    className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-[#0c2340] flex items-center justify-center text-white text-sm font-bold">
                    {aktivnaKonvData?.ime[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c2340] text-sm">{aktivnaKonvData?.ime}</p>
                    <p className="text-xs text-emerald-500">Online</p>
                  </div>
                </div>

                {/* Sporočila */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {sporocila.map((s) => (
                    <div key={s.id} className={`flex ${s.sender_id === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        s.sender_id === 'me'
                          ? 'bg-[#0c2340] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {s.content}
                        <div className={`text-xs mt-1 ${s.sender_id === 'me' ? 'text-white/50' : 'text-gray-400'}`}>
                          {new Date(s.created_at).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Napišite sporočilo..."
                      value={novoSporocilo}
                      onChange={e => setNovoSporocilo(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && posljiSporocilo()}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                    />
                    <button
                      onClick={posljiSporocilo}
                      disabled={!novoSporocilo.trim()}
                      className="w-11 h-11 rounded-xl bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-50 text-[#0c2340] flex items-center justify-center transition-all hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

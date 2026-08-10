'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send, MessageCircle, Search, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'

interface Konverzacija {
  user_id: string
  ime: string
  zadnje_sporocilo: string
  cas: string
  neprebrana: number
}

function formatCas(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 86400000) return date.toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })
  if (diff < 172800000) return 'Včeraj'
  return date.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })
}

function ChatPageContent() {
  const { user, demoMode } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const noviPartnerId = searchParams.get('to')
  const noviPartnerIme = searchParams.get('ime')
  const supabase = createClient()
  const [aktivnaKonv, setAktivnaKonv] = useState<string | null>(null)
  const aktivnaKonvRef = useRef<string | null>(null)
  const [konverzacije, setKonverzacije] = useState<Konverzacija[]>([])
  const [sporocila, setSporocila] = useState<Message[]>([])
  const [novoSporocilo, setNovoSporocilo] = useState('')
  const [iskanje, setIskanje] = useState('')
  const [nalaga, setNalaga] = useState(true)
  const [napakaPosiljanje, setNapakaPosiljanje] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    aktivnaKonvRef.current = aktivnaKonv
  }, [aktivnaKonv])

  useEffect(() => {
    if (!user) {
      router.push('/prijava?redirect=/chat')
      return
    }

    ;(async () => {
      await naloziKonverzacije()
      if (noviPartnerId && noviPartnerId !== user.id) {
        await odpriKonverzacijo(noviPartnerId, noviPartnerIme)
      }
    })()

    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        const msg = payload.new as Message
        if (msg.sender_id !== user.id && msg.receiver_id !== user.id) return

        await naloziKonverzacije()

        const currentKonv = aktivnaKonvRef.current
        if (currentKonv && (msg.sender_id === currentKonv || msg.receiver_id === currentKonv)) {
          setSporocila(prev => [...prev, msg])
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
          if (msg.receiver_id === user.id) {
            await supabase.from('messages').update({ read: true }).eq('id', msg.id)
          }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function naloziKonverzacije() {
    if (!user) return

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!messages || messages.length === 0) {
      setKonverzacije([])
      setNalaga(false)
      return
    }

    const konvMap = new Map<string, { zadnje: Message; neprebrana: number }>()
    for (const msg of messages) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
      if (!konvMap.has(partnerId)) {
        konvMap.set(partnerId, { zadnje: msg, neprebrana: 0 })
      }
      if (msg.receiver_id === user.id && !msg.read) {
        konvMap.get(partnerId)!.neprebrana++
      }
    }

    const partnerIds = Array.from(konvMap.keys())
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, ime')
      .in('id', partnerIds)

    const profileMap = new Map(profiles?.map(p => [p.id, p.ime ?? 'Neznani uporabnik']) ?? [])

    setKonverzacije(
      partnerIds.map(id => {
        const { zadnje, neprebrana } = konvMap.get(id)!
        return {
          user_id: id,
          ime: profileMap.get(id) ?? 'Neznani uporabnik',
          zadnje_sporocilo: zadnje.content,
          cas: formatCas(zadnje.created_at),
          neprebrana,
        }
      })
    )
    setNalaga(false)
  }

  async function odpriKonverzacijo(partnerId: string, imeIzUrl: string | null) {
    let ime = imeIzUrl
    if (!ime) {
      const { data: profil } = await supabase.from('profiles').select('ime').eq('id', partnerId).maybeSingle()
      ime = profil?.ime ?? null
    }
    setKonverzacije((prev) => {
      if (prev.some((k) => k.user_id === partnerId)) return prev
      return [
        { user_id: partnerId, ime: ime ?? 'Nov pogovor', zadnje_sporocilo: '', cas: '', neprebrana: 0 },
        ...prev,
      ]
    })
    handleKonverzacijaKlik(partnerId)
  }

  async function naloziSporocila(partnerId: string) {
    if (!user) return

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (data) {
      setSporocila(data)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

      const neprebranaIds = data.filter(m => m.receiver_id === user.id && !m.read).map(m => m.id)
      if (neprebranaIds.length > 0) {
        await supabase.from('messages').update({ read: true }).in('id', neprebranaIds)
        naloziKonverzacije()
      }
    }
  }

  async function posljiSporocilo() {
    if (!novoSporocilo.trim() || !aktivnaKonv || !user) return

    if (demoMode) {
      setNapakaPosiljanje('Sporočila v demo načinu se ne shranijo. Prijavite se z resničnim računom, da lahko pošiljate sporočila.')
      return
    }

    const vsebina = novoSporocilo.trim()
    setNovoSporocilo('')
    setNapakaPosiljanje('')

    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: user.id, receiver_id: aktivnaKonv, content: vsebina, read: false })
      .select()
      .single()

    if (!error && data) {
      setSporocila(prev => [...prev, data as Message])
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      naloziKonverzacije()
    } else {
      setNovoSporocilo(vsebina)
      setNapakaPosiljanje('Sporočilo ni bilo poslano. Poskusite znova.')
    }
  }

  function handleKonverzacijaKlik(userId: string) {
    setAktivnaKonv(userId)
    setNapakaPosiljanje('')
    naloziSporocila(userId)
  }

  const filtrirane = konverzacije.filter(k =>
    k.ime.toLowerCase().includes(iskanje.toLowerCase())
  )

  const aktivnaKonvData = konverzacije.find(k => k.user_id === aktivnaKonv)

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
              {nalaga ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : filtrirane.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Ni konverzacij</p>
                </div>
              ) : (
                filtrirane.map((k) => (
                  <button
                    key={k.user_id}
                    onClick={() => handleKonverzacijaKlik(k.user_id)}
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
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {sporocila.map((s) => (
                    <div key={s.id} className={`flex ${s.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        s.sender_id === user.id
                          ? 'bg-[#0c2340] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {s.content}
                        <div className={`text-xs mt-1 ${s.sender_id === user.id ? 'text-white/50' : 'text-gray-400'}`}>
                          {new Date(s.created_at).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-100">
                  {napakaPosiljanje && (
                    <p className="text-xs text-red-500 mb-2">{napakaPosiljanje}</p>
                  )}
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

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="pt-16 h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatPageContent />
    </Suspense>
  )
}

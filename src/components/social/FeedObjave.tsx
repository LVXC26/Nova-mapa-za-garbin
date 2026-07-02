'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Image, Send, MoreHorizontal, MapPin, Anchor, CheckCircle, X, Clock } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

type TipObjave = 'objava' | 'potovanje' | 'tuje_caka'

interface FeedPost {
  id: string
  tip: TipObjave
  avtor: string
  avatar: string
  vloga?: string
  cas: string
  vsebina: string
  lokacija?: string
  plovilo?: string
  slike?: string[]
  likes: number
  komentarji: number
  odobrena: boolean
}

const mockObjave: FeedPost[] = [
  {
    id: 'f1', tip: 'potovanje',
    avtor: 'Adriatic Sail', avatar: '🏢', vloga: 'Charter',
    cas: 'Pred 2 urami',
    vsebina: 'Sezona 2024 se uradno začenja! ⛵ Bavaria C45 je ravnokar prišla iz servisnega pregleda — vse pripravljeno za prve stranke. Rezervirajte zgodaj, termini so omejeni!',
    lokacija: 'Marina Portorož', plovilo: 'Bavaria C45',
    likes: 24, komentarji: 3, odobrena: true,
  },
  {
    id: 'f2', tip: 'potovanje',
    avtor: 'Marko Horvat', avatar: '👨‍✈️', vloga: 'Skipper',
    cas: 'Pred 1 dnem',
    vsebina: 'Odlična tura včeraj — Portorož → Rovinj in nazaj. Brise de mer zvečer, mavrica nad rtom Kamenjak. To je razlog, zakaj ljubimo Jadran! 🌈',
    lokacija: 'Rt Kamenjak, Istra', plovilo: 'Bavaria 34',
    likes: 67, komentarji: 12, odobrena: true,
  },
  {
    id: 'f3', tip: 'objava',
    avtor: 'Adriatic Sail', avatar: '🏢', vloga: 'Charter',
    cas: 'Pred 3 dnevi',
    vsebina: 'Prejeli smo certifikat varnosti za celotno floto 2024. Rešilni jopiči, EPIRB, VHF — vse posodobljeno. Vaša varnost je naša prioriteta. ✅',
    likes: 41, komentarji: 7, odobrena: true,
  },
  {
    id: 'f4', tip: 'tuje_caka',
    avtor: 'Janez K.', avatar: '👤',
    cas: 'Pred 5 urami',
    vsebina: 'Čudovita izkušnja s chartrom minuli mesec! Plovili super vzdrževano, posadka profesionalna. Priporočam vsem.',
    likes: 0, komentarji: 0, odobrena: false,
  },
]

function LikeButton({ initial }: { initial: number }) {
  const [liked, setLiked] = useState(false)
  const [n, setN] = useState(initial)
  return (
    <button onClick={() => { setLiked(!liked); setN(c => liked ? c - 1 : c + 1) }}
      className={`flex items-center gap-1.5 text-sm transition-all ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
      <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} /> {n}
    </button>
  )
}

interface Props {
  title?: string
  showAddPost?: boolean
  showModeracija?: boolean
  avtor?: string
  vloga?: string
}

export default function FeedObjave({
  title = 'Objave',
  showAddPost = false,
  showModeracija = false,
  avtor = '',
  vloga = '',
}: Props) {
  const { user } = useAuth()
  const [objave, setObjave] = useState(mockObjave)
  const [tip, setTip] = useState<'objava' | 'potovanje'>('objava')
  const [vsebina, setVsebina] = useState('')
  const [lokacija, setLokacija] = useState('')
  const [plovilo, setPlovilo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'vse' | 'moje' | 'caka'>('vse')

  const odobrene = objave.filter(o => o.odobrena)
  const cakajo = objave.filter(o => !o.odobrena)

  const prikazane = showModeracija
    ? (filter === 'caka' ? cakajo : filter === 'moje' ? objave.filter(o => o.avtor === avtor) : odobrene)
    : odobrene

  function addPost() {
    if (!vsebina.trim()) return
    const nova: FeedPost = {
      id: `f${Date.now()}`,
      tip,
      avtor: user?.user_metadata?.ime ?? avtor ?? 'Jaz',
      avatar: '👤',
      vloga,
      cas: 'Ravnokar',
      vsebina,
      lokacija: lokacija || undefined,
      plovilo: plovilo || undefined,
      likes: 0, komentarji: 0,
      odobrena: true,
    }
    setObjave([nova, ...objave])
    setVsebina(''); setLokacija(''); setPlovilo('')
    setShowForm(false)
  }

  function odobri(id: string) {
    setObjave(prev => prev.map(o => o.id === id ? { ...o, odobrena: true } : o))
  }

  function zavrni(id: string) {
    setObjave(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-[#0c2340]">{title}</h2>
        <div className="flex items-center gap-2">
          {showModeracija && (
            <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
              {[
                { v: 'vse', label: 'Vse' },
                { v: 'caka', label: `Čaka (${cakajo.length})` },
              ].map(({ v, label }) => (
                <button key={v} onClick={() => setFilter(v as typeof filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${filter === v ? 'bg-white text-[#0c2340] shadow-sm' : 'text-gray-500'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
          {showAddPost && user && (
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] text-xs font-semibold rounded-full transition-all hover:scale-105">
              <Image className="w-3.5 h-3.5" /> Dodaj objavo
            </button>
          )}
        </div>
      </div>

      {/* Moderacija: Čaka odobritev */}
      {showModeracija && filter === 'caka' && (
        <div className="space-y-4 mb-6">
          {cakajo.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Ni čakajočih objav</p>
            </div>
          ) : (
            cakajo.map(o => (
              <div key={o.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-lg">{o.avatar}</div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{o.avtor}</p>
                      <p className="text-xs text-amber-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Čaka odobritev</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{o.vsebina}</p>
                <div className="flex gap-2">
                  <button onClick={() => odobri(o.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full transition-all">
                    <CheckCircle className="w-3.5 h-3.5" /> Odobri
                  </button>
                  <button onClick={() => zavrni(o.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full transition-all">
                    <X className="w-3.5 h-3.5" /> Zavrni
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Nova objava forma */}
      {showForm && showAddPost && (
        <div className="bg-white rounded-2xl border border-[#c9a84c]/30 shadow-sm p-5 mb-5">
          {/* Tip selector */}
          <div className="flex gap-2 mb-4">
            {[
              { v: 'objava', label: '📢 Objava' },
              { v: 'potovanje', label: '⛵ Potovanje' },
            ].map(({ v, label }) => (
              <button key={v} type="button" onClick={() => setTip(v as typeof tip)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tip === v ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] font-bold text-sm shrink-0">
              {(user?.user_metadata?.ime ?? avtor ?? 'J')[0]}
            </div>
            <textarea value={vsebina} onChange={e => setVsebina(e.target.value)}
              placeholder={tip === 'potovanje' ? 'Opišite vaše potovanje, ruto, doživetje...' : 'Delite novosti, informacije ali obvestila...'}
              rows={3}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none transition-colors" />
          </div>

          {tip === 'potovanje' && (
            <div className="grid grid-cols-2 gap-3 mb-3 ml-12">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={lokacija} onChange={e => setLokacija(e.target.value)}
                  placeholder="Lokacija (npr. Rovinj)"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div className="relative">
                <Anchor className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={plovilo} onChange={e => setPlovilo(e.target.value)}
                  placeholder="Plovilo (npr. Bavaria 34)"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between ml-12">
            <button type="button" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors">
              <Image className="w-4 h-4" /> Dodaj sliko
            </button>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">Prekliči</button>
              <button onClick={addPost} disabled={!vsebina.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-40 text-[#0c2340] text-xs font-semibold rounded-full transition-all">
                <Send className="w-3.5 h-3.5" /> Objavi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      {filter !== 'caka' && (
        <div className="space-y-4">
          {prikazane.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <Image className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Še ni objav</p>
            </div>
          ) : (
            prikazane.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340]/8 flex items-center justify-center text-xl shrink-0">{o.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#0c2340] text-sm">{o.avtor}</p>
                        {o.vloga && (
                          <span className="text-xs px-1.5 py-0.5 bg-[#0c2340]/8 text-[#0c2340] rounded-full capitalize">{o.vloga}</span>
                        )}
                        {o.tip === 'potovanje' && (
                          <span className="text-xs px-1.5 py-0.5 bg-[#c9a84c]/15 text-[#9a7a2e] rounded-full">⛵ Potovanje</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{o.cas}</p>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-gray-500 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Lokacija + plovilo */}
                {(o.lokacija || o.plovilo) && (
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 ml-13">
                    {o.lokacija && (
                      <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <MapPin className="w-3 h-3 text-[#c9a84c]" /> {o.lokacija}
                      </span>
                    )}
                    {o.plovilo && (
                      <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <Anchor className="w-3 h-3 text-[#c9a84c]" /> {o.plovilo}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-700 leading-relaxed mb-4">{o.vsebina}</p>

                {/* Slika placeholder */}
                {o.slike && o.slike.length > 0 && (
                  <div className="h-48 bg-gradient-to-br from-[#0c2340] to-[#1e3a5f] rounded-xl mb-4 flex items-center justify-center">
                    <Image className="w-10 h-10 text-white/20" />
                  </div>
                )}

                <div className="flex items-center gap-5 pt-3 border-t border-gray-50">
                  <LikeButton initial={o.likes} />
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0c2340] transition-colors">
                    <MessageCircle className="w-4 h-4" /> {o.komentarji}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors ml-auto">
                    <Share2 className="w-4 h-4" /> Deli
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, MapPin, Anchor, CheckCircle, X, Clock, Trash2, Loader2, Camera } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Objava, ObjavaKomentar, TipObjave } from '@/types/database'

const MAX_SLIK_OBJAVA = 6
const MAX_SLIKA_MB = 8

function LikeButton({ objavaId, stevilo, jazLajkam, onToggle }: {
  objavaId: string
  stevilo: number
  jazLajkam: boolean
  onToggle: (objavaId: string, trenutno: boolean) => void
}) {
  return (
    <button onClick={() => onToggle(objavaId, jazLajkam)}
      className={`flex items-center gap-1.5 text-sm transition-all ${jazLajkam ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
      <Heart className={`w-4 h-4 ${jazLajkam ? 'fill-red-500' : ''}`} /> {stevilo}
    </button>
  )
}

function KomentarjiPanel({ objavaId, isModerator }: { objavaId: string; isModerator: boolean }) {
  const { user } = useAuth()
  const [komentarji, setKomentarji] = useState<ObjavaKomentar[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [nov, setNov] = useState('')
  const [posilja, setPosilja] = useState(false)

  const nalozi = useCallback(async () => {
    setNalaga(true)
    const supabase = createClient()
    const { data } = await supabase.from('objava_komentarji').select('*').eq('objava_id', objavaId).order('created_at', { ascending: true })
    setKomentarji(data ?? [])
    setNalaga(false)
  }, [objavaId])

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [nalozi])

  async function dodajKomentar() {
    if (!user || !nov.trim()) return
    setPosilja(true)
    const supabase = createClient()
    await supabase.from('objava_komentarji').insert({
      objava_id: objavaId,
      user_id: user.id,
      ime: user.user_metadata?.ime ?? user.email ?? 'Uporabnik',
      vsebina: nov.trim(),
    })
    setPosilja(false)
    setNov('')
    nalozi()
  }

  async function izbrisiKomentar(id: string) {
    const supabase = createClient()
    await supabase.from('objava_komentarji').delete().eq('id', id)
    nalozi()
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-50 space-y-3">
      {nalaga ? (
        <p className="text-xs text-gray-400">Nalagam komentarje...</p>
      ) : komentarji.length === 0 ? (
        <p className="text-xs text-gray-400">Še ni komentarjev.</p>
      ) : (
        komentarji.map(k => (
          <div key={k.id} className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0c2340]/10 flex items-center justify-center text-xs font-bold text-[#0c2340] shrink-0">{k.ime[0]}</div>
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#0c2340]">{k.ime}</p>
                <p className="text-xs text-gray-600">{k.vsebina}</p>
              </div>
              {isModerator && (
                <button
                  onClick={() => izbrisiKomentar(k.id)}
                  title="Izbriši komentar (moderator)"
                  className="p-1 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))
      )}
      {user && (
        <div className="flex items-center gap-2">
          <input
            value={nov}
            onChange={e => setNov(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); dodajKomentar() } }}
            placeholder="Dodaj komentar..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#c9a84c]"
          />
          <button onClick={dodajKomentar} disabled={posilja || !nov.trim()} className="p-2 text-[#c9a84c] disabled:opacity-40">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

interface Props {
  title?: string
  lastnikUserId?: string | null
  showAddPost?: boolean
  showModeracija?: boolean
}

export default function FeedObjave({
  title = 'Objave',
  lastnikUserId = null,
  showAddPost = false,
  showModeracija = false,
}: Props) {
  const { user } = useAuth()
  const [objave, setObjave] = useState<Objava[]>([])
  const [nalaga, setNalaga] = useState(true)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [mojiLikes, setMojiLikes] = useState<Set<string>>(new Set())
  const [komentarCounts, setKomentarCounts] = useState<Record<string, number>>({})
  const [odprtiKomentarji, setOdprtiKomentarji] = useState<Set<string>>(new Set())
  const [dovoljenoTuje, setDovoljenoTuje] = useState(true)

  const [tip, setTip] = useState<TipObjave>('objava')
  const [vsebina, setVsebina] = useState('')
  const [lokacija, setLokacija] = useState('')
  const [plovilo, setPlovilo] = useState('')
  const [slike, setSlike] = useState<string[]>([])
  const [nalagaSlike, setNalagaSlike] = useState(false)
  const [slikeNapaka, setSlikeNapaka] = useState('')
  const datotekeRef = useRef<HTMLInputElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [posilja, setPosilja] = useState(false)
  const [filter, setFilter] = useState<'vse' | 'moje' | 'caka'>('vse')
  const [isModerator, setIsModerator] = useState(false)

  const jeLastnik = !!user && !!lastnikUserId && user.id === lastnikUserId

  useEffect(() => {
    ;(async () => {
      if (!user) { setIsModerator(false); return }
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('is_moderator').eq('id', user.id).maybeSingle()
      setIsModerator(!!data?.is_moderator)
    })()
  }, [user])

  const nalozi = useCallback(async () => {
    if (!lastnikUserId) { setNalaga(false); return }
    setNalaga(true)
    const supabase = createClient()

    const { data: objavaData } = await supabase.from('objave').select('*').eq('lastnik_user_id', lastnikUserId).order('created_at', { ascending: false })
    const seznam = objavaData ?? []
    setObjave(seznam)

    if (!jeLastnik) {
      const { data: profil } = await supabase.from('public_profiles').select('dovoli_tuje_objave').eq('id', lastnikUserId).maybeSingle()
      setDovoljenoTuje(profil?.dovoli_tuje_objave ?? true)
    }

    const ids = seznam.map(o => o.id)
    if (ids.length > 0) {
      const { data: likes } = await supabase.from('objava_likes').select('objava_id, user_id').in('objava_id', ids)
      const counts: Record<string, number> = {}
      const moji = new Set<string>()
      likes?.forEach(l => {
        counts[l.objava_id] = (counts[l.objava_id] ?? 0) + 1
        if (user && l.user_id === user.id) moji.add(l.objava_id)
      })
      setLikeCounts(counts)
      setMojiLikes(moji)

      const { data: komentarji } = await supabase.from('objava_komentarji').select('objava_id').in('objava_id', ids)
      const kCounts: Record<string, number> = {}
      komentarji?.forEach(k => { kCounts[k.objava_id] = (kCounts[k.objava_id] ?? 0) + 1 })
      setKomentarCounts(kCounts)
    } else {
      setLikeCounts({})
      setMojiLikes(new Set())
      setKomentarCounts({})
    }

    setNalaga(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastnikUserId, jeLastnik, user?.id])

  useEffect(() => {
    ;(async () => { await nalozi() })()
  }, [nalozi])

  const odobrene = objave.filter(o => o.odobrena)
  const cakajo = objave.filter(o => !o.odobrena)

  const prikazane = showModeracija
    ? (filter === 'caka' ? cakajo : filter === 'moje' ? objave.filter(o => o.avtor_user_id === user?.id) : odobrene)
    : odobrene

  async function naloziSlike(e: React.ChangeEvent<HTMLInputElement>) {
    const datoteke = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (datoteke.length === 0 || !user) return
    setSlikeNapaka('')

    if (slike.length + datoteke.length > MAX_SLIK_OBJAVA) {
      setSlikeNapaka(`Največ ${MAX_SLIK_OBJAVA} slik na objavo.`)
      return
    }

    setNalagaSlike(true)
    const supabase = createClient()
    const nove: string[] = []
    for (const datoteka of datoteke) {
      if (!datoteka.type.startsWith('image/')) { setSlikeNapaka(`"${datoteka.name}" ni slikovna datoteka.`); continue }
      if (datoteka.size > MAX_SLIKA_MB * 1024 * 1024) { setSlikeNapaka(`Slika "${datoteka.name}" presega ${MAX_SLIKA_MB} MB.`); continue }
      const pot = `${user.id}/${crypto.randomUUID()}-${datoteka.name}`
      const { error: uploadError } = await supabase.storage.from('objave-slike').upload(pot, datoteka)
      if (uploadError) { setSlikeNapaka('Napaka pri nalaganju slike: ' + uploadError.message); continue }
      const { data } = supabase.storage.from('objave-slike').getPublicUrl(pot)
      nove.push(data.publicUrl)
    }
    setSlike(prev => [...prev, ...nove])
    setNalagaSlike(false)
  }

  function odstraniSliko(url: string) {
    setSlike(prev => prev.filter(s => s !== url))
  }

  async function addPost() {
    if (!vsebina.trim() || !user || !lastnikUserId) return
    setPosilja(true)
    const supabase = createClient()
    const odobrena = jeLastnik || dovoljenoTuje === false ? true : undefined
    const { error } = await supabase.from('objave').insert({
      lastnik_user_id: lastnikUserId,
      avtor_user_id: user.id,
      avtor_ime: user.user_metadata?.ime ?? user.email ?? 'Uporabnik',
      avtor_vloga: (user.user_metadata?.vloga as string | undefined) ?? null,
      tip,
      vsebina: vsebina.trim(),
      lokacija: lokacija || null,
      plovilo: plovilo || null,
      slike,
      odobrena: jeLastnik ? true : odobrena ?? false,
    })
    setPosilja(false)
    if (!error) {
      setVsebina(''); setLokacija(''); setPlovilo(''); setSlike([]); setSlikeNapaka('')
      setShowForm(false)
      nalozi()
    }
  }

  async function odobri(id: string) {
    const supabase = createClient()
    await supabase.from('objave').update({ odobrena: true }).eq('id', id)
    nalozi()
  }

  async function zavrni(id: string) {
    const supabase = createClient()
    await supabase.from('objave').delete().eq('id', id)
    nalozi()
  }

  async function izbrisiObjavo(id: string) {
    if (!confirm('Izbrišete to objavo? Tega ni mogoče razveljaviti.')) return
    const supabase = createClient()
    await supabase.from('objave').delete().eq('id', id)
    nalozi()
  }

  async function preklopiLike(objavaId: string, trenutno: boolean) {
    if (!user) return
    setMojiLikes(prev => {
      const s = new Set(prev)
      if (trenutno) s.delete(objavaId)
      else s.add(objavaId)
      return s
    })
    setLikeCounts(prev => ({ ...prev, [objavaId]: (prev[objavaId] ?? 0) + (trenutno ? -1 : 1) }))
    const supabase = createClient()
    if (trenutno) {
      await supabase.from('objava_likes').delete().eq('objava_id', objavaId).eq('user_id', user.id)
    } else {
      await supabase.from('objava_likes').insert({ objava_id: objavaId, user_id: user.id })
    }
  }

  function toggleKomentarji(id: string) {
    setOdprtiKomentarji(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const lahkoObjavi = !!user && !!lastnikUserId && (jeLastnik || dovoljenoTuje)

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
          {showAddPost && lahkoObjavi && (
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] text-xs font-semibold rounded-full transition-all hover:scale-105">
              <ImageIcon className="w-3.5 h-3.5" /> Dodaj objavo
            </button>
          )}
        </div>
      </div>

      {!lastnikUserId && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center mb-6">
          <p className="text-gray-400 text-sm">Feed za ta profil trenutno ni na voljo.</p>
        </div>
      )}

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
                    <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-[#0c2340]">{o.avtor_ime[0]}</div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{o.avtor_ime}</p>
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
      {showForm && showAddPost && lahkoObjavi && (
        <div className="bg-white rounded-2xl border border-[#c9a84c]/30 shadow-sm p-5 mb-5">
          {/* Tip selector */}
          <div className="flex gap-2 mb-4">
            {[
              { v: 'objava' as TipObjave, label: '📢 Objava' },
              { v: 'potovanje' as TipObjave, label: '⛵ Potovanje' },
            ].map(({ v, label }) => (
              <button key={v} type="button" onClick={() => setTip(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tip === v ? 'bg-[#0c2340] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0c2340] font-bold text-sm shrink-0">
              {(user?.user_metadata?.ime ?? 'J')[0]}
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

          {/* Slike */}
          <div className="ml-12 mb-3">
            {slike.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {slike.map(url => (
                  <div key={url} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => odstraniSliko(url)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => datotekeRef.current?.click()}
              disabled={nalagaSlike || slike.length >= MAX_SLIK_OBJAVA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-[#c9a84c] hover:text-[#0c2340] transition-colors disabled:opacity-40"
            >
              {nalagaSlike ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              Dodaj slike ({slike.length}/{MAX_SLIK_OBJAVA})
            </button>
            <input ref={datotekeRef} type="file" accept="image/*" multiple onChange={naloziSlike} className="hidden" />
            {slikeNapaka && <p className="text-xs text-red-500 mt-1.5">{slikeNapaka}</p>}
          </div>

          {!jeLastnik && dovoljenoTuje && (
            <p className="text-xs text-gray-400 ml-12 mb-3">Vaša objava bo vidna po odobritvi lastnika profila.</p>
          )}

          <div className="flex items-center justify-between ml-12">
            <span className="text-xs text-gray-300">&nbsp;</span>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">Prekliči</button>
              <button onClick={addPost} disabled={!vsebina.trim() || posilja || nalagaSlike}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] disabled:opacity-40 text-[#0c2340] text-xs font-semibold rounded-full transition-all">
                <Send className="w-3.5 h-3.5" /> {posilja ? 'Objavljam...' : 'Objavi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      {filter !== 'caka' && (
        <div className="space-y-4">
          {nalaga ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-gray-400 text-sm">Nalagam objave...</p>
            </div>
          ) : prikazane.length === 0 ? (
            lastnikUserId && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Še ni objav</p>
              </div>
            )
          ) : (
            prikazane.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340]/8 flex items-center justify-center text-lg shrink-0">{o.avtor_ime[0]}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#0c2340] text-sm">{o.avtor_ime}</p>
                        {o.avtor_vloga && (
                          <span className="text-xs px-1.5 py-0.5 bg-[#0c2340]/8 text-[#0c2340] rounded-full capitalize">{o.avtor_vloga}</span>
                        )}
                        {o.tip === 'potovanje' && (
                          <span className="text-xs px-1.5 py-0.5 bg-[#c9a84c]/15 text-[#9a7a2e] rounded-full">⛵ Potovanje</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {isModerator && (
                    <button
                      onClick={() => izbrisiObjavo(o.id)}
                      title="Izbriši objavo (moderator)"
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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

                {o.slike && o.slike.length > 0 && (
                  <div className={`grid gap-1.5 mb-4 rounded-xl overflow-hidden ${o.slike.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {o.slike.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt="" className="w-full h-48 object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-5 pt-3 border-t border-gray-50">
                  <LikeButton
                    objavaId={o.id}
                    stevilo={likeCounts[o.id] ?? 0}
                    jazLajkam={mojiLikes.has(o.id)}
                    onToggle={preklopiLike}
                  />
                  <button onClick={() => toggleKomentarji(o.id)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0c2340] transition-colors">
                    <MessageCircle className="w-4 h-4" /> {komentarCounts[o.id] ?? 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors ml-auto">
                    <Share2 className="w-4 h-4" /> Deli
                  </button>
                </div>

                {odprtiKomentarji.has(o.id) && <KomentarjiPanel objavaId={o.id} isModerator={isModerator} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

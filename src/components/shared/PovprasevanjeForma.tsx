'use client'

import { useState, useTransition } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { oddajPovprasevanje, type PovprasevanjeInput } from '@/app/actions/povprasevanje'

type Props = {
  tip: PovprasevanjeInput['tip']
  targetId: string
}

export default function PovprasevanjeForma({ tip, targetId }: Props) {
  const [forma, setForma] = useState({ ime: '', email: '', telefon: '', termin: '', sporocilo: '', gdpr: false })
  const [stanje, setStanje] = useState<'idle' | 'poslano' | 'napaka'>('idle')
  const [napakaSporocilo, setNapakaSporocilo] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForma(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forma.gdpr) return

    startTransition(async () => {
      const rezultat = await oddajPovprasevanje({
        tip,
        target_id: targetId,
        ime: forma.ime,
        email: forma.email,
        telefon: forma.telefon,
        termin: forma.termin,
        sporocilo: forma.sporocilo,
      })

      if (rezultat.uspeh) {
        setStanje('poslano')
      } else {
        setNapakaSporocilo(rezultat.napaka ?? 'Napaka pri pošiljanju.')
        setStanje('napaka')
      }
    })
  }

  if (stanje === 'poslano') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="font-semibold text-[#0c2340] text-sm">Povpraševanje poslano!</p>
        <p className="text-xs text-gray-500">Odgovorili vam bomo v 24 urah.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {stanje === 'napaka' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {napakaSporocilo}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#0c2340] mb-1.5">Vaše ime *</label>
        <input
          required name="ime" value={forma.ime} onChange={handleChange}
          placeholder="Janez Novak"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c2340] mb-1.5">E-mail *</label>
        <input
          required type="email" name="email" value={forma.email} onChange={handleChange}
          placeholder="ime@primer.si"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c2340] mb-1.5">Telefon</label>
        <input
          type="tel" name="telefon" value={forma.telefon} onChange={handleChange}
          placeholder="+386 40 123 456"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c2340] mb-1.5">Želen termin</label>
        <input
          type="text" name="termin" value={forma.termin} onChange={handleChange}
          placeholder="npr. julij 2025, teden"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0c2340] mb-1.5">Sporočilo *</label>
        <textarea
          required rows={3} name="sporocilo" value={forma.sporocilo} onChange={handleChange}
          placeholder="Zanima me najem plovila za..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
        />
      </div>

      <div className="flex items-start gap-2.5">
        <input
          required type="checkbox" id={`gdpr-${targetId}`} name="gdpr"
          checked={forma.gdpr} onChange={handleChange}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#c9a84c] cursor-pointer shrink-0"
        />
        <label htmlFor={`gdpr-${targetId}`} className="text-xs text-gray-500 cursor-pointer leading-relaxed">
          Strinjam se z obdelavo osebnih podatkov v skladu z{' '}
          <a href="/zasebnost" className="text-[#c9a84c] underline hover:no-underline">Politiko zasebnosti</a>.
          Podatki bodo uporabljeni izključno za namene odgovora na povpraševanje. *
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending || !forma.gdpr}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] font-semibold text-sm rounded-full transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Send className="w-4 h-4" />
        {isPending ? 'Pošiljanje...' : 'Pošlji povpraševanje'}
      </button>
    </form>
  )
}

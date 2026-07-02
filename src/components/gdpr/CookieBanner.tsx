'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const COOKIE_KEY = 'garbin_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false })

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) setVisible(true)
  }, [])

  function accept(type: 'all' | 'necessary' | 'custom') {
    const consent = {
      all: { necessary: true, analytics: true, marketing: true },
      necessary: { necessary: true, analytics: false, marketing: false },
      custom: { necessary: true, ...prefs },
    }[type]
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-[#0c2340] border border-[#c9a84c]/30 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-white text-sm">Piškotki in zasebnost</h3>
                  <button onClick={() => accept('necessary')} className="text-white/40 hover:text-white/70 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Uporabljamo piškotke za boljšo uporabniško izkušnjo, analitiko in personalizirane vsebine.
                  Preberite našo{' '}
                  <Link href="/" className="text-[#c9a84c] hover:underline">politiko zasebnosti</Link>{' '}
                  in{' '}
                  <Link href="/" className="text-[#c9a84c] hover:underline">politiko piškotkov</Link>.
                </p>

                {showSettings && (
                  <div className="mb-4 bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-medium">Nujni piškotki</p>
                        <p className="text-white/40 text-xs">Potrebni za delovanje strani</p>
                      </div>
                      <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-not-allowed opacity-60">
                        <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-medium">Analitični piškotki</p>
                        <p className="text-white/40 text-xs">Google Analytics — statistike obiskov</p>
                      </div>
                      <button
                        onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                        className={`w-9 h-5 rounded-full relative transition-colors ${prefs.analytics ? 'bg-[#c9a84c]' : 'bg-white/20'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${prefs.analytics ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-medium">Marketinški piškotki</p>
                        <p className="text-white/40 text-xs">Meta Pixel — oglasi</p>
                      </div>
                      <button
                        onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                        className={`w-9 h-5 rounded-full relative transition-colors ${prefs.marketing ? 'bg-[#c9a84c]' : 'bg-white/20'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${prefs.marketing ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => accept('all')}
                    className="px-4 py-2 bg-[#c9a84c] hover:bg-[#e8c76d] text-[#0c2340] text-xs font-semibold rounded-full transition-all hover:scale-105"
                  >
                    Sprejmi vse
                  </button>
                  <button
                    onClick={() => accept('necessary')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-all border border-white/20"
                  >
                    Samo nujni
                  </button>
                  <button
                    onClick={() => showSettings ? accept('custom') : setShowSettings(true)}
                    className="flex items-center gap-1 px-4 py-2 text-white/60 hover:text-white text-xs font-medium transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    {showSettings ? 'Shrani nastavitve' : 'Nastavitve'}
                    {!showSettings && <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

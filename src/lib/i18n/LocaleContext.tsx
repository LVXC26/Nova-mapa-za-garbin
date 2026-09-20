'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { prevodi } from './prevodi'

export type Locale = 'sl' | 'en'

const SHRANJEN_KLJUC = 'garbin_locale'

interface LocaleCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  // t() sprejme IZVIRNO slovensko besedilo — v "sl" ga vrne nespremenjeno, v
  // "en" poišče prevod v prevodi.ts. Ce prevod (se) ne obstaja, se prikaze
  // slovenski izvirnik namesto praznega niza — stran ostane uporabna tudi
  // za dele, ki jih se nismo prevedli.
  t: (izvirnik: string) => string
}

const LocaleContext = createContext<LocaleCtx>({
  locale: 'sl',
  setLocale: () => {},
  t: (s: string) => s,
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('sl')

  useEffect(() => {
    try {
      const shranjen = localStorage.getItem(SHRANJEN_KLJUC)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage ni na voljo med SSR
      if (shranjen === 'en') setLocaleState('en')
    } catch {
      // localStorage lahko vrze (zaseben nacin ipd.) — privzeto ostane 'sl'
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try { localStorage.setItem(SHRANJEN_KLJUC, l) } catch {}
  }, [])

  const t = useCallback((izvirnik: string) => {
    if (locale === 'sl') return izvirnik
    return prevodi[izvirnik] ?? izvirnik
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

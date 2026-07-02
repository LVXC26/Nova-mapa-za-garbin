'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { Plovilo } from '@/types/database'

interface PrimerjaContextType {
  primerjava: Plovilo[]
  dodajVPrimerjavo: (plovilo: Plovilo) => void
  odstraniIzPrimerjave: (id: string) => void
  jePrimerjavno: (id: string) => boolean
  pocistiPrimerjavo: () => void
}

const PrimerjaContext = createContext<PrimerjaContextType>({
  primerjava: [],
  dodajVPrimerjavo: () => {},
  odstraniIzPrimerjave: () => {},
  jePrimerjavno: () => false,
  pocistiPrimerjavo: () => {},
})

export function PrimerjaProvider({ children }: { children: React.ReactNode }) {
  const [primerjava, setPrimerjava] = useState<Plovilo[]>([])

  const dodajVPrimerjavo = useCallback((plovilo: Plovilo) => {
    setPrimerjava(prev => {
      if (prev.length >= 3 || prev.some(p => p.id === plovilo.id)) return prev
      return [...prev, plovilo]
    })
  }, [])

  const odstraniIzPrimerjave = useCallback((id: string) => {
    setPrimerjava(prev => prev.filter(p => p.id !== id))
  }, [])

  const jePrimerjavno = useCallback((id: string) => {
    return primerjava.some(p => p.id === id)
  }, [primerjava])

  const pocistiPrimerjavo = useCallback(() => setPrimerjava([]), [])

  return (
    <PrimerjaContext.Provider value={{ primerjava, dodajVPrimerjavo, odstraniIzPrimerjave, jePrimerjavno, pocistiPrimerjavo }}>
      {children}
    </PrimerjaContext.Provider>
  )
}

export function usePrimerjava() {
  return useContext(PrimerjaContext)
}

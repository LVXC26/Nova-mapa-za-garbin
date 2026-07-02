'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'

export type Vloga = 'prodajalec' | 'charter' | 'skipper' | 'kupec' | 'oba'

type AuthContextType = {
  user: User | null
  loading: boolean
  vloga: Vloga | null
  demoMode: boolean
  prijavaDemo: (vloga: Vloga) => void
  odjavaDemo: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  vloga: null,
  demoMode: false,
  prijavaDemo: () => {},
  odjavaDemo: () => {},
})

const DEMO_KEY = 'garbin_demo_user'

const demoUsers: Record<Vloga, { ime: string; email: string }> = {
  charter: { ime: 'Adriatic Sail d.o.o.', email: 'info@adriaticsail.si' },
  skipper: { ime: 'Marko Horvat', email: 'marko.horvat@garbin.si' },
  prodajalec: { ime: 'Janez Novak', email: 'janez.novak@gmail.com' },
  kupec: { ime: 'Ana Kovač', email: 'ana.kovac@gmail.com' },
  oba: { ime: 'Peter Marinič', email: 'peter@maritim.si' },
}

function createMockUser(vloga: Vloga): User {
  const info = demoUsers[vloga]
  return {
    id: `demo-${vloga}`,
    aud: 'authenticated',
    role: 'authenticated',
    email: info.email,
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_metadata: { vloga, ime: info.ime },
    app_metadata: {},
    identities: [],
  } as unknown as User
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Check for demo user in localStorage first
    const saved = localStorage.getItem(DEMO_KEY)
    if (saved) {
      const demo = JSON.parse(saved) as Vloga
      setUser(createMockUser(demo))
      setDemoMode(true)
      return
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })
      return () => subscription.unsubscribe()
    })
  }, [])

  const prijavaDemo = useCallback((vloga: Vloga) => {
    localStorage.setItem(DEMO_KEY, JSON.stringify(vloga))
    setUser(createMockUser(vloga))
    setDemoMode(true)
  }, [])

  const odjavaDemo = useCallback(() => {
    localStorage.removeItem(DEMO_KEY)
    setUser(null)
    setDemoMode(false)
  }, [])

  const vloga = (user?.user_metadata?.vloga ?? null) as Vloga | null

  return (
    <AuthContext.Provider value={{ user, loading, vloga, demoMode, prijavaDemo, odjavaDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

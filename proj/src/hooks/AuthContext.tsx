import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type AuthProfile = {
  id: string
  name: string
  role: 'cliente' | 'psicologo'
  avatarUrl: string | null
}

type AuthState = {
  session: Session | null
  profile: AuthProfile | null
  loading: boolean
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

async function loadProfile(userId: string): Promise<AuthProfile | null> {
  const { data } = await supabase
    .from('perfis')
    .select('id, nome, tipo_usuario, foto_url')
    .eq('id', userId)
    .maybeSingle()
  if (!data) return null
  return { id: data.id, name: data.nome, role: data.tipo_usuario, avatarUrl: data.foto_url }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const { data: { user } } = await supabase.auth.getUser()
    setProfile(user ? await loadProfile(user.id) : null)
  }

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      setSession(session)
      setProfile(session?.user ? await loadProfile(session.user.id) : null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!active) return
      setSession(next)
      setProfile(next?.user ? await loadProfile(next.user.id) : null)
    })

    const onProfileUpdated = () => { refresh() }
    window.addEventListener('vinculo:profile-updated', onProfileUpdated)

    return () => {
      active = false
      subscription.unsubscribe()
      window.removeEventListener('vinculo:profile-updated', onProfileUpdated)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, profile, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  return context
}

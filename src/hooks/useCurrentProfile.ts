import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type CurrentProfile = {
  id: string
  name: string
  role: 'cliente' | 'psicologo'
  avatarUrl: string | null
}

export function useCurrentProfile() {
  const [profile, setProfile] = useState<CurrentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('perfis')
      .select('id, nome, tipo_usuario, foto_url')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !data) {
      setProfile(null)
      setLoading(false)
      return
    }

    setProfile({
      id: data.id,
      name: data.nome,
      role: data.tipo_usuario,
      avatarUrl: data.foto_url,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true

    const safeLoad = async () => {
      if (!active) return
      await load()
    }

    safeLoad()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      safeLoad()
    })

    window.addEventListener('vinculo:profile-updated', safeLoad)

    return () => {
      active = false
      subscription.unsubscribe()
      window.removeEventListener('vinculo:profile-updated', safeLoad)
    }
  }, [load])

  return profile
}

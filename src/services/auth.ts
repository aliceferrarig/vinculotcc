import { supabase } from '../lib/supabase'

export type UserRole = 'cliente' | 'psicologo'

type SignUpInput = {
  name: string
  email: string
  password: string
  role: UserRole
  crp?: string
  crpState?: string
  specialties?: string[]
  modality?: 'online' | 'presencial' | 'ambos'
  price?: number
  bio?: string
}

export async function signUp(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        nome: input.name,
        tipo_usuario: input.role,
        crp: input.crp,
        estado_crp: input.crpState,
        especialidades: input.specialties ?? [],
        modalidade: input.modality ?? 'online',
        valor_consulta: input.price ?? 0,
        biografia: input.bio ?? '',
      },
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  const { data: profile, error: profileError } = await supabase
    .from('perfis')
    .select('tipo_usuario')
    .eq('id', data.user.id)
    .single()

  if (profileError) throw profileError
  return { ...data, role: profile.tipo_usuario as UserRole }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

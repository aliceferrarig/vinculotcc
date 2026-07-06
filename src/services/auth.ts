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
      emailRedirectTo: `${window.location.origin}/entrar`,
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
  const normalizedEmail=email.trim().toLowerCase()
  const { data, error } = await supabase.auth.signInWithPassword({ email:normalizedEmail, password })
  if (error) throw error

  let { data: profile, error: profileError } = await supabase
    .from('perfis')
    .select('tipo_usuario, foto_url')
    .eq('id', data.user.id)
    .maybeSingle()

  if(profileError)throw new Error(`A autenticação funcionou, mas o perfil não pôde ser carregado: ${profileError.message}`)
  if(!profile){
    const {error:repairError}=await supabase.rpc('garantir_meu_perfil')
    if(repairError)throw new Error('A conta existe no Auth, mas seu perfil não existe no banco. Execute o arquivo corrigir-login-perfis.sql no Supabase.')
    const retry=await supabase.from('perfis').select('tipo_usuario, foto_url').eq('id',data.user.id).single()
    profile=retry.data;profileError=retry.error
  }

  if(profileError||!profile)throw new Error('Não foi possível recuperar o perfil desta conta.')
  return { ...data, role: profile.tipo_usuario as UserRole, avatarUrl: profile.foto_url as string|null }
}

export async function requestPasswordReset(email:string){
  const normalized=email.trim().toLowerCase()
  if(!normalized)throw new Error('Digite seu e-mail primeiro.')
  const {error}=await supabase.auth.resetPasswordForEmail(normalized,{redirectTo:`${window.location.origin}/entrar`})
  if(error)throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

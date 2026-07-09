import { supabase } from '../lib/supabase'

export type ProfessionalProfile = {
  id: string
  name: string
  avatarUrl: string | null
  crp: string
  crpState: string
  bio: string
  modality: 'online' | 'presencial' | 'ambos'
  price: number
  experience: number
  specialties: string[]
}

async function repairOwnProfile() {
  const { error } = await supabase.rpc('garantir_meu_perfil')
  if (error) throw new Error('Não foi possível sincronizar seu perfil. Rode reset-banco-vinculo.sql no Supabase.')
}

export async function getOwnProfessionalProfile(): Promise<ProfessionalProfile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  await repairOwnProfile()

  const { data, error } = await supabase.from('psicologos').select(`
    id, crp, estado_crp, biografia, modalidade, valor_consulta, anos_experiencia,
    perfis(nome, foto_url),
    psicologo_especialidades(especialidades(nome))
  `).eq('perfil_id', user.id).maybeSingle()

  if (error) throw error
  if (!data) throw new Error('Perfil profissional não encontrado. Rode reset-banco-vinculo.sql no Supabase.')

  const profile = Array.isArray(data.perfis) ? data.perfis[0] : data.perfis
  return {
    id: data.id,
    name: profile?.nome ?? '',
    avatarUrl: profile?.foto_url ?? null,
    crp: data.crp,
    crpState: data.estado_crp,
    bio: data.biografia ?? '',
    modality: data.modalidade,
    price: Number(data.valor_consulta),
    experience: data.anos_experiencia,
    specialties: (data.psicologo_especialidades ?? [])
      .map((item: any) => Array.isArray(item.especialidades) ? item.especialidades[0]?.nome : item.especialidades?.nome)
      .filter(Boolean),
  }
}

export async function saveProfessionalProfile(profile: ProfessionalProfile) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  await repairOwnProfile()

  const { error: profileError } = await supabase
    .from('perfis')
    .update({ nome: profile.name })
    .eq('id', user.id)
  if (profileError) throw profileError

  const { error: psychError } = await supabase.from('psicologos').update({
    crp: profile.crp,
    estado_crp: profile.crpState,
    biografia: profile.bio,
    modalidade: profile.modality,
    valor_consulta: profile.price,
    anos_experiencia: profile.experience,
    perfil_ativo: true,
  }).eq('id', profile.id)
  if (psychError) throw psychError

  const { data: specialties, error: specialtyError } = await supabase
    .from('especialidades')
    .select('id,nome')
    .in('nome', profile.specialties)
  if (specialtyError) throw specialtyError

  const { error: deleteError } = await supabase
    .from('psicologo_especialidades')
    .delete()
    .eq('psicologo_id', profile.id)
  if (deleteError) throw deleteError

  if (specialties?.length) {
    const { error: insertError } = await supabase
      .from('psicologo_especialidades')
      .insert(specialties.map(item => ({ psicologo_id: profile.id, especialidade_id: item.id })))
    if (insertError) throw insertError
  }
}

export async function uploadProfessionalAvatar(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado.')

  await repairOwnProfile()

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${user.id}/perfil-${Date.now()}.${extension}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  const { error: updateError } = await supabase
    .from('perfis')
    .update({ foto_url: data.publicUrl })
    .eq('id', user.id)
  if (updateError) throw updateError

  const { error: publishError } = await supabase
    .from('psicologos')
    .update({ perfil_ativo: true })
    .eq('perfil_id', user.id)
  if (publishError) throw publishError

  return data.publicUrl
}

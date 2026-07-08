import placeholderAvatar from '../assets/avatar-placeholder.svg'
import { supabase } from '../lib/supabase'

type Psychologist = {
  id:string; profileId:string; name:string; crp:string; specialties:string[]; rating:number; reviews:number;
  sessions:number; mode:string; rawMode:'online'|'presencial'|'ambos'; price:number; match:number; image:string; experience:number;
}

type PsychologistRow = {
  id: string
  perfil_id: string
  crp: string
  biografia: string | null
  modalidade: string
  valor_consulta: number
  anos_experiencia: number
  perfis: { nome: string; foto_url: string | null } | { nome: string; foto_url: string | null }[] | null
  psicologo_especialidades: { especialidades: { nome: string } | { nome: string }[] | null }[] | null
  avaliacoes: { nota: number; comentario: string | null }[] | null
  agendamentos: { id: string }[] | null
  favoritos: { cliente_id: string }[] | null
}

export type ListedPsychologist = Psychologist & {
  bio?: string
  popularity: number
  testimonials: string[]
}

const normalizeOne = <T,>(value: T | T[] | null): T | null => Array.isArray(value) ? value[0] ?? null : value

function normalizeMode(value:string): 'online'|'presencial'|'ambos' {
  if(value === 'presencial' || value === 'ambos') return value
  return 'online'
}

function mapPsychologist(row: PsychologistRow): ListedPsychologist {
  const profile = normalizeOne(row.perfis)
  const reviews = row.avaliacoes ?? []
  const specialties = (row.psicologo_especialidades ?? [])
    .map(item => normalizeOne(item.especialidades)?.nome)
    .filter((name): name is string => Boolean(name))
  const rating = reviews.length
    ? reviews.reduce((total, review) => total + review.nota, 0) / reviews.length
    : 0
  const sessions = row.agendamentos?.length ?? 0
  const favorites = row.favoritos?.length ?? 0
  const rawMode = normalizeMode(row.modalidade)

  return {
    id: row.id,
    profileId: row.perfil_id,
    name: profile?.nome ?? 'Profissional sem nome',
    crp: row.crp,
    specialties,
    rating: Number(rating.toFixed(1)),
    reviews: reviews.length,
    sessions,
    mode: rawMode === 'ambos' ? 'Online e presencial' : rawMode === 'presencial' ? 'Presencial' : 'Online',
    rawMode,
    price: Number(row.valor_consulta),
    match: 0,
    image: profile?.foto_url || placeholderAvatar,
    experience: row.anos_experiencia,
    bio: row.biografia ?? undefined,
    popularity: favorites * 3 + sessions + reviews.length * 2,
    testimonials: reviews.map(review => review.comentario).filter((comment): comment is string => Boolean(comment)),
  }
}

const selection = `
  id,
  perfil_id,
  crp,
  biografia,
  modalidade,
  valor_consulta,
  anos_experiencia,
  perfis(nome, foto_url),
  psicologo_especialidades(especialidades(nome)),
  avaliacoes(nota, comentario),
  agendamentos(id),
  favoritos(cliente_id)
`

export async function buscarPsicologos(): Promise<ListedPsychologist[]> {
  const { data, error } = await supabase
    .from('psicologos')
    .select(selection)
    .eq('perfil_ativo', true)

  if (error) throw error

  return ((data ?? []) as unknown as PsychologistRow[])
    .map(mapPsychologist)
    .sort((a, b) => b.popularity - a.popularity)
}

export async function buscarPsicologoPorId(id: string): Promise<ListedPsychologist | null> {
  const { data, error } = await supabase
    .from('psicologos')
    .select(selection)
    .eq('id', id)
    .eq('perfil_ativo', true)
    .maybeSingle()

  if (error) throw error
  return data ? mapPsychologist(data as unknown as PsychologistRow) : null
}

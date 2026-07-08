import { supabase } from '../lib/supabase'
import placeholderAvatar from '../assets/avatar-placeholder.svg'

export type ProfessionalAppointment = {
  id: string
  clientId: string
  clientName: string
  clientImage: string
  date: string
  time: string
  mode: string
  status: string
}

export type ProfessionalReview = {
  id: string
  clientName: string
  rating: number
  comment: string
  createdAt: string
}

export type ProfessionalPatient = {
  id: string
  name: string
  image: string
  sessions: number
}

export type ProfessionalDashboardSummary = {
  psychologistId: string
  views: number | null
  favorites: number
  pendingRequests: number
  currentPlan: string
  planRenewal: string | null
  averageRating: number | null
  responseRate: number | null
  completedAppointments: number
  memberSince: string | null
  profileActive: boolean
  hasPhoto: boolean
  todayAppointments: ProfessionalAppointment[]
  recentRequests: ProfessionalAppointment[]
  recentReviews: ProfessionalReview[]
}

async function ownPsychologistId(){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)throw new Error('Usuário não autenticado.')

  const {data,error}=await supabase
    .from('psicologos')
    .select('id')
    .eq('perfil_id',user.id)
    .single()

  if(error)throw error
  return data.id
}

async function ownPsychologistRecord(){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)throw new Error('Usuário não autenticado.')

  const {data,error}=await supabase
    .from('psicologos')
    .select('id, perfil_ativo, created_at, perfis(foto_url)')
    .eq('perfil_id',user.id)
    .single()

  if(error)throw error
  const profile=Array.isArray(data.perfis)?data.perfis[0]:data.perfis

  return {
    id:data.id,
    active:Boolean(data.perfil_ativo),
    hasPhoto:Boolean(profile?.foto_url),
    createdAt:data.created_at as string | null,
  }
}

function mapAppointment(row:any): ProfessionalAppointment {
  const profile=Array.isArray(row.perfis)?row.perfis[0]:row.perfis
  return {
    id:row.id,
    clientId:row.cliente_id,
    clientName:profile?.nome??'Cliente',
    clientImage:profile?.foto_url||placeholderAvatar,
    date:row.data_consulta,
    time:String(row.hora_inicio).slice(0,5),
    mode:row.modalidade,
    status:row.status,
  }
}

function mapReview(row:any): ProfessionalReview {
  const profile=Array.isArray(row.perfis)?row.perfis[0]:row.perfis
  return {
    id:row.id,
    clientName:profile?.nome??'Cliente',
    rating:row.nota,
    comment:row.comentario??'',
    createdAt:row.created_at,
  }
}

export async function getProfessionalAppointments():Promise<ProfessionalAppointment[]>{
  const psychologistId=await ownPsychologistId()
  const {data,error}=await supabase
    .from('agendamentos')
    .select('id,cliente_id,data_consulta,hora_inicio,modalidade,status,perfis!agendamentos_cliente_id_fkey(nome,foto_url)')
    .eq('psicologo_id',psychologistId)
    .order('data_consulta')
    .order('hora_inicio')

  if(error)throw error
  return (data??[]).map(mapAppointment)
}

export async function updateAppointmentStatus(id:string,status:'confirmado'|'cancelado'|'concluido'){
  const psychologistId=await ownPsychologistId()
  const {error}=await supabase
    .from('agendamentos')
    .update({status})
    .eq('id',id)
    .eq('psicologo_id',psychologistId)

  if(error)throw error
}

export async function getProfessionalPatients():Promise<ProfessionalPatient[]>{
  const rows=await getProfessionalAppointments()
  const map=new Map<string,ProfessionalPatient>()
  rows.filter(row=>row.status==='confirmado'||row.status==='concluido').forEach(row=>{
    const old=map.get(row.clientId)
    map.set(row.clientId,{id:row.clientId,name:row.clientName,image:row.clientImage,sessions:(old?.sessions??0)+1})
  })
  return [...map.values()]
}

export async function getProfessionalReviews():Promise<ProfessionalReview[]>{
  const psychologistId=await ownPsychologistId()
  const {data,error}=await supabase
    .from('avaliacoes')
    .select('id,nota,comentario,created_at,perfis!avaliacoes_cliente_id_fkey(nome)')
    .eq('psicologo_id',psychologistId)
    .order('created_at',{ascending:false})

  if(error)throw error
  return (data??[]).map(mapReview)
}

export async function getProfessionalDashboardSummary():Promise<ProfessionalDashboardSummary>{
  const psychologist=await ownPsychologistRecord()
  const psychologistId=psychologist.id
  const today=new Date().toISOString().slice(0,10)

  const [appointmentsResult,favoritesResult,reviewsResult,subscriptionResult]=await Promise.all([
    supabase
      .from('agendamentos')
      .select('id,cliente_id,data_consulta,hora_inicio,modalidade,status,perfis!agendamentos_cliente_id_fkey(nome,foto_url)')
      .eq('psicologo_id',psychologistId)
      .order('data_consulta',{ascending:true})
      .order('hora_inicio',{ascending:true}),
    supabase
      .from('favoritos')
      .select('cliente_id',{count:'exact',head:true})
      .eq('psicologo_id',psychologistId),
    supabase
      .from('avaliacoes')
      .select('id,nota,comentario,created_at,perfis!avaliacoes_cliente_id_fkey(nome)')
      .eq('psicologo_id',psychologistId)
      .order('created_at',{ascending:false}),
    supabase
      .from('assinaturas')
      .select('status,data_renovacao,planos(nome)')
      .eq('psicologo_id',psychologistId)
      .order('created_at',{ascending:false})
      .limit(1)
      .maybeSingle(),
  ])

  if(appointmentsResult.error)throw appointmentsResult.error
  if(favoritesResult.error)throw favoritesResult.error
  if(reviewsResult.error)throw reviewsResult.error
  if(subscriptionResult.error)throw subscriptionResult.error

  const appointments=(appointmentsResult.data??[]).map(mapAppointment)
  const reviews=(reviewsResult.data??[]).map(mapReview)
  const pendingRequests=appointments.filter(item=>item.status==='pendente')
  const completedAppointments=appointments.filter(item=>item.status==='concluido').length
  const answeredRequests=appointments.filter(item=>item.status!=='pendente').length
  const responseRate=appointments.length?Math.round((answeredRequests/appointments.length)*100):null
  const averageRating=reviews.length?Number((reviews.reduce((total,review)=>total+review.rating,0)/reviews.length).toFixed(1)):null
  const subscription=subscriptionResult.data as any
  const plan=Array.isArray(subscription?.planos)?subscription.planos[0]:subscription?.planos

  return {
    psychologistId,
    views:null,
    favorites:favoritesResult.count??0,
    pendingRequests:pendingRequests.length,
    currentPlan:plan?.nome??'Sem plano',
    planRenewal:subscription?.data_renovacao??null,
    averageRating,
    responseRate,
    completedAppointments,
    memberSince:psychologist.createdAt,
    profileActive:psychologist.active,
    hasPhoto:psychologist.hasPhoto,
    todayAppointments:appointments.filter(item=>item.date===today),
    recentRequests:pendingRequests.slice(0,5),
    recentReviews:reviews.slice(0,4),
  }
}

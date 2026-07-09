import { supabase } from '../lib/supabase'
import placeholderAvatar from '../assets/avatar-placeholder.svg'

export type ProfessionalAppointment={id:string;clientId:string;clientName:string;clientImage:string;date:string;time:string;mode:string;status:string}

async function ownPsychologistId(){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)throw new Error('Usuário não autenticado.')
  const {data,error}=await supabase.from('psicologos').select('id').eq('perfil_id',user.id).single()
  if(error)throw error
  return data.id
}

export async function getProfessionalAppointments():Promise<ProfessionalAppointment[]>{
  const psychologistId=await ownPsychologistId()
  const {data,error}=await supabase.from('agendamentos').select('id,cliente_id,data_consulta,hora_inicio,modalidade,status,perfis!agendamentos_cliente_id_fkey(nome,foto_url)').eq('psicologo_id',psychologistId).order('data_consulta').order('hora_inicio')
  if(error)throw error
  return (data??[]).map((row:any)=>{const profile=Array.isArray(row.perfis)?row.perfis[0]:row.perfis;return{id:row.id,clientId:row.cliente_id,clientName:profile?.nome??'Cliente',clientImage:profile?.foto_url||placeholderAvatar,date:row.data_consulta,time:String(row.hora_inicio).slice(0,5),mode:row.modalidade,status:row.status}})
}

export async function updateAppointmentStatus(id:string,status:'confirmado'|'cancelado'|'concluido'){
  const psychologistId=await ownPsychologistId()
  const {error}=await supabase.from('agendamentos').update({status}).eq('id',id).eq('psicologo_id',psychologistId)
  if(error)throw error
}

export type ProfessionalPatient={id:string;name:string;image:string;sessions:number}
export async function getProfessionalPatients():Promise<ProfessionalPatient[]>{
  const rows=await getProfessionalAppointments();const map=new Map<string,ProfessionalPatient>()
  rows.filter(row=>row.status==='confirmado'||row.status==='concluido').forEach(row=>{const old=map.get(row.clientId);map.set(row.clientId,{id:row.clientId,name:row.clientName,image:row.clientImage,sessions:(old?.sessions??0)+1})})
  return [...map.values()]
}

export type ProfessionalReview={id:string;clientName:string;rating:number;comment:string;createdAt:string}
export async function getProfessionalReviews():Promise<ProfessionalReview[]>{
  const psychologistId=await ownPsychologistId()
  const {data,error}=await supabase.from('avaliacoes').select('id,nota,comentario,created_at,perfis!avaliacoes_cliente_id_fkey(nome)').eq('psicologo_id',psychologistId).order('created_at',{ascending:false})
  if(error)throw error
  return (data??[]).map((row:any)=>{const profile=Array.isArray(row.perfis)?row.perfis[0]:row.perfis;return{id:row.id,clientName:profile?.nome??'Cliente',rating:row.nota,comment:row.comentario??'',createdAt:row.created_at}})
}

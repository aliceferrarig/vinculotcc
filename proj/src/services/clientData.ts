import { supabase } from '../lib/supabase'
import { buscarPsicologos, type ListedPsychologist } from './psychologists'
import placeholderAvatar from '../assets/avatar-placeholder.svg'

async function currentUserId(){const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Usuário não autenticado.');return user.id}

export async function toggleFavorite(psychologistId:string){
  const userId=await currentUserId()
  const {data}=await supabase.from('favoritos').select('psicologo_id').eq('cliente_id',userId).eq('psicologo_id',psychologistId).maybeSingle()
  if(data){const {error}=await supabase.from('favoritos').delete().eq('cliente_id',userId).eq('psicologo_id',psychologistId);if(error)throw error;return false}
  const {error}=await supabase.from('favoritos').insert({cliente_id:userId,psicologo_id:psychologistId});if(error)throw error;return true
}

export async function getFavorites():Promise<ListedPsychologist[]>{
  const userId=await currentUserId()
  const {data,error}=await supabase.from('favoritos').select('psicologo_id').eq('cliente_id',userId)
  if(error)throw error
  const ids=new Set((data??[]).map(item=>item.psicologo_id))
  return (await buscarPsicologos()).filter(item=>ids.has(item.id))
}

export type ClientAppointment={id:string;date:string;time:string;mode:string;status:string;reviewed:boolean;psychologist:{id:string;name:string;image:string}}
export async function getClientAppointments():Promise<ClientAppointment[]>{
  const userId=await currentUserId()
  const {data,error}=await supabase.from('agendamentos').select(`id,data_consulta,hora_inicio,modalidade,status,psicologos(id,perfis(nome,foto_url)),avaliacoes(id)`).eq('cliente_id',userId).order('data_consulta',{ascending:true})
  if(error)throw error
  return (data??[]).map((row:any)=>{const psych=Array.isArray(row.psicologos)?row.psicologos[0]:row.psicologos;const profile=Array.isArray(psych?.perfis)?psych.perfis[0]:psych?.perfis;return{id:row.id,date:row.data_consulta,time:String(row.hora_inicio).slice(0,5),mode:row.modalidade,status:row.status,reviewed:Boolean(row.avaliacoes?.length),psychologist:{id:psych?.id,name:profile?.nome??'Profissional',image:profile?.foto_url||placeholderAvatar}}})
}

export async function createReview(appointment:ClientAppointment,rating:number,comment:string){
  const userId=await currentUserId();const {error}=await supabase.from('avaliacoes').insert({agendamento_id:appointment.id,cliente_id:userId,psicologo_id:appointment.psychologist.id,nota:rating,comentario:comment.trim()||null});if(error)throw error
}

export async function getClientProfile(){
  const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Usuário não autenticado.')
  const {data,error}=await supabase.from('perfis').select('nome,telefone,data_nascimento,foto_url').eq('id',user.id).single();if(error)throw error
  return{name:data.nome,email:user.email??'',phone:data.telefone??'',birthDate:data.data_nascimento??'',avatarUrl:data.foto_url??''}
}

export async function saveClientProfile(input:{name:string;phone:string;birthDate:string}){
  const userId=await currentUserId();const {error}=await supabase.from('perfis').update({nome:input.name,telefone:input.phone||null,data_nascimento:input.birthDate||null}).eq('id',userId);if(error)throw error
}

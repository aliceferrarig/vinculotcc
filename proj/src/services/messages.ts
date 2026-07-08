import { supabase } from '../lib/supabase'
import placeholderAvatar from '../assets/avatar-placeholder.svg'

export type ConversationContact={id:string;name:string;image:string;lastMessage:string;lastAt:string}
export type ChatMessage={id:string;senderId:string;recipientId:string;content:string;createdAt:string}

async function currentUserId(){const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Usuário não autenticado.');return user.id}

export async function getContact(profileId:string):Promise<ConversationContact>{
  const {data,error}=await supabase.from('perfis').select('id,nome,foto_url').eq('id',profileId).single();if(error)throw error
  return{id:data.id,name:data.nome,image:data.foto_url||placeholderAvatar,lastMessage:'',lastAt:''}
}

export async function getConversationContacts():Promise<ConversationContact[]>{
  const userId=await currentUserId()
  const {data,error}=await supabase.from('mensagens').select('remetente_id,destinatario_id,conteudo,created_at').or(`remetente_id.eq.${userId},destinatario_id.eq.${userId}`).order('created_at',{ascending:false})
  if(error)throw error
  const last=new Map<string,{content:string;at:string}>();for(const row of data??[]){const other=row.remetente_id===userId?row.destinatario_id:row.remetente_id;if(!last.has(other))last.set(other,{content:row.conteudo,at:row.created_at})}
  if(!last.size)return[]
  const {data:profiles,error:profileError}=await supabase.from('perfis').select('id,nome,foto_url').in('id',[...last.keys()]);if(profileError)throw profileError
  return(profiles??[]).map(profile=>({id:profile.id,name:profile.nome,image:profile.foto_url||placeholderAvatar,lastMessage:last.get(profile.id)?.content??'',lastAt:last.get(profile.id)?.at??''})).sort((a,b)=>b.lastAt.localeCompare(a.lastAt))
}

export async function getConversation(otherId:string):Promise<ChatMessage[]>{
  const userId=await currentUserId();const {data,error}=await supabase.from('mensagens').select('id,remetente_id,destinatario_id,conteudo,created_at').or(`and(remetente_id.eq.${userId},destinatario_id.eq.${otherId}),and(remetente_id.eq.${otherId},destinatario_id.eq.${userId})`).order('created_at')
  if(error)throw error
  return(data??[]).map(row=>({id:row.id,senderId:row.remetente_id,recipientId:row.destinatario_id,content:row.conteudo,createdAt:row.created_at}))
}

export async function sendMessage(recipientId:string,content:string){const senderId=await currentUserId();const {error}=await supabase.from('mensagens').insert({remetente_id:senderId,destinatario_id:recipientId,conteudo:content.trim()});if(error)throw error}

export async function getCurrentUserId(){return currentUserId()}

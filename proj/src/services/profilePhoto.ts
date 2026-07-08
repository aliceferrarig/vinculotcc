import { supabase } from '../lib/supabase'

const allowedTypes=['image/jpeg','image/png','image/webp']

export function validateImage(file:File){
  if(!allowedTypes.includes(file.type))throw new Error('Use uma imagem JPG, PNG ou WebP.')
  if(file.size>5*1024*1024)throw new Error('A imagem deve ter no máximo 5 MB.')
}

export async function uploadProfilePhoto(file:File){
  validateImage(file)

  const {data:{user}}=await supabase.auth.getUser()
  if(!user)throw new Error('Usuário não autenticado.')

  const extension=file.name.split('.').pop()?.toLowerCase()||'jpg'
  const path=`${user.id}/perfil-${Date.now()}.${extension}`
  const {error:uploadError}=await supabase.storage.from('avatars').upload(path,file,{upsert:true,contentType:file.type})
  if(uploadError)throw uploadError

  const {data}=supabase.storage.from('avatars').getPublicUrl(path)
  const {error:updateError}=await supabase.from('perfis').update({foto_url:data.publicUrl}).eq('id',user.id)
  if(updateError)throw updateError
  return data.publicUrl
}

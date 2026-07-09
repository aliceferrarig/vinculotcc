import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type CurrentProfile = {
  id: string
  name: string
  role: 'cliente' | 'psicologo'
  avatarUrl: string | null
}

export function useCurrentProfile() {
  const [profile,setProfile]=useState<CurrentProfile|null>(null)

  useEffect(()=>{
    let active=true
    async function load(){
      const {data:{user}}=await supabase.auth.getUser()
      if(!user||!active)return
      const {data}=await supabase.from('perfis').select('id, nome, tipo_usuario, foto_url').eq('id',user.id).maybeSingle()
      if(data&&active)setProfile({id:data.id,name:data.nome,role:data.tipo_usuario,avatarUrl:data.foto_url})
    }
    load()
    window.addEventListener('vinculo:profile-updated',load)
    return()=>{active=false;window.removeEventListener('vinculo:profile-updated',load)}
  },[])

  return profile
}

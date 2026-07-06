import { supabase } from '../lib/supabase'

export async function createAppointment(input:{availabilityId:string;mode:'online'|'presencial'}){
  const {data,error}=await supabase.rpc('criar_agendamento',{
    p_disponibilidade_id:input.availabilityId,
    p_modalidade:input.mode,
  })
  if(error)throw error
  return data
}

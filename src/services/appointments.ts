import { supabase } from '../lib/supabase'

export async function createAppointment(input:{psychologistId:string;date:string;time:string;price:number;mode:'online'|'presencial'}){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)throw new Error('Entre na sua conta para agendar.')
  const [hours,minutes]=input.time.split(':').map(Number)
  const endMinutes=hours*60+minutes+50
  const endTime=`${String(Math.floor(endMinutes/60)).padStart(2,'0')}:${String(endMinutes%60).padStart(2,'0')}`
  const {data,error}=await supabase.from('agendamentos').insert({
    cliente_id:user.id,
    psicologo_id:input.psychologistId,
    data_consulta:input.date,
    hora_inicio:input.time,
    hora_fim:endTime,
    modalidade:input.mode,
    valor:input.price,
    status:'pendente',
  }).select('id').single()
  if(error)throw error
  return data
}

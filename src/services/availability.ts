import { supabase } from '../lib/supabase'

export type AvailabilitySlot={id:string;date:string;time:string;endTime:string;status:string}

function mapSlot(item:any): AvailabilitySlot {
  return {
    id:item.id,
    date:item.data,
    time:String(item.hora_inicio).slice(0,5),
    endTime:String(item.hora_fim).slice(0,5),
    status:item.status,
  }
}

export async function getAvailability(psychologistId:string,date:string):Promise<AvailabilitySlot[]> {
  const {data,error}=await supabase
    .from('disponibilidades')
    .select('id,data,hora_inicio,hora_fim,status')
    .eq('psicologo_id',psychologistId)
    .eq('data',date)
    .order('hora_inicio')

  if(error)throw error
  return (data??[]).map(mapSlot)
}

export async function getUpcomingAvailability(psychologistId:string):Promise<AvailabilitySlot[]> {
  const today=new Date().toISOString().slice(0,10)
  const {data,error}=await supabase
    .from('disponibilidades')
    .select('id,data,hora_inicio,hora_fim,status')
    .eq('psicologo_id',psychologistId)
    .eq('status','disponivel')
    .gte('data',today)
    .order('data')
    .order('hora_inicio')

  if(error)throw error
  return (data??[]).map(mapSlot)
}

export async function getAllOwnAvailability(psychologistId:string):Promise<AvailabilitySlot[]> {
  const today=new Date().toISOString().slice(0,10)
  const {data,error}=await supabase
    .from('disponibilidades')
    .select('id,data,hora_inicio,hora_fim,status')
    .eq('psicologo_id',psychologistId)
    .gte('data',today)
    .order('data')
    .order('hora_inicio')

  if(error)throw error
  return (data??[]).map(mapSlot)
}

export async function addAvailability(psychologistId:string,date:string,time:string){
  const [hours,minutes]=time.split(':').map(Number)
  const end=hours*60+minutes+50
  const endTime=`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`
  const {error}=await supabase.from('disponibilidades').insert({psicologo_id:psychologistId,data:date,hora_inicio:time,hora_fim:endTime,status:'disponivel'})
  if(error)throw error
}

export async function deleteAvailability(id:string){const {error}=await supabase.from('disponibilidades').delete().eq('id',id);if(error)throw error}

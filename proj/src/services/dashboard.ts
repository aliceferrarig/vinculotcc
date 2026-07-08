import { supabase } from '../lib/supabase'

export type DashboardMetrics = {
  favoritos: number
  solicitacoes: number
  pendentes: number
  confirmados: number
  concluidos: number
  media_avaliacoes: number
  total_avaliacoes: number
  membro_desde: string
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data, error } = await supabase.rpc('metricas_psicologo')
  if (error) throw error
  return data as DashboardMetrics
}

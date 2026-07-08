import { supabase } from '../lib/supabase'

export type ScreeningAnswers = {
  prioridade?: string
  tema?: string
  modalidade?: 'online' | 'presencial' | 'tanto_faz'
  preco_max?: number | null
  preferencia?: string
  inicio?: string
}

// Envia as respostas, o banco calcula a compatibilidade e grava as recomendações.
export async function submitScreening(answers: ScreeningAnswers): Promise<string> {
  const { data, error } = await supabase.rpc('registrar_triagem', { p_respostas: answers })
  if (error) throw error
  return data as string
}

export type Recommendation = { psychologistId: string; compatibility: number }

export async function getRecommendations(triagemId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recomendacoes')
    .select('psicologo_id, compatibilidade')
    .eq('triagem_id', triagemId)
    .order('compatibilidade', { ascending: false })
  if (error) throw error
  return (data ?? []).map(row => ({ psychologistId: row.psicologo_id, compatibility: row.compatibilidade }))
}

// Última triagem concluída do cliente, para reabrir os resultados.
export async function getLatestScreening(): Promise<string | null> {
  const { data, error } = await supabase
    .from('triagens')
    .select('id')
    .eq('concluida', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

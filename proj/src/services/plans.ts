import { supabase } from '../lib/supabase'

export type Plan = { id: number; name: string; price: number; features: string[] }
export type Subscription = {
  id: string
  planId: number
  planName: string
  status: string
  startDate: string
  renewalDate: string | null
}

export async function getPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('planos')
    .select('id, nome, preco, recursos')
    .eq('ativo', true)
    .order('preco')
  if (error) throw error
  return (data ?? []).map(row => ({
    id: row.id,
    name: row.nome,
    price: Number(row.preco),
    features: Array.isArray(row.recursos) ? (row.recursos as string[]) : [],
  }))
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('assinaturas')
    .select('id, plano_id, status, data_inicio, data_renovacao, planos(nome)')
    .eq('status', 'ativa')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const plano = Array.isArray(data.planos) ? data.planos[0] : data.planos
  return {
    id: data.id,
    planId: data.plano_id,
    planName: plano?.nome ?? 'Plano',
    status: data.status,
    startDate: data.data_inicio,
    renewalDate: data.data_renovacao,
  }
}

// Assinatura simulada: não há cobrança real, apenas grava no banco.
export async function subscribeToPlan(planId: number): Promise<string> {
  const { data, error } = await supabase.rpc('assinar_plano', { p_plano_id: planId })
  if (error) throw error
  return data as string
}

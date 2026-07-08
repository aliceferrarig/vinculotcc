import { ArrowUpRight, CalendarDays, Crown, Heart, Lightbulb, LoaderCircle, MessageCircle, Star, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, EmptyState } from '../../components/ui'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { getDashboardMetrics, type DashboardMetrics } from '../../services/dashboard'
import { getProfessionalAppointments, getProfessionalReviews, type ProfessionalAppointment, type ProfessionalReview } from '../../services/professionalData'
import { getCurrentSubscription, type Subscription } from '../../services/plans'

const formatDate=(date:string)=>new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR')
const formatRenewal=(date:string|null)=>date?new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR'):'—'

export function Dashboard(){
  const navigate=useNavigate()
  const profile=useCurrentProfile()
  const [metrics,setMetrics]=useState<DashboardMetrics|null>(null)
  const [appointments,setAppointments]=useState<ProfessionalAppointment[]>([])
  const [reviews,setReviews]=useState<ProfessionalReview[]>([])
  const [subscription,setSubscription]=useState<Subscription|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    Promise.all([getDashboardMetrics(),getProfessionalAppointments(),getProfessionalReviews(),getCurrentSubscription()])
      .then(([m,a,r,s])=>{setMetrics(m);setAppointments(a);setReviews(r);setSubscription(s)})
      .catch(()=>setError('Não foi possível carregar o painel.'))
      .finally(()=>setLoading(false))
  },[])

  if(loading)return <div className="grid min-h-80 place-items-center"><LoaderCircle className="animate-spin text-sage-500" size={34}/></div>
  if(error)return <Card className="p-10 text-center"><h1 className="text-xl font-semibold">Não foi possível carregar</h1><p className="mt-2 text-sage-500">{error}</p></Card>

  const today=new Date().toISOString().slice(0,10)
  const pending=appointments.filter(a=>a.status==='pendente')
  const todayAppointments=appointments.filter(a=>a.date===today&&(a.status==='confirmado'||a.status==='pendente'))
  const upcoming=appointments.filter(a=>a.date>=today&&(a.status==='confirmado'||a.status==='pendente'))
  const agendaList=(todayAppointments.length?todayAppointments:upcoming).slice(0,5)

  const metricCards=[
    [Users,'Solicitações',String(metrics?.solicitacoes??0),`${metrics?.pendentes??0} aguardando`],
    [Heart,'Favoritos',String(metrics?.favoritos??0),'clientes salvaram você'],
    [Star,'Avaliação',metrics?.total_avaliacoes?`${metrics.media_avaliacoes}`:'Novo',`${metrics?.total_avaliacoes??0} avaliações`],
    [Crown,'Plano atual',subscription?.planName??'Essencial',subscription?.renewalDate?`Renova em ${formatRenewal(subscription.renewalDate)}`:'Ativo'],
  ] as const

  return <div className="mx-auto max-w-7xl"><h1 className="text-3xl font-semibold text-sage-700">Olá{profile?.name?`, ${profile.name.split(' ')[0]}`:''}!</h1><p className="mt-1 text-sage-600">Aqui está o resumo real do seu consultório.</p>
  <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metricCards.map(([Icon,label,value,note])=><Card key={label} className="p-5"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sage-700"><Icon size={21}/></span><ArrowUpRight size={16} className="text-sage-400"/></div><p className="mt-4 text-sm text-sage-600">{label}</p><strong className="text-2xl font-medium">{value}</strong><p className="mt-2 text-xs text-sage-500">{note}</p></Card>)}</div>
  <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr_.75fr]">
    <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-sage-100 p-5"><h2 className="flex items-center gap-2 font-semibold"><CalendarDays size={18}/>Próximos atendimentos</h2><Button variant="soft" className="min-h-8 px-3 text-xs" onClick={()=>navigate('/psicologo/agenda')}>Ver agenda</Button></div>{agendaList.length?<div>{agendaList.map(item=><div key={item.id} className="grid grid-cols-[55px_1fr_auto] items-center gap-3 border-b border-sage-100 px-5 py-3 last:border-0"><strong className="text-sm text-sage-700">{item.time}</strong><div><p className="text-sm font-semibold">{item.clientName}</p><p className="text-xs text-sage-500">{formatDate(item.date)} · Consulta {item.mode}</p></div><Badge tone={item.status==='pendente'?'amber':'sage'}>{item.status==='pendente'?'Pendente':'Confirmado'}</Badge></div>)}</div>:<div className="p-8 text-center text-sm text-sage-500">Nenhum atendimento agendado ainda.</div>}</Card>
    <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-sage-100 p-5"><h2 className="flex items-center gap-2 font-semibold"><MessageCircle size={18}/>Solicitações recentes</h2><button onClick={()=>navigate('/psicologo/solicitacoes')} className="text-xs text-sage-500">Ver todas</button></div>{pending.length?<div>{pending.slice(0,4).map(item=><div key={item.id} className="flex items-center gap-3 border-b border-sage-100 p-4 last:border-0"><img src={item.clientImage} className="h-10 w-10 rounded-full object-cover object-top"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.clientName}</p><p className="text-xs text-sage-500">Solicitou consulta · {formatDate(item.date)}</p></div><Badge tone="amber">Pendente</Badge></div>)}</div>:<div className="p-8 text-center text-sm text-sage-500">Sem solicitações pendentes.</div>}</Card>
    <div className="space-y-5"><Card className="p-5"><h2 className="flex items-center gap-2 font-semibold"><Users size={18}/>Resumo do perfil</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Avaliação</dt><dd className="text-amber-500">{metrics?.total_avaliacoes?`★ ${metrics.media_avaliacoes}`:'—'}</dd></div><div className="flex justify-between"><dt>Consultas concluídas</dt><dd>{metrics?.concluidos??0}</dd></div><div className="flex justify-between"><dt>Confirmadas</dt><dd>{metrics?.confirmados??0}</dd></div><div className="flex justify-between"><dt>Membro desde</dt><dd>{metrics?.membro_desde?formatDate(metrics.membro_desde):'—'}</dd></div></dl></Card><Card className="bg-sage-100 p-5"><Lightbulb className="text-sage-700"/><h3 className="mt-3 font-semibold">Dica para você</h3><p className="mt-2 text-sm text-sage-600">Mantenha sua disponibilidade atualizada para receber mais solicitações.</p><button onClick={()=>navigate('/psicologo/disponibilidade')} className="mt-4 text-xs font-semibold underline">Atualizar disponibilidade</button></Card></div>
  </div>
  <Card className="mt-5 p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><Star size={18}/>Avaliações recentes</h2><button onClick={()=>navigate('/psicologo/avaliacoes')} className="text-xs text-sage-500">Ver todas</button></div>{reviews.length?<div className="mt-4 grid divide-y divide-sage-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">{reviews.slice(0,4).map(review=><div key={review.id} className="p-3"><p className="text-amber-400">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p><p className="mt-1 text-sm">{review.comment||'Sem comentário.'}</p><small className="text-sage-500">Paciente: {review.clientName}</small></div>)}</div>:<div className="mt-4"><EmptyState icon={<Star/>} title="Nenhuma avaliação ainda" text="As avaliações enviadas pelos clientes após consultas concluídas aparecerão aqui."/></div>}</Card></div>
}

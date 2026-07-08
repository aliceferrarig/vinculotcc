import { ArrowUpRight, CalendarDays, Crown, Eye, Heart, Lightbulb, LoaderCircle, MessageCircle, Star, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '../../components/ui'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { getProfessionalDashboardSummary, type ProfessionalDashboardSummary } from '../../services/professionalData'

function formatDate(date:string|null){
  if(!date)return '—'
  return new Date(`${date.slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR',{month:'short',year:'numeric'})
}

function formatRenewal(date:string|null){
  if(!date)return 'Sem renovação'
  return `Renova em ${new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}`
}

function statusTone(status:string):'sage'|'amber'|'pink'{
  return status==='pendente'?'amber':status==='cancelado'?'pink':'sage'
}

function statusLabel(status:string){
  const labels:Record<string,string>={pendente:'Pendente',confirmado:'Confirmada',cancelado:'Cancelada',concluido:'Concluída'}
  return labels[status]??status
}

export function Dashboard(){
  const navigate=useNavigate()
  const profile=useCurrentProfile()
  const [summary,setSummary]=useState<ProfessionalDashboardSummary|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    let active=true
    getProfessionalDashboardSummary()
      .then(data=>{if(active)setSummary(data)})
      .catch(()=>{if(active)setError('Não foi possível carregar os dados reais do dashboard.')})
      .finally(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[])

  const metrics=useMemo(()=>{
    if(!summary)return []
    return [
      [Eye,'Visualizações',summary.views===null?'—':String(summary.views),summary.views===null?'Ainda não medido':'Atualizado pelo sistema'],
      [Heart,'Favoritos',String(summary.favorites),'Perfis salvos por clientes'],
      [MessageCircle,'Solicitações',String(summary.pendingRequests),`${summary.pendingRequests} aguardando resposta`],
      [Crown,'Plano atual',summary.currentPlan,formatRenewal(summary.planRenewal)],
    ] as const
  },[summary])

  if(loading)return <div className="grid min-h-80 place-items-center"><LoaderCircle className="animate-spin text-sage-500" size={34}/></div>
  if(error||!summary)return <Card className="mx-auto max-w-xl p-10 text-center"><h1 className="text-xl font-semibold">Dashboard indisponível</h1><p className="mt-2 text-sage-500">{error}</p></Card>

  return <div className="mx-auto max-w-7xl">
    <h1 className="text-3xl font-semibold text-sage-700">Olá{profile?.name?`, ${profile.name.split(' ')[0]}`:''}!</h1>
    <p className="mt-1 text-sage-600">Aqui está o resumo do seu consultório hoje.</p>

    {(!summary.profileActive||!summary.hasPhoto)&&<Card className="mt-6 border border-amber-200 bg-amber-50 p-5 text-amber-800">
      <h2 className="font-semibold">Seu perfil ainda não aparece para os clientes</h2>
      <p className="mt-2 text-sm leading-6">Para ser exibido na busca, complete seu perfil profissional e adicione uma foto. Isso evita que perfis incompletos apareçam na plataforma.</p>
      <Button variant="soft" className="mt-4" onClick={()=>navigate('/psicologo/perfil')}>Completar perfil</Button>
    </Card>}

    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([Icon,label,value,note])=><Card key={label} className="p-5"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sage-700"><Icon size={21}/></span><ArrowUpRight size={16} className="text-sage-400"/></div><p className="mt-4 text-sm text-sage-600">{label}</p><strong className="text-2xl font-medium">{value}</strong><p className="mt-2 text-xs text-sage-500">{note}</p></Card>)}</div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr_.75fr]">
      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-sage-100 p-5"><h2 className="flex items-center gap-2 font-semibold"><CalendarDays size={18}/>Agenda de hoje</h2><Button variant="soft" className="min-h-8 px-3 text-xs" onClick={()=>navigate('/psicologo/agenda')}>Ver agenda</Button></div><div>{summary.todayAppointments.length?summary.todayAppointments.map(item=><div key={item.id} className="grid grid-cols-[55px_1fr_auto] items-center gap-3 border-b border-sage-100 px-5 py-3 last:border-0"><strong className="text-sm text-sage-700">{item.time}</strong><div><p className="text-sm font-semibold">{item.clientName}</p><p className="text-xs text-sage-500">Consulta {item.mode}</p></div><Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge></div>):<p className="p-5 text-sm text-sage-500">Nenhuma consulta agendada para hoje.</p>}</div></Card>

      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-sage-100 p-5"><h2 className="flex items-center gap-2 font-semibold"><MessageCircle size={18}/>Solicitações recentes</h2><button onClick={()=>navigate('/psicologo/solicitacoes')} className="text-xs text-sage-500">Ver todas</button></div><div>{summary.recentRequests.length?summary.recentRequests.map(item=><div key={item.id} className="flex items-center gap-3 border-b border-sage-100 p-4 last:border-0"><img src={item.clientImage} className="h-10 w-10 rounded-full object-cover object-top"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.clientName}</p><p className="text-xs text-sage-500">Solicitou consulta · {formatDate(item.date)}</p></div><Badge tone="amber">Pendente</Badge></div>):<p className="p-5 text-sm text-sage-500">Nenhuma solicitação pendente.</p>}</div></Card>

      <div className="space-y-5"><Card className="p-5"><h2 className="flex items-center gap-2 font-semibold"><Users size={18}/>Resumo do perfil</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Avaliação</dt><dd className="text-amber-500">{summary.averageRating?`★ ${summary.averageRating.toFixed(1).replace('.',',')}`:'—'}</dd></div><div className="flex justify-between"><dt>Taxa de resposta</dt><dd>{summary.responseRate===null?'—':`${summary.responseRate}%`}</dd></div><div className="flex justify-between"><dt>Consultas</dt><dd>{summary.completedAppointments}</dd></div><div className="flex justify-between"><dt>Membro desde</dt><dd>{formatDate(summary.memberSince)}</dd></div></dl></Card><Card className="bg-sage-100 p-5"><Lightbulb className="text-sage-700"/><h3 className="mt-3 font-semibold">Dica para você</h3><p className="mt-2 text-sm text-sage-600">Mantenha sua disponibilidade atualizada para receber mais solicitações.</p><button onClick={()=>navigate('/psicologo/disponibilidade')} className="mt-4 text-xs font-semibold underline">Atualizar disponibilidade</button></Card></div>
    </div>

    <Card className="mt-5 p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><Star size={18}/>Avaliações recentes</h2><button className="text-xs text-sage-500">Ver todas</button></div><div className="mt-4 grid divide-y divide-sage-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">{summary.recentReviews.length?summary.recentReviews.map(review=><div key={review.id} className="p-3"><p className="text-amber-400">{'★'.repeat(review.rating)}</p><p className="mt-1 text-sm">{review.comment||'Sem comentário.'}</p><small className="text-sage-500">Paciente: {review.clientName}</small></div>):<p className="col-span-full p-3 text-sm text-sage-500">Nenhuma avaliação recebida ainda.</p>}</div></Card>
  </div>
}

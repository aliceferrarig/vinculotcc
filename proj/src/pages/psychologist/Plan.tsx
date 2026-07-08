import { Check, Crown, LoaderCircle, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Button, Card, Modal } from '../../components/ui'
import { getCurrentSubscription, getPlans, subscribeToPlan, type Plan as PlanType, type Subscription } from '../../services/plans'

const icons=[ShieldCheck,Crown,Sparkles]
const formatDate=(date:string|null)=>date?new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}):'—'
const formatPrice=(price:number)=>price<=0?'Grátis':`R$ ${price.toFixed(0)}/mês`

export function Plan(){
  const [plans,setPlans]=useState<PlanType[]>([])
  const [subscription,setSubscription]=useState<Subscription|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [confirming,setConfirming]=useState<PlanType|null>(null)
  const [processing,setProcessing]=useState(false)
  const [feedback,setFeedback]=useState('')

  async function refresh(){
    const [planList,current]=await Promise.all([getPlans(),getCurrentSubscription()])
    setPlans(planList);setSubscription(current)
  }
  useEffect(()=>{refresh().catch(()=>setError('Não foi possível carregar os planos.')).finally(()=>setLoading(false))},[])

  async function confirmSubscription(){
    if(!confirming)return
    setProcessing(true);setError('')
    try{
      await subscribeToPlan(confirming.id)
      setFeedback(`Assinatura do plano ${confirming.name} ativada. (Pagamento simulado, sem cobrança real.)`)
      setConfirming(null)
      await refresh()
      setTimeout(()=>setFeedback(''),4000)
    }catch(exception){
      setError(exception instanceof Error?exception.message:'Não foi possível assinar o plano.')
    }finally{setProcessing(false)}
  }

  if(loading)return <div className="grid min-h-80 place-items-center"><LoaderCircle className="animate-spin text-sage-500" size={34}/></div>

  const currentName=subscription?.planName??'Essencial'

  return <div className="mx-auto max-w-6xl"><p className="eyebrow">Plano e assinatura</p><h1 className="mt-2 text-3xl font-semibold text-sage-700">Uma estrutura que cresce com você</h1><p className="mt-2 max-w-xl text-sage-600">Escolha o plano que acompanha o momento do seu consultório. O pagamento é simulado nesta versão — nenhuma cobrança real é feita.</p>
  {feedback&&<p className="mt-5 rounded-xl bg-sage-50 p-3 text-sm text-sage-700">{feedback}</p>}
  {error&&<p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
  <Card className="mt-7 flex flex-col justify-between gap-5 bg-gradient-to-r from-sage-700 to-sage-500 p-6 text-white sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/20"><Crown/></span><div><p className="text-xs uppercase tracking-widest text-sage-100">Plano atual</p><h2 className="text-2xl font-semibold">{currentName}</h2><p className="text-sm text-sage-100">{subscription?.renewalDate?`Próxima renovação em ${formatDate(subscription.renewalDate)}`:'Plano gratuito, sem renovação'}</p></div></div></Card>
  <div className="mt-6 grid gap-5 lg:grid-cols-3">{plans.map((plan,index)=>{const active=plan.name===currentName;const Icon=icons[index]??ShieldCheck;return <Card key={plan.id} className={`relative p-6 ${active?'ring-2 ring-sage-500':''}`}>{active&&<span className="absolute right-5 top-5"><Badge>Plano atual</Badge></span>}<span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sage-700"><Icon size={20}/></span><h2 className="mt-5 text-xl font-semibold">{plan.name}</h2><p className="mt-1 text-2xl font-semibold text-sage-700">{formatPrice(plan.price)}</p><ul className="mt-5 space-y-3">{plan.features.map(feature=><li key={feature} className="flex items-center gap-2 text-sm"><Check size={16} className="text-sage-600"/>{feature}</li>)}</ul><Button full className="mt-7" variant={active?'soft':'outline'} disabled={active} onClick={()=>setConfirming(plan)}>{active?'Seu plano':'Escolher plano'}</Button></Card>})}</div>
  <Card className="mt-6 flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><ReceiptText className="text-sage-600"/><div><h3 className="font-semibold">Pagamento simulado</h3><p className="text-sm text-sage-500">Nesta versão, assinar registra o plano no seu perfil sem cobrança. A integração de pagamento real pode ser conectada depois.</p></div></div></Card>
  <Modal open={Boolean(confirming)} onClose={()=>setConfirming(null)} className="max-w-md"><h2 className="text-2xl font-semibold text-sage-700">Confirmar assinatura</h2>{confirming&&<><p className="mt-3 text-sm text-sage-600">Você está assinando o plano <strong>{confirming.name}</strong> por {formatPrice(confirming.price)}.</p><p className="mt-2 flex items-center gap-2 text-xs text-sage-500"><ShieldCheck size={15}/>Pagamento simulado — nenhuma cobrança será feita.</p><div className="mt-7 grid grid-cols-2 gap-3"><Button variant="outline" onClick={()=>setConfirming(null)}>Cancelar</Button><Button disabled={processing} onClick={confirmSubscription}>{processing&&<LoaderCircle className="animate-spin" size={17}/>}Confirmar</Button></div></>}</Modal></div>
}

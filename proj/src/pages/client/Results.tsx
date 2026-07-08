import { CheckCircle2, Filter, HeartHandshake, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PsychologistCard } from '../../components/PsychologistCard'
import { Badge, Button, Card } from '../../components/ui'
import { buscarPsicologos, type ListedPsychologist } from '../../services/psychologists'
import { getLatestScreening, getRecommendations } from '../../services/screening'

export function Results(){
  const [mode,setMode]=useState('Modalidade')
  const [professionals,setProfessionals]=useState<ListedPsychologist[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const navigate=useNavigate()

  useEffect(()=>{
    async function load(){
      const triagemId=sessionStorage.getItem('vinculo:triagem-id')||await getLatestScreening()
      const [people,recommendations]=await Promise.all([
        buscarPsicologos(),
        triagemId?getRecommendations(triagemId):Promise.resolve([]),
      ])
      const scoreById=new Map(recommendations.map(item=>[item.psychologistId,item.compatibility]))
      const ranked=people
        .map(person=>({...person,match:scoreById.get(person.id)??0}))
        .sort((a,b)=>b.match-a.match)
      setProfessionals(ranked)
      sessionStorage.setItem('vinculo:compatibilidades',JSON.stringify(Object.fromEntries(ranked.map(item=>[item.id,item.match]))))
    }
    load().catch(()=>setError('Não foi possível carregar os resultados.')).finally(()=>setLoading(false))
  },[])

  const withMatch=useMemo(()=>professionals.filter(p=>p.match>0),[professionals])
  const list=withMatch.length?withMatch:professionals

  return <div className="mx-auto max-w-6xl"><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><Badge><CheckCircle2 size={13} className="mr-1"/>Triagem concluída</Badge><h1 className="mt-3 text-4xl font-semibold leading-tight text-sage-700">Seu vínculo ideal foi encontrado</h1><p className="mt-3 max-w-xl text-sage-600">Com base nas suas respostas, calculamos a compatibilidade com cada profissional disponível.</p></div><Card className="flex items-center justify-between p-6"><div><p className="text-sm text-sage-500">Encontramos</p><strong className="text-4xl text-sage-700">{loading?'…':list.length}</strong><p className="text-sm text-sage-600">profissionais compatíveis</p></div><HeartHandshake size={54} strokeWidth={1.3} className="text-sage-500"/></Card></div>
    <div className="mt-7 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3"><span className="mr-2 flex items-center gap-2 text-sm font-semibold"><Filter size={16}/>Filtros</span>{['Modalidade','Preço','Gênero','Especialidade'].map(x=><button key={x} onClick={()=>setMode(x)} className={`rounded-full px-4 py-2 text-xs ${mode===x?'bg-sage-600 text-white':'bg-sage-50 text-sage-700'}`}>{x}⌄</button>)}<button className="ml-auto px-3 text-xs text-sage-500">Limpar filtros</button></div>
    {loading?<Card className="mt-5 flex min-h-48 items-center justify-center"><LoaderCircle className="animate-spin text-sage-500"/></Card>:error?<Card className="mt-5 p-10 text-center"><h3 className="font-semibold">Algo deu errado</h3><p className="mt-2 text-sm text-sage-500">{error}</p></Card>:list.length?<div className="mt-5 grid gap-4 lg:grid-cols-2">{list.map(p=><PsychologistCard key={p.id} person={p} showMatch/>)}</div>:<Card className="mt-5 p-10 text-center"><h3 className="font-semibold">Nenhum profissional disponível ainda</h3><p className="mt-2 text-sm text-sage-500">Assim que houver profissionais cadastrados, suas recomendações aparecerão aqui.</p><Button className="mt-6" onClick={()=>navigate('/cliente/descobrir')}>Explorar mesmo assim</Button></Card>}</div>
}

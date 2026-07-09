import { CheckCircle2, Filter, HeartHandshake } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PsychologistCard } from '../../components/PsychologistCard'
import { Badge, Card } from '../../components/ui'
import { buscarPsicologos, type ListedPsychologist } from '../../services/psychologists'

export function Results(){
  const [mode,setMode]=useState('Modalidade')
  const [professionals,setProfessionals]=useState<ListedPsychologist[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    buscarPsicologos()
      .then(items=>{
        const ranked=items.map((item,index)=>({...item,match:Math.max(72,94-index*4)}))
        setProfessionals(ranked)
        sessionStorage.setItem('vinculo:compatibilidades',JSON.stringify(Object.fromEntries(ranked.map(item=>[item.id,item.match]))))
      })
      .catch(()=>setProfessionals([]))
      .finally(()=>setLoading(false))
  },[])

  return <div className="mx-auto max-w-6xl">
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        <Badge><CheckCircle2 size={13} className="mr-1"/>Triagem concluída</Badge>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-sage-700">Seu vínculo ideal foi encontrado</h1>
        <p className="mt-3 max-w-xl text-sage-600">Com base nas suas respostas, selecionamos profissionais alinhados ao seu perfil.</p>
      </div>
      <Card className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-sage-500">Encontramos</p>
          <strong className="text-4xl text-sage-700">{loading?'...':professionals.length}</strong>
          <p className="text-sm text-sage-600">profissionais compatíveis</p>
        </div>
        <HeartHandshake size={54} strokeWidth={1.3} className="text-sage-500"/>
      </Card>
    </div>

    <div className="mt-7 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3">
      <span className="mr-2 flex items-center gap-2 text-sm font-semibold"><Filter size={16}/>Filtros</span>
      {['Modalidade','Preço','Gênero','Especialidade'].map(x=>
        <button key={x} onClick={()=>setMode(x)} className={`rounded-full px-4 py-2 text-xs ${mode===x?'bg-sage-600 text-white':'bg-sage-50 text-sage-700'}`}>{x}⌄</button>
      )}
      <button className="ml-auto px-3 text-xs text-sage-500">Limpar filtros</button>
    </div>

    {professionals.length
      ? <div className="mt-5 grid gap-4 lg:grid-cols-2">{professionals.map(p=><PsychologistCard key={p.id} person={p} showMatch/>)}</div>
      : <Card className="mt-5 p-10 text-center text-sage-600">{loading?'Carregando profissionais...':'Nenhum psicólogo cadastrado ainda.'}</Card>}
  </div>
}

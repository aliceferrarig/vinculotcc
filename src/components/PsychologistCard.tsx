import { Heart, Monitor, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Psychologist } from '../data/mockData'
import { Badge, Button, Card } from './ui'
import { toggleFavorite } from '../services/clientData'

export function PsychologistCard({ person, compact=false, showMatch=false }: { person:Psychologist; compact?:boolean; showMatch?:boolean }) {
  const navigate=useNavigate()
  const [favorite,setFavorite]=useState(false)
  const handleFavorite=async()=>{try{setFavorite(await toggleFavorite(person.id))}catch{/* A tela mantém o estado anterior se a operação falhar. */}}
  if(compact) return <Card className="group flex items-center gap-3 p-3">
    <img src={person.image} alt="" className="h-12 w-12 rounded-full object-cover object-top"/>
    <div className="min-w-0 flex-1"><p className="truncate font-semibold">{person.name}</p><p className="truncate text-xs text-sage-500">{person.specialties.slice(0,2).join(' • ')}</p><p className="mt-1 text-xs"><span className="text-amber-500">★</span> {person.rating} · R$ {person.price}</p></div>
    <button onClick={()=>navigate(`/cliente/psicologos/${person.id}`)} className="rounded-full px-3 py-2 text-xs text-sage-700 hover:bg-sage-50">Ver perfil</button>
  </Card>
  return <Card className="group relative flex h-full flex-col overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-soft">
    <button aria-label="Favoritar" onClick={handleFavorite} className={`absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm hover:text-rose-500 ${favorite?'text-rose-500':'text-sage-600'}`}><Heart size={18} className={favorite?'fill-current':''}/></button>
    <div className="flex items-center gap-4 pr-11">
      <img src={person.image} alt={`Foto de ${person.name}`} className="h-20 w-20 shrink-0 rounded-[22px] object-cover object-top"/>
      <div className="min-w-0 flex-1">
        {showMatch&&<Badge>{person.match}% compatível</Badge>}
        <h3 className={`${showMatch?'mt-2':''} truncate text-lg font-semibold`}>{person.name}</h3>
        <p className="mt-1 text-xs text-sage-500">CRP {person.crp}</p>
      </div>
    </div>
    <div className="mt-4 flex min-h-7 flex-wrap gap-2">{person.specialties.map(s=><span key={s} className="rounded-full bg-sage-50 px-2.5 py-1 text-xs text-sage-700">{s}</span>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sage-100 pt-4 text-xs text-sage-600"><span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400"/>{person.reviews?`${person.rating} (${person.reviews})`:'Novo perfil'}</span><span className="flex items-center gap-1"><Monitor size={14}/>{person.mode}</span></div>
    <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="shrink-0"><strong className="text-lg">R$ {person.price}</strong><span className="text-xs text-sage-500"> / sessão</span></p><div className="flex items-center justify-end gap-2"><Button variant="ghost" className="px-4" onClick={()=>navigate(`/cliente/psicologos/${person.id}`)}>Ver perfil</Button><Button className="px-5" onClick={()=>navigate(`/cliente/agendar/${person.id}`)}>Agendar</Button></div></div>
  </Card>
}

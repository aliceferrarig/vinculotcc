import { CalendarDays, Heart, LoaderCircle, MessageCircle, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PsychologistCard } from '../../components/PsychologistCard'
import { Button, Card, EmptyState, Input } from '../../components/ui'
import { getClientAppointments, getClientProfile, getFavorites, saveClientProfile, type ClientAppointment } from '../../services/clientData'
import type { ListedPsychologist } from '../../services/psychologists'

export function ClientUtilityPage({type}:{type:'favoritos'|'agendamentos'|'mensagens'|'perfil'}){
  if(type==='favoritos')return <FavoritesPage/>
  if(type==='agendamentos')return <AppointmentsPage/>
  if(type==='mensagens')return <MessagesPage/>
  return <ProfilePage/>
}

function FavoritesPage(){
  const [items,setItems]=useState<ListedPsychologist[]>([]);const [loading,setLoading]=useState(true);const navigate=useNavigate()
  useEffect(()=>{getFavorites().then(setItems).finally(()=>setLoading(false))},[])
  return <div className="mx-auto max-w-5xl"><h1 className="text-3xl font-semibold">Seus favoritos</h1><p className="mt-2 text-sage-600">Profissionais que você salvou para ver depois.</p>{loading?<LoaderCircle className="mx-auto mt-20 animate-spin text-sage-500"/>:items.length?<div className="mt-6 grid gap-4 lg:grid-cols-2">{items.map(person=><PsychologistCard key={person.id} person={person}/>)}</div>:<div className="mt-6"><EmptyState icon={<Heart/>} title="Nenhum favorito ainda" text="Salve profissionais interessantes para encontrá-los rapidamente." action={<Button onClick={()=>navigate('/cliente/descobrir')}>Ver mais procurados</Button>}/></div>}</div>
}

function AppointmentsPage(){
  const [items,setItems]=useState<ClientAppointment[]>([]);const [loading,setLoading]=useState(true);const navigate=useNavigate()
  useEffect(()=>{getClientAppointments().then(setItems).finally(()=>setLoading(false))},[])
  return <div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Seus agendamentos</h1>{loading?<LoaderCircle className="mx-auto mt-20 animate-spin text-sage-500"/>:items.length?<div className="mt-6 space-y-4">{items.map(item=><Card key={item.id} className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><img src={item.psychologist.image} className="h-16 w-16 rounded-full object-cover object-top"/><div><h2 className="font-semibold">{item.psychologist.name}</h2><p className="text-sm text-sage-500">{new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR')} · {item.time}</p><p className="text-xs capitalize text-sage-500">Consulta {item.mode} · {item.status}</p></div></div><Button variant="outline" onClick={()=>navigate(`/cliente/psicologos/${item.psychologist.id}`)}>Ver profissional</Button></Card>)}</div>:<div className="mt-6"><EmptyState icon={<CalendarDays/>} title="Nenhuma consulta agendada" text="Quando você solicitar uma sessão, ela aparecerá aqui." action={<Button onClick={()=>navigate('/cliente/descobrir')}>Encontrar psicólogo</Button>}/></div>}</div>
}

function MessagesPage(){return <div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Mensagens</h1><div className="mt-6"><EmptyState icon={<MessageCircle/>} title="Nenhuma conversa iniciada" text="As conversas com seus profissionais aparecerão aqui depois do primeiro contato."/></div></div>}

function ProfilePage(){
  const [form,setForm]=useState({name:'',email:'',phone:'',birthDate:''});const [loading,setLoading]=useState(true);const [saved,setSaved]=useState(false)
  useEffect(()=>{getClientProfile().then(setForm).finally(()=>setLoading(false))},[])
  async function save(){await saveClientProfile(form);setSaved(true);setTimeout(()=>setSaved(false),2200)}
  if(loading)return <LoaderCircle className="mx-auto mt-20 animate-spin text-sage-500"/>
  return <div className="mx-auto max-w-3xl"><h1 className="text-3xl font-semibold">Seu perfil</h1><p className="mt-2 text-sage-600">Mantenha seus dados e preferências atualizados.</p><Card className="mt-6 p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><Input label="Nome completo" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Input label="E-mail" type="email" value={form.email} disabled/><Input label="Telefone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Input label="Data de nascimento" type="date" value={form.birthDate} onChange={e=>setForm({...form,birthDate:e.target.value})}/></div><Button className="mt-7" onClick={save}><Save size={17}/>{saved?'Alterações salvas':'Salvar alterações'}</Button></Card></div>
}

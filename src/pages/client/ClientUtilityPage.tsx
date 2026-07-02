import { CalendarDays, Camera, Heart, LoaderCircle, MessageCircle, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PsychologistCard } from '../../components/PsychologistCard'
import { Button, Card, EmptyState, Input } from '../../components/ui'
import { getClientAppointments, getClientProfile, getFavorites, saveClientProfile, type ClientAppointment } from '../../services/clientData'
import type { ListedPsychologist } from '../../services/psychologists'
import { uploadProfilePhoto } from '../../services/profilePhoto'
import placeholderAvatar from '../../assets/avatar-placeholder.svg'
import { PhotoAdjuster } from '../../components/PhotoAdjuster'

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
  const [form,setForm]=useState({name:'',email:'',phone:'',birthDate:'',avatarUrl:''});const [loading,setLoading]=useState(true);const [saved,setSaved]=useState(false);const [uploading,setUploading]=useState(false);const [message,setMessage]=useState('');const [editingFile,setEditingFile]=useState<File|null>(null)
  useEffect(()=>{getClientProfile().then(setForm).finally(()=>setLoading(false))},[])
  async function save(){await saveClientProfile(form);setSaved(true);setTimeout(()=>setSaved(false),2200)}
  async function upload(file?:File){if(!file)return;setUploading(true);setMessage('');try{const avatarUrl=await uploadProfilePhoto(file);setForm(current=>({...current,avatarUrl}));window.dispatchEvent(new Event('vinculo:profile-updated'));setMessage('Foto atualizada com sucesso.')}catch(exception){setMessage(exception instanceof Error?exception.message:'Não foi possível enviar a foto.')}finally{setUploading(false)}}
  if(loading)return <LoaderCircle className="mx-auto mt-20 animate-spin text-sage-500"/>
  return <div className="mx-auto max-w-3xl"><h1 className="text-3xl font-semibold">Seu perfil</h1><p className="mt-2 text-sage-600">Mantenha seus dados e preferências atualizados.</p><Card className="mt-6 p-6 sm:p-8"><div className="mb-8 flex flex-col items-center gap-5 border-b border-sage-100 pb-7 sm:flex-row"><div className="relative"><img src={form.avatarUrl||placeholderAvatar} alt="Sua foto de perfil" className="h-28 w-28 rounded-[30px] object-cover object-top shadow-card"/><label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-sage-600 text-white shadow-md hover:bg-sage-700">{uploading?<LoaderCircle className="animate-spin" size={17}/>:<Camera size={17}/>}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} className="hidden" onChange={event=>{setEditingFile(event.target.files?.[0]||null);event.target.value=''}}/></label></div><div className="text-center sm:text-left"><h2 className="font-semibold">Foto de perfil</h2><p className="mt-1 max-w-sm text-sm text-sage-500">Opcional. Você pode adicionar ou trocar sua foto quando quiser.</p><label className="mt-3 inline-flex cursor-pointer items-center text-sm font-semibold text-sage-700 underline"><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} className="hidden" onChange={event=>{setEditingFile(event.target.files?.[0]||null);event.target.value=''}}/>{form.avatarUrl?'Trocar e ajustar foto':'Adicionar foto'}</label>{message&&<p className="mt-2 text-xs text-sage-600">{message}</p>}</div></div><div className="grid gap-5 sm:grid-cols-2"><Input label="Nome completo" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Input label="E-mail" type="email" value={form.email} disabled/><Input label="Telefone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Input label="Data de nascimento" type="date" value={form.birthDate} onChange={e=>setForm({...form,birthDate:e.target.value})}/></div><Button className="mt-7" onClick={save}><Save size={17}/>{saved?'Alterações salvas':'Salvar alterações'}</Button></Card><PhotoAdjuster file={editingFile} onCancel={()=>setEditingFile(null)} onConfirm={adjusted=>{setEditingFile(null);upload(adjusted)}}/></div>
}

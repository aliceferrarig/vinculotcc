import { Bell, CalendarDays, ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, MessageCircle, Settings, Star, UserRound, UsersRound, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo } from '../ui'
import placeholderAvatar from '../../assets/avatar-placeholder.svg'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'

const items=[
  ['/psicologo/dashboard','Dashboard',LayoutDashboard], ['/psicologo/perfil','Meu perfil',UserRound], ['/psicologo/disponibilidade','Disponibilidade',CalendarDays],
  ['/psicologo/agenda','Agenda',CalendarDays], ['/psicologo/solicitacoes','Solicitações',ClipboardList], ['/psicologo/pacientes','Pacientes',UsersRound],
  ['/psicologo/mensagens','Mensagens',MessageCircle], ['/psicologo/avaliacoes','Avaliações',Star], ['/psicologo/plano','Plano e assinatura',CreditCard], ['/psicologo/configuracoes','Configurações',Settings]
] as const

export function PsychologistLayout(){
  const [open,setOpen]=useState(false); const navigate=useNavigate()
  const profile=useCurrentProfile()
  return <div className="min-h-screen bg-cream lg:flex">
    {open&&<button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-sage-900/30 lg:hidden" onClick={()=>setOpen(false)}/>} 
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-white p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Logo/><button className="p-2 lg:hidden" onClick={()=>setOpen(false)}><X/></button></div>
      <nav className="mt-7 space-y-1">{items.map(([to,title,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive?'bg-sage-100 font-semibold text-sage-800':'text-sage-700 hover:bg-sage-50'}`}><Icon size={19}/>{title}</NavLink>)}</nav>
      <button onClick={()=>navigate('/')} className="relative mt-auto flex items-center gap-3 border-t border-sage-100 px-3 pt-5 text-sm"><LogOut size={19}/>Sair</button>
    </aside>
    <div className="min-w-0 flex-1"><header className="sticky top-0 z-20 flex h-20 items-center justify-between bg-cream/90 px-4 backdrop-blur sm:px-8"><button className="rounded-full bg-white p-2.5 lg:hidden" onClick={()=>setOpen(true)}><Menu/></button><div className="ml-auto flex items-center gap-3"><Bell size={19}/><img src={profile?.avatarUrl||placeholderAvatar} alt="Foto do profissional" className="h-10 w-10 rounded-full object-cover object-top"/><span className="hidden text-sm font-semibold sm:block">{profile?.name||'Minha conta'}</span></div></header><main className="p-4 sm:p-7 lg:p-9"><Outlet/></main></div>
  </div>
}

import { Bell, CalendarDays, ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, MessageCircle, Settings, Star, UserRound, UsersRound, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo, ThemeToggle } from '../ui'
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
  return <div className="min-h-screen bg-cream dark:bg-[#08110e] lg:flex">
    {open&&<button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-sage-900/30 lg:hidden" onClick={()=>setOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-[#101b17]/95 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Logo/><button className="p-2 lg:hidden" onClick={()=>setOpen(false)}><X/></button></div>
      <nav className="mt-7 space-y-1">{items.map(([to,title,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive?'bg-sage-100 font-semibold text-sage-800 shadow-sm dark:bg-white/10 dark:text-sage-50':'text-sage-700 hover:bg-sage-50 dark:text-sage-200 dark:hover:bg-white/10'}`}><Icon size={19}/>{title}</NavLink>)}</nav>
      <button onClick={()=>navigate('/')} className="relative mt-auto flex items-center gap-3 border-t border-sage-100 px-3 pt-5 text-sm transition hover:text-sage-700 dark:border-white/10 dark:text-sage-200"><LogOut size={19}/>Sair</button>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/70 bg-cream/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#08110e]/80 sm:px-8">
        <button className="rounded-full bg-white p-2.5 shadow-sm dark:bg-white/10 lg:hidden" onClick={()=>setOpen(true)}><Menu/></button>
        <div className="ml-auto flex items-center gap-3"><ThemeToggle/><Bell size={19}/><img src={profile?.avatarUrl||placeholderAvatar} alt="Foto do profissional" className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-white/70 dark:ring-white/10"/><span className="hidden text-sm font-semibold sm:block">{profile?.name||'Minha conta'}</span></div>
      </header>
      <main className="p-4 sm:p-7 lg:p-9"><Outlet/></main>
    </div>
  </div>
}

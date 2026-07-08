import { Bell, CalendarDays, Compass, Heart, LogOut, Menu, MessageCircle, UserRound, X, Sparkles } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo, ThemeToggle } from '../ui'
import placeholderAvatar from '../../assets/avatar-placeholder.svg'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'

const items=[
  ['/cliente/descobrir','Descobrir','Encontre psicólogos',Compass], ['/cliente/triagem','Triagem','Vincule-se',Sparkles],
  ['/cliente/favoritos','Favoritos','Psicólogos salvos',Heart], ['/cliente/agendamentos','Agendamentos','Suas consultas',CalendarDays],
  ['/cliente/mensagens','Mensagens','Chat com psicólogo',MessageCircle], ['/cliente/perfil','Perfil','Dados e preferências',UserRound]
] as const

export function ClientLayout(){
  const [open,setOpen]=useState(false); const navigate=useNavigate()
  const profile=useCurrentProfile()
  return <div className="min-h-screen bg-cream dark:bg-[#08110e] lg:flex">
    {open&&<button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-sage-900/30 lg:hidden" onClick={()=>setOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[265px] flex-col border-r border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-[#101b17]/95 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Logo/><button className="p-2 lg:hidden" onClick={()=>setOpen(false)}><X/></button></div>
      <nav className="mt-8 space-y-1">{items.map(([to,title,sub,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${isActive?'bg-sage-100 text-sage-800 shadow-sm dark:bg-white/10 dark:text-sage-50':'text-sage-700 hover:bg-sage-50 dark:text-sage-200 dark:hover:bg-white/10'}`}><Icon size={21}/><span><strong className="block text-sm font-semibold">{title}</strong><small className="block text-[11px] text-sage-500 dark:text-sage-400">{sub}</small></span></NavLink>)}</nav>
      <button onClick={()=>navigate('/')} className="mt-auto flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-sage-700 transition hover:bg-sage-50 dark:text-sage-200 dark:hover:bg-white/10"><LogOut size={21}/>Sair</button>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/70 bg-cream/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#08110e]/80 sm:px-8">
        <button className="rounded-full bg-white p-2.5 text-sage-700 shadow-sm dark:bg-white/10 dark:text-sage-100 lg:hidden" onClick={()=>setOpen(true)}><Menu/></button>
        <span className="hidden text-sm text-sage-500 dark:text-sage-300 lg:block">Um espaço seguro para o seu cuidado.</span>
        <div className="ml-auto flex items-center gap-3"><ThemeToggle/><button className="rounded-full p-2 text-sage-600 transition hover:bg-white dark:text-sage-200 dark:hover:bg-white/10"><Bell size={19}/></button><img src={profile?.avatarUrl||placeholderAvatar} alt="Foto do cliente" className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-white/70 dark:ring-white/10"/><div className="hidden sm:block"><p className="text-sm font-semibold">{profile?.name||'Minha conta'}</p><p className="text-[11px] text-sage-500 dark:text-sage-400">Cliente</p></div></div>
      </header>
      <main className="p-4 sm:p-7 lg:p-9"><Outlet/></main>
    </div>
  </div>
}

import { Outlet, Link } from 'react-router-dom'
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { Logo } from '../ui'

export function AuthLayout(){
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-8">
    <span className="absolute left-[8%] top-[24%] hidden h-24 w-24 place-items-center rounded-[32px] bg-sage-100/80 text-sage-500 lg:grid"><HeartHandshake size={38}/></span>
    <span className="absolute bottom-[17%] right-[9%] hidden h-20 w-20 place-items-center rounded-full bg-white/70 text-sage-500 shadow-card lg:grid"><ShieldCheck size={30}/></span>
    <span className="absolute right-[16%] top-[13%] hidden text-sage-300 lg:block"><Sparkles size={34}/></span>
    <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
      <Link to="/" className="block w-fit"><Logo/></Link>
      <div className="mt-8 w-full"><Outlet/></div>
      <p className="mt-6 flex items-center gap-2 text-center text-xs text-sage-500"><ShieldCheck size={14}/>Seus dados são protegidos e usados apenas para sua experiência na plataforma.</p>
    </div>
  </main>
}

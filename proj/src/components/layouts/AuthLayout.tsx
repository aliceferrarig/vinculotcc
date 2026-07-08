import { Outlet, Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Logo, ThemeToggle } from '../ui'

export function AuthLayout(){
  return <main className="relative min-h-screen overflow-hidden bg-cream px-4 py-8 text-ink dark:bg-[#08110e] dark:text-sage-50">
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(93,138,122,.18)_0%,rgba(157,185,173,.12)_38%,rgba(245,238,228,.45)_100%)] dark:bg-[linear-gradient(135deg,rgba(93,138,122,.18)_0%,rgba(8,17,14,.88)_58%,rgba(21,36,31,.92)_100%)]"/>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sage-100/60 to-transparent dark:from-sage-900/40"/>
    <div className="absolute right-5 top-5 z-30"><ThemeToggle/></div>

    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center">
      <Link to="/" aria-label="Voltar para a página inicial" className="mb-8 block w-fit">
        <Logo/>
      </Link>

      <div className="w-full">
        <Outlet/>
      </div>

      <p className="mt-6 flex items-center gap-2 text-center text-xs text-sage-600 dark:text-sage-300">
        <ShieldCheck size={14}/>
        Seus dados são protegidos e usados apenas para sua experiência na plataforma.
      </p>
    </div>
  </main>
}

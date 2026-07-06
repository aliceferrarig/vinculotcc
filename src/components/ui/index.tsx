import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'
import vinculoLogo from '../../assets/logo-vinculo.png'

export function Logo({ light=false }: { light?: boolean }) {
  return <img src={vinculoLogo} alt="Vínculo" className={`h-10 w-auto max-w-[170px] object-contain ${light?'brightness-0 invert':''}`}/>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?:'primary'|'outline'|'ghost'|'soft'; full?:boolean }
export function Button({ variant='primary', full, className='', children, ...props }: ButtonProps) {
  const variants={
    primary:'bg-sage-500 text-white hover:bg-sage-600 shadow-sm',
    outline:'border border-sage-300 bg-white text-sage-700 hover:bg-sage-50',
    ghost:'text-sage-700 hover:bg-sage-100',
    soft:'bg-sage-100 text-sage-700 hover:bg-sage-200'
  }
  return <button className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${full?'w-full':''} ${className}`} {...props}>{children}</button>
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?:string; icon?:ReactNode }
export function Input({ label, icon, className='', ...props }: InputProps) {
  return <label className="block text-sm font-medium text-sage-800">{label && <span className="mb-2 block">{label}</span>}<span className="relative block">{icon&&<span className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500">{icon}</span>}<input className={`focus-ring h-12 w-full rounded-xl border border-sage-200 bg-white px-4 text-sm text-ink placeholder:text-sage-400 ${icon?'pl-11':''} ${className}`} {...props}/></span></label>
}

export function Card({ children, className='' }: { children:ReactNode; className?:string }) { return <div className={`surface ${className}`}>{children}</div> }
export function Badge({ children, tone='sage' }: { children:ReactNode; tone?:'sage'|'amber'|'pink' }) {
  const tones={sage:'bg-sage-100 text-sage-700',amber:'bg-amber-50 text-amber-700',pink:'bg-rose-50 text-rose-700'}
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function Modal({ open, onClose, children, className='' }: { open:boolean; onClose:()=>void; children:ReactNode; className?:string }) {
  if(!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-sage-900/55 p-4 backdrop-blur-sm" onMouseDown={onClose}><div role="dialog" aria-modal="true" className={`relative max-h-[92vh] w-full max-w-2xl overflow-auto rounded-[28px] bg-white p-6 shadow-2xl sm:p-9 ${className}`} onMouseDown={e=>e.stopPropagation()}><button aria-label="Fechar" onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-sage-600 hover:bg-sage-100"><X size={20}/></button>{children}</div></div>
}

export function Stepper({ current, total, labels }: { current:number; total:number; labels?:string[] }) {
  return <div className="flex items-start justify-center gap-2">{Array.from({length:total},(_,i)=>i+1).map((n,i)=><div key={n} className="flex items-center"><div className="flex flex-col items-center"><span className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-bold transition ${n<=current?'border-sage-500 bg-sage-500 text-white':'border-sage-200 bg-white text-sage-400'}`}>{n}</span>{labels?.[i]&&<span className="mt-2 hidden whitespace-nowrap text-[11px] text-sage-500 sm:block">{labels[i]}</span>}</div>{n<total&&<span className={`mb-5 h-px w-6 sm:w-12 ${n<current?'bg-sage-500':'bg-sage-200'}`}/>}</div>)}</div>
}

export function EmptyState({ icon, title, text, action }: { icon:ReactNode; title:string; text:string; action?:ReactNode }) {
  return <Card className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-sage-100 text-sage-600">{icon}</span><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm text-sage-600">{text}</p>{action&&<div className="mt-6">{action}</div>}</Card>
}

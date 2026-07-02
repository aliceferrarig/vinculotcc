import { useState } from 'react'
import type { FormEvent } from 'react'
import { Briefcase, Check, LoaderCircle, Lock, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Input, Stepper } from '../../components/ui'
import { signIn, signUp, type UserRole } from '../../services/auth'

export function Login(){
  const navigate=useNavigate()
  const [role,setRole]=useState<UserRole>('cliente')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  async function handleSubmit(event:FormEvent){
    event.preventDefault(); setLoading(true); setError('')
    try{
      const result=await signIn(email,password)
      if(result.role!==role){
        setError(`Esta conta está cadastrada como ${result.role==='cliente'?'cliente':'psicólogo(a)'}.`)
        return
      }
      navigate(result.role==='cliente'?'/cliente/descobrir':'/psicologo/dashboard')
    }catch{
      setError('E-mail ou senha incorretos. Confira os dados e tente novamente.')
    }finally{setLoading(false)}
  }

  return <Card className="p-6 sm:p-9"><div className="text-center"><h1 className="text-3xl font-semibold text-sage-700">Bem-vindo(a) de volta</h1><p className="mt-2 text-sm text-sage-500">Entre para continuar sua jornada.</p></div><div className="mt-7 grid grid-cols-2 rounded-full bg-sage-50 p-1"><button type="button" onClick={()=>setRole('cliente')} className={`rounded-full py-2.5 text-sm ${role==='cliente'?'bg-white font-semibold shadow-sm':''}`}>Cliente</button><button type="button" onClick={()=>setRole('psicologo')} className={`rounded-full py-2.5 text-sm ${role==='psicologo'?'bg-white font-semibold shadow-sm':''}`}>Psicólogo</button></div><form className="mt-6 space-y-4" onSubmit={handleSubmit}><Input label="E-mail" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" icon={<Mail size={18}/>}/><Input label="Senha" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" icon={<Lock size={18}/>}/>{error&&<p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<div className="text-right"><button type="button" className="text-xs font-semibold text-sage-600 underline">Esqueci minha senha</button></div><Button type="submit" full disabled={loading}>{loading&&<LoaderCircle className="animate-spin" size={17}/>}Entrar</Button></form><p className="mt-6 text-center text-sm text-sage-600">Não tem conta? <Link className="font-semibold underline" to={`/cadastro/${role}`}>Criar conta</Link></p><Link to="/" className="mt-3 block text-center text-xs text-sage-500">← Voltar à página inicial</Link></Card>
}

export function Register(){
  const {role='cliente'}=useParams(); const navigate=useNavigate(); const isPsych=role==='psicologo'
  const [step,setStep]=useState(1); const [selected,setSelected]=useState<string[]>([]); const [loading,setLoading]=useState(false); const [error,setError]=useState('')
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState('')
  const [crp,setCrp]=useState(''); const [crpState,setCrpState]=useState(''); const [modality,setModality]=useState<'online'|'presencial'|'ambos'>('online'); const [price,setPrice]=useState(''); const [bio,setBio]=useState('')
  const specialties=['Ansiedade','Depressão','Relacionamentos','Autoestima','TDAH','Luto','Burnout','Traumas']

  async function finish(event:FormEvent){
    event.preventDefault(); setError('')
    if(password!==confirm){setError('As senhas não coincidem.');return}
    if(isPsych&&step===1){setStep(2);return}
    if(isPsych&&!selected.length){setError('Escolha pelo menos uma especialidade.');return}
    setLoading(true)
    try{
      const result=await signUp({name,email,password,role:isPsych?'psicologo':'cliente',crp,crpState,specialties:selected,modality,price:Number(price||0),bio})
      if(!result.session){
        alert('Cadastro realizado! Confirme seu e-mail antes de entrar.')
        navigate('/entrar')
        return
      }
      navigate(isPsych?'/psicologo/dashboard':'/cliente/descobrir')
    }catch(exception){
      setError(exception instanceof Error?exception.message:'Não foi possível concluir o cadastro.')
    }finally{setLoading(false)}
  }

  return <Card className={`${isPsych?'relative left-1/2 w-[min(760px,calc(100vw-32px))] max-w-3xl -translate-x-1/2':''} p-6 sm:p-9`}><div className="text-center"><h1 className="text-2xl font-semibold text-sage-700">Bem-vindo(a), {isPsych?'psicólogo(a)':'cliente'}!</h1><p className="mt-2 text-sm text-sage-500">{isPsych?'Crie seu perfil profissional para começar a receber pacientes.':'Cadastre-se para continuar sua jornada.'}</p>{isPsych&&<div className="mt-6"><Stepper current={step} total={2} labels={['Dados de acesso','Perfil profissional']}/></div>}</div>
    <form className="mt-7 space-y-4" onSubmit={finish}>{(!isPsych||step===1)?<><Input label="Nome completo" required value={name} onChange={e=>setName(e.target.value)} placeholder="Digite seu nome completo" icon={<UserRound size={18}/>}/><Input label="E-mail" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Digite seu e-mail" icon={<Mail size={18}/>}/>{isPsych&&<div className="grid gap-4 sm:grid-cols-2"><Input label="CRP" required value={crp} onChange={e=>setCrp(e.target.value)} placeholder="Ex.: 06/123456" icon={<Briefcase size={18}/>}/><label className="text-sm font-medium">Estado do CRP<select required value={crpState} onChange={e=>setCrpState(e.target.value)} className="focus-ring mt-2 h-12 w-full rounded-xl border border-sage-200 bg-white px-4"><option value="">Selecione seu estado</option><option>São Paulo</option><option>Rio de Janeiro</option><option>Minas Gerais</option><option>Paraná</option><option>Bahia</option><option>Santa Catarina</option><option>Rio Grande do Sul</option></select></label></div>}<div className="grid gap-4 sm:grid-cols-2"><Input label="Senha" type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Crie uma senha" icon={<Lock size={18}/>}/><Input label="Confirmar senha" type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirme sua senha" icon={<Lock size={18}/>}/></div>{!isPsych&&<label className="flex items-start gap-2 text-xs text-sage-600"><input required type="checkbox" className="mt-1 accent-sage-600"/>Eu aceito os Termos de Uso e a Política de Privacidade.</label>}</>:<><div><p className="mb-3 text-sm font-medium">Especialidades</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{specialties.map(s=><button type="button" key={s} onClick={()=>setSelected(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s])} className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${selected.includes(s)?'border-sage-500 bg-sage-100':'border-sage-200'}`}>{selected.includes(s)&&<Check size={14}/>} {s}</button>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Modalidade<select value={modality} onChange={e=>setModality(e.target.value as typeof modality)} className="mt-2 h-12 w-full rounded-xl border border-sage-200 bg-white px-4"><option value="online">Online</option><option value="presencial">Presencial</option><option value="ambos">Ambos</option></select></label><Input label="Valor por sessão" required min="0" type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="150,00"/></div><label className="block text-sm font-medium">Biografia profissional<textarea required value={bio} onChange={e=>setBio(e.target.value)} className="focus-ring mt-2 min-h-28 w-full rounded-xl border border-sage-200 p-4" placeholder="Fale sobre sua formação, abordagem e experiência..."/></label></>}
      {error&&<p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<div className="flex gap-3">{isPsych&&step===2&&<Button type="button" full variant="outline" onClick={()=>setStep(1)}>Voltar</Button>}<Button type="submit" full disabled={loading}>{loading&&<LoaderCircle className="animate-spin" size={17}/>} {isPsych&&step===1?'Continuar cadastro':'Concluir cadastro'}</Button></div></form><p className="mt-5 text-center text-xs text-sage-500">Já tem uma conta? <Link to="/entrar" className="font-semibold underline">Entrar</Link></p></Card>
}

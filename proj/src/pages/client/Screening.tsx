import { ArrowLeft, ArrowRight, Clock, HandHeart, HelpCircle, LoaderCircle, UserSearch, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Stepper } from '../../components/ui'
import { submitScreening, type ScreeningAnswers } from '../../services/screening'

// Cada opção carrega o rótulo exibido e o valor estruturado enviado ao banco.
type Option={label:string;value:string;icon:typeof HandHeart}
type Question={key:keyof ScreeningAnswers;title:string;subtitle:string;options:Option[]}

const questions:Question[]=[
  {key:'prioridade',title:'O que é mais importante para você nesse momento?',subtitle:'Suas respostas nos ajudarão a encontrar profissionais mais alinhados ao que você precisa agora.',options:[
    {label:'Encontrar alguém especializado',value:'especializado',icon:UserSearch},
    {label:'Ter um atendimento acessível',value:'acessivel',icon:WalletCards},
    {label:'Encontrar horários flexíveis',value:'flexivel',icon:Clock},
    {label:'Me sentir acolhido(a)',value:'acolhimento',icon:HandHeart},
    {label:'Ainda não sei',value:'indefinido',icon:HelpCircle}]},
  {key:'tema',title:'Sobre o que você gostaria de conversar?',subtitle:'Escolha o tema que mais se aproxima do seu momento.',options:[
    {label:'Ansiedade',value:'Ansiedade',icon:HandHeart},
    {label:'Autoestima',value:'Autoestima',icon:HandHeart},
    {label:'Relacionamentos',value:'Relacionamentos',icon:HandHeart},
    {label:'Burnout',value:'Burnout',icon:HandHeart},
    {label:'Luto',value:'Luto',icon:HandHeart}]},
  {key:'modalidade',title:'Como prefere ser atendido(a)?',subtitle:'Escolha a modalidade mais confortável para a sua rotina.',options:[
    {label:'Online',value:'online',icon:UserSearch},
    {label:'Presencial',value:'presencial',icon:UserSearch},
    {label:'Tanto faz',value:'tanto_faz',icon:HelpCircle}]},
  {key:'preco_max',title:'Qual faixa de valor funciona para você?',subtitle:'Mostraremos profissionais dentro da faixa escolhida.',options:[
    {label:'Até R$ 120',value:'120',icon:WalletCards},
    {label:'De R$ 121 a R$ 170',value:'170',icon:WalletCards},
    {label:'De R$ 171 a R$ 230',value:'230',icon:WalletCards},
    {label:'O valor não é prioridade',value:'',icon:HelpCircle}]},
  {key:'preferencia',title:'Você tem preferência de profissional?',subtitle:'Essa resposta é opcional e pode ser alterada depois.',options:[
    {label:'Mulher',value:'mulher',icon:UserSearch},
    {label:'Homem',value:'homem',icon:UserSearch},
    {label:'Sem preferência',value:'sem_preferencia',icon:HelpCircle}]},
  {key:'inicio',title:'Quando gostaria de começar?',subtitle:'Última pergunta — estamos quase encontrando o seu vínculo.',options:[
    {label:'O quanto antes',value:'imediato',icon:Clock},
    {label:'Nas próximas semanas',value:'semanas',icon:Clock},
    {label:'Só estou conhecendo',value:'conhecendo',icon:HelpCircle}]},
]

export function Screening(){
  const [step,setStep]=useState(0)
  const [answers,setAnswers]=useState<Record<string,string>>({})
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  const navigate=useNavigate()
  const q=questions[step]
  const selectedValue=answers[q.key]

  const select=(value:string)=>setAnswers(current=>({...current,[q.key]:value}))

  async function advance(){
    if(step<questions.length-1){setStep(step+1);return}
    setSaving(true);setError('')
    try{
      const payload:ScreeningAnswers={
        prioridade:answers.prioridade,
        tema:answers.tema,
        modalidade:answers.modalidade as ScreeningAnswers['modalidade'],
        preco_max:answers.preco_max?Number(answers.preco_max):null,
        preferencia:answers.preferencia,
        inicio:answers.inicio,
      }
      const triagemId=await submitScreening(payload)
      sessionStorage.setItem('vinculo:triagem-id',triagemId)
      navigate('/cliente/resultados')
    }catch(exception){
      setError(exception instanceof Error?exception.message:'Não foi possível concluir a triagem.')
    }finally{setSaving(false)}
  }

  return <div className="mx-auto max-w-3xl"><Card className="min-h-[650px] p-5 sm:p-10"><div className="text-center"><p className="text-xs font-semibold uppercase tracking-widest text-sage-500">Etapa {step+1} de {questions.length}</p><div className="mx-auto mt-4 max-w-xl"><Stepper current={step+1} total={questions.length}/></div><h1 className="mx-auto mt-8 max-w-xl text-3xl font-semibold leading-tight text-sage-700">{q.title}</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-sage-500">{q.subtitle}</p></div>
    <div className="mx-auto mt-8 max-w-xl space-y-3">{q.options.map(option=>{const active=selectedValue===option.value;const Icon=option.icon;return <button key={option.label} onClick={()=>select(option.value)} className={`focus-ring flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${active?'border-sage-500 bg-sage-100':'border-sage-200 bg-white hover:border-sage-400'}`}><span className={`grid h-10 w-10 place-items-center rounded-full ${active?'bg-sage-600 text-white':'bg-sage-50 text-sage-600'}`}><Icon size={19}/></span><span className="flex-1 font-medium">{option.label}</span><span className={`h-5 w-5 rounded-full border-2 ${active?'border-[6px] border-sage-600':'border-sage-300'}`}/></button>})}</div>
    {error&&<p className="mx-auto mt-6 max-w-xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <div className="mx-auto mt-8 flex max-w-xl justify-between"><Button variant="ghost" disabled={step===0||saving} onClick={()=>setStep(step-1)}><ArrowLeft size={17}/>Voltar</Button><Button disabled={selectedValue===undefined||saving} onClick={advance}>{saving&&<LoaderCircle className="animate-spin" size={17}/>}{step===questions.length-1?'Ver resultados':'Continuar'}<ArrowRight size={17}/></Button></div></Card></div>
}

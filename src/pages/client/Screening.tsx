import { ArrowLeft, ArrowRight, Clock, HandHeart, HelpCircle, UserSearch, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Stepper } from '../../components/ui'

const questions=[
  {title:'O que é mais importante para você nesse momento?',subtitle:'Suas respostas nos ajudarão a encontrar profissionais mais alinhados ao que você precisa agora.',options:[['Encontrar alguém especializado',UserSearch],['Ter um atendimento acessível',WalletCards],['Encontrar horários flexíveis',Clock],['Me sentir acolhido(a)',HandHeart],['Ainda não sei',HelpCircle]]},
  {title:'Sobre o que você gostaria de conversar?',subtitle:'Você pode escolher o tema que mais se aproxima do seu momento.',options:[['Ansiedade',HandHeart],['Autoestima',HandHeart],['Relacionamentos',HandHeart],['Burnout ou estresse',HandHeart],['Luto',HandHeart]]},
  {title:'Como prefere ser atendido(a)?',subtitle:'Escolha a modalidade mais confortável para a sua rotina.',options:[['Online',UserSearch],['Presencial',UserSearch],['Tanto faz',HelpCircle]]},
  {title:'Qual faixa de valor funciona para você?',subtitle:'Mostraremos profissionais dentro da faixa escolhida.',options:[['Até R$ 120',WalletCards],['De R$ 121 a R$ 170',WalletCards],['De R$ 171 a R$ 230',WalletCards],['O valor não é prioridade',HelpCircle]]},
  {title:'Você tem preferência de profissional?',subtitle:'Essa resposta é opcional e pode ser alterada depois.',options:[['Mulher',UserSearch],['Homem',UserSearch],['Sem preferência',HelpCircle]]},
  {title:'Quando gostaria de começar?',subtitle:'Última pergunta — estamos quase encontrando o seu vínculo.',options:[['O quanto antes',Clock],['Nas próximas semanas',Clock],['Só estou conhecendo',HelpCircle]]}
] as const

export function Screening(){
  const [step,setStep]=useState(0); const [answers,setAnswers]=useState<string[]>([]); const navigate=useNavigate(); const q=questions[step]
  const select=(answer:string)=>{const next=[...answers];next[step]=answer;setAnswers(next)}
  const advance=()=>{
    if(step===questions.length-1){
      sessionStorage.setItem('vinculo:triagem-concluida','true')
      navigate('/cliente/resultados')
      return
    }
    setStep(step+1)
  }
  return <div className="mx-auto max-w-3xl"><Card className="min-h-[650px] p-5 sm:p-10"><div className="text-center"><p className="text-xs font-semibold uppercase tracking-widest text-sage-500">Etapa {step+1} de {questions.length}</p><div className="mx-auto mt-4 max-w-xl"><Stepper current={step+1} total={questions.length}/></div><h1 className="mx-auto mt-8 max-w-xl text-3xl font-semibold leading-tight text-sage-700">{q.title}</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-sage-500">{q.subtitle}</p></div><div className="mx-auto mt-8 max-w-xl space-y-3">{q.options.map(([label,Icon])=><button key={label} onClick={()=>select(label)} className={`focus-ring flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${answers[step]===label?'border-sage-500 bg-sage-100':'border-sage-200 bg-white hover:border-sage-400'}`}><span className={`grid h-10 w-10 place-items-center rounded-full ${answers[step]===label?'bg-sage-600 text-white':'bg-sage-50 text-sage-600'}`}><Icon size={19}/></span><span className="flex-1 font-medium">{label}</span><span className={`h-5 w-5 rounded-full border-2 ${answers[step]===label?'border-[6px] border-sage-600':'border-sage-300'}`}/></button>)}</div><div className="mx-auto mt-8 flex max-w-xl justify-between"><Button variant="ghost" disabled={step===0} onClick={()=>setStep(step-1)}><ArrowLeft size={17}/>Voltar</Button><Button disabled={!answers[step]} onClick={advance}>{step===questions.length-1?'Ver resultados':'Continuar'}<ArrowRight size={17}/></Button></div></Card></div>
}

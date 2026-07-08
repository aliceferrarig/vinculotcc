import { useEffect, useState } from 'react'
import { Check, ClipboardCheck, HandHeart, Heart, Instagram, ListChecks, Mail, Quote, Search, ShieldCheck, Sparkles, Star, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Logo, ThemeToggle } from '../components/ui'
import heroPuzzle from '../assets/hero-quebra-cabeca.png'

export function Landing(){
  const [faq,setFaq]=useState<number|null>(null)
  const [activeSection,setActiveSection]=useState('inicio')
  const navigate=useNavigate()
  const choose=(role:'cliente'|'psicologo')=>navigate(`/cadastro/${role}`)
  const navItems=[
    ['inicio','Início'],
    ['como','Como Funciona'],
    ['diferencial','Diferencial'],
    ['previa-triagem','Triagem'],
    ['seguranca','Segurança'],
    ['depoimentos','Depoimentos'],
    ['duvidas','Dúvidas'],
    ['contato','Contato']
  ] as const

  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]
      if(visible?.target.id)setActiveSection(visible.target.id)
    },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.2,.5,.8]})
    navItems.forEach(([id])=>{const section=document.getElementById(id); if(section)observer.observe(section)})
    return ()=>observer.disconnect()
  },[])

  return <div className="bg-cream text-ink dark:bg-[#08110e] dark:text-sage-50">
    <header className="fixed inset-x-0 top-0 z-[999] border-b border-white/10 bg-sage-600/70 text-white shadow-[0_10px_35px_rgba(49,66,58,.12)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-[#08110e]/90">
      <div className="page-shell flex h-20 items-center justify-between">
        <a href="#inicio" aria-label="Voltar ao início" className="block w-fit"><Logo light/></a>
        <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-white/10 bg-white/10 p-1 text-sm font-semibold backdrop-blur lg:flex">
          {navItems.map(([id,label])=><a key={id} className={`rounded-full px-3.5 py-2 transition-colors duration-300 hover:bg-white/10 hover:text-white ${activeSection===id?'bg-white/20 text-white shadow-sm':'text-white/80'}`} href={`#${id}`}>{label}</a>)}
        </nav>
        <ThemeToggle/>
      </div>
    </header>

    <section id="inicio" className="organic-bg relative min-h-[672px] overflow-hidden bg-[linear-gradient(135deg,#5d8a7a_0%,#9db9ad_42%,#f5eee4_100%)] text-white transition-colors duration-700 dark:bg-[linear-gradient(135deg,#08110e_0%,#203b32_54%,#15241f_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_6%_58%,rgba(255,255,255,.18),transparent_8%),radial-gradient(circle_at_78%_46%,rgba(255,255,255,.45),transparent_31%),radial-gradient(circle_at_45%_92%,rgba(255,255,255,.24),transparent_28%)] transition-opacity duration-700 dark:opacity-60"/>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-cream/60 to-cream dark:via-[#08110e]/70 dark:to-[#08110e]"/>

      <div className="page-shell relative z-10 flex flex-col items-center px-6 pb-24 pt-28 text-center">
        <h1 className="heading-display max-w-5xl text-[56px] leading-[.93] tracking-[-0.06em] sm:text-[82px] lg:text-[96px]">
          Encontre o psicólogo<br/>ideal para <em className="font-normal">você</em>
        </h1>
        <p className="mt-8 max-w-xl text-base font-semibold leading-5 text-white/95 sm:text-lg">
          Uma forma simples de encontrar psicólogos que realmente<br className="hidden sm:block"/> fazem sentido para você.
        </p>
        <img src={heroPuzzle} alt="Duas pessoas unindo peças de quebra-cabeça" className="mt-7 w-full max-w-[410px] bg-transparent object-contain"/>
        <div className="mt-12 grid w-full max-w-[650px] gap-6 sm:grid-cols-2">
          <button onClick={()=>choose('cliente')} className="hero-choice-btn">Entrar como cliente</button>
          <button onClick={()=>choose('psicologo')} className="hero-choice-btn">Entrar como psicólogo</button>
        </div>
      </div>
    </section>

    <section id="como" className="page-shell pb-24 pt-16 text-center">
      <p className="eyebrow">Como funciona</p>
      <h2 className="heading-display mt-3 text-4xl italic text-sage-700 dark:text-sage-50 sm:text-6xl">Um caminho simples<br/>para cuidar de você</h2>
      <p className="mx-auto mt-5 max-w-lg text-sage-600 dark:text-sage-300">Nossa plataforma conecta você aos profissionais ideais de forma rápida, segura e personalizada.</p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {([[ClipboardCheck,'Responder perguntas','Conte-nos sobre suas necessidades e preferências em um formulário acolhedor.'],[Sparkles,'Receber sugestões','A triagem organiza as informações e encontra perfis compatíveis.'],[HandHeart,'Escolher com segurança','Explore os perfis, compare opções e decida com mais confiança.']] as const).map(([Icon,title,text],i)=><Card key={title} className="interactive-card p-7 text-left">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-100 text-sage-700 shadow-sm dark:bg-white/10 dark:text-sage-100"><Icon size={26}/></span>
          <span className="mt-6 block text-xs font-bold text-sage-500 dark:text-sage-400">0{i+1}</span>
          <h3 className="mt-2 text-xl font-semibold">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-sage-600 dark:text-sage-300">{text}</p>
        </Card>)}
      </div>
    </section>

    <section id="diferencial" className="page-shell pb-24">
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <Card className="interactive-card overflow-hidden p-7 sm:p-9">
          <p className="eyebrow">Antes</p>
          <h2 className="heading-display mt-3 text-4xl italic text-sage-700 dark:text-sage-50">Uma lista que não entende seu momento</h2>
          <div className="mt-7 space-y-3">
            {['Muitos perfis parecidos','Escolha baseada só em preço','Pouca clareza sobre compatibilidade'].map(item=><div key={item} className="flex items-center gap-3 rounded-2xl bg-sage-50 p-4 text-sm text-sage-600 dark:bg-white/5 dark:text-sage-300"><Search size={17}/>{item}</div>)}
          </div>
        </Card>
        <Card className="interactive-card overflow-hidden bg-gradient-to-br from-sage-700 to-sage-500 p-7 text-white dark:from-[#172d26] dark:to-[#24463a] sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-100">Depois</p>
          <h2 className="heading-display mt-3 text-4xl italic">Recomendações com mais sentido</h2>
          <div className="mt-7 space-y-3">
            {['Triagem inicial acolhedora','Profissionais alinhados ao seu perfil','Escolha com mais confiança'].map(item=><div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white"><Check size={17}/>{item}</div>)}
          </div>
        </Card>
      </div>
    </section>

    <section id="previa-triagem" className="relative overflow-hidden bg-[#efe5d8] py-28 transition-colors duration-700 dark:bg-[#0d1713]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-cream via-cream/70 to-transparent dark:from-[#08110e] dark:via-[#08110e]/70"/>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-cream/50 to-cream dark:via-[#08110e]/50 dark:to-[#08110e]"/>
      <div className="page-shell relative z-10 grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Prévia da triagem</p>
          <h2 className="heading-display mt-3 text-5xl italic text-sage-700 dark:text-sage-50">Perguntas simples, escolhas mais humanas</h2>
          <p className="mt-5 max-w-md text-sage-600 dark:text-sage-300">A triagem não substitui o atendimento psicológico. Ela só ajuda a organizar preferências para aproximar você de profissionais compatíveis.</p>
        </div>
        <Card className="p-6 sm:p-8">
          <div className="space-y-4">
            <ScreeningPreview number="01" question="Qual tema você gostaria de trabalhar primeiro?" answer="Ansiedade, autoestima, relacionamentos..."/>
            <ScreeningPreview number="02" question="Como você prefere ser atendido(a)?" answer="Online, presencial ou ambos."/>
            <ScreeningPreview number="03" question="Qual faixa de valor faz sentido para você?" answer="A plataforma considera sua realidade antes de sugerir."/>
          </div>
        </Card>
      </div>
    </section>

    <section id="seguranca" className="page-shell py-24">
      <Card className="grid items-center gap-8 overflow-hidden p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-[36px] bg-sage-100 text-sage-700 shadow-card dark:bg-white/10 dark:text-sage-100"><ShieldCheck size={48}/></div>
        <div>
          <p className="eyebrow">Segurança e ética</p>
          <h2 className="heading-display mt-3 text-4xl italic text-sage-700 dark:text-sage-50">O Vínculo aproxima, mas não diagnostica</h2>
          <p className="mt-4 max-w-2xl leading-7 text-sage-600 dark:text-sage-300">A plataforma não realiza diagnóstico, não substitui avaliação clínica e não promete resultados terapêuticos. O objetivo é tornar a busca por psicólogos mais acolhedora, organizada e transparente.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <EthicItem icon={<UserCheck size={18}/>} text="Usuário escolhe o profissional"/>
            <EthicItem icon={<ShieldCheck size={18}/>} text="Dados usados com cuidado"/>
            <EthicItem icon={<ListChecks size={18}/>} text="Informações claras no perfil"/>
          </div>
        </div>
      </Card>
    </section>

    <section id="duvidas" className="relative overflow-hidden bg-[#efe5d8] py-28 transition-colors duration-700 dark:bg-[#0d1713]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream via-cream/60 to-transparent dark:from-[#08110e] dark:via-[#08110e]/70"/>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-cream/50 to-cream dark:via-[#08110e]/50 dark:to-[#08110e]"/>
      <div className="page-shell relative z-10">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="heading-display mt-3 text-5xl italic text-sage-700 dark:text-sage-50">Dúvidas frequentes</h2>
          <p className="mt-4 text-sage-600 dark:text-sage-300">Respostas simples para deixar sua experiência mais segura.</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {[
            ['Como o sistema encontra psicólogos compatíveis?','Cruzamos suas preferências de atendimento, objetivos, disponibilidade e faixa de valor com os perfis profissionais cadastrados.'],
            ['O Vínculo realiza diagnósticos?','Não. A plataforma facilita o encontro entre pessoas e profissionais; qualquer avaliação clínica cabe exclusivamente ao psicólogo.'],
            ['Preciso pagar para utilizar a plataforma?','A descoberta e a triagem são gratuitas. O pagamento da sessão é combinado conforme o valor exibido no perfil.']
          ].map(([q,a],i)=><button key={q} onClick={()=>setFaq(faq===i?null:i)} className="surface interactive-card w-full p-5 text-left"><span className="flex items-center gap-5"><strong className="text-sage-400">0{i+1}</strong><span className="flex-1 font-medium">{q}</span><span className="text-xl">{faq===i?'−':'+'}</span></span>{faq===i&&<p className="ml-11 mt-4 max-w-2xl text-sm leading-6 text-sage-600 dark:text-sage-300">{a}</p>}</button>)}
        </div>
      </div>
    </section>

    <section id="depoimentos" className="page-shell py-24">
      <div className="text-center">
        <p className="eyebrow">Depoimentos</p>
        <h2 className="heading-display mt-3 text-5xl italic text-sage-700 dark:text-sage-50">Histórias que inspiram vínculos</h2>
        <p className="mx-auto mt-4 max-w-xl text-sage-600 dark:text-sage-300">Relatos demonstrativos de como queremos que a experiência na plataforma seja.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ['MS','Mariana S.','Cliente','A triagem tornou a busca mais leve e me ajudou a encontrar alguém alinhado ao que eu precisava.'],
          ['CR','Camila R.','Psicóloga','Consigo apresentar meu trabalho com cuidado e receber solicitações de pessoas que combinam com meu perfil.'],
          ['LF','Lucas F.','Cliente','O agendamento foi simples e o perfil profissional trouxe as informações que eu precisava para decidir.']
        ].map(([initials,name,role,text])=><Card key={name} className="interactive-card flex h-full flex-col p-7"><Quote className="text-sage-300" size={32}/><div className="mt-4 flex gap-1 text-amber-400">{Array.from({length:5},(_,i)=><Star key={i} size={15} fill="currentColor"/>)}</div><p className="mt-4 flex-1 leading-7 text-sage-700 dark:text-sage-200">“{text}”</p><div className="mt-6 flex items-center gap-3 border-t border-sage-100 pt-5 dark:border-white/10"><span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sm font-bold text-sage-700 dark:bg-white/10 dark:text-sage-100">{initials}</span><div><p className="font-semibold">{name}</p><p className="text-xs text-sage-500 dark:text-sage-400">{role} · relato demonstrativo</p></div></div></Card>)}
      </div>
    </section>

    <section id="contato" className="relative overflow-hidden bg-sage-700 py-24 text-white transition-colors duration-700 dark:bg-[#0b1411]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(255,255,255,.14),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(186,202,193,.18),transparent_28%)]"/>
      <div className="page-shell relative grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-sage-200">Contato</p><h2 className="heading-display mt-4 text-6xl italic">Vamos nos vincular?</h2><p className="mt-5 max-w-md text-sage-100">Fale com a gente para tirar dúvidas, sugerir melhorias ou construir uma parceria.</p></div>
        <form className="rounded-[28px] border border-white/20 bg-white/95 p-6 text-ink shadow-glow backdrop-blur transition-colors duration-700 dark:bg-white/10 dark:text-sage-50 sm:p-8" onSubmit={e=>e.preventDefault()}><div className="grid gap-4 sm:grid-cols-2"><Input label="Nome completo" placeholder="Seu nome"/><Input label="E-mail" type="email" placeholder="contato@email.com"/></div><Input label="Assunto" placeholder="Como podemos ajudar?" className="mt-1"/><label className="mt-4 block text-sm font-medium">Mensagem<textarea className="focus-ring mt-2 min-h-28 w-full rounded-xl border border-sage-200 bg-white/90 p-4 transition-colors duration-700 dark:border-white/20 dark:bg-[#0d1713]" placeholder="Escreva sua mensagem..."/></label><button className="hero-choice-btn mt-5 w-full" type="submit">Enviar mensagem</button></form>
      </div>
    </section>

    <footer className="bg-sage-800 text-sage-100 transition-colors duration-700 dark:bg-[#070d0b]"><div className="page-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><Logo light/><p className="mt-5 max-w-sm text-sm leading-6 text-sage-200">Um espaço acolhedor para aproximar pessoas e profissionais de psicologia com mais compatibilidade, informação e cuidado.</p><div className="mt-5 flex gap-3"><a aria-label="Instagram" href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"><Instagram size={18}/></a><a aria-label="E-mail" href="mailto:contato@vinculo.com.br" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"><Mail size={18}/></a></div></div><FooterColumn title="Para clientes" links={[['Encontrar psicólogo','#inicio'],['Fazer triagem','/cadastro/cliente'],['Entrar','/entrar']]}/><FooterColumn title="Para psicólogos" links={[['Criar perfil','/cadastro/psicologo'],['Área profissional','/entrar'],['Planos','/cadastro/psicologo']]}/><FooterColumn title="Informações" links={[['Dúvidas','#duvidas'],['Contato','#contato'],['Privacidade','#'],['Termos de uso','#']]}/></div><div className="border-t border-white/10"><div className="page-shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-sage-300 sm:flex-row"><p>© 2026 O Vínculo. Todos os direitos reservados.</p><p className="flex items-center gap-2"><ShieldCheck size={14}/>Ambiente protegido <span>·</span><Heart size={14}/>Cuidado com propósito</p></div></div></footer>
  </div>
}

function ScreeningPreview({number,question,answer}:{number:string;question:string;answer:string}){return <div className="rounded-3xl border border-sage-100 bg-sage-50/80 p-5 dark:border-white/10 dark:bg-white/5"><span className="text-xs font-bold tracking-[.18em] text-sage-400">{number}</span><h3 className="mt-2 font-semibold text-sage-800 dark:text-sage-50">{question}</h3><p className="mt-2 text-sm text-sage-600 dark:text-sage-300">{answer}</p></div>}
function EthicItem({icon,text}:{icon:React.ReactNode;text:string}){return <div className="flex items-center gap-2 rounded-2xl bg-sage-50 p-3 text-sm font-medium text-sage-700 dark:bg-white/5 dark:text-sage-200">{icon}{text}</div>}
function FooterColumn({title,links}:{title:string;links:[string,string][]}){return <div><h3 className="font-semibold text-white">{title}</h3><ul className="mt-4 space-y-3 text-sm text-sage-200">{links.map(([label,href])=><li key={label}><a href={href} className="transition hover:text-white">{label}</a></li>)}</ul></div>}

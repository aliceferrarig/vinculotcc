import { useState } from 'react'
import {
  ArrowRight,
  ClipboardCheck,
  HandHeart,
  Heart,
  Instagram,
  Mail,
  Quote,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, Logo } from '../components/ui'
import heroPuzzle from '../assets/hero-quebra-cabeca.png'

export function Landing() {
  const [faq, setFaq] = useState<number | null>(null)
  const navigate = useNavigate()

  const choose = (role: 'cliente' | 'psicologo') => navigate(`/cadastro/${role}`)

  return (
    <div className="bg-cream">
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sage-700 via-sage-400 to-[#f8efe4] text-white">
        <header className="page-shell relative z-10 flex h-24 items-center justify-between">
          <Logo light />

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
            <a href="#como" className="transition hover:text-white">Como funciona</a>
            <a href="#duvidas" className="transition hover:text-white">Dúvidas</a>
            <a href="#depoimentos" className="transition hover:text-white">Depoimentos</a>
            <a href="#contato" className="transition hover:text-white">Contato</a>
          </nav>

          <Button variant="outline" onClick={() => navigate('/entrar')}>
            Entrar
          </Button>
        </header>

        <div className="page-shell relative z-10 grid min-h-[calc(100vh-96px)] items-center gap-14 pb-16 pt-6 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-3xl text-center lg:text-left">
            <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-white/90 backdrop-blur">
              Cuidado que combina com você
            </span>

            <h1 className="heading-display mt-7 text-5xl leading-[0.98] text-white sm:text-6xl lg:text-[82px]">
              Encontre o psicólogo ideal para você
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg lg:text-xl">
              Uma forma simples, segura e personalizada de encontrar profissionais que realmente fazem sentido para o seu momento.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:max-w-xl">
              <Button
                variant="outline"
                full
                onClick={() => choose('cliente')}
              >
                Encontrar meu psicólogo
              </Button>

              <Button
                full
                className="bg-sage-900 text-white hover:bg-sage-800"
                onClick={() => choose('psicologo')}
              >
                Sou psicólogo(a)
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="rounded-[42px] border border-white/25 bg-white/15 p-6 backdrop-blur-sm">
              <div className="rounded-[34px] bg-[#eef3ed]/75 p-8">
                <img
                  src={heroPuzzle}
                  alt="Duas pessoas unindo peças de quebra-cabeça"
                  className="mx-auto w-full max-w-xl object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como" className="page-shell py-24 text-center">
        <p className="eyebrow">Como funciona</p>

        <h2 className="heading-display mt-3 text-4xl italic text-sage-700 sm:text-6xl">
          Um caminho simples<br />para cuidar de você
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sage-600">
          Nossa plataforma conecta você aos profissionais ideais de forma rápida, segura e personalizada.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {([
            [ClipboardCheck, 'Responder perguntas', 'Conte-nos sobre suas necessidades e preferências em um formulário acolhedor.'],
            [Sparkles, 'Receber sugestões', 'A triagem organiza as informações e encontra perfis compatíveis.'],
            [HandHeart, 'Escolher com segurança', 'Explore os perfis, compare opções e decida com mais confiança.']
          ] as const).map(([Icon, title, text], i) => (
            <Card key={title} className="p-7 text-left">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-100 text-sage-700">
                <Icon size={26} />
              </span>

              <span className="mt-6 block text-xs font-bold text-sage-500">
                0{i + 1}
              </span>

              <h3 className="mt-2 text-xl font-semibold">{title}</h3>

              <p className="mt-3 text-sm leading-6 text-sage-600">
                {text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="duvidas" className="relative bg-[#efe5d8] py-24">
        <div className="page-shell">
          <div className="text-center">
            <p className="eyebrow">FAQ</p>

            <h2 className="heading-display mt-3 text-5xl italic text-sage-700">
              Dúvidas frequentes
            </h2>

            <p className="mt-4 text-sage-600">
              Respostas simples para deixar sua experiência mais segura.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {[
              [
                'Como o sistema encontra psicólogos compatíveis?',
                'Cruzamos suas preferências de atendimento, objetivos, disponibilidade e faixa de valor com os perfis profissionais cadastrados.'
              ],
              [
                'O Vínculo realiza diagnósticos?',
                'Não. A plataforma facilita o encontro entre pessoas e profissionais; qualquer avaliação clínica cabe exclusivamente ao psicólogo.'
              ],
              [
                'Preciso pagar para utilizar a plataforma?',
                'A descoberta e a triagem são gratuitas. O pagamento da sessão é combinado conforme o valor exibido no perfil.'
              ]
            ].map(([q, a], i) => (
              <button
                key={q}
                onClick={() => setFaq(faq === i ? null : i)}
                className="surface w-full p-5 text-left"
              >
                <span className="flex items-center gap-5">
                  <strong className="text-sage-400">0{i + 1}</strong>
                  <span className="flex-1 font-medium">{q}</span>
                  <span className="text-xl">{faq === i ? '−' : '+'}</span>
                </span>

                {faq === i && (
                  <p className="ml-11 mt-4 max-w-2xl text-sm leading-6 text-sage-600">
                    {a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="page-shell py-24">
        <div className="text-center">
          <p className="eyebrow">Depoimentos</p>

          <h2 className="heading-display mt-3 text-5xl italic text-sage-700">
            Histórias que inspiram vínculos
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sage-600">
            Relatos demonstrativos de como queremos que a experiência na plataforma seja.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['MS', 'Mariana S.', 'Cliente', 'A triagem tornou a busca mais leve e me ajudou a encontrar alguém alinhado ao que eu precisava.'],
            ['CR', 'Camila R.', 'Psicóloga', 'Consigo apresentar meu trabalho com cuidado e receber solicitações de pessoas que combinam com meu perfil.'],
            ['LF', 'Lucas F.', 'Cliente', 'O agendamento foi simples e o perfil profissional trouxe as informações que eu precisava para decidir.']
          ].map(([initials, name, role, text]) => (
            <Card key={name} className="flex h-full flex-col p-7">
              <Quote className="text-sage-300" size={32} />

              <div className="mt-4 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>

              <p className="mt-4 flex-1 leading-7 text-sage-700">
                “{text}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-sage-100 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 text-sm font-bold text-sage-700">
                  {initials}
                </span>

                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-sage-500">{role} · relato demonstrativo</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="contato" className="relative bg-sage-700 py-24 text-white">
        <div className="page-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-sage-200">
              Contato
            </p>

            <h2 className="heading-display mt-4 text-6xl italic">
              Vamos nos vincular?
            </h2>

            <p className="mt-5 max-w-md text-sage-100">
              Fale com a gente para tirar dúvidas, sugerir melhorias ou construir uma parceria.
            </p>
          </div>

          <form
            className="rounded-[28px] bg-white p-6 text-ink sm:p-8"
            onSubmit={e => e.preventDefault()}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nome completo" placeholder="Seu nome" />
              <Input label="E-mail" type="email" placeholder="contato@email.com" />
            </div>

            <Input label="Assunto" placeholder="Como podemos ajudar?" className="mt-1" />

            <label className="mt-4 block text-sm font-medium">
              Mensagem
              <textarea
                className="focus-ring mt-2 min-h-28 w-full rounded-xl border border-sage-200 p-4"
                placeholder="Escreva sua mensagem..."
              />
            </label>

            <Button full className="mt-5">
              Enviar mensagem
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-sage-800 text-sage-100">
        <div className="page-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />

            <p className="mt-5 max-w-sm text-sm leading-6 text-sage-200">
              Um espaço acolhedor para aproximar pessoas e profissionais de psicologia com mais compatibilidade, informação e cuidado.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                aria-label="Instagram"
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Instagram size={18} />
              </a>

              <a
                aria-label="E-mail"
                href="mailto:contato@vinculo.com.br"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Para clientes"
            links={[
              ['Encontrar psicólogo', '#como'],
              ['Fazer triagem', '/cadastro/cliente'],
              ['Entrar', '/entrar']
            ]}
          />

          <FooterColumn
            title="Para psicólogos"
            links={[
              ['Criar perfil', '/cadastro/psicologo'],
              ['Área profissional', '/entrar'],
              ['Planos', '/cadastro/psicologo']
            ]}
          />

          <FooterColumn
            title="Informações"
            links={[
              ['Dúvidas', '#duvidas'],
              ['Contato', '#contato'],
              ['Privacidade', '#'],
              ['Termos de uso', '#']
            ]}
          />
        </div>

        <div className="border-t border-white/10">
          <div className="page-shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-sage-300 sm:flex-row">
            <p>© 2026 O Vínculo. Todos os direitos reservados.</p>

            <p className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Ambiente protegido
              <span>·</span>
              <Heart size={14} />
              Cuidado com propósito
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-semibold text-white">{title}</h3>

      <ul className="mt-4 space-y-3 text-sm text-sage-200">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition hover:text-white">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
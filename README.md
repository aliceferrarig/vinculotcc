# O Vínculo

Protótipo funcional do TCC para conectar pacientes e psicólogos por meio de descoberta guiada, triagem e compatibilidade.

## Arquitetura

- `AuthLayout`: login, cadastro e escolha de perfil.
- `ClientLayout`: descoberta, triagem, resultados, perfil profissional, favoritos, consultas e agendamento.
- `PsychologistLayout`: dashboard, edição de perfil, disponibilidade, agenda, solicitações e assinatura.
- `components/ui`: componentes visuais reutilizáveis (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Stepper`).
- `data`: dados simulados isolados da interface, prontos para substituição por API.
- `pages`: páginas organizadas por domínio (`auth`, `client`, `psychologist`).

## Fluxos

```text
Landing → Escolha de perfil → Login/Cadastro
Cliente → Descoberta → Triagem (6 etapas) → Resultados → Perfil → Agendamento (3 etapas)
Psicólogo → Dashboard → Perfil / Disponibilidade / Agenda / Solicitações / Plano
```

## Configurar o Supabase

1. Execute `supabase/schema-completo.sql` no SQL Editor de um projeto novo.
2. Se o schema antigo já foi executado, rode apenas `supabase/atualizacao-perfis-profissionais.sql`.
3. Copie `.env.example` para `.env.local` e preencha a Project URL e a Publishable key.

O cadastro de psicólogo cria automaticamente o usuário, perfil profissional e especialidades. Os novos perfis aparecem em **Psicólogos mais procurados**; não existe mais um perfil padrão da Ana Carolina.

Após o primeiro login, ambos os tipos de conta passam pela etapa de foto. Para psicólogos ela é obrigatória e o perfil permanece oculto da descoberta até o upload; para clientes ela é opcional.

Antes do upload, o editor de imagem permite aplicar zoom e reposicionar o enquadramento horizontal e verticalmente. O recorte quadrado é gerado no navegador e só então enviado ao Storage.

## Executar

```bash
pnpm install
pnpm dev
```

Para gerar a versão de produção: `pnpm build`.

> As métricas históricas do dashboard continuam demonstrativas. Autenticação, perfis, descoberta, favoritos, agendamentos, edição profissional e disponibilidade utilizam o Supabase.

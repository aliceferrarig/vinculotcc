# O Vínculo

Protótipo funcional do TCC para conectar pacientes e psicólogos por meio de descoberta guiada, triagem e compatibilidade.

## Arquitetura

- `AuthLayout`: login, cadastro e escolha de perfil.
- `ClientLayout`: descoberta, triagem, resultados, perfil profissional, favoritos, consultas e agendamento.
- `PsychologistLayout`: dashboard, edição de perfil, disponibilidade, agenda, solicitações e assinatura.
- `components/ui`: componentes visuais reutilizáveis (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Stepper`).
- `services`: integração real com autenticação, banco e Storage do Supabase.
- `pages`: páginas organizadas por domínio (`auth`, `client`, `psychologist`).

## Identidade visual

- Tipografia única: **DM Sans** em toda a interface.
- Logo oficial aplicada nos cabeçalhos, menus, autenticação, modal e rodapé.
- Ilustração oficial do quebra-cabeça aplicada ao destaque inicial.
- Folhagem oficial reutilizada nos detalhes decorativos.
- Todos os três arquivos visuais estão em PNG com fundo transparente em `src/assets`.

## Fluxos

```text
Landing → Escolha de perfil → Login/Cadastro
Cliente → Descoberta → Triagem (6 etapas) → Resultados → Perfil → Agendamento (3 etapas)
Psicólogo → Dashboard → Perfil / Disponibilidade / Agenda / Solicitações / Plano
```

## Configurar o Supabase

1. Execute `supabase/schema-completo.sql` no SQL Editor de um projeto novo.
2. Se o schema antigo já foi executado, rode `supabase/atualizacao-perfis-profissionais.sql` e depois `supabase/atualizacao-relacoes-reais.sql`.
3. Para contas que entram no Supabase Auth, mas não possuem registro em `perfis`, execute `supabase/corrigir-login-perfis.sql`.
4. Copie `.env.example` para `.env.local` e preencha a Project URL e a Publishable key.

O cadastro de psicólogo cria automaticamente o usuário, perfil profissional e especialidades. Os novos perfis aparecem em **Psicólogos mais procurados**; não existe mais um perfil padrão da Ana Carolina.

Após o primeiro login, ambos os tipos de conta passam pela etapa de foto. Para psicólogos ela é obrigatória e o perfil permanece oculto da descoberta até o upload; para clientes ela é opcional.

Antes do upload, o editor de imagem permite aplicar zoom e reposicionar o enquadramento horizontal e verticalmente. O recorte quadrado é gerado no navegador e só então enviado ao Storage.

## Executar

```bash
pnpm install
pnpm dev
```

Para gerar a versão de produção: `pnpm build`.

> Apenas os números históricos do dashboard e o ranking visual podem continuar demonstrativos. Cadastro, perfis, disponibilidade, agendamentos, solicitações, pacientes, avaliações, favoritos e mensagens usam contas e registros reais do Supabase.

# Correções aplicadas - V2

## Críticos

- `src/pages/psychologist/Dashboard.tsx`
  - Removeu `mockData.ts`.
  - Passou a carregar métricas, agenda, solicitações e avaliações pelo Supabase usando `getProfessionalDashboardSummary()`.
  - Removeu métricas fixas como `1.248`, `342`, `26`, `398`.

- `src/services/professionalData.ts`
  - Criou o resumo real do dashboard do psicólogo.
  - Usa `agendamentos`, `favoritos`, `avaliacoes` e `assinaturas`.
  - Mantém `views` como `null`, pois não existe tabela/coluna de visualizações no schema atual.

- `src/hooks/useCurrentProfile.ts`
  - Agora escuta `supabase.auth.onAuthStateChange`.
  - Atualiza o perfil em login, logout e mudanças de sessão.
  - Continua ouvindo o evento `vinculo:profile-updated`.

- `src/services/availability.ts`
  - `getAvailability()` agora busca `hora_fim`.
  - `endTime` deixou de vir vazio.

## Moderados

- `src/pages/client/Booking.tsx`
  - Removeu a heurística frágil de modalidade.
  - Quando o psicólogo atende `ambos`, o cliente escolhe entre online e presencial.
  - Quando o psicólogo atende só uma modalidade, a tela mostra a modalidade fixa.

- `src/services/psychologists.ts`
  - Adicionou `rawMode` no tipo `ListedPsychologist`.
  - Isso permite o agendamento saber se o profissional atende `online`, `presencial` ou `ambos`.

- `src/services/professionalProfile.ts`
  - Adicionou `active` ao perfil profissional.
  - Ao salvar, `perfil_ativo` fica verdadeiro apenas se houver foto.
  - Ao enviar foto, dispara `vinculo:profile-updated`.

- `src/pages/psychologist/EditProfile.tsx`
  - Adicionou aviso quando o perfil do psicólogo ainda não está publicado.
  - Explica que o perfil só aparece na busca após adicionar foto.

- `supabase/schema-completo.sql`
  - Unificou as policies SELECT duplicadas de `perfis` em uma policy única.
  - Adicionou policy para psicólogo visualizar favoritos recebidos.

- `supabase/atualizacao-relacoes-reais.sql`
  - Agora remove as policies antigas antes de criar a policy unificada.
  - Também cria a policy de favoritos para o dashboard real conseguir contar favoritos recebidos.

## Validação

- `npm run build` executado com sucesso.

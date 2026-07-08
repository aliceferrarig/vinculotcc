# Correções aplicadas

## Críticas

- Dashboard do psicólogo deixou de usar `mockData.ts` e agora busca dados reais do Supabase via `getProfessionalDashboardSummary`.
- Métricas hardcoded foram removidas. Favoritos, solicitações, plano, consultas concluídas, avaliação média e taxa de resposta vêm do banco. Visualizações ficam como `—` porque não existe tabela de visualizações no schema atual.
- `useCurrentProfile` agora escuta `supabase.auth.onAuthStateChange`, atualizando o perfil em login, logout ou mudança de sessão.
- `getAvailability` agora seleciona `data` e `hora_fim`, preenchendo corretamente `endTime` nos horários.

## Moderadas

- `Booking.tsx` agora permite o cliente escolher entre online e presencial quando o psicólogo atende em `ambos`.
- Psicólogos sem foto/perfil publicado agora recebem aviso no dashboard e na tela de edição de perfil.
- Policies SELECT sobre `perfis` foram unificadas em uma única policy: `Usuário visualiza perfis permitidos`.

## Validação

- `npm run build` executado com sucesso após as alterações.

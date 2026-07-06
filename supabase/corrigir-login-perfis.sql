-- O VÍNCULO - CORREÇÃO DE LOGIN E PERFIS
-- Execute no Supabase: SQL Editor > New query > cole tudo > Run.

-- Recupera usuários antigos existentes no Auth que não possuem linha em perfis.
insert into public.perfis(id,nome,tipo_usuario)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data->>'nome',''),split_part(u.email,'@',1),'Usuário'),
  case when u.raw_user_meta_data->>'tipo_usuario'='psicologo' then 'psicologo' else 'cliente' end
from auth.users u
where not exists(select 1 from public.perfis p where p.id=u.id)
on conflict(id) do nothing;

-- Permite que uma conta autenticada recupere o próprio perfil caso ele esteja ausente.
create or replace function public.garantir_meu_perfil()
returns void
language plpgsql
security definer
set search_path=''
as $$
begin
  insert into public.perfis(id,nome,tipo_usuario)
  select
    u.id,
    coalesce(nullif(u.raw_user_meta_data->>'nome',''),split_part(u.email,'@',1),'Usuário'),
    case when u.raw_user_meta_data->>'tipo_usuario'='psicologo' then 'psicologo' else 'cliente' end
  from auth.users u
  where u.id=auth.uid()
  on conflict(id) do nothing;
end;
$$;

grant execute on function public.garantir_meu_perfil() to authenticated;

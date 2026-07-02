-- O VÍNCULO - ATUALIZAÇÃO PARA PERFIS PROFISSIONAIS
-- Use este arquivo se você já executou o schema completo anteriormente.
-- Supabase > SQL Editor > New query > cole este conteúdo > Run

create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  novo_psicologo_id uuid;
begin
  insert into public.perfis (id, nome, tipo_usuario)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    case
      when new.raw_user_meta_data ->> 'tipo_usuario' = 'psicologo' then 'psicologo'
      else 'cliente'
    end
  );

  if new.raw_user_meta_data ->> 'tipo_usuario' = 'psicologo' then
    insert into public.psicologos (
      perfil_id, crp, estado_crp, biografia, modalidade, valor_consulta, perfil_ativo
    ) values (
      new.id,
      new.raw_user_meta_data ->> 'crp',
      new.raw_user_meta_data ->> 'estado_crp',
      new.raw_user_meta_data ->> 'biografia',
      coalesce(new.raw_user_meta_data ->> 'modalidade', 'online'),
      coalesce((new.raw_user_meta_data ->> 'valor_consulta')::numeric, 0),
      false
    ) returning id into novo_psicologo_id;

    insert into public.psicologo_especialidades (psicologo_id, especialidade_id)
    select novo_psicologo_id, e.id
    from public.especialidades e
    where e.nome in (
      select jsonb_array_elements_text(
        coalesce(new.raw_user_meta_data -> 'especialidades', '[]'::jsonb)
      )
    );
  end if;

  return new;
end;
$$;

-- Recupera contas de psicólogo criadas antes desta atualização,
-- desde que os dados profissionais estejam presentes no metadata do Auth.
insert into public.psicologos (
  perfil_id, crp, estado_crp, biografia, modalidade, valor_consulta, perfil_ativo
)
select
  u.id,
  u.raw_user_meta_data ->> 'crp',
  u.raw_user_meta_data ->> 'estado_crp',
  u.raw_user_meta_data ->> 'biografia',
  coalesce(u.raw_user_meta_data ->> 'modalidade', 'online'),
  coalesce((u.raw_user_meta_data ->> 'valor_consulta')::numeric, 0),
  false
from auth.users u
join public.perfis p on p.id = u.id and p.tipo_usuario = 'psicologo'
where nullif(u.raw_user_meta_data ->> 'crp', '') is not null
  and nullif(u.raw_user_meta_data ->> 'estado_crp', '') is not null
  and not exists (select 1 from public.psicologos ps where ps.perfil_id = u.id);

-- Perfis profissionais sem foto deixam de aparecer na descoberta.
update public.psicologos ps
set perfil_ativo = false
from public.perfis p
where p.id = ps.perfil_id and nullif(p.foto_url, '') is null;

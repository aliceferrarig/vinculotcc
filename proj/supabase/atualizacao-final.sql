-- O VÍNCULO - ATUALIZAÇÃO FINAL
-- Execute uma vez no Supabase: SQL Editor > New query > cole tudo > Run.
-- Resolve: (1) psicólogo aparece assim que conclui o cadastro (foto opcional),
--          (2) dashboard com números reais, (3) triagem real, (4) assinatura simulada.

-- =========================================================
-- 1. PERFIL PROFISSIONAL ATIVO JÁ NO CADASTRO (FOTO OPCIONAL)
-- =========================================================

-- O trigger de criação passa a nascer com perfil_ativo = true.
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
      true
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

-- Reativa todos os perfis profissionais já existentes (inclusive sem foto).
update public.psicologos set perfil_ativo = true where perfil_ativo = false;

-- =========================================================
-- 2. DASHBOARD DO PSICÓLOGO - MÉTRICAS REAIS
-- =========================================================

create or replace function public.metricas_psicologo()
returns jsonb
language plpgsql
security definer set search_path = public, auth
as $$
declare
  v_psicologo uuid;
  v_favoritos int;
  v_solicitacoes int;
  v_pendentes int;
  v_confirmados int;
  v_concluidos int;
  v_media numeric;
  v_total_avaliacoes int;
  v_membro_desde date;
begin
  select id, created_at::date into v_psicologo, v_membro_desde
  from public.psicologos where perfil_id = auth.uid();
  if v_psicologo is null then raise exception 'Perfil profissional não encontrado.'; end if;

  select count(*) into v_favoritos from public.favoritos where psicologo_id = v_psicologo;
  select count(*) into v_solicitacoes from public.agendamentos where psicologo_id = v_psicologo;
  select count(*) into v_pendentes from public.agendamentos where psicologo_id = v_psicologo and status = 'pendente';
  select count(*) into v_confirmados from public.agendamentos where psicologo_id = v_psicologo and status = 'confirmado';
  select count(*) into v_concluidos from public.agendamentos where psicologo_id = v_psicologo and status = 'concluido';
  select coalesce(round(avg(nota),1),0), count(*) into v_media, v_total_avaliacoes
    from public.avaliacoes where psicologo_id = v_psicologo;

  return jsonb_build_object(
    'favoritos', v_favoritos,
    'solicitacoes', v_solicitacoes,
    'pendentes', v_pendentes,
    'confirmados', v_confirmados,
    'concluidos', v_concluidos,
    'media_avaliacoes', v_media,
    'total_avaliacoes', v_total_avaliacoes,
    'membro_desde', v_membro_desde
  );
end;
$$;

grant execute on function public.metricas_psicologo() to authenticated;

-- =========================================================
-- 3. TRIAGEM REAL -> RECOMENDAÇÕES COM COMPATIBILIDADE
-- =========================================================
-- Recebe as respostas, calcula um score simples por psicólogo ativo
-- (especialidade desejada + modalidade + faixa de preço) e grava tudo.

create or replace function public.registrar_triagem(p_respostas jsonb)
returns uuid
language plpgsql
security definer set search_path = public, auth
as $$
declare
  v_cliente uuid := auth.uid();
  v_triagem uuid;
  v_tema text := p_respostas ->> 'tema';
  v_modalidade text := p_respostas ->> 'modalidade';
  v_preco_max numeric := nullif(p_respostas ->> 'preco_max','')::numeric;
  r record;
  v_score int;
begin
  if v_cliente is null then raise exception 'Faça login para fazer a triagem.'; end if;

  insert into public.triagens (cliente_id, respostas, concluida)
  values (v_cliente, p_respostas, true)
  returning id into v_triagem;

  for r in
    select ps.id,
           ps.modalidade,
           ps.valor_consulta,
           coalesce(bool_or(e.nome = v_tema), false) as tem_tema,
           coalesce(avg(a.nota),0) as media
    from public.psicologos ps
    left join public.psicologo_especialidades pe on pe.psicologo_id = ps.id
    left join public.especialidades e on e.id = pe.especialidade_id
    left join public.avaliacoes a on a.psicologo_id = ps.id
    where ps.perfil_ativo = true
    group by ps.id, ps.modalidade, ps.valor_consulta
  loop
    v_score := 55;
    if r.tem_tema then v_score := v_score + 25; end if;
    if v_modalidade is null or v_modalidade = 'tanto_faz'
       or r.modalidade = 'ambos' or r.modalidade = v_modalidade
       then v_score := v_score + 10; end if;
    if v_preco_max is null or r.valor_consulta <= v_preco_max
       then v_score := v_score + 6; end if;
    v_score := v_score + least(4, round(r.media)::int);
    v_score := least(99, v_score);

    insert into public.recomendacoes (triagem_id, psicologo_id, compatibilidade)
    values (v_triagem, r.id, v_score)
    on conflict (triagem_id, psicologo_id) do nothing;
  end loop;

  return v_triagem;
end;
$$;

grant execute on function public.registrar_triagem(jsonb) to authenticated;

-- =========================================================
-- 4. ASSINATURA SIMULADA (SEM COBRANÇA REAL)
-- =========================================================

create or replace function public.assinar_plano(p_plano_id bigint)
returns uuid
language plpgsql
security definer set search_path = public, auth
as $$
declare
  v_psicologo uuid;
  v_assinatura uuid;
begin
  select id into v_psicologo from public.psicologos where perfil_id = auth.uid();
  if v_psicologo is null then raise exception 'Somente psicólogos podem assinar planos.'; end if;
  if not exists(select 1 from public.planos where id = p_plano_id and ativo = true) then
    raise exception 'Plano indisponível.';
  end if;

  -- Cancela assinaturas ativas anteriores e cria a nova (last-write-wins).
  update public.assinaturas set status = 'cancelada', updated_at = now()
    where psicologo_id = v_psicologo and status = 'ativa';

  insert into public.assinaturas (psicologo_id, plano_id, status, data_inicio, data_renovacao)
  values (v_psicologo, p_plano_id, 'ativa', current_date, current_date + interval '30 days')
  returning id into v_assinatura;

  return v_assinatura;
end;
$$;

grant execute on function public.assinar_plano(bigint) to authenticated;

-- Garante que todo psicólogo tenha uma assinatura "Essencial" (grátis) por padrão.
insert into public.assinaturas (psicologo_id, plano_id, status, data_inicio)
select ps.id, pl.id, 'ativa', current_date
from public.psicologos ps
cross join lateral (select id from public.planos where nome = 'Essencial' limit 1) pl
where not exists (select 1 from public.assinaturas a where a.psicologo_id = ps.id);

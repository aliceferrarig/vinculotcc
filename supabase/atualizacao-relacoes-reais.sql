-- O VÍNCULO - RELAÇÕES REAIS ENTRE CLIENTES E PSICÓLOGOS
-- Execute uma vez no Supabase: SQL Editor > New query > Run.

-- Reativa perfis antigos que já têm a foto profissional obrigatória.
update public.psicologos ps set perfil_ativo=true
from public.perfis p
where p.id=ps.perfil_id and nullif(p.foto_url,'') is not null;

create or replace function public.criar_agendamento(
  p_disponibilidade_id uuid,
  p_modalidade text default 'online'
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_cliente uuid := auth.uid();
  v_slot public.disponibilidades%rowtype;
  v_psicologo public.psicologos%rowtype;
  v_agendamento uuid;
begin
  if v_cliente is null then raise exception 'Faça login para agendar.'; end if;
  if not exists(select 1 from public.perfis where id=v_cliente and tipo_usuario='cliente') then
    raise exception 'Somente clientes podem agendar.';
  end if;
  if p_modalidade not in ('online','presencial') then raise exception 'Modalidade inválida.'; end if;

  select * into v_slot from public.disponibilidades
  where id=p_disponibilidade_id for update;
  if not found or v_slot.status<>'disponivel' then raise exception 'Este horário não está mais disponível.'; end if;
  if v_slot.data<current_date then raise exception 'Não é possível agendar uma data passada.'; end if;

  select * into v_psicologo from public.psicologos
  where id=v_slot.psicologo_id and perfil_ativo=true;
  if not found then raise exception 'O perfil profissional não está ativo.'; end if;
  if v_psicologo.modalidade<>'ambos' and v_psicologo.modalidade<>p_modalidade then raise exception 'Modalidade não oferecida.'; end if;

  insert into public.agendamentos(cliente_id,psicologo_id,disponibilidade_id,data_consulta,hora_inicio,hora_fim,modalidade,valor,status)
  values(v_cliente,v_slot.psicologo_id,v_slot.id,v_slot.data,v_slot.hora_inicio,v_slot.hora_fim,p_modalidade,v_psicologo.valor_consulta,'pendente')
  returning id into v_agendamento;
  update public.disponibilidades set status='reservado' where id=v_slot.id;
  return v_agendamento;
end;
$$;

grant execute on function public.criar_agendamento(uuid,text) to authenticated;

create or replace function public.sincronizar_disponibilidade_agendamento()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.disponibilidade_id is not null and new.status='cancelado' and old.status<>'cancelado' then
    update public.disponibilidades set status='disponivel' where id=new.disponibilidade_id;
  end if;
  return new;
end;
$$;

drop trigger if exists sincronizar_disponibilidade_apos_agendamento on public.agendamentos;
create trigger sincronizar_disponibilidade_apos_agendamento
after update of status on public.agendamentos
for each row execute procedure public.sincronizar_disponibilidade_agendamento();

drop policy if exists "Participantes visualizam perfis relacionados" on public.perfis;
create policy "Participantes visualizam perfis relacionados"
on public.perfis for select to authenticated using (
  exists(
    select 1 from public.agendamentos a join public.psicologos ps on ps.id=a.psicologo_id
    where (a.cliente_id=perfis.id and ps.perfil_id=(select auth.uid()))
       or (ps.perfil_id=perfis.id and a.cliente_id=(select auth.uid()))
  )
  or exists(
    select 1 from public.mensagens m
    where (m.remetente_id=(select auth.uid()) and m.destinatario_id=perfis.id)
       or (m.destinatario_id=(select auth.uid()) and m.remetente_id=perfis.id)
  )
);

-- CineMood + Supabase do zero
-- Rode este arquivo no SQL Editor de um projeto Supabase novo.
-- Cria Auth profile, backup dos filmes, clubes privados, votação, avaliações e Storage de foto.

create extension if not exists pgcrypto;

-- =========================
-- Helpers
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================
-- Perfis de usuário
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'usuário',
  full_name text,
  bio text,
  avatar_url text,
  avatar_path text,
  favorite_genres integer[] not null default '{}'::integer[],
  streaming_platforms text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'usuário'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Preferências do usuário para recomendações e estatísticas de perfil
alter table public.profiles
  add column if not exists favorite_genres integer[] not null default '{}'::integer[];

alter table public.profiles
  add column if not exists streaming_platforms text[] not null default '{}'::text[];

-- =========================
-- Backup dos dados pessoais do app
-- =========================
create table if not exists public.user_movie_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_movie_data_set_updated_at on public.user_movie_data;
create trigger user_movie_data_set_updated_at
before update on public.user_movie_data
for each row execute function public.set_updated_at();

-- =========================
-- Clubes privados
-- =========================
create table if not exists public.movie_clubs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  invite_code text not null unique,
  is_private boolean not null default true,
  allowed_genres integer[] not null default array[28,12,16,35,18,10751,14,27,9648,10749,878,53],
  active_movie jsonb,
  active_club_movie_id uuid,
  movie_week_start date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  nickname text,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create table if not exists public.club_movies (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  movie jsonb not null,
  movie_tmdb_id integer not null,
  suggested_by uuid references public.profiles(id) on delete set null,
  week_start date not null default current_date,
  status text not null default 'suggested' check (status in ('suggested', 'voting', 'selected', 'watched')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.club_movie_votes (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  club_movie_id uuid not null references public.club_movies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, user_id, week_start)
);

create table if not exists public.club_movie_seen (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  club_movie_id uuid not null references public.club_movies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_movie_id, user_id)
);

create table if not exists public.club_reviews (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  club_movie_id uuid not null references public.club_movies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_movie_id, user_id)
);

create table if not exists public.club_private_comments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.movie_clubs(id) on delete cascade,
  club_movie_id uuid not null references public.club_movies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_movie_id, user_id)
);

create index if not exists movie_clubs_invite_code_idx on public.movie_clubs(invite_code);
create index if not exists club_members_user_id_idx on public.club_members(user_id);
create index if not exists club_members_club_id_idx on public.club_members(club_id);
create index if not exists club_movies_club_week_idx on public.club_movies(club_id, week_start);
create index if not exists club_movie_votes_movie_idx on public.club_movie_votes(club_movie_id);
create index if not exists club_movie_seen_movie_idx on public.club_movie_seen(club_movie_id);
create index if not exists club_movie_seen_user_idx on public.club_movie_seen(user_id, club_movie_id);
create index if not exists club_reviews_movie_idx on public.club_reviews(club_movie_id);
create index if not exists club_private_comments_user_idx on public.club_private_comments(user_id, club_movie_id);

-- updated_at triggers
drop trigger if exists movie_clubs_set_updated_at on public.movie_clubs;
create trigger movie_clubs_set_updated_at
before update on public.movie_clubs
for each row execute function public.set_updated_at();

drop trigger if exists club_members_set_updated_at on public.club_members;
create trigger club_members_set_updated_at
before update on public.club_members
for each row execute function public.set_updated_at();

drop trigger if exists club_movies_set_updated_at on public.club_movies;
create trigger club_movies_set_updated_at
before update on public.club_movies
for each row execute function public.set_updated_at();

drop trigger if exists club_movie_votes_set_updated_at on public.club_movie_votes;
create trigger club_movie_votes_set_updated_at
before update on public.club_movie_votes
for each row execute function public.set_updated_at();

drop trigger if exists club_movie_seen_set_updated_at on public.club_movie_seen;
create trigger club_movie_seen_set_updated_at
before update on public.club_movie_seen
for each row execute function public.set_updated_at();

drop trigger if exists club_reviews_set_updated_at on public.club_reviews;
create trigger club_reviews_set_updated_at
before update on public.club_reviews
for each row execute function public.set_updated_at();

drop trigger if exists club_private_comments_set_updated_at on public.club_private_comments;
create trigger club_private_comments_set_updated_at
before update on public.club_private_comments
for each row execute function public.set_updated_at();

-- =========================
-- Funções seguras de clube
-- =========================
create or replace function public.is_club_member(p_club_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.club_members
    where club_id = p_club_id and user_id = p_user_id
  );
$$;

create or replace function public.is_club_admin(p_club_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.club_members
    where club_id = p_club_id
      and user_id = p_user_id
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.create_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.club_members (club_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (club_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists movie_club_owner_membership on public.movie_clubs;
create trigger movie_club_owner_membership
after insert on public.movie_clubs
for each row execute function public.create_owner_membership();

create or replace function public.join_club_by_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_club_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select id into v_club_id
  from public.movie_clubs
  where invite_code = upper(trim(p_invite_code));

  if v_club_id is null then
    raise exception 'Clube não encontrado. Confira o código privado.';
  end if;

  insert into public.club_members (club_id, user_id, role)
  values (v_club_id, auth.uid(), 'member')
  on conflict (club_id, user_id) do nothing;

  return v_club_id;
end;
$$;

create or replace function public.regenerate_club_invite_code(p_club_id uuid, p_invite_code text)
returns public.movie_clubs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_club public.movie_clubs;
begin
  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode gerar novo código.';
  end if;

  update public.movie_clubs
  set invite_code = upper(trim(p_invite_code)), updated_at = now()
  where id = p_club_id
  returning * into v_club;

  return v_club;
end;
$$;

create or replace function public.delete_movie_club(p_club_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  if not exists (select 1 from public.movie_clubs where id = p_club_id and owner_id = auth.uid()) then
    raise exception 'Apenas o ADM criador pode excluir o clube.';
  end if;

  delete from public.movie_clubs where id = p_club_id and owner_id = auth.uid();
  return true;
end;
$$;

create or replace function public.update_club_member_nickname(p_club_id uuid, p_member_id uuid, p_nickname text)
returns public.club_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.club_members;
begin
  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode editar apelidos.';
  end if;

  update public.club_members
  set nickname = nullif(trim(coalesce(p_nickname, '')), ''), updated_at = now()
  where id = p_member_id and club_id = p_club_id
  returning * into v_member;

  if v_member.id is null then
    raise exception 'Membro não encontrado.';
  end if;

  return v_member;
end;
$$;


create or replace function public.set_club_member_role(p_club_id uuid, p_member_id uuid, p_role text)
returns public.club_members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.club_members;
  v_requester_role text;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select role into v_requester_role
  from public.club_members
  where club_id = p_club_id and user_id = auth.uid();

  if v_requester_role <> 'owner' then
    raise exception 'Apenas o ADM criador pode alterar permissões de ADM.';
  end if;

  if p_role not in ('admin', 'member') then
    raise exception 'Permissão inválida.';
  end if;

  select * into v_member
  from public.club_members
  where id = p_member_id and club_id = p_club_id;

  if v_member.id is null then
    raise exception 'Membro não encontrado.';
  end if;

  if v_member.role = 'owner' then
    raise exception 'O ADM criador não pode ter a permissão alterada.';
  end if;

  update public.club_members
  set role = p_role, updated_at = now()
  where id = p_member_id and club_id = p_club_id
  returning * into v_member;

  return v_member;
end;
$$;

create or replace function public.remove_club_member(p_club_id uuid, p_member_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode remover participantes.';
  end if;

  select role into v_role from public.club_members where id = p_member_id and club_id = p_club_id;
  if v_role is null then
    raise exception 'Membro não encontrado.';
  end if;

  if v_role = 'owner' then
    raise exception 'O ADM criador não pode ser removido.';
  end if;

  delete from public.club_members where id = p_member_id and club_id = p_club_id;
  return true;
end;
$$;

create or replace function public.leave_movie_club(p_club_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select role into v_role from public.club_members where club_id = p_club_id and user_id = auth.uid();
  if v_role is null then
    raise exception 'Você não participa deste clube.';
  end if;

  if v_role = 'owner' then
    raise exception 'O ADM criador precisa excluir o clube em vez de sair.';
  end if;

  delete from public.club_members where club_id = p_club_id and user_id = auth.uid();
  return true;
end;
$$;

create or replace function public.set_club_voting_candidates(p_club_id uuid, p_club_movie_ids uuid[], p_week_start date)
returns setof public.club_movies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := coalesce(array_length(p_club_movie_ids, 1), 0);
  v_valid_count int;
  v_week date := coalesce(p_week_start, current_date);
begin
  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode definir a votação.';
  end if;

  if v_count > 3 then
    raise exception 'A votação pode ter no máximo 3 filmes.';
  end if;

  if v_count > 0 then
    select count(*) into v_valid_count
    from public.club_movies
    where club_id = p_club_id
      and id = any(p_club_movie_ids)
      and status in ('suggested', 'voting');

    if v_valid_count <> v_count then
      raise exception 'Um dos filmes não pode entrar na votação.';
    end if;

    select week_start into v_week
    from public.club_movies
    where club_id = p_club_id and id = p_club_movie_ids[1];
  end if;

  update public.club_movies
  set status = 'suggested', updated_at = now()
  where club_id = p_club_id
    and week_start = v_week
    and status = 'voting';

  if v_count > 0 then
    update public.club_movies
    set status = 'voting', updated_at = now()
    where club_id = p_club_id
      and id = any(p_club_movie_ids)
      and status = 'suggested';

    return query
    select * from public.club_movies
    where club_id = p_club_id
      and id = any(p_club_movie_ids);
  end if;

  return;
end;
$$;

create or replace function public.vote_for_club_movie(p_club_id uuid, p_club_movie_id uuid)
returns public.club_movie_votes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_movie public.club_movies;
  v_vote public.club_movie_votes;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  if not public.is_club_member(p_club_id, auth.uid()) then
    raise exception 'Você não participa deste clube.';
  end if;

  select * into v_movie
  from public.club_movies
  where id = p_club_movie_id and club_id = p_club_id;

  if v_movie.id is null then
    raise exception 'Filme não encontrado neste clube.';
  end if;

  if v_movie.status <> 'voting' then
    raise exception 'Esse filme não está em votação.';
  end if;

  insert into public.club_movie_votes (club_id, club_movie_id, user_id, week_start)
  values (p_club_id, p_club_movie_id, auth.uid(), v_movie.week_start)
  on conflict (club_id, user_id, week_start)
  do update set club_movie_id = excluded.club_movie_id, updated_at = now()
  returning * into v_vote;

  return v_vote;
end;
$$;


create or replace function public.mark_club_movie_watched(p_club_movie_id uuid)
returns public.club_movies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_movie public.club_movies;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select * into v_movie
  from public.club_movies
  where id = p_club_movie_id;

  if v_movie.id is null then
    raise exception 'Filme não encontrado.';
  end if;

  if not public.is_club_admin(v_movie.club_id, auth.uid()) then
    raise exception 'Apenas ADM pode marcar filme como assistido.';
  end if;

  update public.club_movies
  set status = 'watched', updated_at = now()
  where id = p_club_movie_id
  returning * into v_movie;

  update public.movie_clubs
  set active_movie = v_movie.movie,
      active_club_movie_id = v_movie.id,
      movie_week_start = v_movie.week_start,
      updated_at = now()
  where id = v_movie.club_id;

  return v_movie;
end;
$$;

create or replace function public.select_weekly_movie(p_club_id uuid, p_club_movie_id uuid)
returns public.club_movies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_movie public.club_movies;
begin
  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode definir o filme da semana.';
  end if;

  select * into v_movie
  from public.club_movies
  where id = p_club_movie_id and club_id = p_club_id;

  if v_movie.id is null then
    raise exception 'Filme não encontrado neste clube.';
  end if;

  update public.club_movies
  set status = 'suggested', updated_at = now()
  where club_id = p_club_id
    and week_start = v_movie.week_start
    and status in ('selected', 'voting')
    and id <> p_club_movie_id;

  update public.club_movies
  set status = 'selected', updated_at = now()
  where id = p_club_movie_id
  returning * into v_movie;

  update public.movie_clubs
  set active_movie = v_movie.movie,
      active_club_movie_id = v_movie.id,
      movie_week_start = v_movie.week_start,
      updated_at = now()
  where id = p_club_id;

  return v_movie;
end;
$$;


create or replace function public.add_club_movie_suggestion(
  p_club_id uuid,
  p_movie jsonb,
  p_movie_tmdb_id integer,
  p_week_start date default current_date
)
returns public.club_movies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.club_movies;
  v_movie public.club_movies;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode adicionar filmes ao clube.';
  end if;

  select * into v_existing
  from public.club_movies
  where club_id = p_club_id
    and movie_tmdb_id = p_movie_tmdb_id
  order by
    case status
      when 'watched' then 0
      when 'selected' then 1
      when 'voting' then 2
      else 3
    end,
    created_at desc
  limit 1;

  if v_existing.id is not null then
    if v_existing.status = 'watched' then
      raise exception 'Esse filme já foi assistido pelo grupo e continua salvo no histórico.';
    else
      raise exception 'Esse filme já está nas sugestões, votação ou filme da semana.';
    end if;
  end if;

  insert into public.club_movies (
    club_id,
    movie,
    movie_tmdb_id,
    suggested_by,
    week_start,
    status
  )
  values (
    p_club_id,
    p_movie,
    p_movie_tmdb_id,
    auth.uid(),
    coalesce(p_week_start, current_date),
    'suggested'
  )
  returning * into v_movie;

  return v_movie;
end;
$$;

create or replace function public.remove_club_movie_suggestion(p_club_movie_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_movie public.club_movies;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select * into v_movie
  from public.club_movies
  where id = p_club_movie_id;

  if v_movie.id is null then
    return true;
  end if;

  if not public.is_club_admin(v_movie.club_id, auth.uid()) then
    raise exception 'Apenas ADM pode remover sugestões.';
  end if;

  if v_movie.status = 'watched' then
    raise exception 'Não é possível apagar um filme já assistido pela área de sugestões. Ele continua no histórico do clube.';
  end if;

  delete from public.club_movies
  where id = p_club_movie_id
    and status <> 'watched';

  return true;
end;
$$;

create or replace function public.clear_club_suggestions(p_club_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removed integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  if not public.is_club_admin(p_club_id, auth.uid()) then
    raise exception 'Apenas ADM pode limpar sugestões.';
  end if;

  with removed as (
    delete from public.club_movies
    where club_id = p_club_id
      and status in ('suggested', 'voting')
    returning id
  )
  select count(*)::integer into v_removed from removed;

  return v_removed;
end;
$$;

revoke all on function public.join_club_by_code(text) from public;
revoke all on function public.regenerate_club_invite_code(uuid, text) from public;
revoke all on function public.delete_movie_club(uuid) from public;
revoke all on function public.update_club_member_nickname(uuid, uuid, text) from public;
revoke all on function public.remove_club_member(uuid, uuid) from public;
revoke all on function public.set_club_member_role(uuid, uuid, text) from public;
revoke all on function public.leave_movie_club(uuid) from public;
revoke all on function public.set_club_voting_candidates(uuid, uuid[], date) from public;
revoke all on function public.vote_for_club_movie(uuid, uuid) from public;
revoke all on function public.select_weekly_movie(uuid, uuid) from public;
revoke all on function public.mark_club_movie_watched(uuid) from public;
revoke all on function public.add_club_movie_suggestion(uuid, jsonb, integer, date) from public;
revoke all on function public.remove_club_movie_suggestion(uuid) from public;
revoke all on function public.clear_club_suggestions(uuid) from public;

grant execute on function public.join_club_by_code(text) to authenticated;
grant execute on function public.regenerate_club_invite_code(uuid, text) to authenticated;
grant execute on function public.delete_movie_club(uuid) to authenticated;
grant execute on function public.update_club_member_nickname(uuid, uuid, text) to authenticated;
grant execute on function public.remove_club_member(uuid, uuid) to authenticated;
grant execute on function public.set_club_member_role(uuid, uuid, text) to authenticated;
grant execute on function public.leave_movie_club(uuid) to authenticated;
grant execute on function public.set_club_voting_candidates(uuid, uuid[], date) to authenticated;
grant execute on function public.vote_for_club_movie(uuid, uuid) to authenticated;
grant execute on function public.select_weekly_movie(uuid, uuid) to authenticated;
grant execute on function public.mark_club_movie_watched(uuid) to authenticated;
grant execute on function public.add_club_movie_suggestion(uuid, jsonb, integer, date) to authenticated;
grant execute on function public.remove_club_movie_suggestion(uuid) to authenticated;
grant execute on function public.clear_club_suggestions(uuid) to authenticated;

-- =========================
-- Storage para foto de perfil
-- =========================
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = true;

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.user_movie_data enable row level security;
alter table public.movie_clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.club_movies enable row level security;
alter table public.club_movie_votes enable row level security;
alter table public.club_movie_seen enable row level security;
alter table public.club_reviews enable row level security;
alter table public.club_private_comments enable row level security;

-- Limpeza de policies para permitir rodar novamente em testes
drop policy if exists "Perfis visíveis para autenticados" on public.profiles;
drop policy if exists "Usuário cria seu perfil" on public.profiles;
drop policy if exists "Usuário atualiza seu perfil" on public.profiles;
drop policy if exists "Usuário lê seus dados" on public.user_movie_data;
drop policy if exists "Usuário cria seus dados" on public.user_movie_data;
drop policy if exists "Usuário atualiza seus dados" on public.user_movie_data;
drop policy if exists "Usuário apaga seus dados" on public.user_movie_data;
drop policy if exists "Membro vê clube privado" on public.movie_clubs;
drop policy if exists "Usuário cria clube próprio" on public.movie_clubs;
drop policy if exists "ADM atualiza clube" on public.movie_clubs;
drop policy if exists "Dono apaga clube" on public.movie_clubs;
drop policy if exists "Membro vê participantes" on public.club_members;
drop policy if exists "Membro vê filmes do clube" on public.club_movies;
drop policy if exists "ADM sugere filmes" on public.club_movies;
drop policy if exists "ADM atualiza filmes" on public.club_movies;
drop policy if exists "ADM remove filmes" on public.club_movies;
drop policy if exists "Membro vê votos do clube" on public.club_movie_votes;
drop policy if exists "Membro cria seu voto" on public.club_movie_votes;
drop policy if exists "Membro atualiza seu voto" on public.club_movie_votes;
drop policy if exists "Membro apaga seu voto" on public.club_movie_votes;
drop policy if exists "Membro vê quem já viu" on public.club_movie_seen;
drop policy if exists "Membro marca que viu" on public.club_movie_seen;
drop policy if exists "Membro atualiza que viu" on public.club_movie_seen;
drop policy if exists "Membro desmarca que viu" on public.club_movie_seen;
drop policy if exists "Membro vê avaliações" on public.club_reviews;
drop policy if exists "Membro cria sua avaliação" on public.club_reviews;
drop policy if exists "Membro atualiza sua avaliação" on public.club_reviews;
drop policy if exists "Membro apaga sua avaliação ou ADM apaga" on public.club_reviews;
drop policy if exists "Usuário vê seus comentários pessoais" on public.club_private_comments;
drop policy if exists "Usuário cria comentário pessoal" on public.club_private_comments;
drop policy if exists "Usuário atualiza comentário pessoal" on public.club_private_comments;
drop policy if exists "Usuário apaga comentário pessoal" on public.club_private_comments;
drop policy if exists "Fotos de perfil públicas" on storage.objects;
drop policy if exists "Usuário envia sua foto" on storage.objects;
drop policy if exists "Usuário atualiza sua foto" on storage.objects;
drop policy if exists "Usuário apaga sua foto" on storage.objects;

-- profiles
create policy "Perfis visíveis para autenticados"
on public.profiles for select
to authenticated
using (true);

create policy "Usuário cria seu perfil"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Usuário atualiza seu perfil"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- user_movie_data
create policy "Usuário lê seus dados"
on public.user_movie_data for select
to authenticated
using (user_id = auth.uid());

create policy "Usuário cria seus dados"
on public.user_movie_data for insert
to authenticated
with check (user_id = auth.uid());

create policy "Usuário atualiza seus dados"
on public.user_movie_data for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Usuário apaga seus dados"
on public.user_movie_data for delete
to authenticated
using (user_id = auth.uid());

-- movie_clubs: privados, sem listagem pública
create policy "Membro vê clube privado"
on public.movie_clubs for select
to authenticated
using (owner_id = auth.uid() or public.is_club_member(id, auth.uid()));

create policy "Usuário cria clube próprio"
on public.movie_clubs for insert
to authenticated
with check (owner_id = auth.uid() and is_private = true);

create policy "ADM atualiza clube"
on public.movie_clubs for update
to authenticated
using (public.is_club_admin(id, auth.uid()))
with check (public.is_club_admin(id, auth.uid()));

create policy "Dono apaga clube"
on public.movie_clubs for delete
to authenticated
using (owner_id = auth.uid());

-- club_members: sem insert/update/delete direto pelo client; usa funções seguras
create policy "Membro vê participantes"
on public.club_members for select
to authenticated
using (user_id = auth.uid() or public.is_club_member(club_id, auth.uid()));

-- club_movies
create policy "Membro vê filmes do clube"
on public.club_movies for select
to authenticated
using (public.is_club_member(club_id, auth.uid()));

create policy "ADM sugere filmes"
on public.club_movies for insert
to authenticated
with check (public.is_club_admin(club_id, auth.uid()) and suggested_by = auth.uid());

create policy "ADM atualiza filmes"
on public.club_movies for update
to authenticated
using (public.is_club_admin(club_id, auth.uid()))
with check (public.is_club_admin(club_id, auth.uid()));

create policy "ADM remove filmes"
on public.club_movies for delete
to authenticated
using (public.is_club_admin(club_id, auth.uid()));

-- club_movie_votes
create policy "Membro vê votos do clube"
on public.club_movie_votes for select
to authenticated
using (public.is_club_member(club_id, auth.uid()));

create policy "Membro cria seu voto"
on public.club_movie_votes for insert
to authenticated
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro atualiza seu voto"
on public.club_movie_votes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro apaga seu voto"
on public.club_movie_votes for delete
to authenticated
using (user_id = auth.uid());

-- club_movie_seen: cada membro marca/desmarca apenas o próprio status; todos os membros veem a contagem
create policy "Membro vê quem já viu"
on public.club_movie_seen for select
to authenticated
using (public.is_club_member(club_id, auth.uid()));

create policy "Membro marca que viu"
on public.club_movie_seen for insert
to authenticated
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro atualiza que viu"
on public.club_movie_seen for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro desmarca que viu"
on public.club_movie_seen for delete
to authenticated
using (user_id = auth.uid());

-- club_reviews
create policy "Membro vê avaliações"
on public.club_reviews for select
to authenticated
using (public.is_club_member(club_id, auth.uid()));

create policy "Membro cria sua avaliação"
on public.club_reviews for insert
to authenticated
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro atualiza sua avaliação"
on public.club_reviews for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Membro apaga sua avaliação ou ADM apaga"
on public.club_reviews for delete
to authenticated
using (user_id = auth.uid() or public.is_club_admin(club_id, auth.uid()));

-- club_private_comments: anotações pessoais de clube, visíveis somente ao dono
create policy "Usuário vê seus comentários pessoais"
on public.club_private_comments for select
to authenticated
using (user_id = auth.uid());

create policy "Usuário cria comentário pessoal"
on public.club_private_comments for insert
to authenticated
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Usuário atualiza comentário pessoal"
on public.club_private_comments for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and public.is_club_member(club_id, auth.uid()));

create policy "Usuário apaga comentário pessoal"
on public.club_private_comments for delete
to authenticated
using (user_id = auth.uid());

-- storage.objects para fotos de perfil
create policy "Fotos de perfil públicas"
on storage.objects for select
to public
using (bucket_id = 'profile-photos');

create policy "Usuário envia sua foto"
on storage.objects for insert
to authenticated
with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Usuário atualiza sua foto"
on storage.objects for update
to authenticated
using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Usuário apaga sua foto"
on storage.objects for delete
to authenticated
using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.arbiter_stages (
  id uuid primary key default gen_random_uuid(),
  version_label text not null unique,
  version_sort_key integer not null,
  boss_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint arbiter_stages_version_sort_key_check check (version_sort_key >= 0)
);

create table if not exists public.clear_records (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete restrict,
  stage_id uuid not null references public.arbiter_stages(id) on delete restrict,
  gold_cost integer not null,
  video_url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint clear_records_gold_cost_check check (gold_cost >= 0),
  constraint clear_records_video_url_check check (video_url ~* '^https?://')
);

create table if not exists public.pending_records (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  stage_id uuid not null references public.arbiter_stages(id) on delete cascade,
  gold_cost integer not null,
  video_url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint pending_records_gold_cost_check check (gold_cost >= 0 and gold_cost <= 20),
  constraint pending_records_video_url_check check (video_url ~* '^https?://')
);

create index if not exists idx_pending_records_created_at
  on public.pending_records(created_at desc);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_text text not null,
  is_pinned boolean not null default false,
  published_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.announcements
  add column if not exists is_pinned boolean not null default false;

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row
execute function public.set_updated_at();

create index if not exists idx_arbiter_stages_version_sort_key
  on public.arbiter_stages(version_sort_key);

create index if not exists idx_clear_records_character_stage
  on public.clear_records(character_id, stage_id, gold_cost);

create index if not exists idx_clear_records_stage_character
  on public.clear_records(stage_id, character_id, gold_cost);

create index if not exists idx_announcements_published_at
  on public.announcements(published_at desc);

create index if not exists idx_announcements_pinned_published_at
  on public.announcements(is_pinned desc, published_at desc);

create or replace view public.stage_character_min_records as
with min_gold as (
  select
    stage_id,
    character_id,
    min(gold_cost) as min_gold_cost
  from public.clear_records
  group by stage_id, character_id
)
select
  r.id,
  r.character_id,
  r.stage_id,
  r.gold_cost,
  r.video_url,
  r.created_at,
  c.name as character_name,
  c.slug as character_slug,
  s.version_label as stage_version_label,
  s.version_sort_key as stage_version_sort_key,
  s.boss_name as stage_boss_name
from public.clear_records r
join min_gold mg
  on mg.stage_id = r.stage_id
 and mg.character_id = r.character_id
 and mg.min_gold_cost = r.gold_cost
join public.characters c
  on c.id = r.character_id
join public.arbiter_stages s
  on s.id = r.stage_id;

create or replace view public.character_stage_min_records as
select * from public.stage_character_min_records;

create or replace view public.character_avg_min_gold_rankings as
with stage_min as (
  select
    character_id,
    stage_id,
    min(gold_cost) as min_gold_cost
  from public.clear_records
  group by character_id, stage_id
)
select
  c.id as character_id,
  c.name as character_name,
  c.slug as character_slug,
  round(avg(stage_min.min_gold_cost)::numeric, 1) as average_min_gold_cost,
  count(stage_min.stage_id)::int as stages_covered
from stage_min
join public.characters c
  on c.id = stage_min.character_id
group by c.id, c.name, c.slug;

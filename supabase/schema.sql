-- Student Life — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- for a fresh project. Safe to re-run (uses IF NOT EXISTS / OR REPLACE where possible).

-- ─────────────────────────────────────────────────────────────
-- profiles (1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'New Scholar',
  handle text not null default '',
  level int not null default 1,
  role text not null default 'Level 1 Scholar',
  university text not null default '',
  class_of text not null default '',
  current_xp int not null default 0,
  next_level_xp int not null default 1000,
  gpa numeric not null default 0,
  rank text not null default '-',
  walks int not null default 0,
  streak_days int not null default 0,
  avatar_url text not null default '',
  dark_mode boolean not null default false,
  notifications boolean not null default true,
  language text not null default 'id' check (language in ('id', 'en')),
  last_quiz_date date,
  last_streak_date date,
  last_streak_bonus_date date,
  created_at timestamptz not null default now()
);

-- Safe to re-run on an existing project that predates these columns.
alter table public.profiles add column if not exists last_streak_date date;
alter table public.profiles add column if not exists last_streak_bonus_date date;

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, university, handle)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New Scholar'),
    coalesce(new.raw_user_meta_data->>'university', ''),
    coalesce('@' || lower(regexp_replace(new.raw_user_meta_data->>'name', '\s+', '_', 'g')), '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- missions
-- ─────────────────────────────────────────────────────────────
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  course text not null default '',
  priority text not null check (priority in ('high', 'medium', 'low')),
  due_date text not null default '',
  tag text not null default 'OTHER',
  completed boolean not null default false,
  xp_reward int not null default 0,
  time text,
  location text,
  focus_priority text,
  date_str date,
  created_at timestamptz not null default now()
);

alter table public.missions enable row level security;

create policy "missions: crud own" on public.missions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists missions_user_id_idx on public.missions (user_id);

-- ─────────────────────────────────────────────────────────────
-- transactions
-- ─────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text not null default 'OTHER',
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  date text not null default '',
  recurrence text not null default 'none' check (recurrence in ('none', 'monthly')),
  created_at timestamptz not null default now()
);

-- Safe to re-run on an existing project that predates this column.
alter table public.transactions add column if not exists recurrence text not null default 'none' check (recurrence in ('none', 'monthly'));

alter table public.transactions enable row level security;

create policy "transactions: crud own" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists transactions_user_id_idx on public.transactions (user_id);

-- ─────────────────────────────────────────────────────────────
-- savings_goals (one active goal per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.savings_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  title text not null default 'Savings Goal',
  saved_amount numeric not null default 0,
  target_amount numeric not null default 0
);

alter table public.savings_goals enable row level security;

create policy "savings_goals: crud own" on public.savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  message text not null,
  time text not null default '',
  read boolean not null default false,
  type text not null default 'system' check (type in ('deadline', 'achievement', 'streak', 'system')),
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications: crud own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists notifications_user_id_idx on public.notifications (user_id);

-- ─────────────────────────────────────────────────────────────
-- push_subscriptions — Web Push endpoints, one row per subscribed
-- browser/device. A user can have several (phone + laptop, etc).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions: crud own" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

-- ─────────────────────────────────────────────────────────────
-- user_badges — unlock state only; the badge catalog (title/icon/tier)
-- stays static on the frontend since it never varies per user.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "user_badges: crud own" on public.user_badges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Deadline push reminders: a daily cron job hits the send-deadline-reminders
-- Edge Function, which emails... er, pushes every mission due tomorrow.
--
-- One-time setup on a fresh project:
--   create extension if not exists pg_cron with schema extensions;
--   create extension if not exists pg_net with schema extensions;
--   supabase functions deploy send-deadline-reminders
--   supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." VAPID_SUBJECT="mailto:you@example.com"
--
--   select cron.schedule(
--     'daily-deadline-push',
--     '0 1 * * *', -- 01:00 UTC = 08:00 WIB
--     $$ select net.http_post(
--          url:='https://<project-ref>.supabase.co/functions/v1/send-deadline-reminders',
--          headers:=jsonb_build_object('Authorization','Bearer <anon key>','Content-Type','application/json')
--        ) $$
--   );
-- ─────────────────────────────────────────────────────────────

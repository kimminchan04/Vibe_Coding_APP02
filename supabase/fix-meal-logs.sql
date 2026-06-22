-- meal_logs 403 오류 해결용 (Supabase SQL Editor에서 실행)
-- 테이블·RLS·권한이 없거나 잘못 설정된 경우 복구합니다.

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  menu_name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  logged_at timestamptz default now()
);

alter table public.meal_logs enable row level security;

drop policy if exists "meal_logs_select_own" on public.meal_logs;
drop policy if exists "meal_logs_insert_own" on public.meal_logs;
drop policy if exists "meal_logs_delete_own" on public.meal_logs;

create policy "meal_logs_select_own" on public.meal_logs
  for select to authenticated
  using (auth.uid() = user_id);

create policy "meal_logs_insert_own" on public.meal_logs
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "meal_logs_delete_own" on public.meal_logs
  for delete to authenticated
  using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, delete on public.meal_logs to authenticated;

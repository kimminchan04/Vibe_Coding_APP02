-- Supabase SQL: 대진밥핏 스키마
-- Supabase Dashboard > SQL Editor 에서 실행하세요.

-- 프로필
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  department text,
  calorie_goal integer default 2000,
  protein_goal integer default 60,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 식사 기록
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

create policy "meal_logs_select_own" on public.meal_logs
  for select using (auth.uid() = user_id);

create policy "meal_logs_insert_own" on public.meal_logs
  for insert with check (auth.uid() = user_id);

create policy "meal_logs_delete_own" on public.meal_logs
  for delete using (auth.uid() = user_id);

-- 가입 시 프로필 자동 생성 (선택)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, department)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'department'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

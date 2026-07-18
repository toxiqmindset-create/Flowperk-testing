-- ============================================
-- FLOWPERK DATABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('brand', 'creator')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- 2. CAMPAIGNS (created by brands)
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  campaign_type text not null check (campaign_type in ('clipping', 'ugc')),
  budget numeric not null check (budget > 0),
  pay_rate_per_100k numeric not null check (pay_rate_per_100k > 0),
  min_views integer not null default 10000,
  requirements text,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  created_at timestamptz default now()
);

alter table campaigns enable row level security;

create policy "Campaigns are viewable by everyone"
  on campaigns for select using (true);

create policy "Brands can insert their own campaigns"
  on campaigns for insert with check (
    auth.uid() = brand_id
    and exists (select 1 from profiles where id = auth.uid() and role = 'brand')
  );

create policy "Brands can update their own campaigns"
  on campaigns for update using (auth.uid() = brand_id);

-- 3. SUBMISSIONS (creators submit clips against a campaign)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  creator_id uuid not null references profiles(id) on delete cascade,
  video_url text not null,
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  views integer default 0,
  earnings numeric default 0,
  created_at timestamptz default now()
);

alter table submissions enable row level security;

create policy "Creators can view their own submissions"
  on submissions for select using (auth.uid() = creator_id);

create policy "Brands can view submissions to their campaigns"
  on submissions for select using (
    exists (select 1 from campaigns where campaigns.id = submissions.campaign_id and campaigns.brand_id = auth.uid())
  );

create policy "Creators can insert submissions"
  on submissions for insert with check (
    auth.uid() = creator_id
    and exists (select 1 from profiles where id = auth.uid() and role = 'creator')
  );

create policy "Brands can update status of submissions to their campaigns"
  on submissions for update using (
    exists (select 1 from campaigns where campaigns.id = submissions.campaign_id and campaigns.brand_id = auth.uid())
  );

-- 4. AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- This reads role + full_name out of the signup metadata you pass from the client.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'role', 'creator')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Done. After running this, go to:
-- Authentication > Providers > Email > make sure "Confirm email" is OFF
-- for fastest local testing (you can turn it back on later for production).
-- ============================================

-- Supabase Schema for 도시산책 커뮤니티
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Community Posts table
create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  images text[] default '{}',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text
);

-- Enable RLS
alter table public.community_posts enable row level security;

-- Community posts policies
create policy "Approved posts are viewable by everyone"
  on public.community_posts for select
  using (status = 'approved' or auth.uid() = user_id);

create policy "Users can create own posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own pending posts"
  on public.community_posts for update
  using (auth.uid() = user_id and status = 'pending');

create policy "Users can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

-- Create storage bucket for community images
insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Anyone can view community images"
  on storage.objects for select
  using (bucket_id = 'community-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'community-images' and auth.role() = 'authenticated');

create policy "Users can delete own images"
  on storage.objects for delete
  using (bucket_id = 'community-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_community_posts_updated_at
  before update on public.community_posts
  for each row execute procedure public.handle_updated_at();

-- Index for faster queries
create index if not exists idx_community_posts_user_id on public.community_posts(user_id);
create index if not exists idx_community_posts_status on public.community_posts(status);
create index if not exists idx_community_posts_created_at on public.community_posts(created_at desc);

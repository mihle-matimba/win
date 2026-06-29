-- ============================================================
-- 008: Add phone number to profiles table
-- Run in Supabase SQL editor
-- ============================================================

alter table public.profiles
  add column if not exists phone text;

-- Update trigger to also store phone from user metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, community_id, role, full_name, avatar_url, phone)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'community_id')::uuid,
    coalesce(new.raw_user_meta_data ->> 'role', 'member'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', null)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Migration: 005_storage_bucket
-- Product image storage: public read, sellers write only to their own folder

-- Insert the product-images bucket (public read, idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Helper: create storage policy only if it does not already exist
create or replace function public.ensure_storage_policy(
  p_name text,
  p_cmd text,
  p_qual text,
  p_with_check text
) returns void as $$
declare
  v_sql text;
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = p_name
  ) then
    if p_cmd = 'insert' then
      v_sql := format('create policy %I on storage.objects for %s with check (%s)',
        p_name, p_cmd, coalesce(p_with_check, 'true'));
    elsif p_cmd = 'delete' then
      v_sql := format('create policy %I on storage.objects for %s using (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'));
    elsif p_cmd = 'select' then
      v_sql := format('create policy %I on storage.objects for %s using (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'));
    else
      v_sql := format('create policy %I on storage.objects for %s using (%s) with check (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'), coalesce(p_with_check, 'true'));
    end if;
    execute v_sql;
  end if;
end;
$$ language plpgsql;

-- Sellers can upload to their own folder: product-images/{seller_id}/
select public.ensure_storage_policy(
  'sellers_upload_own_folder', 'insert', null,
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )');

-- Sellers can update/delete their own files
select public.ensure_storage_policy(
  'sellers_modify_own_files', 'all',
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )',
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )');

-- Public read access
select public.ensure_storage_policy(
  'public_read_product_images', 'select',
  'bucket_id = ''product-images''', null);

-- Drop the helper function after use
drop function public.ensure_storage_policy(text, text, text, text);

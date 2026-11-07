-- Migration: 006_storage_policy_hardening
-- Remove the broad SELECT policy on the public product-images bucket so clients
-- cannot enumerate every file. Public files are served via /object/public/.
-- Restrict uploads/modifications to approved sellers only, writing to their own folder.

-- Drop the broad public read / list policy (public buckets don't need a SELECT policy).
drop policy if exists "public_read_product_images" on storage.objects;

-- Recreate seller upload policy: only approved sellers, only their own profile folder.
drop policy if exists "sellers_upload_own_folder" on storage.objects;
create policy "sellers_upload_own_folder"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
);

-- Recreate seller modify policy: only approved sellers, only their own files.
drop policy if exists "sellers_modify_own_files" on storage.objects;
create policy "sellers_modify_own_files"
on storage.objects for all
using (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
)
with check (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('logos', 'logos', true, 2097152, array['image/png','image/jpeg','image/webp','image/svg+xml','image/x-icon']),
  ('screenshots', 'screenshots', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('covers', 'covers', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('project-images', 'project-images', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('media', 'media', true, 5242880, array['image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict (id) do nothing;

-- Public read on all buckets above
drop policy if exists "public_read_logos" on storage.objects;
create policy "public_read_logos" on storage.objects for select
  using (bucket_id in ('logos','screenshots','covers','project-images','media'));

-- Only the authenticated Owner may upload/update/delete
drop policy if exists "owner_write_media" on storage.objects;
create policy "owner_write_media" on storage.objects for insert
  with check (
    bucket_id in ('logos','screenshots','covers','project-images','media')
    and auth.uid() is not null
  );

drop policy if exists "owner_update_media" on storage.objects;
create policy "owner_update_media" on storage.objects for update
  using (
    bucket_id in ('logos','screenshots','covers','project-images','media')
    and auth.uid() is not null
  );

drop policy if exists "owner_delete_media" on storage.objects;
create policy "owner_delete_media" on storage.objects for delete
  using (
    bucket_id in ('logos','screenshots','covers','project-images','media')
    and auth.uid() is not null
  );

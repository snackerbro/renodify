-- ─────────────────────────────────────────────────────────────────────────
-- Renodify — Storage RLS policies
-- Buckets (vendor-logos, vendor-covers, vendor-gallery) are PUBLIC, so reads
-- via the public URL work without a policy. These policies let a signed-in
-- vendor upload/replace/remove files only inside their OWN vendor folder
-- (upload path is "<vendorId>/<file>", matching the app's LogoUpload).
-- ─────────────────────────────────────────────────────────────────────────

-- Public read (explicit; harmless for already-public buckets, useful for listing)
create policy "renodify storage public read"
  on storage.objects for select
  using (bucket_id in ('vendor-logos','vendor-covers','vendor-gallery'));

-- A vendor may write only into a top-level folder named after a vendor they own.
create policy "renodify storage owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('vendor-logos','vendor-covers','vendor-gallery')
    and (storage.foldername(name))[1] in (
      select id::text from public.vendors where owner_id = auth.uid()
    )
  );

create policy "renodify storage owner update"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('vendor-logos','vendor-covers','vendor-gallery')
    and (storage.foldername(name))[1] in (
      select id::text from public.vendors where owner_id = auth.uid()
    )
  );

create policy "renodify storage owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('vendor-logos','vendor-covers','vendor-gallery')
    and (storage.foldername(name))[1] in (
      select id::text from public.vendors where owner_id = auth.uid()
    )
  );

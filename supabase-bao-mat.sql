-- Kệ sách kỷ niệm · BẢO MẬT
-- Ai cũng xem được kệ sách (trừ quyển đánh dấu riêng tư). Chỉ chủ kệ (một tài khoản) được thêm / sửa / xóa.
--
-- TRƯỚC KHI CHẠY: thay cả 3 chỗ  UID_CUA_BAN  bằng User UID của tài khoản bạn
-- (Supabase → Authentication → Users → bấm vào tài khoản → copy "User UID").
-- Có thể chạy lại nhiều lần mà không hỏng gì.

-- 1) Hàm nhận diện chủ kệ: đúng tài khoản của bạn mới trả về true
create or replace function public.is_owner()
returns boolean language sql stable set search_path = ''
as $$ select coalesce(auth.uid() = 'UID_CUA_BAN'::uuid, false) $$;

-- 2) Cờ riêng tư cho từng quyển sách
alter table public.books add column if not exists private boolean not null default false;

-- 3) Gắn chủ cho dữ liệu cũ, dữ liệu mới tự gắn
update public.books set owner_id = 'UID_CUA_BAN'::uuid where owner_id is null;
update public.pages set owner_id = 'UID_CUA_BAN'::uuid where owner_id is null;
alter table public.books alter column owner_id set default auth.uid();
alter table public.pages alter column owner_id set default auth.uid();

-- 4) Xóa toàn bộ luật cũ (kể cả các luật thử nghiệm dev_*) để làm lại từ đầu
do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies
           where schemaname = 'public' and tablename in ('books','pages') loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
  for r in select policyname from pg_policies
           where schemaname = 'storage' and tablename = 'objects'
             and (policyname like 'dev\_%' or policyname like 'photos\_owner\_%') loop
    execute format('drop policy %I on storage.objects', r.policyname);
  end loop;
end $$;

alter table public.books enable row level security;
alter table public.pages enable row level security;

-- 5) Sách: ai cũng đọc được sách công khai; chủ kệ đọc và sửa được tất cả
create policy books_public_read on public.books for select
  using (not private or public.is_owner());
create policy books_owner_write on public.books for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- 6) Trang: đọc được nếu quyển sách chứa nó đọc được; chỉ chủ kệ được sửa
create policy pages_public_read on public.pages for select
  using (exists (select 1 from public.books b where b.id = book_id and (not b.private or public.is_owner())));
create policy pages_owner_write on public.pages for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- 7) Kho ảnh "photos": ảnh vẫn mở bằng đường link công khai, nhưng chỉ chủ kệ được tải lên / xóa / xem danh sách
create policy photos_owner_select on storage.objects for select to authenticated
  using (bucket_id = 'photos' and public.is_owner());
create policy photos_owner_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and public.is_owner());
create policy photos_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'photos' and public.is_owner()) with check (bucket_id = 'photos' and public.is_owner());
create policy photos_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and public.is_owner());

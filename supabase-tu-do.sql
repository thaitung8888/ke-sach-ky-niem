-- Kệ sách kỷ niệm · TỦ ĐỒ SƯU TẦM
-- Chạy SAU file supabase-bao-mat.sql (cần hàm public.is_owner() ở file đó).
-- Ai cũng xem được (trừ món đánh dấu riêng tư); chỉ chủ kệ được thêm / sửa / xóa.
-- Ảnh dùng chung kho "photos" (thư mục wardrobe/), luật kho ảnh đã có sẵn từ file bảo mật.

create table if not exists public.garments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand       text,
  story       text,
  color       text,
  photo       text,
  position    int  not null default 0,
  private     boolean not null default false,
  created_at  timestamptz not null default now(),
  owner_id    uuid default auth.uid()
);

alter table public.garments enable row level security;
drop policy if exists garments_public_read on public.garments;
drop policy if exists garments_owner_write on public.garments;
create policy garments_public_read on public.garments for select
  using (not private or public.is_owner());
create policy garments_owner_write on public.garments for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- Ảnh mặt nghiêng (áo treo nhìn từ bên cạnh). Trên thanh treo hiện ảnh này, chọn vào thì xoay sang ảnh mặt trước.
-- Chạy lại cả file cũng an toàn: cột chỉ được thêm nếu chưa có.
alter table public.garments add column if not exists photo_side text;

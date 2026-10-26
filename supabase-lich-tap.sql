-- Lịch luyện tập · bảng dữ liệu + bảo mật + 7 thói quen ban đầu
-- CHẠY SAU file supabase-bao-mat.sql (cần hàm public.is_owner() đã có UID của bạn).
-- Có thể chạy lại nhiều lần mà không hỏng gì.

-- 1) Thói quen
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid default auth.uid(),
  name        text not null,
  icon        text not null default '✅',
  kind        text not null default 'check' check (kind in ('check','count')),  -- có/không hoặc số lượng
  target      numeric not null default 1,         -- mục tiêu (với kiểu số lượng)
  unit        text not null default '',           -- đơn vị: ly, phút, từ…
  days        smallint[],                         -- thứ trong tuần 1=T2 … 7=CN; để trống = hằng ngày
  private     boolean not null default false,     -- riêng tư: người xem chỉ thấy màu ô, không thấy tên
  position    int not null default 0,
  start_date  date not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  archived_at date,                               -- ngừng theo dõi từ ngày này (lịch sử cũ vẫn giữ)
  created_at  timestamptz not null default now()
);

-- 2) Lượt đánh dấu: mỗi thói quen tối đa 1 dòng mỗi ngày
create table if not exists public.checkins (
  id        uuid primary key default gen_random_uuid(),
  owner_id  uuid default auth.uid(),
  habit_id  uuid not null references public.habits(id) on delete cascade,
  day       date not null,
  value     numeric not null default 1,
  unique (habit_id, day)
);
create index if not exists checkins_day_idx on public.checkins(day);

-- 3) Ngày nghỉ có phép: không làm đứt chuỗi
create table if not exists public.rest_days (
  day       date primary key,
  owner_id  uuid default auth.uid(),
  note      text not null default ''
);

alter table public.habits    enable row level security;
alter table public.checkins  enable row level security;
alter table public.rest_days enable row level security;

drop policy if exists habits_owner_all   on public.habits;
drop policy if exists checkins_public    on public.checkins;
drop policy if exists checkins_owner     on public.checkins;
drop policy if exists rest_public        on public.rest_days;
drop policy if exists rest_owner         on public.rest_days;

-- Bảng habits gốc: chỉ chủ kệ đọc / ghi (người xem đọc qua view bên dưới, tên thói quen riêng tư bị ẩn)
create policy habits_owner_all on public.habits for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
-- Lượt đánh dấu và ngày nghỉ: ai cũng xem được (để vẽ bảng ô vuông), chỉ chủ kệ ghi
create policy checkins_public on public.checkins for select using (true);
create policy checkins_owner  on public.checkins for all to authenticated
  using (public.is_owner()) with check (public.is_owner());
create policy rest_public on public.rest_days for select using (true);
create policy rest_owner  on public.rest_days for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- 4) View công khai: người xem thấy lịch và mục tiêu, nhưng tên + biểu tượng thói quen riêng tư bị ẩn
create or replace view public.habits_view with (security_invoker = false) as
  select id,
         case when private and not public.is_owner() then null else name end as name,
         case when private and not public.is_owner() then '🔒' else icon end as icon,
         kind, target, unit, days, private, position, start_date, archived_at
  from public.habits;
grant select on public.habits_view to anon, authenticated;

-- 5) 7 thói quen ban đầu (chỉ thêm khi bảng còn trống). Thay UID_CUA_BAN như file bảo mật.
insert into public.habits (owner_id, name, icon, kind, target, unit, days, position)
select 'UID_CUA_BAN'::uuid, x.name, x.icon, x.kind, x.target, x.unit, x.days, x.pos
from (values
  ('Dậy trước 6h sáng',    '🌅', 'check', 1,  '',     null::smallint[], 1),
  ('Tập thể dục sáng',     '🤸', 'check', 1,  '',     null,             2),
  ('Uống 2 lít nước',      '💧', 'count', 8,  'ly',   null,             3),
  ('Luyện code',           '💻', 'check', 1,  '',     null,             4),
  ('Tập gym buổi tối',     '🏋️', 'check', 1,  '',     '{1,3,5}',        5),
  ('Đi bộ',                '🚶', 'check', 1,  '',     null,             6),
  ('Học từ mới tiếng Anh', '📖', 'count', 10, 'từ',   null,             7)
) as x(name, icon, kind, target, unit, days, pos)
where not exists (select 1 from public.habits);

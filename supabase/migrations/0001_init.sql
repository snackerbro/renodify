-- ─────────────────────────────────────────────────────────────────────────
-- Renodify — initial schema + Row-Level Security
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Profiles: one row per auth user, holds role + optional vendor link.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'homeowner' check (role in ('homeowner','customer','vendor')),
  email       text,
  full_name   text,
  vendor_id   uuid,
  created_at  timestamptz not null default now()
);

-- Vendors.
create table if not exists public.vendors (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  owner_id           uuid references auth.users (id) on delete set null,
  name               text not null,
  category_slug      text not null,
  category           text not null,
  areas              text[] not null default '{}',
  property_types     text[] not null default '{}',
  logo_url           text,
  cover_url          text,
  whatsapp           text,
  phone              text,
  location           text,
  email              text,
  plan               text check (plan in ('basic','silver','gold')),
  verified           boolean not null default false,
  rating_avg         numeric(2,1) not null default 0,
  review_count       integer not null default 0,
  years_in_business  integer not null default 0,
  response_rate      integer,
  price_from         text,
  deal               text,
  unclaimed          boolean not null default false,
  about              text,
  created_at         timestamptz not null default now()
);
create index if not exists vendors_category_idx on public.vendors (category_slug);

alter table public.profiles
  add constraint profiles_vendor_fk
  foreign key (vendor_id) references public.vendors (id) on delete set null
  not valid;

-- Vendor child entities.
create table if not exists public.outlets (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  name        text not null,
  address     text,
  phone       text,
  hours       jsonb not null default '[]'::jsonb
);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  kind        text not null default 'Service' check (kind in ('Service','Product')),
  icon        text,
  name        text not null,
  price       text,
  unit        text,
  description text,
  features    text[] default '{}'
);

create table if not exists public.deals (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  icon        text,
  title       text not null,
  discount    text,
  scope       text,
  ends_on     text,
  details     text
);

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  type        text,
  title       text not null,
  role        text,
  date        text,
  location    text
);

create table if not exists public.past_work (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  title       text not null,
  category    text,
  location    text,
  year        text,
  description text,
  images      text[] default '{}'
);

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  author_name text not null,
  rating      integer not null check (rating between 1 and 5),
  text        text,
  created_at  timestamptz not null default now()
);

-- Enquiries (from the Get-Quotes flow) + vendor fan-out.
create table if not exists public.enquiries (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid references auth.users (id) on delete set null,
  homeowner_name    text not null,
  homeowner_contact text not null,
  property_type     text not null,
  categories        text[] not null default '{}',
  budget            text,
  timeline          text,
  message           text,
  status            text not null default 'new' check (status in ('new','replied')),
  created_at        timestamptz not null default now()
);

create table if not exists public.enquiry_vendors (
  enquiry_id  uuid not null references public.enquiries (id) on delete cascade,
  vendor_id   uuid not null references public.vendors (id) on delete cascade,
  primary key (enquiry_id, vendor_id)
);

-- Subscriptions (mirrors Stripe).
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  vendor_id              uuid unique not null references public.vendors (id) on delete cascade,
  plan                   text not null check (plan in ('basic','silver','gold')),
  enquiries_included     integer not null default 0,
  enquiries_used         integer not null default 0,
  renews_on              date,
  stripe_customer_id     text,
  stripe_subscription_id text,
  status                 text not null default 'active',
  created_at             timestamptz not null default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.vendors         enable row level security;
alter table public.outlets         enable row level security;
alter table public.services        enable row level security;
alter table public.deals           enable row level security;
alter table public.events          enable row level security;
alter table public.past_work       enable row level security;
alter table public.reviews         enable row level security;
alter table public.enquiries       enable row level security;
alter table public.enquiry_vendors enable row level security;
alter table public.subscriptions   enable row level security;

-- Helper: does the current user own this vendor?
create or replace function public.owns_vendor(v uuid)
returns boolean language sql stable as $$
  select exists (select 1 from public.vendors where id = v and owner_id = auth.uid());
$$;

-- Profiles: self access.
create policy "profiles self read"   on public.profiles for select using (id = auth.uid());
create policy "profiles self update" on public.profiles for update using (id = auth.uid());
create policy "profiles self insert" on public.profiles for insert with check (id = auth.uid());

-- Vendors: public read; owner write.
create policy "vendors public read" on public.vendors for select using (true);
create policy "vendors owner update" on public.vendors for update using (owner_id = auth.uid());
create policy "vendors owner insert" on public.vendors for insert with check (owner_id = auth.uid());

-- Child tables: public read; owner full write.
do $$
declare t text;
begin
  foreach t in array array['outlets','services','deals','events','past_work'] loop
    execute format('create policy "%1$s public read" on public.%1$s for select using (true);', t);
    execute format('create policy "%1$s owner write" on public.%1$s for all using (public.owns_vendor(vendor_id)) with check (public.owns_vendor(vendor_id));', t);
  end loop;
end $$;

-- Reviews: public read; insert by anyone (moderated app-side).
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews insert" on public.reviews for insert with check (true);

-- Enquiries: anyone may create; readable by the customer who made it or a matched vendor owner.
create policy "enquiries insert" on public.enquiries for insert with check (true);
create policy "enquiries read" on public.enquiries for select using (
  customer_id = auth.uid()
  or exists (
    select 1 from public.enquiry_vendors ev
    where ev.enquiry_id = enquiries.id and public.owns_vendor(ev.vendor_id)
  )
);
create policy "enquiries owner update" on public.enquiries for update using (
  exists (
    select 1 from public.enquiry_vendors ev
    where ev.enquiry_id = enquiries.id and public.owns_vendor(ev.vendor_id)
  )
);

-- Enquiry links: anyone may create (during enquiry creation); vendor owner reads.
create policy "enquiry_vendors insert" on public.enquiry_vendors for insert with check (true);
create policy "enquiry_vendors read" on public.enquiry_vendors for select using (public.owns_vendor(vendor_id));

-- Subscriptions: vendor owner reads (writes go through the service role).
create policy "subscriptions owner read" on public.subscriptions for select using (public.owns_vendor(vendor_id));

-- ── New-user trigger: create a profile (and vendor for vendor signups) ─────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'homeowner');
  v_name text := new.raw_user_meta_data->>'full_name';
  v_biz  text := new.raw_user_meta_data->>'business_name';
  v_vendor uuid;
begin
  if v_role = 'vendor' then
    insert into public.vendors (owner_id, slug, name, category_slug, category, unclaimed)
    values (
      new.id,
      'vendor-' || left(new.id::text, 8),
      coalesce(v_biz, 'My business'),
      'blinds', 'Blinds', false
    )
    returning id into v_vendor;
  end if;

  insert into public.profiles (id, role, email, full_name, vendor_id)
  values (new.id, v_role, new.email, v_name, v_vendor);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

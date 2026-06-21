-- Vendor website (used for claim verification: a claimant's company email
-- domain must match the listing's website domain).
alter table public.vendors add column if not exists website text;

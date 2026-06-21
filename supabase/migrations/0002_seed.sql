-- ─────────────────────────────────────────────────────────────────────────
-- Renodify — sample seed data (optional). Mirrors lib/sample-data.ts so the
-- live site shows realistic content. Safe to skip in production.
-- ─────────────────────────────────────────────────────────────────────────

insert into public.vendors
  (slug, name, category_slug, category, areas, property_types, plan, rating_avg, review_count, years_in_business, response_rate, price_from, deal, unclaimed, about)
values
  ('shadeworks-blinds','ShadeWorks Blinds','blinds','Blinds','{Islandwide}','{HDB,Condo,Landed}','silver',4.8,86,8,94,'S$180','10% off motorised',false,'Established blinds specialist trusted across HDB and condo renovations.'),
  ('dripfold-curtains','DripFold Curtains','curtains','Curtains','{Islandwide}','{HDB,Condo}','silver',4.6,51,7,92,'S$220',null,false,'Custom curtains and soft furnishings for Singapore homes.'),
  ('safeview-grilles','SafeView Invisible Grilles','invisible-grilles','Invisible Grilles','{Islandwide}','{HDB,Condo,Landed}','gold',4.9,120,10,96,'S$25/ft','Free installation',false,'Marine-grade invisible grilles with child-safe spacing.'),
  ('coolbreeze-aircon','CoolBreeze Aircon','aircon-servicing','Aircon Servicing','{Central,East}','{HDB,Condo}','silver',4.5,210,9,90,'S$40',null,false,'Aircon supply, install and servicing across Singapore.'),
  ('planklab-flooring','PlankLab Flooring','flooring','Flooring','{Islandwide}','{HDB,Condo}','silver',4.7,64,6,91,'S$4.50/sqft',null,false,'SPC, vinyl and tile flooring with fast installation.'),
  ('brightwire-electrical','BrightWire Electrical','electrical','Electrical','{Islandwide}','{HDB,Condo}','basic',4.4,38,5,88,'S$90',null,false,'Licensed electrical works for renovations.'),
  ('nestsmart-home','NestSmart Home','smart-home','Smart Home','{Islandwide}','{HDB,Condo,Landed}','gold',4.8,47,4,95,'S$350',null,false,'Smart locks, lighting and home automation.'),
  ('sealtight-waterproofing','SealTight Waterproofing','waterproofing','Waterproofing','{Islandwide}','{HDB,Condo,Landed}','silver',4.6,29,11,89,'S$450',null,false,'Bathroom, kitchen and balcony waterproofing.'),
  ('lumen-lighting','Lumen Lighting Studio','lighting','Lighting','{Islandwide}','{HDB,Condo}','silver',4.9,73,7,93,'S$60','Bundle discount',false,'Lighting design and supply for every room.'),
  ('freshfold-laundry','FreshFold Laundry Systems','laundry-systems','Laundry Systems','{Islandwide}','{HDB,Condo}',null,4.3,18,3,85,'S$520',null,true,'Automated laundry racks and systems.')
on conflict (slug) do nothing;

-- Child data for the first vendor (ShadeWorks) as a profile example.
with v as (select id from public.vendors where slug = 'shadeworks-blinds')
insert into public.outlets (vendor_id, name, address, phone, hours)
select v.id, 'Main Showroom', '12 Tai Seng Street, #03-08, Singapore 534118', '+65 6123 4567',
  '[{"day":"Mon","open":true,"from":"09:00","to":"18:00"},{"day":"Tue","open":true,"from":"09:00","to":"18:00"},{"day":"Wed","open":true,"from":"09:00","to":"18:00"},{"day":"Thu","open":true,"from":"09:00","to":"18:00"},{"day":"Fri","open":true,"from":"09:00","to":"18:00"},{"day":"Sat","open":true,"from":"09:00","to":"14:00"},{"day":"Sun","open":false,"from":"09:00","to":"18:00"}]'::jsonb
from v;

with v as (select id from public.vendors where slug = 'shadeworks-blinds')
insert into public.services (vendor_id, kind, icon, name, price, unit, description, features)
select v.id, 'Service', 'sliders', 'Site measurement & consultation', 'Free', 'per visit', 'On-site measurement and recommendation.', '{Same-week appointment,Islandwide,No obligation}'::text[] from v
union all
select v.id, 'Product', 'tag', 'Motorised roller blinds', 'S$280', 'per window', 'Supply and install with warranty.', '{2-year warranty,Battery or wired}'::text[] from v;

with v as (select id from public.vendors where slug = 'shadeworks-blinds')
insert into public.reviews (vendor_id, author_name, rating, text)
select v.id, 'Wei Ling', 5, 'Responsive and tidy. Highly recommend for HDB owners.' from v
union all
select v.id, 'Daniel T.', 4, 'Good price and finishing. Kept me updated throughout.' from v;

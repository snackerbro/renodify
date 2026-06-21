# Renodify

**Singapore's renovation-vendor directory — _"You found your ID. Now find everyone else."_**

Renodify helps homeowners find every renovation specialist they still need *after*
confirming their interior designer (blinds, curtains, invisible grilles, aircon,
flooring, smart home, lighting, doors and more). Free for homeowners; vendors pay a
monthly subscription to claim a listing and receive enquiries.

## Tech stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** — Postgres, Auth, Storage, Row-Level Security
- **Stripe** — vendor subscriptions (Basic / Silver / Gold)
- **Vercel** — hosting + CI deploys
- SEO/GEO-first: SSR/SSG, JSON-LD, sitemap, robots, `llms.txt`, `en-SG`

## Quick start
```bash
npm install
cp .env.example .env.local   # add Supabase/Stripe keys (optional to start)
npm run dev                  # http://localhost:3000
```
The app runs with built-in sample data until you connect Supabase. See
**[SETUP.md](./SETUP.md)** for the full Supabase + Vercel + Stripe walkthrough.

## Project structure
```
app/
  (public)/      Homeowner pages (home, browse, category, vendor, get-quotes,
                 guides, deals, events, search, checklist, legal, about, …)
  (auth)/        login · register · forgot-password (customer/vendor toggle)
  (dash)/        vendor-dashboard · customer-dashboard
  api/           enquiries · checkout · stripe/webhook
  sitemap.ts robots.ts opengraph-image.tsx
components/
  ds/            Design-system primitives (Button, Field, Badge, Rating, Chip,
                 SearchBar, Icon)
  site/          Header, Footer, BottomNav, VendorCard, CategoryTile, Logo
  dashboard/     Schema-driven CRUD modal, typed-delete confirm, hours editor,
                 logo upload, VendorDashboard
  quotes/ checklist/ billing/ auth/
lib/
  services/      Backend service layer (catalog, enquiries, account,
                 subscriptions) — all data access lives here
  supabase/      client · server · admin · env
  stripe/  seo.ts  guides.ts  constants.ts  types.ts  validators.ts
styles/          design-system.css + site.css (the high-fidelity design layer)
supabase/migrations/  0001_init.sql (schema + RLS), 0002_seed.sql (sample data)
```

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Notes
- The **Renodify Verified** badge ships inactive; all vendors show
  "Verification pending" until the programme launches.
- Vendor dashboard CRUD is fully interactive; with Supabase connected, changes
  persist via the RLS-scoped browser client. Without it, the dashboard runs in
  demo mode (session-local).
- Design source of truth: `styles/design-system.css` + `styles/site.css`
  (see `DESIGN_HANDOFF.md`).

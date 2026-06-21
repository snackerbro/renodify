# Renodify — Setup Guide

This is everything you need to take Renodify from this repo to a live site on
Vercel + Supabase, with Stripe ready to switch on later.

> TL;DR order: **1) Supabase → 2) GitHub → 3) Vercel → 4) Stripe (later).**
> The app runs locally and on Vercel even before Supabase/Stripe are configured —
> it falls back to built-in sample data and "demo mode" dashboards.

---

## 0. Local development

```bash
npm install
cp .env.example .env.local   # fill in as you complete the steps below
npm run dev                  # http://localhost:3000
npm run build                # production build (run before deploying)
```

Without any env vars, the public site renders with sample vendors and the
dashboards show demo data. Add Supabase keys to make it real.

---

## 1. Supabase (database, auth, storage)

1. Create a project at [supabase.com](https://supabase.com). **Region: Singapore
   (`ap-southeast-1`)** for lowest latency to your users.
2. **API keys** — Project → Settings → API. Copy into `.env.local`:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)
3. **Run the schema** — Project → SQL Editor → paste & run:
   - `supabase/migrations/0001_init.sql` (tables, RLS, new-user trigger)
   - `supabase/migrations/0002_seed.sql` (optional sample vendors)

   Or, with the Supabase CLI:
   ```bash
   npm i -g supabase
   supabase link --project-ref <your-ref>
   supabase db push
   ```
4. **Auth** — Authentication → Providers → enable **Email**. For quick testing you
   may turn off "Confirm email"; keep it on for production. Add your site URL and
   `…/login` to Authentication → URL Configuration → Redirect URLs.
5. **Storage buckets** — Storage → New bucket (mark each **Public**):
   - `vendor-logos`
   - `vendor-covers`
   - `vendor-gallery`

   Then add upload policies so a signed-in vendor can upload to their own folder.
   In SQL Editor:
   ```sql
   -- Public read for all three buckets
   create policy "public read logos" on storage.objects for select
     using (bucket_id = 'vendor-logos');
   create policy "public read covers" on storage.objects for select
     using (bucket_id = 'vendor-covers');
   create policy "public read gallery" on storage.objects for select
     using (bucket_id = 'vendor-gallery');

   -- Authenticated users can write to the image buckets
   create policy "auth write logos" on storage.objects for insert to authenticated
     with check (bucket_id = 'vendor-logos');
   create policy "auth update logos" on storage.objects for update to authenticated
     using (bucket_id = 'vendor-logos');
   ```
   (Repeat the write/update policies for `vendor-covers` and `vendor-gallery`.)

---

## 2. GitHub

The repo is already initialized with the remote `github.com/snackerbro/renodify`.

```bash
git add -A
git commit -m "Initial Renodify platform"
git branch -M main
git push -u origin main
```

---

## 3. Vercel (hosting + CI deploy)

1. [vercel.com](https://vercel.com) → **Add New → Project** → import
   `snackerbro/renodify`. Framework is auto-detected as **Next.js** — no build
   config needed.
2. **Environment Variables** (Project → Settings → Environment Variables) — add
   for Production (and Preview):
   - `NEXT_PUBLIC_SITE_URL` → your production URL (e.g. `https://renodify.sg`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (later)
   - `NEXT_PUBLIC_STRIPE_PRICE_BASIC/SILVER/GOLD` (later)
3. **Deploy.** Every push to `main` redeploys automatically.
4. **Custom domain** — Project → Settings → Domains → add `renodify.sg` and
   follow the DNS instructions. Update `NEXT_PUBLIC_SITE_URL` to match.

---

## 4. Stripe (vendor subscriptions — switch on when ready)

1. Create a [Stripe](https://stripe.com) account.
2. **Products** — create three recurring (monthly) prices: Basic S$199, Silver
   S$349, Gold S$599. Copy each Price ID into:
   - `NEXT_PUBLIC_STRIPE_PRICE_BASIC`
   - `NEXT_PUBLIC_STRIPE_PRICE_SILVER`
   - `NEXT_PUBLIC_STRIPE_PRICE_GOLD`
3. **API key** — Developers → API keys → Secret key → `STRIPE_SECRET_KEY`.
4. **Webhook** — Developers → Webhooks → Add endpoint:
   - URL: `https://<your-domain>/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.deleted`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
5. Redeploy. The "Choose plan" buttons on `/list-your-business` now start a real
   Stripe Checkout; on success the webhook writes the subscription to Supabase.

Until these keys exist, checkout returns a friendly "billing not configured" message
and the rest of the platform works normally.

---

## How the pieces fit

- **Backend services** live in `lib/services/*` and own all data access. Pages and
  API routes stay thin and call them. Each read service falls back to sample data
  when Supabase isn't configured, so nothing breaks before setup.
- **Three Supabase clients**: `lib/supabase/client.ts` (browser, anon),
  `server.ts` (cookie-bound, RLS as the user), `admin.ts` (service-role, webhooks).
- **Auth & roles** via a `profiles` table + `proxy.ts` gating `/vendor-dashboard`
  and `/customer-dashboard`. A DB trigger auto-creates a profile (and a vendor row
  for vendor sign-ups) on registration.
- **Images** upload to Supabase Storage and serve through `next/image` (the
  Supabase hostname is allow-listed in `next.config.ts`).
- **SEO/GEO**: per-page metadata + canonical, JSON-LD (Article / BreadcrumbList /
  FAQPage / LocalBusiness / Organization), `/sitemap.xml`, `/robots.txt`,
  `/llms.txt`, dynamic OpenGraph image, `lang="en-SG"`.

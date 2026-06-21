# Handoff: Renodify — Singapore Renovation Vendor Directory

## Overview
**Renodify** is a mobile-first web platform and directory for **every renovation vendor a Singapore homeowner needs *after* the interior designer** — blinds, curtains, invisible grilles, awnings, aircon, flooring, smart home, lighting, doors, and more. Positioning line: *"You found your ID. Now find everyone else."*

Business model: **free for homeowners** (browse, compare, request quotes); **vendors pay** a monthly subscription to claim a listing and receive enquiries.

This package documents the full design so it can be implemented in a real codebase with Claude Code.

---

## About the Design Files
The files in this bundle (and in the parent project under `site/`) are **design references created in HTML** — high-fidelity prototypes showing the intended look, layout, and behavior. **They are not production code to copy directly.**

They were built on a small in-house templating runtime (`support.js` / `ds-base.js` with `<x-dc>`, `<sc-if>`, `<sc-for>`, `{{ }}` bindings) purely to make the prototypes interactive. **Do not port that runtime.** Instead, **recreate these designs in your target stack** using its established patterns.

**Recommended stack (no existing codebase):** **Next.js (App Router) + React + TypeScript + Tailwind CSS**, with the design tokens below mapped into `tailwind.config`. A component library like shadcn/ui is a good base for primitives (Button, Input, Dialog/modal, Select). For data: any standard backend (Postgres + Prisma, or Supabase) fits the data models described here.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and interactions are all specified. Recreate the UI pixel-faithfully using the tokens in this document. The single source of visual truth is `_ds/renodify-9d07aaae-ef2f-4fcd-9d91-343fb01d2ad6/styles.css` (design system) plus `site/site.css` (the adaptive website layer built on top).

---

## Architecture at a glance
- **Mobile-first, responsive.** Each page is a single adaptive layout: desktop ≥900px shows a top nav + multi-column layouts; below that it collapses to single-column with a bottom tab bar. Breakpoints used: **640px, 760px, 900px, 1000px**.
- **Two audiences, two areas:**
  - **Homeowner (public)** — directory browsing, vendor profiles, quote requests, content/SEO.
  - **Vendor (authenticated)** — dashboard to manage listing, enquiries, services, deals, events, past work, outlets + hours, plan.
  - **Customer (authenticated)** — light dashboard to track quote replies & saved deals.
- **Design system** ships three palettes (default Teal/Amber, `slate`, `forest`) switchable via `data-palette` on `<html>`.

---

## Screens / Views

### PUBLIC — Homeowner

**1. Home** (`site/home/`)
- Sticky top nav (Browse · Deals · Events · Guides · About + "List your business" + primary "Get Quotes").
- Hero (teal `--rdf-primary` bg, white text): eyebrow pill, H1 `clamp(33px,6vw,54px)` weight 800 with amber emphasis span, subcopy, **HDB/Condo** filter chips, search bar, trust row (checkmarks). Desktop: two columns with a floating `VendorCard` + stat chips on the right; mobile: single column, visual hidden.
- **"What do you still need?"** category grid — `repeat(auto-fill, minmax(150px,1fr))`, **alphabetical A→Z**, 21 tiles (CategoryTile component).
- **Popular vendors** — 3-up VendorCard grid (`--rdf-surface-alt` section bg).
- **How it works** — 3 numbered step cards.
- Trust/CTA banner (`--rdf-primary-tint`) + footer (4-col on desktop, `--rdf-primary-dark` bg).

**2. Browse Categories** (`site/browse-categories/`)
- Page head, search bar, HDB/Condo/Landed chips, full specialist category grid, "still need an ID?" de-emphasised note row.

**3. Category Listing** (`site/category-listing/`)
- Back link, category header (icon + title + count). Desktop: **sticky filter sidebar (264px) + vendor grid**; mobile: filter chips row + bottom-sheet, sticky "Get quotes" CTA above the tab bar.

**4. Vendor Profile** (`site/vendor-profile/`)
- Cover image, **claim banner** ("Is this your business? → Claim"), identity card (logo monogram, name, category, Rating, badges incl. `verified-pending`), trust meta (years / response rate / from-price), **Products & services** (rich cards: thumb, Service/Product tag, features, price, Enquire), **Outlets & opening hours** (each outlet card with address, phone, and its **own** 7-day hours table, today's row highlighted), Past-work gallery, Reviews, Events (upcoming + past), similar companies. Desktop: **sticky contact sidebar**; mobile: **sticky bottom contact bar** (Call / WhatsApp / Get Quote).

**5. Get Quotes** (`site/get-quotes/`)
- Centered multi-step enquiry card (max 640px): Step 1 property type → Step 2 categories (multi-select chips) → Step 3 budget + timeline → Step 4 contact + **PDPA consent** → confirmation. Progress segments at top; Back/Continue footer; "Send request" on final step.

**6. List Your Business** (`site/list-your-business/`)
- Vendor acquisition. Teal hero ("Reach homeowners mid-renovation") + "Find & claim my business" CTA + floating "4 enquiries waiting" card. **Pricing tiers** (Basic S$199 / Silver S$349 "Most popular" / Gold S$599) priced by enquiries/month. "What counts as an enquiry?" explainer.

**7. Subscription Confirmation** (`site/subscription-confirmation/`) — post-checkout success state for a vendor plan.

**8. About & Trust** (`site/about-trust/`) — the "complement-to-ID" positioning, trust approach (soft signals, moderated reviews, property-aware), Verified-coming note, contact.

**9. Renodify Verified** (`site/renodify-verified/`) — how vendors will be verified (checklist of checks), what the badge means, **inactive at launch**.

**10. Guides index** (`site/guides/`) — SEO content hub: featured "after you've picked your ID" card + 2-up guide cards.

**11. Guide detail (SEO article) ×7** (`site/guide-detail/` overview + `site/guide-motorised-blinds-hdb/`, `guide-invisible-grilles-condo/`, `guide-aircon-btu-sizing/`, `guide-flooring-vinyl-tile-spc/`, `guide-when-to-waterproof/`, `guide-post-reno-cleaning/`)
- **SEO-critical.** Each has: unique `<title>`, meta description, keywords, canonical, Open Graph + Twitter tags, **three JSON-LD blocks (`Article`, `BreadcrumbList`, `FAQPage`)**, `lang="en-SG"`, semantic `<article>`, single `<h1>`, ordered `<h2>`/`<h3>`, breadcrumb, sticky table of contents (desktop), key-takeaways box, numbered timeline, pull quote, FAQ, CTA, author bio, related guides. **Preserve all of this metadata when implementing — it's the point of these pages.**

**12. Deals & Promotions** (`site/deals/`) — featured BTO/condo group-buy banner + current-promotions cards.

**13. Events** (`site/events/`) + **Event detail** (`site/event-detail/`) — renovation expos/fairs/roadshows; detail shows date, location, and the list of Renodify vendors exhibiting.

**14. Reno Checklist** (`site/reno-checklist/`) — signature feature: tick off sorted vendor categories, progress bar, see what's still outstanding.

**15. Search Results** (`site/search-results/`) — unified search across matching categories and companies.

**16. Legal** (`site/legal/`) — tabbed PDPA Privacy Policy + Terms of Use.

### AUTH (homeowner + vendor variants)
**17. Login** (`site/login/`), **Register** (`site/register/`), **Forgot password** (`site/forgot-password/`)
- Split layout: brand panel (teal, with feature points) + form card. Each has a **customer vs vendor** role toggle. Vendor logs in to manage enquiries; customer logs in to track quote replies & deals.

### AUTHENTICATED DASHBOARDS
**18. Vendor Dashboard** (`site/vendor-dashboard/`) — **the most complex screen.** See detail below.

**19. Customer Dashboard** (`site/customer-dashboard/`) — track vendor replies to quote requests and saved deals.

---

## Vendor Dashboard — detailed spec
Header band (`--rdf-surface-alt`): business name + category·area, `verified-pending` badge, plan pill. Avatar shows the **uploaded logo only** (no letter monogram). Below: 4 stat cards (New enquiries / Services / Active deals / Past projects).

Layout: **left sidebar of tabs + content column** (desktop), stacked on mobile. Tabs use the design-system **FilterChip**; the active chip is rendered fresh (not class-toggled) so the highlight reliably follows selection.

Tabs:
1. **Enquiries** — list of enquiry cards (homeowner name, status pill New/Replied, service·property·budget·timeline, message, Reply/Call actions).
2. **Profile & outlets** —
   - **Business logo upload**: square preview + native file picker behind a teal pill button; recommendation copy "**512 × 512px** (min 200), PNG/SVG transparent, max 2 MB"; 2 MB client validation; Replace/Remove; persisted to `localStorage` (replace with real upload + storage).
   - **Contact details**: read view + edit form for business name, **WhatsApp number, contact number, location/address**, public email.
   - **Outlets & opening hours**: each outlet is its own card (name, address, phone) with a **per-outlet** 7-day hours editor (toggle each day open/closed + from/to times) opened via "Edit hours"; full outlet CRUD.
3. **Services** — CRUD of services/products (icon, Service/Product type, name, price, unit, description).
4. **Deals** — CRUD of promotions (icon, title, discount, applies-to, ends, details).
5. **Events** — CRUD of expos/fairs (title, type, role, date, location).
6. **Past work** — CRUD of completed projects (title, category, location, year, description).
7. **Plan & billing** — current plan, usage meter, change-plan link.

**CRUD pattern (all entities):** one shared, schema-driven **create/edit modal** (data-driven field list: text / textarea / select). **Delete** routes through a **type-"delete"-to-confirm modal** (destructive button disabled until the word `delete` is typed). Implement with your modal/dialog primitive; keep the typed-confirm guard on destructive deletes.

---

## Interactions & Behavior
- **Navigation:** standard links between pages; bottom tab bar (mobile) maps to Home/Browse/Get Quotes/Checklist; desktop top nav.
- **Tabs / steps / toggles:** local component state. The multi-step Get-Quotes flow and dashboard tabs swap content panels; progress indicators reflect state.
- **Modals:** create/edit (shared form), delete-confirm (typed guard), per-outlet hours editor. Overlay click + close button dismiss; content click stops propagation.
- **Forms:** HDB/Condo/Landed selection, multi-select category chips, PDPA consent checkbox gating submit, logo file validation (≤2 MB, image types).
- **Motion (`site/site-fx.js`):** scroll-reveal entrances (cards/sections rise+fade as they enter view), tactile button press (`scale(.96)`), modal/step transitions, smooth in-page anchor scroll. **Critical rule:** content is **always visible at rest** — the reveal is an additive, self-clearing animation, never an `opacity:0` resting state. All motion is gated behind `@media (prefers-reduced-motion: no-preference)`. Reproduce with your animation lib (e.g. Framer Motion `whileInView`) keeping the visible-at-rest guarantee.
- **Responsive:** see breakpoints; desktop sidebars become stacked/sheet UIs on mobile; sticky CTAs sit above the bottom tab bar.

---

## State Management
Per-screen local state is sufficient for most views; app-level/server state needed for:
- **Auth & role** (homeowner vs vendor vs customer) — drives nav, dashboards, and login destination.
- **Vendor listing data** (the entities below) — server CRUD; dashboard edits should sync to the public vendor profile.
- **Enquiries** — created by the Get-Quotes flow, delivered to matched vendors, status tracked (New/Replied) on both vendor and customer dashboards.
- **Logo** — currently `localStorage`; move to real file upload + asset storage.
- **Subscriptions / billing** — plan selection → checkout → confirmation; enquiry-quota metering.

---

## Data Models (suggested)
```
Vendor        { id, name, category, areas[], logoUrl, whatsapp, phone, location, email,
                plan (basic|silver|gold), verified (bool, false at launch), ratingAvg, reviewCount, yearsInBusiness }
Outlet        { id, vendorId, name, address, phone, hours: DayHours[7] }
DayHours      { day, open (bool), from, to }
Service       { id, vendorId, kind (Service|Product), icon, name, price, unit, description }
Deal          { id, vendorId, icon, title, discount, scope, endsOn, details }
Event         { id, vendorId, type, title, role, date, location }
PastWork      { id, vendorId, title, category, location, year, description, images[] }
Review        { id, vendorId, authorName, rating, text, createdAt }
Category      { id, slug, label, icon, vendorCount }
Enquiry       { id, homeownerContact, propertyType, categories[], budget, timeline, message,
                vendorIds[], status (new|replied), createdAt }
User          { id, role (homeowner|vendor|customer), email, ... }
Subscription  { id, vendorId, plan, enquiriesIncluded, enquiriesUsed, renewsOn }
GuideArticle  { slug, title, metaDescription, keywords, body, faq[], relatedSlugs[] }  // SEO
```

---

## Design Tokens
All tokens live in `_ds/renodify-9d07aaae-ef2f-4fcd-9d91-343fb01d2ad6/styles.css` (copied into this folder as `design-system-styles.css`). Map these into your theme/Tailwind config.

**Colors (default palette — Teal & Amber)**
| Token | Hex | Use |
|---|---|---|
| `--rdf-primary` | `#12625C` | Deep teal — primary buttons, hero, active |
| `--rdf-primary-dark` | `#0A3F3C` | Hovers, footer bg |
| `--rdf-primary-soft` | `#DCEAE5` | Soft sage chips/icon bg |
| `--rdf-primary-tint` | `#EDF4F1` | Tinted section/CTA bg |
| `--rdf-accent` | `#E0823D` | Warm amber — promos, highlights, emphasis |
| `--rdf-accent-dark` | `#C56C29` | Amber hover |
| `--rdf-accent-tint` | `#FBEEE1` | Amber tint bg |
| `--rdf-bg` | `#FAF8F4` | Page background (warm off-white) |
| `--rdf-surface` | `#FFFFFF` | Cards |
| `--rdf-surface-alt` | `#F4F1EA` | Alt sections, headers |
| `--rdf-text` | `#1F2A2A` | Primary text |
| `--rdf-text-secondary` | `#5C6B6A` | Secondary text |
| `--rdf-text-muted` | `#8A9694` | Meta/muted |
| `--rdf-border` | `#E6E2DA` | Hairline borders |
| `--rdf-border-strong` | `#D6D0C4` | Stronger borders/inputs |
| `--rdf-star` | `#F5A623` | Rating stars |
| `--rdf-success` | `#2E9E6B` | Success / open / verified |
| `--rdf-success-soft` | `#E0F1E8` | Success bg |

Alt palettes: `:root[data-palette="slate"]` (cooler urban) and `:root[data-palette="forest"]` (organic warm) — full overrides in the stylesheet. Note: there are **no `--rdf-danger*` tokens**; destructive UI uses literal fallbacks (`#c0392b` text, `#fdecea` bg) — define proper danger tokens in production.

**Typography** — Headings: **Plus Jakarta Sans** 600–800. Body/UI: **Figtree** 400–600. (Google Fonts, imported at top of stylesheet.) Base 16px, never below 14px for copy; meta 12px min. Scale: `--rdf-text-xs..5xl` = 12 / 14 / 16 / 18 / 20 / 24 / 30 / 38 / 48px. Line-height: tight 1.15, snug 1.3, body 1.5. Large display headings use `clamp()` for fluid sizing.

**Spacing** — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px (`--rdf-space-1..8`). Min tap target **48px**.

**Radius** — sm 10 / md 14 / lg 16 / xl 22 / pill 999px. Buttons, chips, search = pill; cards = 14–16px.

**Shadow (soft, low)** — xs `0 1px 2px rgba(31,42,42,.05)` · sm `0 2px 8px /.06` · md `0 6px 20px /.08` · lg `0 14px 38px /.10`.

**Motion easing** — `--rdf-ease: cubic-bezier(0.4, 0.1, 0.2, 1)`; transitions ~.16s (controls) to ~.6s (reveals).

---

## Components (design system — `window.Renodify_9d07aa` in the prototype)
Recreate these as real components in your stack (props in parentheses):
- **Button** (variant: primary | secondary; size: sm | lg; block; iconLeft/iconRight) — pill, teal primary / outlined secondary.
- **Input** (label, type, placeholder) · **SearchBar** (placeholder, showButton).
- **FilterChip** (active, icon, count, caret) — pill toggle; used for filters, toggles, dashboard tabs.
- **Rating** (value, count, showValue, size) — amber stars.
- **Badge** (variant: verified | verified-pending | property | deal) — `verified-pending` is the reserved-slot state used everywhere at launch.
- **CategoryTile** (icon, label, count) · **VendorCard** (name, category, area, rating, reviews, years, responseRate, priceFrom, propertyTypes[], deal, logoText, unclaimed, verifiedPending).
- **Header**, **BottomNav**, **Logo**, **Icon** (line-style icon set; the prototype's full set is in `site/rdf-icon.js` — reuse the SVG paths or substitute your own icon library 1:1).

**Verified-at-launch rule:** the Verified badge is built but **inactive**. Show `verified-pending` ("Verification pending" / "Coming soon"); don't show any vendor as Verified until the programme goes live (Phase 2).

---

## Assets
- **Fonts:** Plus Jakarta Sans + Figtree via Google Fonts (`@import` at top of `design-system-styles.css`).
- **Icons:** custom inline-SVG line set in `site/rdf-icon.js` (and the DS bundle). Names referenced across pages: `blinds, curtains, grille, awning, aircon, flooring, carpentry, smartHome, electrical, waterproofing, painting, cleaning, furniture, lighting, waterFilter, fan, wallpaper, fengshui, door, soundSystem, laundry, tableware, search, user, users, pin, clock, tag, image, calendar, inbox, creditCard, edit, plus, x, check, chevronLeft/Right, arrowRight, phone, message, building, shield, shieldCheck, clipboardCheck, sliders`. Lift the SVG paths from `rdf-icon.js` or map to equivalents in your icon library.
- **Photos:** placeholders only (hatched boxes) — supply real vendor cover/gallery imagery and a real logo upload pipeline.
- **No third-party brand assets** are used.

---

## Files (design references — in the parent project)
- `_ds/renodify-9d07aaae-ef2f-4fcd-9d91-343fb01d2ad6/` — design system: `styles.css` (tokens + base + `.rdf-*` component classes), `_ds_bundle.js` (compiled components), `readme.md`.
- `site/site.css` — the adaptive website layer (header, hero, grids, footer, dashboard, modals, hours, logo, breakpoints). **Primary layout reference after the DS tokens.**
- `site/rdf-icon.js` — icon SVG paths. `site/site-fx.js` — scroll-reveal/motion layer.
- `site/<page>/index.html` — one folder per screen listed above. `index.html` (project root) is a launcher linking all pages.
- In THIS handoff folder: `design-system-styles.css` (copy of the DS tokens/stylesheet) and `site-layer.css` (copy of `site/site.css`).

### Implementation order (suggested)
1. Tokens + base components (Button, Input, Badge, Card, Modal, FilterChip, Icon).
2. Public shell (header/footer/nav) + Home + Browse + Category Listing + Vendor Profile.
3. Get Quotes flow + Enquiry model.
4. Auth (3 roles) + Vendor Dashboard (entities + CRUD + typed-delete + per-outlet hours + logo upload).
5. Customer Dashboard, List-Your-Business + plans/checkout/confirmation.
6. SEO guides (preserve all metadata/JSON-LD), Deals, Events, Reno Checklist, Search, Legal, Verified, About.
```
```
> The bundled HTML is the visual + behavioral source of truth. When in doubt about a measurement or color, read it from `design-system-styles.css` / `site-layer.css`.

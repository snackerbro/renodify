"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  Deal,
  DayHours,
  Enquiry,
  Outlet,
  PastWork,
  Service,
  Subscription,
  VendorDetail,
  VendorEvent,
} from "@/lib/types";
import { Icon } from "@/components/ds/Icon";
import { Badge, VerifiedPendingBadge } from "@/components/ds/Badge";
import { Button } from "@/components/ds/Button";
import { Field, Input, Textarea } from "@/components/ds/Field";
import { CrudModal, type CrudField, type CrudValues } from "./CrudModal";
import { DeleteConfirm } from "./DeleteConfirm";
import { HoursEditor } from "./HoursEditor";
import { LogoUpload } from "./LogoUpload";
import { writeEntity, deleteEntity } from "./persist";
import { DAYS } from "@/lib/constants";

type TabKey = "enquiries" | "profile" | "services" | "deals" | "events" | "pastwork" | "plan";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "enquiries", label: "Enquiries", icon: "inbox" },
  { key: "profile", label: "Profile & outlets", icon: "building" },
  { key: "services", label: "Services", icon: "sliders" },
  { key: "deals", label: "Deals", icon: "tag" },
  { key: "events", label: "Events", icon: "calendar" },
  { key: "pastwork", label: "Past work", icon: "image" },
  { key: "plan", label: "Plan & billing", icon: "creditCard" },
];

// Field schemas for the shared CRUD modal.
const SERVICE_FIELDS: CrudField[] = [
  { key: "name", label: "Name", required: true, full: true, placeholder: "e.g. Motorised roller blinds" },
  { key: "kind", label: "Type", type: "select", options: ["Service", "Product"] },
  { key: "price", label: "Price", placeholder: "e.g. S$280" },
  { key: "unit", label: "Unit", placeholder: "e.g. per window / from" },
  { key: "description", label: "Description", type: "textarea", placeholder: "What's included?" },
];
const DEAL_FIELDS: CrudField[] = [
  { key: "title", label: "Title", required: true, full: true },
  { key: "discount", label: "Discount", placeholder: "e.g. 10% off" },
  { key: "scope", label: "Applies to", placeholder: "e.g. Motorised range" },
  { key: "endsOn", label: "Ends on", placeholder: "e.g. 31 Aug 2026" },
  { key: "details", label: "Details", type: "textarea" },
];
const EVENT_FIELDS: CrudField[] = [
  { key: "title", label: "Title", required: true, full: true },
  { key: "type", label: "Type", type: "select", options: ["Expo", "Fair", "Roadshow"] },
  { key: "role", label: "Your role", placeholder: "e.g. Exhibitor" },
  { key: "date", label: "Date", placeholder: "YYYY-MM-DD" },
  { key: "location", label: "Location", full: true },
];
const PASTWORK_FIELDS: CrudField[] = [
  { key: "title", label: "Title", required: true, full: true },
  { key: "category", label: "Category" },
  { key: "location", label: "Location" },
  { key: "year", label: "Year", placeholder: "e.g. 2025" },
  { key: "description", label: "Description", type: "textarea" },
];
const OUTLET_FIELDS: CrudField[] = [
  { key: "name", label: "Outlet name", required: true, full: true, placeholder: "e.g. Main Showroom" },
  { key: "address", label: "Address", full: true },
  { key: "phone", label: "Phone" },
];

interface ModalState {
  table: string;
  title: string;
  fields: CrudField[];
  initial?: CrudValues;
  editingId?: string;
  // which collection to update
  collection: TabKey | "outlets";
}

export function VendorDashboard({
  vendor,
  enquiries,
  subscription,
  demoMode,
}: {
  vendor: VendorDetail;
  enquiries: Enquiry[];
  subscription: Subscription | null;
  demoMode: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("enquiries");
  const [services, setServices] = useState<Service[]>(vendor.services);
  const [deals, setDeals] = useState<Deal[]>(vendor.deals);
  const [events, setEvents] = useState<VendorEvent[]>(vendor.events);
  const [pastWork, setPastWork] = useState<PastWork[]>(vendor.pastWork);
  const [outlets, setOutlets] = useState<Outlet[]>(vendor.outlets);
  const [logoUrl, setLogoUrl] = useState<string | null>(vendor.logoUrl ?? null);

  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleting, setDeleting] = useState<{ collection: ModalState["collection"]; id: string; label: string; table: string } | null>(null);
  const [hoursEdit, setHoursEdit] = useState<Outlet | null>(null);

  // Profile edit
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: vendor.name,
    whatsapp: vendor.whatsapp ?? "",
    phone: vendor.phone ?? "",
    location: vendor.location ?? "",
    email: vendor.email ?? "",
    about: vendor.about ?? "",
  });

  const newId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`;

  function saveEntity(values: CrudValues) {
    if (!modal) return;
    const id = modal.editingId ?? newId();
    const row = { id, vendorId: vendor.id, ...values };
    // update local state
    const apply = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      setter((list) =>
        modal.editingId
          ? list.map((x) => (x.id === id ? ({ ...x, ...values } as T) : x))
          : [...list, row as unknown as T],
      );
    switch (modal.collection) {
      case "services":
        apply(setServices);
        break;
      case "deals":
        apply(setDeals);
        break;
      case "events":
        apply(setEvents);
        break;
      case "pastwork":
        apply(setPastWork);
        break;
      case "outlets":
        setOutlets((list) =>
          modal.editingId
            ? list.map((o) => (o.id === id ? { ...o, ...values } : o))
            : [...list, { ...(row as unknown as Outlet), hours: defaultHours() }],
        );
        break;
    }
    void writeEntity(modal.table, row, vendor.id);
    setModal(null);
  }

  function confirmDelete() {
    if (!deleting) return;
    const remove = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      setter((list) => list.filter((x) => x.id !== deleting.id));
    switch (deleting.collection) {
      case "services":
        remove(setServices);
        break;
      case "deals":
        remove(setDeals);
        break;
      case "events":
        remove(setEvents);
        break;
      case "pastwork":
        remove(setPastWork);
        break;
      case "outlets":
        remove(setOutlets);
        break;
    }
    void deleteEntity(deleting.table, deleting.id);
    setDeleting(null);
  }

  function saveHours(hours: DayHours[]) {
    if (!hoursEdit) return;
    setOutlets((list) => list.map((o) => (o.id === hoursEdit.id ? { ...o, hours } : o)));
    void writeEntity("outlets", { id: hoursEdit.id, vendorId: vendor.id, name: hoursEdit.name, address: hoursEdit.address, phone: hoursEdit.phone, hours }, vendor.id);
    setHoursEdit(null);
  }

  function saveProfile() {
    void writeEntity("vendors", { id: vendor.id, ...profile, logoUrl }, vendor.id);
    setEditProfile(false);
  }

  const monogram = profile.name.slice(0, 1).toUpperCase();

  return (
    <div className="dash">
      {demoMode && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="note-row">
            <Icon name="shield" size={18} color="var(--rdf-text-secondary)" />
            <span style={{ fontSize: 14, color: "var(--rdf-text-secondary)" }}>
              <strong>Demo mode.</strong> Sign-in and the database aren&apos;t configured yet, so this
              dashboard shows sample data and changes aren&apos;t saved. See SETUP.md.
            </span>
          </div>
        </div>
      )}

      {/* Header band */}
      <div className="dash__head">
        <div className="container dash__head-inner">
          <div
            className={`dash__avatar${logoUrl ? " dash__avatar--logo" : ""}`}
            style={logoUrl ? { backgroundImage: `url(${logoUrl})` } : undefined}
          >
            {!logoUrl && monogram}
          </div>
          <div className="dash__who">
            <h1>{profile.name}</h1>
            <p>
              {vendor.category} · {vendor.areas.join(", ")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <VerifiedPendingBadge />
            {subscription && <Badge variant="property">{subscription.plan.toUpperCase()} plan</Badge>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container" style={{ paddingTop: 20 }}>
        <div className="stat-grid">
          <div className="stat">
            <div className="stat__v">{enquiries.filter((e) => e.status === "new").length}</div>
            <div className="stat__l">New enquiries</div>
          </div>
          <div className="stat">
            <div className="stat__v">{services.length}</div>
            <div className="stat__l">Services</div>
          </div>
          <div className="stat">
            <div className="stat__v">{deals.length}</div>
            <div className="stat__l">Active deals</div>
          </div>
          <div className="stat">
            <div className="stat__v">{pastWork.length}</div>
            <div className="stat__l">Past projects</div>
          </div>
        </div>
      </div>

      {/* Layout: tabs + content */}
      <div className="container" style={{ padding: "22px 20px 56px" }}>
        <div className="dash__layout">
          <div className="dash__tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`rdf-chip${tab === t.key ? " rdf-chip--active" : ""}`}
                aria-pressed={tab === t.key}
                onClick={() => setTab(t.key)}
              >
                <Icon name={t.icon} size={16} /> {t.label}
              </button>
            ))}
          </div>

          <div>
            {tab === "enquiries" && <EnquiriesTab enquiries={enquiries} />}

            {tab === "profile" && (
              <>
                <div className="profile-card">
                  <div className="profile-card__head">
                    <h3>
                      <Icon name="image" size={18} /> Business logo
                    </h3>
                  </div>
                  <LogoUpload vendorId={vendor.id} initialUrl={logoUrl} onChange={setLogoUrl} />
                </div>

                <div className="profile-card">
                  <div className="profile-card__head">
                    <h3>
                      <Icon name="building" size={18} /> Contact details
                    </h3>
                    {!editProfile && (
                      <button className="link-btn" onClick={() => setEditProfile(true)}>
                        <Icon name="edit" size={14} /> Edit
                      </button>
                    )}
                  </div>
                  {editProfile ? (
                    <>
                      <div className="profile-form">
                        <Field label="Business name" className="full">
                          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                        </Field>
                        <Field label="WhatsApp number">
                          <Input value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} />
                        </Field>
                        <Field label="Contact number">
                          <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                        </Field>
                        <Field label="Location / address" className="full">
                          <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                        </Field>
                        <Field label="Public email" className="full">
                          <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                        </Field>
                        <Field label="About" className="full">
                          <Textarea value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
                        </Field>
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <Button variant="secondary" onClick={() => setEditProfile(false)}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={saveProfile}>
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="field-readout">
                      <Readout label="Business name" value={profile.name} />
                      <Readout label="WhatsApp" value={profile.whatsapp} />
                      <Readout label="Contact" value={profile.phone} />
                      <Readout label="Location" value={profile.location} full />
                      <Readout label="Public email" value={profile.email} full />
                    </div>
                  )}
                </div>

                {/* Outlets */}
                <div className="profile-card">
                  <div className="profile-card__head">
                    <h3>
                      <Icon name="pin" size={18} /> Outlets & opening hours
                    </h3>
                    <button
                      className="link-btn"
                      onClick={() =>
                        setModal({
                          table: "outlets",
                          title: "Add outlet",
                          fields: OUTLET_FIELDS,
                          collection: "outlets",
                        })
                      }
                    >
                      <Icon name="plus" size={14} /> Add outlet
                    </button>
                  </div>
                  <div className="outlet-manage-list">
                    {outlets.map((o) => (
                      <div className="outlet-manage" key={o.id}>
                        <div className="outlet-manage__head">
                          <div className="outlet-manage__id">
                            <div className="outlet-manage__name">{o.name}</div>
                            <div className="outlet-manage__meta">
                              <Icon name="pin" size={14} /> {o.address || "No address"}
                            </div>
                            <div className="outlet-manage__meta">
                              <Icon name="phone" size={14} /> {o.phone || "—"}
                            </div>
                          </div>
                          <div className="manage-item__actions">
                            <button
                              className="icon-btn"
                              aria-label="Edit outlet"
                              onClick={() =>
                                setModal({
                                  table: "outlets",
                                  title: "Edit outlet",
                                  fields: OUTLET_FIELDS,
                                  collection: "outlets",
                                  editingId: o.id,
                                  initial: { name: o.name, address: o.address, phone: o.phone },
                                })
                              }
                            >
                              <Icon name="edit" size={16} />
                            </button>
                            <button
                              className="icon-btn icon-btn--danger"
                              aria-label="Delete outlet"
                              onClick={() => setDeleting({ collection: "outlets", id: o.id, label: o.name, table: "outlets" })}
                            >
                              <Icon name="x" size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="outlet-manage__hours">
                          <div className="outlet-manage__hours-head">
                            <span className="outlet-manage__hours-title">
                              <Icon name="clock" size={14} /> Opening hours
                            </span>
                            <button className="link-btn" onClick={() => setHoursEdit(o)}>
                              Edit hours
                            </button>
                          </div>
                          <div className="hours-chips">
                            {DAYS.map((d) => {
                              const h = o.hours.find((x) => x.day === d);
                              return (
                                <span key={d} className={`hours-chip${h?.open ? "" : " is-closed"}`}>
                                  <b>{d}</b> {h?.open ? `${h.from}–${h.to}` : "Closed"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "services" && (
              <EntityList
                title="Services & products"
                subtitle="What you offer, with pricing."
                items={services.map((s) => ({
                  id: s.id,
                  title: s.name,
                  meta: `${s.kind} · ${s.description}`,
                  price: `${s.price} ${s.unit}`,
                  icon: s.kind === "Product" ? "tag" : "sliders",
                  accent: s.kind === "Product",
                }))}
                onAdd={() => setModal({ table: "services", title: "Add service", fields: SERVICE_FIELDS, collection: "services" })}
                onEdit={(id) => {
                  const s = services.find((x) => x.id === id)!;
                  setModal({
                    table: "services",
                    title: "Edit service",
                    fields: SERVICE_FIELDS,
                    collection: "services",
                    editingId: id,
                    initial: { name: s.name, kind: s.kind, price: s.price, unit: s.unit, description: s.description },
                  });
                }}
                onDelete={(id, label) => setDeleting({ collection: "services", id, label, table: "services" })}
              />
            )}

            {tab === "deals" && (
              <EntityList
                title="Deals & promotions"
                subtitle="Limited-time offers shown on your profile and the Deals page."
                items={deals.map((d) => ({ id: d.id, title: d.title, meta: `${d.discount} · ${d.scope}`, price: d.endsOn, icon: "tag", accent: true }))}
                onAdd={() => setModal({ table: "deals", title: "Add deal", fields: DEAL_FIELDS, collection: "deals" })}
                onEdit={(id) => {
                  const d = deals.find((x) => x.id === id)!;
                  setModal({ table: "deals", title: "Edit deal", fields: DEAL_FIELDS, collection: "deals", editingId: id, initial: { title: d.title, discount: d.discount, scope: d.scope, endsOn: d.endsOn, details: d.details } });
                }}
                onDelete={(id, label) => setDeleting({ collection: "deals", id, label, table: "deals" })}
              />
            )}

            {tab === "events" && (
              <EntityList
                title="Events"
                subtitle="Expos, fairs and roadshows you're exhibiting at."
                items={events.map((e) => ({ id: e.id, title: e.title, meta: `${e.type} · ${e.location}`, price: e.date, icon: "calendar" }))}
                onAdd={() => setModal({ table: "events", title: "Add event", fields: EVENT_FIELDS, collection: "events" })}
                onEdit={(id) => {
                  const e = events.find((x) => x.id === id)!;
                  setModal({ table: "events", title: "Edit event", fields: EVENT_FIELDS, collection: "events", editingId: id, initial: { title: e.title, type: e.type, role: e.role, date: e.date, location: e.location } });
                }}
                onDelete={(id, label) => setDeleting({ collection: "events", id, label, table: "events" })}
              />
            )}

            {tab === "pastwork" && (
              <EntityList
                title="Past work"
                subtitle="Completed projects to showcase."
                items={pastWork.map((p) => ({ id: p.id, title: p.title, meta: `${p.category} · ${p.location}`, price: p.year, icon: "image" }))}
                onAdd={() => setModal({ table: "past_work", title: "Add project", fields: PASTWORK_FIELDS, collection: "pastwork" })}
                onEdit={(id) => {
                  const p = pastWork.find((x) => x.id === id)!;
                  setModal({ table: "past_work", title: "Edit project", fields: PASTWORK_FIELDS, collection: "pastwork", editingId: id, initial: { title: p.title, category: p.category, location: p.location, year: p.year, description: p.description } });
                }}
                onDelete={(id, label) => setDeleting({ collection: "pastwork", id, label, table: "past_work" })}
              />
            )}

            {tab === "plan" && <PlanTab subscription={subscription} />}
          </div>
        </div>
      </div>

      {modal && (
        <CrudModal
          title={modal.title}
          fields={modal.fields}
          initial={modal.initial}
          onClose={() => setModal(null)}
          onSave={saveEntity}
        />
      )}
      {deleting && (
        <DeleteConfirm label={deleting.label} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}
      {hoursEdit && (
        <HoursEditor
          outletName={hoursEdit.name}
          initial={hoursEdit.hours}
          onClose={() => setHoursEdit(null)}
          onSave={saveHours}
        />
      )}
    </div>
  );
}

function defaultHours(): DayHours[] {
  return DAYS.map((day) => ({ day, open: day !== "Sun", from: "09:00", to: "18:00" }));
}

function Readout({ label, value, full }: { label: string; value?: string; full?: boolean }) {
  return (
    <div className={full ? "full" : undefined}>
      <div className="ro__label">{label}</div>
      <div className={`ro__value${value ? "" : " muted"}`}>{value || "Not set"}</div>
    </div>
  );
}

function EnquiriesTab({ enquiries }: { enquiries: Enquiry[] }) {
  if (!enquiries.length) {
    return (
      <div className="manage-empty">
        <Icon name="inbox" size={28} />
        <p>No enquiries yet. They&apos;ll appear here as homeowners request quotes.</p>
      </div>
    );
  }
  return (
    <div className="enq">
      {enquiries.map((e) => (
        <div className="enq-card" key={e.id}>
          <div className="enq-card__top">
            <span className="enq-card__icon">
              <Icon name="user" size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="enq-card__title">{e.homeownerName}</div>
              <div className="enq-card__meta">
                {e.categories.join(", ")} · {e.propertyType} · {e.budget} · {e.timeline}
              </div>
            </div>
            <span className={`pill-status pill-status--${e.status}`}>{e.status}</span>
          </div>
          <p className="enq-card__body">{e.message}</p>
          <div className="enq-card__actions">
            <a className="rdf-btn rdf-btn--primary rdf-btn--sm" href={`tel:${e.homeownerContact}`}>
              Reply
            </a>
            <a className="rdf-btn rdf-btn--secondary rdf-btn--sm" href={`tel:${e.homeownerContact}`}>
              <Icon name="phone" size={15} /> Call
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ListItem {
  id: string;
  title: string;
  meta: string;
  price?: string;
  icon: string;
  accent?: boolean;
}

function EntityList({
  title,
  subtitle,
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  items: ListItem[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, label: string) => void;
}) {
  return (
    <>
      <div className="manage-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <Button variant="primary" size="sm" iconLeft="plus" onClick={onAdd}>
          Add
        </Button>
      </div>
      {items.length ? (
        <div className="manage-list">
          {items.map((it) => (
            <div className="manage-item" key={it.id}>
              <span className={`manage-item__icon${it.accent ? " manage-item__icon--accent" : ""}`}>
                <Icon name={it.icon} size={22} />
              </span>
              <div className="manage-item__main">
                <div className="manage-item__title">{it.title}</div>
                <div className="manage-item__meta">{it.meta}</div>
              </div>
              {it.price && <span className="manage-item__price">{it.price}</span>}
              <div className="manage-item__actions">
                <button className="icon-btn" aria-label="Edit" onClick={() => onEdit(it.id)}>
                  <Icon name="edit" size={16} />
                </button>
                <button className="icon-btn icon-btn--danger" aria-label="Delete" onClick={() => onDelete(it.id, it.title)}>
                  <Icon name="x" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="manage-empty">
          <Icon name="plus" size={28} />
          <p>Nothing here yet.</p>
          <Button variant="primary" onClick={onAdd}>
            Add the first one
          </Button>
        </div>
      )}
    </>
  );
}

function PlanTab({ subscription }: { subscription: Subscription | null }) {
  if (!subscription) {
    return (
      <div className="manage-empty">
        <Icon name="creditCard" size={28} />
        <p>No active plan. Choose a plan to start receiving enquiries.</p>
        <Link href="/list-your-business#pricing" className="rdf-btn rdf-btn--primary">
          View plans
        </Link>
      </div>
    );
  }
  const pct = Math.min(100, Math.round((subscription.enquiriesUsed / subscription.enquiriesIncluded) * 100));
  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <h3>
          <Icon name="creditCard" size={18} /> {subscription.plan.toUpperCase()} plan
        </h3>
        <Link href="/list-your-business#pricing" className="link-btn">
          Change plan
        </Link>
      </div>
      <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14 }}>
        {subscription.enquiriesUsed} of {subscription.enquiriesIncluded} enquiries used this cycle ·
        renews {subscription.renewsOn}
      </p>
      <div style={{ height: 10, borderRadius: 999, background: "var(--rdf-border)", marginTop: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "var(--rdf-primary)" }} />
      </div>
    </div>
  );
}

export default VendorDashboard;

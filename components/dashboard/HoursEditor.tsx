"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "@/components/ds/Button";
import { DAYS } from "@/lib/constants";
import type { DayHours } from "@/lib/types";

function defaults(): DayHours[] {
  return DAYS.map((day) => ({ day, open: day !== "Sun", from: "09:00", to: "18:00" }));
}

export function HoursEditor({
  outletName,
  initial,
  onClose,
  onSave,
}: {
  outletName: string;
  initial?: DayHours[];
  onClose: () => void;
  onSave: (hours: DayHours[]) => void;
}) {
  const [hours, setHours] = useState<DayHours[]>(
    () => DAYS.map((d) => initial?.find((h) => h.day === d) ?? defaults().find((h) => h.day === d)!),
  );

  function update(day: string, patch: Partial<DayHours>) {
    setHours((hs) => hs.map((h) => (h.day === day ? { ...h, ...patch } : h)));
  }

  return (
    <Modal
      title={`Opening hours — ${outletName}`}
      subtitle="Set the hours for this outlet. Toggle a day closed to hide its times."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="grow" onClick={() => onSave(hours)}>
            Save hours
          </Button>
        </>
      }
    >
      <div className="hours-list">
        {hours.map((h) => (
          <div className="hours-row" key={h.day}>
            <span className="hours-row__day">{h.day}</span>
            <button
              type="button"
              className={`hours-row__toggle${h.open ? " on" : ""}`}
              onClick={() => update(h.day, { open: !h.open })}
              aria-pressed={h.open}
            >
              <span className="hours-row__switch" />
              {h.open ? "Open" : "Closed"}
            </button>
            {h.open ? (
              <span className="hours-row__times">
                <input
                  className="rdf-input"
                  type="time"
                  value={h.from}
                  onChange={(e) => update(h.day, { from: e.target.value })}
                />
                <span className="sep">–</span>
                <input
                  className="rdf-input"
                  type="time"
                  value={h.to}
                  onChange={(e) => update(h.day, { to: e.target.value })}
                />
              </span>
            ) : (
              <span className="hours-row__closed">Closed</span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default HoursEditor;

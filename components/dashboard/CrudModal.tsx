"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Field, Input, Textarea, Select } from "@/components/ds/Field";
import { Button } from "@/components/ds/Button";

export interface CrudField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  full?: boolean;
  required?: boolean;
}

export type CrudValues = Record<string, string>;

export function CrudModal({
  title,
  fields,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  fields: CrudField[];
  initial?: CrudValues;
  onClose: () => void;
  onSave: (values: CrudValues) => void;
}) {
  const [values, setValues] = useState<CrudValues>(() => {
    const base: CrudValues = {};
    fields.forEach((f) => (base[f.key] = initial?.[f.key] ?? (f.type === "select" ? f.options?.[0] ?? "" : "")));
    return base;
  });

  function set(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  const valid = fields.every((f) => !f.required || values[f.key]?.trim());

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="grow" disabled={!valid} onClick={() => onSave(values)}>
            Save
          </Button>
        </>
      }
    >
      <div className="modal__grid">
        {fields.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            htmlFor={`f-${f.key}`}
            className={f.full || f.type === "textarea" ? "full" : undefined}
          >
            {f.type === "textarea" ? (
              <Textarea
                id={`f-${f.key}`}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : f.type === "select" ? (
              <Select id={`f-${f.key}`} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={`f-${f.key}`}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </Field>
        ))}
      </div>
    </Modal>
  );
}

export default CrudModal;

"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Input } from "@/components/ds/Field";
import { Icon } from "@/components/ds/Icon";

/** Destructive confirm: the delete button stays disabled until the user types "delete". */
export function DeleteConfirm({
  label,
  onClose,
  onConfirm,
}: {
  label: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const armed = typed.trim().toLowerCase() === "delete";

  return (
    <Modal
      title="Delete this item?"
      subtitle={`This permanently removes “${label}”. This can't be undone.`}
      onClose={onClose}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger grow" disabled={!armed} onClick={onConfirm}>
            Delete
          </button>
        </>
      }
    >
      <div className="danger-note">
        <Icon name="shield" size={18} />
        <span>
          To confirm, type <strong>delete</strong> below.
        </span>
      </div>
      <Input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="delete"
        aria-label="Type delete to confirm"
        autoFocus
      />
    </Modal>
  );
}

export default DeleteConfirm;

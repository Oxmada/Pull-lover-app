import { useState } from "react";

export function useConfirmDialog() {
  const [confirmModal, setConfirmModal] = useState(null);

  const askConfirm = (message, onConfirm, confirmLabel = "Supprimer") =>
    setConfirmModal({ message, onConfirm, confirmLabel });

  const closeConfirm = () => setConfirmModal(null);

  return { confirmModal, askConfirm, closeConfirm };
}

import "./ConfirmationDialog.css";

export function ConfirmationDialog({ confirmModal, onClose }) {
  if (!confirmModal) return null;
  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-msg">{confirmModal.message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onClose}>
            Annuler
          </button>
          <button
            className="confirm-ok"
            onClick={() => { confirmModal.onConfirm(); onClose(); }}
          >
            {confirmModal.confirmLabel || "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/hooks/useToast";
import { Toast } from "@/app/components/ui/Toast";
import "../customers/customers.css";

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700, color: "#78716c",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
};

const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e7e5e4",
  borderRadius: 6, fontSize: 13, fontFamily: "inherit", color: "#0f172a",
  outline: "none", boxSizing: "border-box", background: "#fff",
};

function toLocalDatetimeValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminSettingsPage() {
  const [dropDate, setDropDate] = useState("");
  const [currentDrop, setCurrentDrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast, showToast } = useToast();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setCurrentDrop(data.dropDate ?? null);
    setDropDate(toLocalDatetimeValue(data.dropDate));
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    if (!dropDate) {
      setError("Veuillez sélectionner une date.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dropDate: new Date(dropDate).toISOString() }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erreur lors de la sauvegarde");
    } else {
      setCurrentDrop(data.dropDate);
      showToast("Date du drop mise à jour");
    }
  }

  function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  const isExpired = currentDrop && new Date(currentDrop) < new Date();

  return (
    <div className="ap-page">
      <Toast toast={toast} />

      <div className="ap-topbar">
        <h1 className="ap-topbar-title">Paramètres du drop</h1>
      </div>

      {loading ? (
        <div className="admin-loading-wrap"><span className="admin-loader" />Chargement</div>
      ) : (
        <div style={{ maxWidth: 560 }}>

          {/* Statut actuel */}
          <div style={{
            background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10,
            padding: "20px 24px", marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Drop actuel
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
                {formatDate(currentDrop)}
              </span>
              {currentDrop && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                  background: isExpired ? "#fee2e2" : "#dcfce7",
                  color: isExpired ? "#b91c1c" : "#15803d",
                }}>
                  {isExpired ? "Expiré — compteur caché" : "En cours"}
                </span>
              )}
            </div>
          </div>

          {/* Formulaire */}
          <div style={{
            background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10,
            padding: "20px 24px",
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>
              Définir le prochain drop
            </h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Date & heure du drop *</label>
                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={dropDate}
                  onChange={(e) => setDropDate(e.target.value)}
                  required
                />
                <p style={{ fontSize: 11, color: "#a8a29e", marginTop: 6 }}>
                  Le compteur apparaîtra sur le site jusqu'à cette date, puis se cachera automatiquement.
                </p>
              </div>

              {error && (
                <p style={{ fontSize: 13, color: "#C95D5D", margin: 0 }}>{error}</p>
              )}

              <div>
                <button type="submit" className="ap-btn-add" disabled={saving}>
                  {saving ? "Sauvegarde…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

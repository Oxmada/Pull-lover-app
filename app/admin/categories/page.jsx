"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const P = {
  bg:     "#f5f5f4",
  card:   "#fff",
  border: "#e7e5e4",
  text:   "#0f172a",
  muted:  "#a8a29e",
  accent: "#C95D5D",
  font:   "var(--font-montserrat), 'Montserrat', sans-serif",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [newName, setNewName]       = useState("");
  const [editingId, setEditingId]   = useState(null);
  const [editName, setEditName]     = useState("");
  const [toast, setToast]           = useState(null);
  const inputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (showForm) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showForm]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res  = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || "Erreur", "error"); return; }
    setNewName("");
    setShowForm(false);
    fetchCategories();
    showToast("Catégorie créée");
  };

  const startEdit = (cat) => { setEditingId(cat._id); setEditName(cat.name); };
  const cancelEdit = ()    => { setEditingId(null); setEditName(""); };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    const res  = await fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || "Erreur", "error"); return; }
    setCategories((prev) => prev.map((c) => c._id === id ? { ...c, name: data.name } : c));
    cancelEdit();
    showToast("Catégorie renommée");
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const res  = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || "Erreur", "error"); return; }
    setCategories((prev) => prev.filter((c) => c._id !== id));
    showToast("Catégorie supprimée");
  };

  return (
    <div style={{ minHeight: "100vh", background: P.bg, padding: "28px 36px", fontFamily: P.font }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          padding: "12px 20px", borderRadius: "10px", color: "#fff",
          fontSize: "14px", fontWeight: "600", fontFamily: P.font,
          background: toast.type === "error" ? P.accent : P.text,
          boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
          animation: "cat-slide-in 0.25s ease",
        }}>
          {toast.message}
        </div>
      )}

      <style>{`@keyframes cat-slide-in { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }`}</style>

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link href="/admin/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "7px 14px", background: P.card, color: "#57534e",
          border: `1.5px solid ${P.border}`, borderRadius: "8px",
          fontSize: "13px", fontWeight: "600", fontFamily: P.font,
          cursor: "pointer", textDecoration: "none", transition: "all 0.15s",
          flexShrink: 0,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = P.text; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = P.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = P.card; e.currentTarget.style.color = "#57534e"; e.currentTarget.style.borderColor = P.border; }}
        >
          ← Dashboard
        </Link>

        <h1 style={{ fontSize: "26px", fontWeight: "700", color: P.text, letterSpacing: "-0.5px", flex: 1, margin: 0 }}>
          Catégories
        </h1>

        <button
          onClick={() => { setShowForm((v) => !v); setNewName(""); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", background: P.accent, color: "#fff",
            border: "none", borderRadius: "9px", fontSize: "13px",
            fontWeight: "700", fontFamily: P.font, cursor: "pointer",
            transition: "background 0.2s", flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#b04d4d"}
          onMouseLeave={(e) => e.currentTarget.style.background = P.accent}
        >
          + Nouvelle catégorie
        </button>
      </div>

      {/* Formulaire d'ajout inline */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          display: "flex", gap: "8px", alignItems: "center",
          background: P.card, border: `1px solid ${P.border}`,
          borderRadius: "12px", padding: "14px 18px", marginBottom: "16px",
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Nom de la catégorie…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              flex: 1, padding: "8px 13px", border: `1.5px solid ${P.border}`,
              borderRadius: "8px", fontSize: "13px", fontFamily: P.font,
              color: P.text, background: "#fafaf9", outline: "none",
            }}
            onFocus={(e)  => { e.target.style.borderColor = P.accent; e.target.style.background = P.card; }}
            onBlur={(e)   => { e.target.style.borderColor = P.border; e.target.style.background = "#fafaf9"; }}
          />
          <button type="submit" style={{
            padding: "8px 18px", background: P.text, color: "#fff",
            border: "none", borderRadius: "8px", fontSize: "13px",
            fontWeight: "600", fontFamily: P.font, cursor: "pointer",
          }}>
            Créer
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={{
            padding: "8px 14px", background: "#f5f5f4", color: "#78716c",
            border: `1.5px solid ${P.border}`, borderRadius: "8px",
            fontSize: "13px", fontWeight: "600", fontFamily: P.font, cursor: "pointer",
          }}>
            Annuler
          </button>
        </form>
      )}

      {/* Table */}
      <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: P.muted, fontSize: "15px", fontFamily: P.font }}>
            Chargement…
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: P.muted, fontSize: "15px", fontFamily: P.font }}>
            Aucune catégorie. Créez-en une !
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafaf9", borderBottom: `1px solid ${P.border}` }}>
                {["Nom", "Créée le", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding: "11px 18px", textAlign: "left", fontSize: "11px",
                    fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em",
                    color: P.muted, fontFamily: P.font, whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat._id}
                  style={{ borderTop: i === 0 ? "none" : `1px solid #f5f5f4`, transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fafaf9"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {/* Nom / Rename inline */}
                  <td style={{ padding: "13px 18px", fontFamily: P.font }}>
                    {editingId === cat._id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRename(cat._id); if (e.key === "Escape") cancelEdit(); }}
                        style={{
                          padding: "6px 10px", border: `1.5px solid ${P.accent}`,
                          borderRadius: "7px", fontSize: "14px", fontFamily: P.font,
                          color: P.text, background: P.card, outline: "none", width: "220px",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "14px", fontWeight: "600", color: P.text }}>
                        {cat.name}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td style={{ padding: "13px 18px", fontSize: "13px", color: "#78716c", fontFamily: P.font, whiteSpace: "nowrap" }}>
                    {new Date(cat.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {editingId === cat._id ? (
                        <>
                          <ActionBtn onClick={() => handleRename(cat._id)} variant="save">Sauvegarder</ActionBtn>
                          <ActionBtn onClick={cancelEdit} variant="cancel">Annuler</ActionBtn>
                        </>
                      ) : (
                        <>
                          <ActionBtn onClick={() => startEdit(cat)} variant="edit">Modifier</ActionBtn>
                          <ActionBtn onClick={() => handleDelete(cat._id, cat.name)} variant="delete">Supprimer</ActionBtn>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Compteur */}
      {!loading && categories.length > 0 && (
        <p style={{ marginTop: "12px", fontSize: "12px", color: P.muted, fontFamily: P.font }}>
          {categories.length} catégorie{categories.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

function ActionBtn({ onClick, variant, children }) {
  const styles = {
    edit:   { bg: "#f5f5f4", color: "#0f172a", border: "#e7e5e4", hoverBg: "#0f172a", hoverColor: "#fff" },
    delete: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3", hoverBg: "#be123c", hoverColor: "#fff" },
    save:   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", hoverBg: "#15803d", hoverColor: "#fff" },
    cancel: { bg: "#f5f5f4", color: "#78716c", border: "#e7e5e4", hoverBg: "#78716c", hoverColor: "#fff" },
  };
  const s = styles[variant];
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px", background: s.bg, color: s.color,
        border: `1.5px solid ${s.border}`, borderRadius: "7px",
        fontSize: "12px", fontWeight: "600",
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = s.hoverBg; e.currentTarget.style.color = s.hoverColor; e.currentTarget.style.borderColor = s.hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = s.bg; e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.border; }}
    >
      {children}
    </button>
  );
}

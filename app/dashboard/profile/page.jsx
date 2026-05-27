"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    phone: "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [infoMsg, setInfoMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  async function handleInfoSave(e) {
    e.preventDefault();
    setLoading(true);
    setInfoMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        await update({ name: form.name });
        setInfoMsg({ type: "success", text: "Profil mis à jour." });
      } else {
        setInfoMsg({ type: "error", text: data.message });
      }
    } catch {
      setInfoMsg({ type: "error", text: "Erreur réseau." });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPwMsg({ type: "success", text: "Mot de passe modifié." });
      } else {
        setPwMsg({ type: "error", text: data.message });
      }
    } catch {
      setPwMsg({ type: "error", text: "Erreur réseau." });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div>
      <h1 className="db-page-title">Mon profil</h1>
      <div className="db-wrapper">

        {/* ── Informations ── */}
        <div className="db-card">
          <p className="db-section-title">Informations personnelles</p>
          <form onSubmit={handleInfoSave} className="db-form">

            <div className="db-form-row">
              <label className="db-form-label">Nom complet</label>
              <input
                className="db-form-input"
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                minLength={2}
              />
            </div>

            <div className="db-form-row">
              <label className="db-form-label">Email</label>
              <input
                className="db-form-input db-form-input-disabled"
                type="email"
                value={session?.user?.email || ""}
                disabled
              />
              <span className="db-form-hint">L&apos;email ne peut pas être modifié.</span>
            </div>

            <div className="db-form-row">
              <label className="db-form-label">Téléphone</label>
              <input
                className="db-form-input"
                type="tel"
                placeholder="ex : +33 6 12 34 56 78"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            {infoMsg && (
              <p className={infoMsg.type === "success" ? "db-form-success" : "db-form-error"}>
                {infoMsg.text}
              </p>
            )}

            <button className="db-form-btn" type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
        </div>

        {/* ── Mot de passe ── */}
        <div className="db-card">
          <p className="db-section-title">Changer le mot de passe</p>
          <form onSubmit={handlePasswordSave} className="db-form">

            <div className="db-form-row">
              <label className="db-form-label">Mot de passe actuel</label>
              <input
                className="db-form-input"
                type="password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="db-form-row">
              <label className="db-form-label">Nouveau mot de passe</label>
              <input
                className="db-form-input"
                type="password"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            <div className="db-form-row">
              <label className="db-form-label">Confirmer le mot de passe</label>
              <input
                className="db-form-input"
                type="password"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
              />
            </div>

            {pwMsg && (
              <p className={pwMsg.type === "success" ? "db-form-success" : "db-form-error"}>
                {pwMsg.text}
              </p>
            )}

            <button className="db-form-btn" type="submit" disabled={pwLoading}>
              {pwLoading ? "Modification…" : "Modifier le mot de passe"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ButtonPrimary } from "../../components/ui/Button";
import "./register.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const router = useRouter();

  function getPasswordStrength(pwd) {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Faible", color: "#ef4444", width: "33%" };
    if (pwd.length < 10) return { label: "Moyen", color: "#f59e0b", width: "66%" };
    return { label: "Fort", color: "#10b981", width: "100%" };
  }

  const strength = getPasswordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessageType("error");
      return setMessage("Les mots de passe ne correspondent pas");
    }
    if (!acceptTerms) {
      setMessageType("error");
      return setMessage("Vous devez accepter les conditions");
    }
    if (password.length < 6) {
      setMessageType("error");
      return setMessage("Mot de passe trop court (min. 6 caractères)");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessageType("error");
        return setMessage(data.message || "Erreur");
      }
      setMessage("Compte créé ! Redirection...");
      setMessageType("success");
      setTimeout(async () => {
        await signIn("credentials", { email, password, redirect: false });
        router.push("/dashboard");
      }, 1500);
    } catch {
      setMessageType("error");
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      <div className="register-bg">
        <span /><span /><span /><span />
      </div>

      <div className="register-card">

        <div className="register-card-header">
          <h1>Créer un compte</h1>
        </div>

          {/* CHAMPS */}
          <div className="register-inputs">

            <div className="register-field">
              <label>Nom complet</label>
              <div className="register-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>

            <div className="register-field">
              <label>Adresse e-mail</label>
              <div className="register-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="register-field">
              <label>Mot de passe</label>
              <div className="register-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showPwd ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {strength && (
                <div className="register-strength">
                  <div className="register-strength-bar">
                    <div style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="register-field">
              <label>Confirmer le mot de passe</label>
              <div className="register-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showConfirmPwd ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                  {showConfirmPwd ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* CGU */}
          <label className="register-terms">
            <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
            <span>J'accepte les <Link href="/cgu">conditions d'utilisation</Link> et la <Link href="/privacy">politique de confidentialité</Link></span>
          </label>

          {/* MESSAGE */}
          {message && <p className={`register-message ${messageType}`}>{message}</p>}

          {/* BOUTON */}
          <ButtonPrimary full onClick={handleSubmit} disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </ButtonPrimary>

          {/* DIVIDER */}
          <div className="register-divider">
            <span /><p>Ou s'inscrire avec</p><span />
          </div>

          {/* SOCIAL */}
          <div className="register-social">
            <button type="button" onClick={() => signIn("google")}>Google</button>
            <button type="button" onClick={() => signIn("facebook")}>Facebook</button>
          </div>

          {/* FOOTER */}
          <div className="register-footer">
            <p>Vous avez déjà un compte ?</p>
            <Link href="/auth/login">Se connecter</Link>
          </div>

      </div>
    </div>
  );
}
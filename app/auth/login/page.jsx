"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ButtonPrimary } from "../../components/ui/Button";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setError("Email ou mot de passe incorrect");
    const session = await getSession();
    router.push(session?.user?.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="login-page">

      <div className="login-bg">
        <span /><span /><span /><span />
      </div>

      {/* CARD */}
      <div className="login-card">

        <form onSubmit={handleLogin}>
          {/* INPUTS — Frame 4592 : gap 10px */}
          <div className="login-inputs">
            <div className="login-field">
              <label>Adresse e-mail</label>
              <div className="login-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Tom.exemple@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Mot de passe</label>
              <div className="login-input-wrap">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
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
            </div>
          </div>

          {/* OPTIONS + BOUTON — Frame 4592 : gap 20px */}
          <div className="login-actions">
            <div className="login-options">
              <label><input type="checkbox" /> Se souvenir de moi</label>
              <Link href="/auth/forgot-password">Mot de passe oublié</Link>
            </div>

            {error && <p className="login-error">{error}</p>}

            <ButtonPrimary full type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </ButtonPrimary>

            <div className="login-divider">
              <span /><p>Ou continuer avec</p><span />
            </div>
          </div>
        </form>

        {/* SOCIAL — Frame 4646 : h50px, gap 20px */}
        <div className="login-social">
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Google</button>
          <button onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}>Facebook</button>
        </div>

        {/* FOOTER — Frame 4644 : h30px, space-between */}
        <div className="login-footer">
          <p>Pas encore de compte ?</p>
          <Link href="/auth/register">Créer un compte</Link>
        </div>

      </div>
    </div>
  );
}
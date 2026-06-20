"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ButtonPrimary } from "./components/ui/Button";
import "./home.css";
import AproposSection from "./components/AproposSection";

const CounterTime = dynamic(() => import("./components/CounterTime"), { ssr: false });
import NotreCollectionSection from "./components/NotreCollectionSection";
import ProcessSection from "./components/ProcessSection";
import LifeStyleSection from "./components/LifeStyleSection";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function HomePage() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState(null); // "success" | "error" | "duplicate"
  const valuesRef = useScrollReveal(0.1);

  async function handleNewsletter(e) {
    e.preventDefault();
    setNlStatus("success");
    setNlEmail("");
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nlEmail }),
    }).then((res) => {
      if (res.status === 409) setNlStatus("duplicate");
      else if (!res.ok) setNlStatus("error");
    }).catch(() => setNlStatus("error"));
  }

  return (
    <main className="home-pro">

      {/* ── Compteur drop ── */}
      <CounterTime />

      {/* ── À propos ── */}
      <AproposSection />

      {/* ── Nouveautés ── */}
      <NotreCollectionSection />

      {/* ── Comment ça fonctionne ── */}
      <ProcessSection />

      {/* ── Lifestyle ── */}
      <LifeStyleSection />

      {/* ── Valeurs + Newsletter ── */}
      <section className="values-newsletter-section reveal" ref={valuesRef}>
        <div className="values-newsletter-inner">

          {/* Bandeau unique */}
          <div className="vn-band">

            {/* Ligne valeurs */}
            <div className="vn-vals">
              <div className="vn-val">
                <svg className="vn-val-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <div>
                  <h4>Livraison rapide</h4>
                  <p>24-48h partout à Madagascar</p>
                </div>
              </div>
              <div className="vn-val">
                <svg className="vn-val-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <h4>Paiement sécurisé</h4>
                  <p>Transactions 100% protégées</p>
                </div>
              </div>
              <div className="vn-val">
                <svg className="vn-val-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <div>
                  <h4>Retours gratuits</h4>
                  <p>30 jours pour changer d'avis</p>
                </div>
              </div>
              <div className="vn-val">
                <svg className="vn-val-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                <div>
                  <h4>Support client</h4>
                  <p>Assistance disponible 7j/7</p>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="vn-divider" />

            {/* Newsletter */}
            <div className="vn-newsletter">
              <div className="vn-nl-text">
                <h3>Restez informé</h3>
                <p>Offres exclusives en avant-première</p>
              </div>
              <div className="vn-nl-right">
                <form className="vn-nl-form" onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    className="vn-nl-input"
                    placeholder="Votre adresse email"
                    aria-label="Votre adresse email"
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    required
                  />
                  <ButtonPrimary type="submit">S'inscrire</ButtonPrimary>
                </form>
                {nlStatus === "success" && (
                  <p className="vn-nl-feedback vn-nl-feedback--ok">Inscription confirmée !</p>
                )}
                {nlStatus === "duplicate" && (
                  <p className="vn-nl-feedback vn-nl-feedback--warn">Cet email est déjà inscrit.</p>
                )}
                {nlStatus === "error" && (
                  <p className="vn-nl-feedback vn-nl-feedback--err">Une erreur est survenue, réessayez.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
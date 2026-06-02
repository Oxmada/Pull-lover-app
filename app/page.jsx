"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./home.css";
import CounterTime from "./components/CounterTime";
import AproposSection from "./components/AproposSection";
import NotreCollectionSection from "./components/NotreCollectionSection";
import ProcessSection from "./components/ProcessSection";
import LifeStyleSection from "./components/LifeStyleSection";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState(null); // "success" | "error" | "duplicate"
  const promoRef = useScrollReveal(0.1);
  const valuesRef = useScrollReveal(0.1);

  async function handleNewsletter(e) {
    e.preventDefault();
    setNlStatus(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nlEmail }),
      });
      if (res.ok) {
        setNlStatus("success");
        setNlEmail("");
      } else {
        const data = await res.json();
        setNlStatus(res.status === 409 ? "duplicate" : "error");
      }
    } catch {
      setNlStatus("error");
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  }, []);

  const promoProducts = products.filter(p => p.promoPrice).slice(0, 4);

  return (
    <main className="home-pro">

      {/* ── Compteur drop ── */}
      <CounterTime />

      {/* ── À propos ── */}
      <AproposSection />

      {/* ── Promotions ── */}
      {promoProducts.length > 0 && (
        <section className="promo-banner-pro reveal" ref={promoRef}>
          <div className="container-pro">
            <div className="promo-header-pro">
              <div>
                <span className="promo-label">Offres spéciales</span>
                <h2>Jusqu'à -50% sur une sélection</h2>
              </div>
              <Link href="/nos-mailles?promo=true" className="btn-view-all">Tout voir →</Link>
            </div>
            <div className="products-grid-pro">
              {promoProducts.map((product) => (
                <Link href={`/products/${product._id}`} key={product._id} className="product-card-pro">
                  {product.promoPrice && (
                    <span className="product-discount">
                      -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                    </span>
                  )}
                  <div className="product-image-pro">
                    <img src={product.image || "/no-image.png"} alt={product.name} />
                    <div className="product-overlay">Voir le produit →</div>
                  </div>
                  <div className="product-details-pro">
                    <h3>{product.name}</h3>
                    {product.brand && <p className="product-brand">{product.brand}</p>}
                    <div className="product-price-pro">
                      <span className="price-current">{product.promoPrice?.toLocaleString()} €</span>
                      <span className="price-original">{product.price.toLocaleString()} €</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <form className="vn-nl-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  className="vn-nl-input"
                  placeholder="Votre adresse email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  required
                />
                <button className="vn-nl-btn" type="submit">S'inscrire</button>
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
      </section>

    </main>
  );
}
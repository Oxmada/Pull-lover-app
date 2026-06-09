"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useState } from "react";
import { ButtonPrimary } from "../components/ui/Button";
import "./cart.css";

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, cartTotal } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");

  const TVA_RATE = 0.20;
  const tva = Math.round(cartTotal * TVA_RATE);
  const total = cartTotal + tva;
  const totalQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="cart-page">

      {/* Fond orbes animés */}
      <div className="cart-bg">
        <span /><span /><span /><span />
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Votre panier est vide.</p>
          <Link href="/nos-mailles">Retour à la boutique</Link>
        </div>
      ) : (
        <div className="cart-wrapper">

          {/* COLONNE GAUCHE */}
          <div className="cart-left">
            <h2 className="cart-title">Mon panier</h2>

            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.cartKey} className="cart-item">

                  {/* IMAGE */}
                  <div className="cart-item-image">
                    {item.image && <img src={item.image} alt={item.name} />}
                  </div>

                  {/* NOM + TAILLE + COULEUR + QTY */}
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    {(item.size || item.color) && (
                      <p className="cart-item-variant">
                        {item.size && <span>Taille : {item.size}</span>}
                        {item.size && item.color && " · "}
                        {item.color && <span>Couleur : {item.color}</span>}
                      </p>
                    )}
                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(item.cartKey)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.cartKey)}>+</button>
                    </div>
                  </div>

                  {/* PRIX + REMOVE */}
                  <div className="cart-item-right">
                    <span className="cart-item-price">{item.promoPrice ?? item.price} €</span>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.cartKey)} aria-label="Supprimer l'article">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>

                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE DROITE */}
          <div className="cart-right">
            <div className="cart-promo">
              <h3 className="cart-section-title">Code promo</h3>
              <div className="promo-input-row">
                <input
                  type="text"
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button>Appliquer</button>
              </div>
            </div>

            <div className="cart-summary">
              <h3 className="cart-section-title">Résumé</h3>
              <div className="summary-row">
                <span>Sous-total ({totalQty} article{totalQty > 1 ? "s" : ""})</span>
                <span>{cartTotal} €</span>
              </div>
              <div className="summary-row">
                <span>TVA (20%)</span>
                <span>{tva} €</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{total} €</span>
              </div>
              <ButtonPrimary full onClick={() => router.push("/checkout")}>
                Procéder au paiement
              </ButtonPrimary>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

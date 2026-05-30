"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useState } from "react";
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
                    <button className="cart-remove" onClick={() => removeFromCart(item.cartKey)}>
                      Supprimer
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
              <button className="checkout-btn" onClick={() => router.push("/checkout")}>
                Procéder au paiement
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

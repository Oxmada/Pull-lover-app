"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/app/components/CartContext";
import { ButtonPrimary, ButtonGhost } from "@/app/components/ui/Button";
import "./checkout.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "13px",
      fontFamily: "Montserrat, sans-serif",
      color: "#111",
      "::placeholder": { color: "#aaa" },
    },
    invalid: { color: "#ef4444" },
  },
};

function CheckoutInner() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Madagascar");
  const [shipping, setShipping] = useState("colissimo");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pull-lover-promo");
      if (stored) setAppliedPromo(JSON.parse(stored));
    } catch {}
  }, []);

  const TVA_RATE = 0.20;
  const promoDiscount = appliedPromo?.discount ?? 0;
  const discountedSubtotal = Math.max(0, cartTotal - promoDiscount);
  const tva = Math.round(discountedSubtotal * TVA_RATE);
  const livraison = 25;
  const total = discountedSubtotal + tva + livraison;
  const totalQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstname || !lastname || !email || !city || !address) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setErrorMsg("Votre panier est vide.");
      return;
    }
    if (!stripe || !elements) {
      setErrorMsg("Stripe n'est pas encore chargé. Réessayez.");
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le PaymentIntent côté serveur
      const piRes = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, customerEmail: email }),
      });
      const piData = await piRes.json();
      if (!piRes.ok) {
        setErrorMsg(piData.message || "Erreur lors de la création du paiement.");
        return;
      }

      // 2. Confirmer le paiement avec la carte Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(piData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${firstname} ${lastname}`,
            email,
            address: { city, postal_code: postalCode, country: "FR" },
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setErrorMsg("Le paiement n'a pas abouti. Réessayez.");
        return;
      }

      // 3. Créer la commande en base
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { firstname, lastname, email, company, city, address, postalCode, country },
          cartItems,
          total,
          payment: "card",
          delivery: shipping,
          stripePaymentId: paymentIntent.id,
          promoCode: appliedPromo?.code || null,
          discountAmount: promoDiscount || 0,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setErrorMsg(orderData.message || "Commande non enregistrée, contactez le support.");
        return;
      }

      clearCart();
      localStorage.removeItem("pull-lover-promo");
      router.push("/success");

    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      setErrorMsg("Erreur inattendue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      <div className="checkout-bg">
        <span /><span /><span /><span />
      </div>

      <div className="checkout-inner">

        <button className="checkout-back" onClick={() => router.back()}>
          ← Retour
        </button>

        <div className="checkout-wrapper">

          {/* COLONNE GAUCHE */}
          <div className="checkout-left">

            {/* CONTACT */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">Contact</h3>
              <input
                type="email"
                placeholder="Tom.exemple@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="checkout-input"
                required
              />
            </div>

            {/* LIVRAISON */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">Livraison</h3>
              <input
                type="text"
                placeholder="Pays / région"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="checkout-input"
              />
              <div className="checkout-row">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="checkout-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="checkout-input"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Entreprise (optionnel)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="checkout-input"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="checkout-input"
                required
              />
              <div className="checkout-row">
                <input
                  type="text"
                  placeholder="Code postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="checkout-input"
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="checkout-input"
                  required
                />
              </div>
            </div>

            {/* MODE D'EXPÉDITION */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">Mode d'expédition</h3>
              <label className="checkout-radio">
                <input
                  type="radio"
                  name="shipping"
                  value="colissimo"
                  checked={shipping === "colissimo"}
                  onChange={() => setShipping("colissimo")}
                />
                <span>Colissimo — Livraison avec signature entre 2 et 8 jours</span>
              </label>
              <label className="checkout-radio">
                <input
                  type="radio"
                  name="shipping"
                  value="relais"
                  checked={shipping === "relais"}
                  onChange={() => setShipping("relais")}
                />
                <span>Point relais Colissimo — 2 à 4 jours</span>
              </label>
            </div>

            {/* PAIEMENT — Stripe Elements */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">Paiement</h3>
              <div className="checkout-stripe-card">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <p className="checkout-stripe-notice">
                🔒 Paiement sécurisé par Stripe. Vos données carte ne transitent jamais par nos serveurs.
              </p>
            </div>

            {errorMsg && <p className="checkout-error">{errorMsg}</p>}

            <ButtonPrimary
              full
              onClick={handleSubmit}
              disabled={loading || !stripe}
            >
              {loading ? "Traitement en cours..." : `Payer ${total} €`}
            </ButtonPrimary>

          </div>

          {/* COLONNE DROITE — Résumé */}
          <div className="checkout-right">

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item._id} className="checkout-item">
                  <div className="checkout-item-image">
                    {item.image && <img src={item.image} alt={item.name} />}
                  </div>
                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span className="checkout-item-price">
                    {item.promoPrice ?? item.price} €
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Résumé</h3>
              <div className="checkout-summary-row">
                <span>Sous-total ({totalQty})</span>
                <span>{cartTotal} €</span>
              </div>
              {appliedPromo && (
                <div className="checkout-summary-row" style={{ color: "#15803d", fontWeight: 600 }}>
                  <span>Remise ({appliedPromo.code})</span>
                  <span>−{promoDiscount} €</span>
                </div>
              )}
              <div className="checkout-summary-row">
                <span>TVA (20%)</span>
                <span>{tva} €</span>
              </div>
              <div className="checkout-summary-row">
                <span>Livraison</span>
                <span>{livraison} €</span>
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row checkout-summary-total">
                <span>Total</span>
                <span>{total} €</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}

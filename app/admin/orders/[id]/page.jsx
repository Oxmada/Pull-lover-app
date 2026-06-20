"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/hooks/useToast";
import { Toast } from "@/app/components/ui/Toast";
import "./order-detail.css";

const STATUS_OPTIONS = [
  { value: "pending",    label: "En attente"     },
  { value: "confirmed",  label: "Confirm�e"      },
  { value: "processing", label: "En pr�paration" },
  { value: "paid",       label: "Pay�e"          },
  { value: "shipped",    label: "Exp�di�e"       },
  { value: "delivered",  label: "Livr�e"         },
  { value: "cancelled",  label: "Annul�e"        },
];

const PAYMENT_LABELS = {
  cash:          "Esp�ces",
  mobile_money:  "Mobile Money",
  card:          "Carte bancaire",
  bank_transfer: "Virement bancaire",
};

export default function AdminOrderDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) { router.push("/admin/orders"); return; }
        const data = await res.json();
        setOrder(data);
      } catch {
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, router]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res  = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || "Erreur", "error"); return; }
      setOrder(data);
      showToast("Statut mis � jour � email envoy� au client");
    } catch {
      showToast("Erreur serveur", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="od-page">
        <div className="admin-loading-wrap"><span className="admin-loader" /></div>
      </div>
    );
  }

  if (!order) return null;

  const c           = order.customer || {};
  const fullName    = [c.firstname, c.lastname].filter(Boolean).join(" ") || "�";
  const initials    = ((c.firstname?.[0] || "") + (c.lastname?.[0] || "")).toUpperCase() || "?";
  const orderNumber = order._id.toString().slice(-8).toUpperCase();

  return (
    <div className="od-page">

      <Toast toast={toast} />

      {/* Topbar */}
      <div className="od-topbar">
        <Link href="/admin/orders" className="od-back-btn">← Retour</Link>
        <div className="od-topbar-center">
          <h1 className="od-title">Commande <span className="od-ref">#{orderNumber}</span></h1>
          {order.createdAt && (
            <span className="od-date-top">
              {new Date(order.createdAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </span>
          )}
        </div>
        <span className={`ao-status-badge ao-status-${order.status}`}>
          {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
        </span>
      </div>

      <div className="od-grid">

        {/* ── Client ── */}
        <div className="od-card">
          <h2 className="od-card-title">Client</h2>
          <div className="od-client-row">
            <div className="od-avatar">{initials}</div>
            <div>
              <div className="od-client-name">{fullName}</div>
              {c.email && (
                <a href={`mailto:${c.email}`} className="od-client-email">{c.email}</a>
              )}
              {c.phone && <div className="od-client-phone">{c.phone}</div>}
            </div>
          </div>
          {(c.address || c.city) && (
            <div className="od-address-block">
              <div className="od-address-label">Adresse de livraison</div>
              {c.address && <div className="od-address-line">{c.address}</div>}
              {c.city    && <div className="od-address-city">{c.city}</div>}
            </div>
          )}
        </div>

        {/* ── R�sum� ── */}
        <div className="od-card">
          <h2 className="od-card-title">R�sum�</h2>
          <div className="od-summary-row">
            <span className="od-summary-label">Paiement</span>
            <span className={`ao-payment ao-payment-${order.payment}`}>
              {PAYMENT_LABELS[order.payment] || order.payment || "�"}
            </span>
          </div>
          <div className="od-summary-row">
            <span className="od-summary-label">Articles</span>
            <span className="od-summary-value">{order.products?.length || 0}</span>
          </div>
          <div className="od-summary-row od-summary-total">
            <span className="od-summary-label">Total</span>
            <span className="od-total-value">{(order.total || 0).toLocaleString()} �</span>
          </div>
        </div>

        {/* ── Changer le statut ── */}
        <div className="od-card">
          <h2 className="od-card-title">Changer le statut</h2>
          <p className="od-status-hint">Un email est envoy� automatiquement au client.</p>
          <div className="od-status-grid">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s.value}
                disabled={updating || order.status === s.value}
                onClick={() => updateStatus(s.value)}
                className={`od-status-btn ao-status-${s.value} ${order.status === s.value ? "od-status-current" : ""}`}
              >
                {s.label}
                {order.status === s.value && <span className="od-status-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Produits ── */}
      {order.products?.length > 0 && (
        <div className="od-card od-products-card">
          <h2 className="od-card-title">Articles command�s</h2>
          <table className="od-products-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>R�f�rence</th>
                <th>Quantit�</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, i) => {
                const p = item.product || {};
                return (
                  <tr key={i}>
                    <td>
                      <div className="od-product-cell">
                        {p.image
                          ? <Image src={p.image} alt={p.name || ""} width={48} height={48} className="od-product-img" />
                          : <div className="od-product-no-img">👕</div>
                        }
                        <span className="od-product-name">{p.name || "Produit supprim�"}</span>
                      </div>
                    </td>
                    <td className="od-product-ref">
                      {p._id ? p._id.toString().slice(-8).toUpperCase() : "�"}
                    </td>
                    <td className="od-product-qty">� {item.quantity || 1}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

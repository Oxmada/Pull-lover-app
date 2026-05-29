"use client";

export default function UserOrdersClient({ orders }) {
  
  // 📍 Fonction pour afficher le statut
  const getStatusInfo = (status) => {
    const statuses = {
      pending: { label: "En attente", color: "#f59e0b", icon: "⏳" },
      confirmed: { label: "Confirmée", color: "#3b82f6", icon: "✔️" },
      processing: { label: "En préparation", color: "#8b5cf6", icon: "📦" },
      paid: { label: "Payée", color: "#10b981", icon: "💰" },
      shipped: { label: "Expédiée", color: "#06b6d4", icon: "🚚" },
      delivered: { label: "Livrée", color: "#22c55e", icon: "✅" },
      cancelled: { label: "Annulée", color: "#ef4444", icon: "❌" },
    };
    return statuses[status] || { label: status, color: "#gray", icon: "❓" };
  };

  // 📍 Timeline des étapes
  const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

  const getStepIndex = (status) => {
    if (status === "cancelled") return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>📦 Mes Commandes</h2>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>Vous n'avez pas encore de commandes</p>
          <a href="/products" style={styles.shopBtn}>
            🛍️ Commencer vos achats
          </a>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const currentStep = getStepIndex(order.status);

            return (
              <div key={order._id} style={styles.orderCard}>
                {/* Header */}
                <div style={styles.orderHeader}>
                  <div>
                    <span style={styles.orderId}>
                      Commande #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: statusInfo.color,
                    }}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                {/* Timeline de suivi */}
                {order.status !== "cancelled" && (
                  <div style={styles.timeline}>
                    {statusSteps.map((step, index) => {
                      const stepInfo = getStatusInfo(step);
                      const isActive = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div key={step} style={styles.timelineStep}>
                          <div
                            style={{
                              ...styles.timelineDot,
                              backgroundColor: isActive ? stepInfo.color : "#e5e7eb",
                              transform: isCurrent ? "scale(1.3)" : "scale(1)",
                            }}
                          >
                            {isActive && "✓"}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              style={{
                                ...styles.timelineLine,
                                backgroundColor: index < currentStep ? "#22c55e" : "#e5e7eb",
                              }}
                            />
                          )}
                          <span
                            style={{
                              ...styles.timelineLabel,
                              color: isActive ? "#111" : "#9ca3af",
                              fontWeight: isCurrent ? "bold" : "normal",
                            }}
                          >
                            {stepInfo.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Annulé */}
                {order.status === "cancelled" && (
                  <div style={styles.cancelledBanner}>
                    ❌ Cette commande a été annulée
                  </div>
                )}

                {/* Détails commande */}
                <div style={styles.orderDetails}>
                  <div style={styles.detailRow}>
                    <span>📍 Adresse :</span>
                    <span>{order.customer?.address}, {order.customer?.city}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>📞 Téléphone :</span>
                    <span>{order.customer?.phone || "—"}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>💳 Paiement :</span>
                    <span>
                      {order.payment === "cash" && "💵 Espèces à la livraison"}
                      {order.payment === "mobile_money" && "📱 Mobile Money"}
                      {order.payment === "card" && "💳 Carte bancaire"}
                      {order.payment === "bank_transfer" && "🏦 Virement"}
                      {!order.payment && "—"}
                    </span>
                  </div>
                </div>

                {/* Produits */}
                <div style={styles.productsList}>
                  <strong>📋 Produits commandés :</strong>
                  {order.products?.map((item, idx) => (
                    <div key={idx} style={styles.productItem}>
                      <span>{item.product?.name || "Produit"}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                  <div style={styles.totalRow}>
                    <strong>Total :</strong>
                    <span style={styles.total}>{order.total?.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  empty: {
    textAlign: "center",
    padding: 60,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginTop: 20,
  },
  shopBtn: {
    display: "inline-block",
    marginTop: 20,
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginRight: 10,
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: 20,
    color: "white",
    fontSize: 14,
    fontWeight: 500,
  },
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    margin: "20px 0",
    position: "relative",
  },
  timelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    transition: "all 0.3s ease",
    zIndex: 1,
  },
  timelineLine: {
    position: "absolute",
    top: 14,
    left: "50%",
    width: "100%",
    height: 3,
    zIndex: 0,
  },
  timelineLabel: {
    marginTop: 8,
    fontSize: 11,
    textAlign: "center",
  },
  cancelledBanner: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: 15,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 15,
  },
  orderDetails: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: 5,
  },
  productsList: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
  },
  productItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #d1fae5",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0 0 0",
    marginTop: 10,
  },
  total: {
    fontWeight: "bold",
    color: "#059669",
    fontSize: 20,
  },
};
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import DashboardStats from "./components/DashboardStats";
import styles from "./dashboard.module.css";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/admin/unauthorized");
  }

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <h1 className={styles.title}>Dashboard Admin</h1>
      </div>

      <div className={styles.grid}>
        <a href="/admin/products" className={styles.card}>
          Produits & Stock
        </a>
        <a href="/admin/categories" className={styles.card}>
          Catégories
        </a>
        <a href="/admin/customers" className={styles.card}>
          Utilisateurs
        </a>
        <a href="/admin/orders" className={styles.card}>
          Commandes
        </a>
      </div>

      <DashboardStats />
    </div>
  );
}
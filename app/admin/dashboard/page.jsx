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

<DashboardStats />
    </div>
  );
}
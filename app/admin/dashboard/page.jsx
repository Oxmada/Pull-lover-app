import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import styles from "./dashboard.module.css";

const DashboardStats = dynamic(() => import("./components/DashboardStats"), { ssr: false });

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
        <h1 className={styles.title}>Dashboard admin</h1>
      </div>

<DashboardStats />
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { HomeIcon, OrdersIcon, UserIcon, MapPinIcon, LogoutIcon } from "@/app/components/icons";

export default function Sidebar({ user }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: <HomeIcon />, label: "Vue d'ensemble", short: "Dashboard", path: "/dashboard" },
    { icon: <OrdersIcon />, label: "Commandes", short: "Commandes", path: "/dashboard/orders" },
    { icon: <UserIcon />, label: "Profil", short: "Profil", path: "/dashboard/profile" },
    { icon: <MapPinIcon />, label: "Adresses", short: "Adresses", path: "/dashboard/addresses" },
  ];

  return (
    <>
      {/* Sidebar desktop / tablette */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="logout-btn"
          >
            <LogoutIcon />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="bottom-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`bottom-nav-item ${pathname === item.path ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span>{item.short}</span>
          </Link>
        ))}
        <button
          className="bottom-nav-item"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <span className="bottom-nav-icon">
            <LogoutIcon size={20} />
          </span>
          <span>Sortir</span>
        </button>
      </nav>
    </>
  );
}

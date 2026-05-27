"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Sidebar({ user }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: "🏠", label: "Vue d'ensemble", short: "Dashboard", path: "/dashboard" },
    { icon: "📦", label: "Commandes", short: "Commandes", path: "/dashboard/orders" },
    { icon: "👤", label: "Profil", short: "Profil", path: "/dashboard/profile" },
    { icon: "📍", label: "Adresses", short: "Adresses", path: "/dashboard/addresses" },
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>Sortir</span>
        </button>
      </nav>
    </>
  );
}

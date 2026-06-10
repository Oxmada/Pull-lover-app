"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ProductsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const CategoriesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const NewsletterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PromoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
    <line x1="12" y1="12" x2="18" y2="6" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_ITEMS = [
  { href: "/admin/dashboard",  label: "Dashboard",      short: "Dashboard",  icon: <DashboardIcon /> },
  { href: "/admin/products",   label: "Produits & Stock", short: "Produits",  icon: <ProductsIcon /> },
  { href: "/admin/categories", label: "Catégories",     short: "Catégories", icon: <CategoriesIcon /> },
  { href: "/admin/customers",  label: "Utilisateurs",   short: "Users",      icon: <UsersIcon /> },
  { href: "/admin/orders",     label: "Commandes",      short: "Commandes",  icon: <OrdersIcon /> },
  { href: "/admin/newsletter", label: "Newsletter",     short: "News",       icon: <NewsletterIcon /> },
  { href: "/admin/promos",    label: "Codes promo",    short: "Promos",     icon: <PromoIcon /> },
];

const BOTTOM_PRIMARY = ["/admin/dashboard", "/admin/products", "/admin/orders"];

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  const primaryItems = NAV_ITEMS.filter((i) => BOTTOM_PRIMARY.includes(i.href));
  const secondaryItems = NAV_ITEMS.filter((i) => !BOTTOM_PRIMARY.includes(i.href));

  return (
    <>
      {/* Sidebar desktop / tablette */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-avatar">A</div>
          <div className="admin-sidebar-info">
            <h3>Administration</h3>
            <p>Pull Lover</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item${isActive(href) ? " active" : ""}`}
            >
              <span className="admin-nav-icon">{icon}</span>
              <span className="admin-nav-label">{label}</span>
            </Link>
          ))}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="admin-nav-item admin-nav-logout"
          >
            <span className="admin-nav-icon"><LogoutIcon /></span>
            <span className="admin-nav-label">Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Bottom nav mobile — 3 items fixes + bouton Plus */}
      <nav className="admin-bottom-nav">
        {primaryItems.map(({ href, short, icon }) => (
          <Link
            key={href}
            href={href}
            className={`admin-bottom-nav-item${isActive(href) ? " active" : ""}`}
          >
            <span className="admin-bottom-nav-icon">{icon}</span>
            <span>{short}</span>
          </Link>
        ))}
        <button
          className={`admin-bottom-nav-item${moreOpen ? " active" : ""}`}
          onClick={() => setMoreOpen((v) => !v)}
          aria-label="Plus"
        >
          <span className="admin-bottom-nav-icon">
            {moreOpen ? <CloseIcon /> : <PlusIcon />}
          </span>
          <span>{moreOpen ? "Fermer" : "Plus"}</span>
        </button>
      </nav>

      {/* Sheet slide-up "Plus" */}
      {moreOpen && (
        <>
          <div className="admin-more-overlay" onClick={() => setMoreOpen(false)} />
          <div className="admin-more-sheet">
            <div className="admin-more-sheet-handle" />
            {secondaryItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`admin-more-item${isActive(href) ? " active" : ""}`}
                onClick={() => setMoreOpen(false)}
              >
                <span className="admin-more-item-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
            <button
              className="admin-more-item admin-more-logout"
              onClick={() => { setMoreOpen(false); signOut({ callbackUrl: "/" }); }}
            >
              <span className="admin-more-item-icon"><LogoutIcon /></span>
              <span>Déconnexion</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}

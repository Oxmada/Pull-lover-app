"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "./CartContext";
import "./HeaderHero.css";

export default function HeaderHero() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const { cartItems } = useCart();
  const cartCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const [showBadge, setShowBadge] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const close = () => setIsMenuOpen(false);

  return (
    <section className="hero-section">

      {/* ── HEADER ── */}
      <header className="navbar">
        <Link href="/" className="logo">
          <div className="logo-combined">
            <div className="logo-icon-wrapper">
              <img
                src="https://res.cloudinary.com/dewstflqp/image/upload/v1778090909/pull-lover_logo_coeur_blanc_nc4sgu.png"
                alt="PullLover Cœur"
                className="navbar-logo-img"
              />
            </div>
            <img
              src="https://res.cloudinary.com/dewstflqp/image/upload/v1778092616/logo_pull-lover_blanc_fond_transparent-3_ajf2kj.png"
              alt="PullLover Logo"
              className="navbar-text-img"
            />
          </div>
        </Link>

        {/* Burger / Close */}
        <button
          className={`burger-menu${isMenuOpen ? " burger-menu--open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer" : "Menu"}
        >
          {isMenuOpen ? "✕" : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Nav links */}
        <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link href="/" onClick={close}>Accueil</Link>
          <Link href="/boutique" onClick={close}>Nos mailles</Link>
          <Link href="/NotreMarque" onClick={close}>Notre marque</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="admin-link" onClick={close}>
              Dashboard
            </Link>
          )}

          {/* Icônes dans le burger mobile */}
          <div className="burger-icons">
            <Link href="/wishlist" onClick={close}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>
            <Link href="/cart" className="cart-icon" onClick={close}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 8V7C6 4.79086 7.79086 3 10 3H14C16.2091 3 18 4.79086 18 7V8M19 8H5C3.89543 8 3 8.89543 3 10V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V10C21 8.89543 20.1046 8 19 8Z" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {!session ? (
              <Link href="/auth/login" onClick={close}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" />
                </svg>
              </Link>
            ) : (
              <button onClick={() => { signOut({ callbackUrl: "/" }); close(); }} className="logout-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" />
                </svg>
              </button>
            )}
          </div>
        </nav>

        {/* Icônes desktop */}
        <div className="nav-icons">
          <Link href="/cart" className="cart-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8V7C6 4.79086 7.79086 3 10 3H14C16.2091 3 18 4.79086 18 7V8M19 8H5C3.89543 8 3 8.89543 3 10V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V10C21 8.89543 20.1046 8 19 8Z" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link href="/wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Link>

          {!session ? (
            <Link href="/auth/login">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" />
              </svg>
            </Link>
          ) : (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="logout-icon" title="Déconnexion">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* ── HERO CONTENT ── */}
      <div className="hero-container">
        <div className="hero-content-left">
          <h1 className="hero-title">
            <span className="bold">Pull</span>
            <span className="script">Lover</span>
          </h1>
          <p className="hero-sub">
            Eo adducta re per Isauriam, rege Persarum bellis finitimis
          </p>
          <Link href="/boutique" className="hero-cta">
            Je précommande
          </Link>
        </div>

        <div className="hero-content-right">
          {showBadge && (
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="badge-icon">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Nouvel arrivage le 20/06/2026 à 19H</span>
              <button onClick={() => setShowBadge(false)} className="badge-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="social-vertical">
        <span className="follow-label">Suivez-nous</span>
        <div className="social-line" />
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM7 4C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V7C20 5.34315 18.6569 4 17 4H7ZM12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM17.5 5.25C17.9142 5.25 18.25 5.58579 18.25 6C18.25 6.41421 17.9142 6.75 17.5 6.75C17.0858 6.75 16.75 6.41421 16.75 6C16.75 5.58579 17.0858 5.25 17.5 5.25Z" fill="currentColor" />
          </svg>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM14.85 10H12.5V8.815C12.5 8.169 12.825 7.75 13.627 7.75H14.85V6H13.25C11.511 6 10.5 6.947 10.5 8.5V10H9V12H10.5V18H12.5V12H14.522L14.85 10Z" fill="currentColor" />
          </svg>
        </a>
      </div>

      <div className="made-with-love">100% made with love</div>
    </section>
  );
}
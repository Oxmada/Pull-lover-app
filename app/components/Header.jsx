"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useSession, signOut } from "next-auth/react";
import { HeartIcon, BagIcon, UserIcon, BurgerIcon } from "@/app/components/icons";
import "./Header.css";

// ── Data ───────────────────────────────────────────────────────────

const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Nos mailles", href: "/nos-mailles" },
    { label: "Notre marque", href: "/NotreMarque" },
    { label: "Contact", href: "/contact" },
];

// ── Component ──────────────────────────────────────────────────────

export default function Header({ transparent = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const pathname = usePathname();

    const { cartItems } = useCart();
    const { favorites } = useFavorites();
    const { data: session, status } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const cartCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
    const favCount = favorites?.length || 0;

    const close = () => setMenuOpen(false);

    const handleAccueilClick = (e) => {
        close();
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useClickOutside([[userMenuRef, () => setUserMenuOpen(false)]]);

    return (
        <header className={`h-wrapper${transparent ? " h-wrapper--transparent" : ""}`}>
            {/* Bandeau — masqué en mode transparent (home) */}
            {!transparent && <div className="h-bandeau">Nouvel arrivage le 20/06/2026 à 19H</div>}

            {/* Navbar */}
            <nav className="h-navbar">
                <Link href="/" className="h-logo">
                    {transparent && (
                      <Image
                        src="https://res.cloudinary.com/dewstflqp/image/upload/v1778090909/pull-lover_logo_coeur_blanc_nc4sgu.png"
                        alt=""
                        aria-hidden="true"
                        width={34}
                        height={34}
                        className="h-logo-coeur"
                        priority
                      />
                    )}
                    <span className="h-logo-bold">Pull</span>
                    <span className="h-logo-script">Lover</span>
                </Link>

                {/* Nav links */}
                <ul className={`h-nav-list ${menuOpen ? "h-nav-list--open" : ""}`}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="h-nav-link"
                                onClick={link.href === "/" ? handleAccueilClick : close}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {isAdmin && (
                        <li>
                            <Link href="/admin/dashboard" className="h-nav-link h-nav-link--admin" onClick={close}>
                                Dashboard
                            </Link>
                        </li>
                    )}
                    {session && !isAdmin && (
                        <li>
                            <Link href="/dashboard" className="h-nav-link" onClick={close}>
                                Mon espace
                            </Link>
                        </li>
                    )}
                    {/* Icônes dans le menu mobile */}
                    <li className="h-nav-icons-mobile">
                        <Link href="/favoris" className="h-icon-btn h-cart-btn" onClick={close} aria-label="Favoris">
                            <HeartIcon />
                            {favCount > 0 && <span className="h-cart-badge">{favCount}</span>}
                        </Link>
                        <Link href="/panier" className="h-icon-btn h-cart-btn" onClick={close} aria-label="Panier">
                            <BagIcon />
                            {cartCount > 0 && <span className="h-cart-badge">{cartCount}</span>}
                        </Link>
                        {status === "loading" ? (
                            <span className="h-icon-btn" aria-hidden="true"><UserIcon size={22} /></span>
                        ) : !session ? (
                            <Link href="/auth/login" className="h-icon-btn" onClick={close} aria-label="Connexion">
                                <UserIcon size={22} />
                            </Link>
                        ) : (
                            <Link href="/dashboard" className="h-icon-btn" onClick={close} aria-label="Mon espace">
                                <UserIcon size={22} />
                            </Link>
                        )}
                    </li>
                </ul>

                {/* Icônes desktop */}
                <div className="h-icons">
                    <Link href="/favoris" className="h-icon-btn h-cart-btn" aria-label="Favoris">
                        <HeartIcon />
                        {favCount > 0 && <span className="h-cart-badge">{favCount}</span>}
                    </Link>
                    <Link href="/panier" className="h-icon-btn h-cart-btn" aria-label="Panier">
                        <BagIcon />
                        {cartCount > 0 && <span className="h-cart-badge">{cartCount}</span>}
                    </Link>
                    {status === "loading" ? (
                        <span className="h-icon-btn" aria-hidden="true"><UserIcon size={22} /></span>
                    ) : !session ? (
                        <Link href="/auth/login" className="h-icon-btn" aria-label="Connexion">
                            <UserIcon size={22} />
                        </Link>
                    ) : (
                        <div className="h-user-menu" ref={userMenuRef}>
                            <button
                                className="h-icon-btn"
                                onClick={() => setUserMenuOpen((prev) => !prev)}
                                aria-label="Mon compte"
                            >
                                <UserIcon size={22} />
                            </button>
                            {userMenuOpen && (
                                <div className="h-user-dropdown">
                                    <p className="h-user-name">{session.user?.name || session.user?.email}</p>
                                    <div className="h-user-divider" />
                                    <Link
                                        href="/dashboard"
                                        className="h-user-link"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        Mon espace
                                    </Link>
                                    <div className="h-user-divider" />
                                    <button
                                        className="h-user-signout"
                                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                                    >
                                        Se déconnecter
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Burger / Close */}
                <button
                    className={`h-burger${menuOpen ? " h-burger--open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Fermer" : "Menu"}
                >
                    {menuOpen ? "✕" : <BurgerIcon />}
                </button>
            </nav>

            {menuOpen && <div className="h-overlay" onClick={close} />}
        </header>
    );
}
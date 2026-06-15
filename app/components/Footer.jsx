"use client";

import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/app/components/icons";
import "./Footer.css";

const LogoCoeur = () => (
  <img
    src="https://res.cloudinary.com/dewstflqp/image/upload/v1778090909/pull-lover_logo_coeur_blanc_nc4sgu.png"
    alt="Pull-lover logo"
    width={24}
    height={24}
  />
);

const socialLinks = [
  { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
  { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
  { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <YouTubeIcon />, href: "https://youtube.com", label: "YouTube" },
];

const navLinks = [
  { label: "Accueil",      href: "/" },
  { label: "Nos mailles",  href: "/nos-mailles" },
  { label: "Notre marque", href: "/NotreMarque" },
  { label: "Contact",      href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── LIGNE PRINCIPALE ── */}
      <div className="footer-main">
        <div className="footer-brand">
          <LogoCoeur />
          <span className="footer-logo-text">Pull Lover</span>
        </div>

        <nav className="footer-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="footer-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <ul className="footer-social-list">
          {socialLinks.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label} className="footer-social-link">
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-divider" />

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom-row">
        <p className="footer-copyright">©2026 Pull-lover. All rights reserved.</p>
        <Link href="/mentions-legales" className="footer-legal-link">Mentions légales</Link>
        <Link href="/conditions-de-vente" className="footer-legal-link">Conditions de vente</Link>
        <Link href="/politique-de-confidentialite" className="footer-legal-link">Politique de confidentialité</Link>
        <p className="footer-credit">
          Réalisé par{" "}
          <a href="https://oxmad-digital.com" target="_blank"
            rel="noopener noreferrer" className="footer-credit-link">
            Oxmad-digital
          </a>
        </p>
      </div>

    </footer>
  );
}

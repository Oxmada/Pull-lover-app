"use client";

import Link from "next/link";
import "./Footer.css";

const LogoCoeur = ({ className = "" }) => (
  <img
    src="https://res.cloudinary.com/dewstflqp/image/upload/v1778090909/pull-lover_logo_coeur_blanc_nc4sgu.png"
    alt="Pull-lover logo"
    width={40}
    height={40}
    className={className}
  />
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M23 7s-.3-1.9-1.1-2.7c-1.1-1.1-2.3-1.1-2.8-1.2C16.2 3 12 3 12 3s-4.2 0-7.1.2C4.4 3.3 3.2 3.3 2.1 4.4 1.3 5.2 1 7 1 7S.7 9.2.7 11.4v2.1C.7 15.7 1 18 1 18s.3 1.9 1.1 2.7c1.1 1.1 2.5 1 3.1 1.1C7.2 22 12 22 12 22s4.2 0 7.1-.2c.6-.1 1.8-.1 2.8-1.2.8-.8 1.1-2.7 1.1-2.7s.3-2.2.3-4.4v-2.1C23.3 9.2 23 7 23 7z" fill="currentColor" />
    <path d="M9.5 15.5V8.5l7 3.5-7 3.5z" fill="#870003" />
  </svg>
);

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Nos mailles", href: "/boutique" },
  { label: "Notre marque", href: "/NotreMarque" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
  { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
  { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <YouTubeIcon />, href: "https://youtube.com", label: "YouTube" },
];

const SocialList = () => (
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
);

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── DESKTOP/TABLETTE : logo + nav + rien à droite ── */}
      <div className="footer-top-row">
        <div className="footer-brand">
          <LogoCoeur />
          <span className="footer-tagline">Y a que la maille qui m'aille</span>
        </div>

        {/* Nav visible desktop/tablette, cachée mobile */}
        <nav aria-label="Navigation principale" className="footer-nav-desktop">
          <ul className="footer-nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials visibles mobile uniquement */}
        <nav aria-label="Réseaux sociaux" className="footer-socials-top">
          <SocialList />
        </nav>
      </div>

      {/* Nav visible mobile uniquement */}
      <div className="footer-nav-row">
        <nav aria-label="Navigation principale">
          <ul className="footer-nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-divider" />

      {/* ── BOTTOM : copyright + crédit + socials desktop ── */}
      <div className="footer-bottom-row">
        <p className="footer-copyright">©2026 Pull-lover All right reserved.</p>
        <p className="footer-credit">
          Réaliser par{" "}
          <a href="https://oxmad-digital.com" target="_blank"
            rel="noopener noreferrer" className="footer-credit-link">
            Oxmad-digital
          </a>
        </p>
        {/* Socials visibles desktop/tablette uniquement */}
        <nav aria-label="Réseaux sociaux" className="footer-socials-bottom">
          <SocialList />
        </nav>
      </div>

    </footer>
  );
}
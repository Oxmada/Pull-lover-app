"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./AproposSection.css";

const CHIPS = [
    "Laine mérinos",
    "Raphia naturel",
    "Coton bio",
    "Soie sauvage",
];

const AproposSection = () => {
    const chipsRef = useRef(null);

    useEffect(() => {
        const el = chipsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("chips-active");
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="apropos-section">
            <div className="apropos-main-container">

                {/* Image produit */}
                <div className="apropos-product-presentation">
                    <Image
                        src="https://res.cloudinary.com/dewstflqp/image/upload/v1778080907/products/fafxr3b6fdauvoaaouaa.jpg"
                        alt="Pull-lover maille bleue"
                        width={480}
                        height={560}
                        className="apropos-product-image"
                        priority
                    />
                </div>

                {/* Bloc texte */}
                <div className="apropos-container">
                    <div className="apropos-txt-container">

                        {/* Groupe label + titre — gap 10px */}
                        <div className="apropos-header">
                            <p className="apropos-eyebrow">Notre marque</p>
                            <h2 className="apropos-title">La passion de la maille</h2>
                        </div>

                        {/* Description — 60px après le titre */}
                        <p className="apropos-description">
                            Chaque pièce est conçue et réalisée à la main par nos artisanes
                            à Antananarivo. Un geste ancestral, des matières nobles, une
                            attention portée à chaque détail. Depuis notre fondation, nous
                            travaillons en étroite collaboration avec des tisserandes
                            expérimentées qui perpétuent un savoir-faire transmis de
                            génération en génération. Chaque point, chaque couleur, chaque
                            forme est pensée pour allier authenticité et élégance
                            contemporaine.
                        </p>

                        {/* Chips — 20px après la description */}
                        <div className="apropos-chips" ref={chipsRef}>
                            {CHIPS.map((chip, i) => (
                                <span
                                    className="apropos-chip"
                                    key={chip}
                                    style={{ animationDelay: `${i * 0.12}s` }}
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>

                        {/* Bouton — 40px après les chips */}
                        <Link href="/NotreMarque" className="apropos-btn">En savoir plus</Link>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default AproposSection;
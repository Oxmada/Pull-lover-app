"use client";

import { useEffect, useState, useRef } from "react";
import "./CounterTime.css";

// ── Config ─────────────────────────────────────────────────────────
const DROP_DATE = new Date("2026-06-20T19:00:00");
const START_DATE = new Date("2026-05-13T00:00:00");

// ── Données colonnes latérales ──────────────────────────────────────
const STATS_LEFT = [
    { num: "12", label: "Pièces", tag: "dans le drop" },
    { num: "4", label: "Coloris", tag: "exclusifs" },
    { num: "100%", label: "Artisanal", tag: "fait main" },
];

const STATS_RIGHT = [
    { num: "MG", label: "Origine", tag: "Madagascar" },
    { num: "48h", label: "Livraison", tag: "Antananarivo" },
    { num: "∞", label: "Saison", tag: "intemporel" },
];

// ── Hook countdown ─────────────────────────────────────────────────
function useCountdown(target) {
    const calc = () => {
        const diff = Math.max(0, target - Date.now());
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
        };
    };

    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(calc());
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, []);

    return time;
}

// ── Hook progress — client uniquement ─────────────────────────────
function useProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calc = () => {
            const total = DROP_DATE - START_DATE;
            const elapsed = Math.min(Date.now() - START_DATE, total);
            return Math.max(0, Math.min(100, (elapsed / total) * 100));
        };
        setProgress(calc());
    }, []);

    return progress;
}

// ── Digit group ────────────────────────────────────────────────────
function DigitGroup({ value, label }) {
    const str = value != null ? String(value).padStart(2, "0") : "00";
    const prevRef = useRef(str);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        if (prevRef.current !== str) {
            setFlip(true);
            const t = setTimeout(() => { prevRef.current = str; setFlip(false); }, 300);
            return () => clearTimeout(t);
        }
    }, [str]);

    return (
        <div className="ct-group">
            <div className="ct-boxes">
                <span className={`ct-box ${flip ? "ct-box--flip" : ""}`}>{str[0]}</span>
                <span className={`ct-box ${flip ? "ct-box--flip" : ""}`}>{str[1]}</span>
            </div>
            <span className="ct-label">{label}</span>
        </div>
    );
}

// ── Colonne latérale ───────────────────────────────────────────────
function SideColumn({ stats, right = false }) {
    return (
        <div className={`ct-side ${right ? "ct-side--right" : ""}`}>
            {stats.map(({ num, label, tag }) => (
                <div className="ct-side-item" key={label}>
                    <span className="ct-side-num">{num}</span>
                    <span className="ct-side-label">{label}</span>
                    <span className="ct-side-tag">{tag}</span>
                </div>
            ))}
        </div>
    );
}

// ── Component ──────────────────────────────────────────────────────
export default function CounterTime() {
    const time = useCountdown(DROP_DATE);
    const progress = useProgress();
    const { days = 0, hours = 0, minutes = 0 } = time ?? {};

    return (
        <section className="ct-section">
            <div className="ct-inner">

                {/* Colonne gauche */}
                <SideColumn stats={STATS_LEFT} />

                {/* Centre */}
                <div className="ct-center">
                    <h2 className="ct-title">Nouveau drop en cours</h2>
                    <p className="ct-desc">
                        Lorem ipsum dolor sit amet consectetur adipiscing
                        elit at erat consectetur ultricies sapien facilisi
                        euismod duis mauris a sed
                    </p>
                    <div className="ct-counter-wrapper">
                        <div className="ct-counter">
                            <DigitGroup value={days} label="Jours" />
                            <span className="ct-sep" aria-hidden="true">:</span>
                            <DigitGroup value={hours} label="Heures" />
                            <span className="ct-sep" aria-hidden="true">:</span>
                            <DigitGroup value={minutes} label="Minutes" />
                        </div>
                        <div className="ct-progress-track">
                            <div className="ct-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {/* Colonne droite */}
                <SideColumn stats={STATS_RIGHT} right />

            </div>
        </section>
    );
}
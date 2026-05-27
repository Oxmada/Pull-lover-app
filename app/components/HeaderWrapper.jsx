"use client";

// HeaderWrapper.jsx — Sélectionne le bon header selon la page

import { usePathname } from "next/navigation";
import HeaderHero from "./HeaderHero";
import Header from "./Header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return isHome ? <HeaderHero /> : <Header />;
}
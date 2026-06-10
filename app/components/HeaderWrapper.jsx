"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import HeaderHero from "./HeaderHero";

export default function HeaderWrapper() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) return null;

    const isHome = pathname === "/";

    return (
        <>
            <Header transparent={isHome} />
            {isHome && <HeaderHero />}
        </>
    );
}

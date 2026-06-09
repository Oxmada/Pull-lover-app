import React from "react";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import HeaderWrapper from "./components/HeaderWrapper";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: "Pull Lover",
  description: "Boutique de mailles artisanales faites main à Antananarivo",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className={montserrat.className}>
        <Providers>
          <HeaderWrapper />
          <main style={{ background: "transparent" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

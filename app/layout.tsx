import React from "react";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import HeaderWrapper from "./components/HeaderWrapper";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: "MyShop",
  description: "Boutique en ligne",
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

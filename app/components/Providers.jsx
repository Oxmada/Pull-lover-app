"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
    </SessionProvider>
  );
}

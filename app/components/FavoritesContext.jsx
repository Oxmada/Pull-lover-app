"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const favoritesRef = useRef(favorites);
  useEffect(() => { favoritesRef.current = favorites; }, [favorites]);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setFavorites(data); })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setFavorites([]);
    }
  }, [status]);

  const toggleFavorite = useCallback(async (product) => {
    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    const alreadyFav = favoritesRef.current.some((p) => p._id === product._id);

    if (alreadyFav) {
      setFavorites((prev) => prev.filter((p) => p._id !== product._id));
      fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      }).catch(console.error);
    } else {
      setFavorites((prev) => [...prev, product]);
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      }).catch(console.error);
    }
  }, [session]);

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p._id === id),
    [favorites]
  );

  const removeFavorite = useCallback(async (id) => {
    if (!session) return;
    setFavorites((prev) => prev.filter((p) => p._id !== id));
    fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    }).catch(console.error);
  }, [session]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

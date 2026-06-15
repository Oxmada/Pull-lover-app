import { useEffect } from "react";

// pairs: tableau de [ref, closeFn] — ferme chaque dropdown quand on clique dehors
export function useClickOutside(pairs) {
  useEffect(() => {
    const handler = (e) => {
      pairs.forEach(([ref, close]) => {
        if (ref.current && !ref.current.contains(e.target)) close();
      });
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

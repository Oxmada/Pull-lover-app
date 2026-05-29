"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /* 🔄 Charger depuis localStorage */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  /* 💾 Sauvegarde auto */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ➕ Ajouter au panier */
  const addToCart = (product) => {
    const cartKey = `${product._id}_${product.size || ""}_${product.color || ""}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);

      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, cartKey, quantity: 1 }];
    });
  };

  /* ➕ Quantité */
  const increaseQty = (cartKey) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* ➖ Quantité */
  const decreaseQty = (cartKey) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ❌ Supprimer */
  const removeFromCart = (cartKey) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartKey !== cartKey)
    );
  };

  /* 🗑️ Vider le panier */
  const clearCart = () => setCartItems([]);

  /* 💰 TOTAL AUTOMATIQUE */
  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number(item.promoPrice ?? item.price);
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

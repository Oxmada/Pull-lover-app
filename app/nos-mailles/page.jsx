"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useFavorites } from "../components/FavoritesContext";
import "./nos-mailles.css";

const GENDER_FILTERS = ["Homme", "Femme", "Accessoires"];

const SORT_OPTIONS = [
  { value: "", label: "Ordre par défaut" },
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name-asc", label: "Nom A→Z" },
  { value: "name-desc", label: "Nom Z→A" },
];

function NosMaillesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(search);
  const [priceMinInput, setPriceMinInput] = useState(priceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(priceMax);

  const productsPerPage = 9;

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`/nos-mailles?${newParams.toString()}`);
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateURL({ search: searchInput, page: "" });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce price inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceMinInput !== priceMin || priceMaxInput !== priceMax) {
        updateURL({ priceMin: priceMinInput, priceMax: priceMaxInput, page: "" });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [priceMinInput, priceMaxInput]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (sort) query.append("sort", sort);
        const res = await fetch(`/api/products?${query.toString()}`);
        if (!res.ok) throw new Error("Erreur chargement produits");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, category, sort]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement catégories");
      }
    }
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (priceMin && product.price < parseFloat(priceMin)) return false;
    if (priceMax && product.price > parseFloat(priceMax)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc": return (a.promoPrice || a.price) - (b.promoPrice || b.price);
      case "price-desc": return (b.promoPrice || b.price) - (a.promoPrice || a.price);
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
      default: return 0;
    }
  });

  const currentPage = Math.max(1, pageParam);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(0, indexOfLastProduct);

  const resetFilters = () => {
    setPriceMinInput("");
    setPriceMaxInput("");
    setSearchInput("");
    router.push("/nos-mailles");
  };

  const hasActiveFilters = search || category || sort || priceMin || priceMax;

  return (
    <div className="boutique-container">

      {/* EN-TETE */}
      <div className="boutique-header">
        <h1 className="boutique-title">Nos Mailles</h1>
        <p className="boutique-tagline">Des mailles pensées pour durer</p>
      </div>

      {/* BARRE FILTRES */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="price-range">
            <input
              type="number"
              placeholder="Prix min"
              value={priceMinInput}
              onChange={(e) => setPriceMinInput(e.target.value)}
              className="price-input"
              min="0"
            />
            <span className="price-sep">–</span>
            <input
              type="number"
              placeholder="Prix max"
              value={priceMaxInput}
              onChange={(e) => setPriceMaxInput(e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
        </div>

        <div className="filters-right">
          {GENDER_FILTERS.map((label) => {
            const cat = categories.find(
              (c) => c.name.toLowerCase() === label.toLowerCase()
            );
            const isActive = cat ? category === cat._id : false;
            return (
              <button
                key={label}
                className={`gender-btn${isActive ? " active" : ""}`}
                onClick={() => {
                  if (!cat) return;
                  updateURL({ category: isActive ? "" : cat._id, page: "" });
                }}
              >
                {label}
              </button>
            );
          })}

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => updateURL({ sort: e.target.value, page: "" })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RESET */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <button className="reset-btn" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* SKELETON */}
      {loading && (
        <div className="products-grid">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-state">❌ {error}</div>}

      {!loading && sortedProducts.length === 0 && (
        <div className="empty-state">
          <p>Aucun produit trouvé</p>
          <button className="reset-btn" onClick={resetFilters}>Réinitialiser</button>
        </div>
      )}

      {/* GRILLE PRODUITS */}
      {!loading && currentProducts.length > 0 && (
        <div className="products-grid">
          {currentProducts.map((product) => {
            const colorCount = product.colors?.length ?? null;

            return (
              <div className="product-card" key={product._id}>

                <div className="product-image-outer">
                  <button
                    className={`wishlist-btn ${isFavorite(product._id) ? "active" : ""}`}
                    onClick={() => toggleFavorite(product)}
                    aria-label="Ajouter aux favoris"
                  >
                    <svg viewBox="0 0 24 24" fill={isFavorite(product._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  {product.promoPrice && (
                    <span className="badge-promo">
                      -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                    </span>
                  )}

                  <Link href={`/products/${product._id}`} className="product-image-link">
                    <div className={`product-image-wrap ${product.stock === 0 ? "out-of-stock" : ""}`}>
                      <Image
                        src={product.image || "/no-image.png"}
                        alt={product.name}
                        width={400}
                        height={480}
                        className="product-img"
                      />
                      {product.stock === 0 && (
                        <div className="stock-overlay">Rupture de stock</div>
                      )}
                    </div>
                  </Link>
                </div>

                <div className="product-info">
                  <Link href={`/products/${product._id}`} className="product-name">
                    {product.name}
                  </Link>

                  <div className="product-price">
                    {product.promoPrice ? (
                      <>
                        <span className="price-promo">{product.promoPrice.toLocaleString()} €</span>
                        <span className="price-old">{product.price.toLocaleString()} €</span>
                      </>
                    ) : (
                      <span className="price-normal">{product.price.toLocaleString()} €</span>
                    )}
                  </div>

                  {colorCount !== null && colorCount > 0 && (
                    <p className="product-colors">
                      {colorCount} couleur{colorCount > 1 ? "s" : ""}
                    </p>
                  )}

                  <div className="product-bottom">
                    <button
                      className="add-to-cart-btn"
                      disabled={!product.isAvailable || product.stock === 0}
                      onClick={() =>
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.promoPrice ?? product.price,
                          image: product.image,
                          quantity: 1,
                          stock: product.stock,
                        })
                      }
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VOIR PLUS / PAGINATION */}
      {!loading && totalPages > 1 && currentPage < totalPages && (
        <div className="pagination">
          <button
            className="voir-plus-btn"
            onClick={() => updateURL({ page: String(currentPage + 1) })}
          >
            Voir plus
          </button>
          <p className="pagination-info">
            {Math.min(indexOfLastProduct, sortedProducts.length)} / {sortedProducts.length} produits
          </p>
        </div>
      )}

      {!loading && sortedProducts.length > 0 && currentPage >= totalPages && (
        <p className="pagination-info" style={{ textAlign: "center", marginTop: "2rem" }}>
          {sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default function NosMaillesPage() {
  return (
    <Suspense>
      <NosMaillesContent />
    </Suspense>
  );
}

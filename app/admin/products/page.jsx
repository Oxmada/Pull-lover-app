"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductForm from "@/app/components/ProductForm";
import "./products-admin.css";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductsManagement() {
  const [products, setProducts]             = useState([]);
  const [categories, setCategories]         = useState([]);
  const [stats, setStats]                   = useState(null);
  const [pagination, setPagination]         = useState(null);
  const [loading, setLoading]               = useState(true);
  const [filter, setFilter]                 = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch]                 = useState("");
  const [sort, setSort]                     = useState("createdAt");
  const [order, setOrder]                   = useState("desc");
  const [page, setPage]                     = useState(1);
  const [toast, setToast]                   = useState(null);
  const [exporting, setExporting]           = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortOpen, setSortOpen]             = useState(false);
  const [catOpen, setCatOpen]               = useState(false);
  const [confirmModal, setConfirmModal]     = useState(null);
  const sortRef        = useRef(null);
  const catRef         = useRef(null);
  const searchFirstRef = useRef(true);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const askConfirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  useEffect(() => { fetchCategories(); }, []);

  // Fetch immédiat sur tous les filtres sauf search
  useEffect(() => { fetchProducts(); }, [filter, sort, order, categoryFilter, page]);

  // Fetch avec debounce sur la recherche textuelle (skip premier rendu)
  useEffect(() => {
    if (searchFirstRef.current) { searchFirstRef.current = false; return; }
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const close = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const fetchCategories = async () => {
    try {
      const res  = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || data || []);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter, sort, order, page,
        ...(search         && { search }),
        ...(categoryFilter && { category: categoryFilter }),
      });
      const res  = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async (product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          updates: { isAvailable: !product.isAvailable },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => p._id === product._id ? { ...p, isAvailable: !p.isAvailable } : p)
        );
      } else {
        showToast("Erreur lors de la mise à jour", "error");
      }
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleDelete = (productId, productName) => {
    askConfirm(`Supprimer "${productName}" définitivement ?`, async () => {
      try {
        const res  = await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          showToast("Produit supprimé");
        } else {
          showToast("Erreur lors de la suppression", "error");
        }
      } catch {
        showToast("Erreur lors de la suppression", "error");
      }
    });
  };

  const handleEdit = (product) => { setEditingProduct(product); setShowForm(true); };
  const closeForm  = ()        => { setShowForm(false); setEditingProduct(null); };

  const handleSave = async (productData) => {
    try {
      const method = editingProduct ? "PUT" : "POST";
      const res    = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      await fetchProducts();
      closeForm();
      showToast(editingProduct ? "Produit modifié" : "Produit ajouté");
    } catch (error) {
      showToast("Erreur : " + error.message, "error");
    }
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        filter, sort, order, export: "true",
        ...(search         && { search }),
        ...(categoryFilter && { category: categoryFilter }),
      });
      const res  = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (!data.success) return;

      const headers = [
        "Nom", "Marque", "Catégorie", "Prix (€)", "Prix promo (€)",
        "XS", "S", "M", "L", "XL", "Stock total", "Visible", "Ajouté le",
      ];
      const rows = data.products.map(p => [
        p.name,
        p.brand || "",
        p.category?.name || "",
        p.price,
        p.promoPrice || "",
        p.stocks?.XS ?? 0, p.stocks?.S ?? 0, p.stocks?.M ?? 0,
        p.stocks?.L ?? 0, p.stocks?.XL ?? 0,
        p.stock ?? 0,
        p.isAvailable !== false ? "Oui" : "Non",
        new Date(p.createdAt).toLocaleDateString("fr-FR"),
      ].join(";"));

      const csv  = [headers.join(";"), ...rows].join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `produits_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const setFilterAndReset = (val) => { setFilter(val); setPage(1); };
  const setCatAndReset    = (val) => { setCategoryFilter(val); setPage(1); };
  const setSortAndReset   = (val) => { setSort(val); setPage(1); setSortOpen(false); };

  const CHIP_FILTERS = [
    { value: "all", label: "Tous",         statsKey: "total",      color: "#0f172a" },
    { value: "low", label: "Stock faible", statsKey: "lowStock",   color: "#b45309" },
    { value: "out", label: "Rupture",      statsKey: "outOfStock", color: "#be123c" },
  ];

  const SORT_OPTIONS = [
    { label: "Date création", value: "createdAt" },
    { label: "Nom",           value: "name"      },
    { label: "Prix",          value: "price"     },
    { label: "Stock",         value: "stock"     },
  ];

  return (
    <div className="ap-page">

      {/* Toast */}
      {toast && (
        <div className={`ap-toast ${toast.type === "error" ? "ap-toast-error" : "ap-toast-success"}`}>
          {toast.message}
        </div>
      )}

      {/* Modale de confirmation */}
      {confirmModal && (
        <div className="ap-confirm-overlay" onClick={() => setConfirmModal(null)}>
          <div className="ap-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="ap-confirm-msg">{confirmModal.message}</p>
            <div className="ap-confirm-actions">
              <button className="ap-confirm-cancel" onClick={() => setConfirmModal(null)}>
                Annuler
              </button>
              <button
                className="ap-confirm-ok"
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="ap-topbar">
        <h1 className="ap-topbar-title">Produits &amp; Stock</h1>
        <button className="ac-btn-export" onClick={exportCSV} disabled={exporting}>
          {exporting ? "Export…" : "↓ Export CSV"}
        </button>
        <button className="ap-btn-add" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Ajouter un produit
        </button>
      </div>

      {/* Toolbar — ligne 1 : recherche + catégorie + tri */}
      <div className="ao-toolbar-top">
        <input
          type="text"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (page !== 1) setPage(1); }}
          className="ap-search-input"
        />
        <div className="ap-sort-wrap" ref={catRef}>
          <button className="ap-sort-trigger" onClick={() => setCatOpen((o) => !o)}>
            {categories.find((c) => c._id === categoryFilter)?.name || "Catégories"}
            <svg className={`ap-sort-trigger-arrow ${catOpen ? "open" : ""}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {catOpen && (
            <ul className="ap-sort-dropdown">
              <li className="ap-sort-dropdown-title">Catégories</li>
              <li
                className={`ap-sort-option ${categoryFilter === "" ? "selected" : ""}`}
                onClick={() => { setCatAndReset(""); setCatOpen(false); }}
              >
                Toutes catégories
                {categoryFilter === "" && <span className="ap-sort-check">✓</span>}
              </li>
              {categories.map((c) => (
                <li
                  key={c._id}
                  className={`ap-sort-option ${categoryFilter === c._id ? "selected" : ""}`}
                  onClick={() => { setCatAndReset(c._id); setCatOpen(false); }}
                >
                  {c.name}
                  {categoryFilter === c._id && <span className="ap-sort-check">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ap-sort-wrap" ref={sortRef}>
          <button className="ap-sort-trigger" onClick={() => setSortOpen((o) => !o)}>
            {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            <svg className={`ap-sort-trigger-arrow ${sortOpen ? "open" : ""}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {sortOpen && (
            <ul className="ap-sort-dropdown">
              <li className="ap-sort-dropdown-title">Filtres</li>
              {SORT_OPTIONS.map((o) => (
                <li
                  key={o.value}
                  className={`ap-sort-option ${sort === o.value ? "selected" : ""}`}
                  onClick={() => setSortAndReset(o.value)}
                >
                  {o.label}
                  {sort === o.value && <span className="ap-sort-check">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Toolbar — ligne 2 : chips filtres stock */}
      <div className="ao-filter-chips">
        {CHIP_FILTERS.map((f) => {
          const count = stats ? stats[f.statsKey] : null;
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterAndReset(f.value)}
              className={`ao-chip${active ? " ao-chip-active" : ""}`}
              style={{ "--chip-color": f.color }}
            >
              <span className="ao-chip-dot" />
              {count !== null && <span className="ao-chip-count">{count}</span>}
              <span className="ao-chip-label">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        {loading ? (
          <div className="ap-state"><span className="ap-state-icon">⏳</span>Chargement…</div>
        ) : products.length === 0 ? (
          <div className="ap-state"><span className="ap-state-icon">📭</span>Aucun produit trouvé</div>
        ) : (
          <table className="ap-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock par taille</th>
                <th>Statut</th>
                <th>Visible</th>
                <th>Ajouté le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="ap-product-cell">
                      {product.image
                        ? <img src={product.image} alt={product.name} className="ap-product-img" />
                        : <div className="ap-product-no-img">👕</div>
                      }
                      <div>
                        <span className="ap-product-name">{product.name}</span>
                        {product.brand && <span className="ap-product-brand">{product.brand}</span>}
                      </div>
                    </div>
                  </td>
                  <td>{product.category?.name || <span style={{ color: "#a8a29e" }}>—</span>}</td>
                  <td>
                    {product.promoPrice ? (
                      <>
                        <span className="ap-price-original">{product.price.toLocaleString()} €</span>
                        <span className="ap-price-promo">{product.promoPrice.toLocaleString()} €</span>
                      </>
                    ) : (
                      <span className="ap-price">{product.price.toLocaleString()} €</span>
                    )}
                  </td>
                  <td><StockBySize stocks={product.stocks} /></td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>
                    <button
                      className={`ap-toggle ${product.isAvailable !== false ? "on" : "off"}`}
                      onClick={() => handleToggleAvailable(product)}
                      title={product.isAvailable !== false ? "Visible — cliquer pour masquer" : "Masqué — cliquer pour afficher"}
                    >
                      <span className="ap-toggle-thumb" />
                    </button>
                  </td>
                  <td><CreatedAt date={product.createdAt} /></td>
                  <td>
                    <div className="ap-actions">
                      <Link
                        href={`/products/${product._id}`}
                        target="_blank"
                        className="ap-btn-view"
                        title="Voir la fiche produit"
                      >
                        ↗
                      </Link>
                      <button className="ap-btn-edit" onClick={() => handleEdit(product)}>Modifier</button>
                      <button className="ap-btn-delete" onClick={() => handleDelete(product._id, product.name)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="ap-pagination">
          <button
            className="ap-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Précédent
          </button>
          <span className="ap-page-info">
            Page {pagination.page} / {pagination.pages}
            <span className="ap-page-total"> — {pagination.total} produits</span>
          </span>
          <button
            className="ap-page-btn"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div
          className="ap-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="ap-modal">
            <div className="ap-modal-header">
              <h2 className="ap-modal-title">
                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
              <button className="ap-modal-close" onClick={closeForm}>✕</button>
            </div>
            <div className="ap-modal-body">
              <ProductForm
                categories={categories}
                editingProduct={editingProduct}
                onSave={handleSave}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StockBySize({ stocks }) {
  const stockMap = stocks || {};
  return (
    <div className="ap-stocks-by-size">
      {ALL_SIZES.map((size) => {
        const qty = stockMap[size] ?? 0;
        return (
          <span key={size} className={`ap-size-chip ${qty === 0 ? "empty" : ""}`}>
            <span className="ap-size-label">{size}</span>
            <span className="ap-size-qty">{qty}</span>
          </span>
        );
      })}
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) return <span className="ap-badge ap-badge-out">Rupture</span>;
  if (stock < 5)   return <span className="ap-badge ap-badge-low">Stock faible</span>;
  return <span className="ap-badge ap-badge-ok">Disponible</span>;
}

function CreatedAt({ date }) {
  if (!date) return <span style={{ color: "#a8a29e" }}>—</span>;
  const d   = new Date(date);
  const day = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  return <span className="ap-date">{day}</span>;
}

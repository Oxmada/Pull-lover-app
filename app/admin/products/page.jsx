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
  const [confirmModal, setConfirmModal]     = useState(null);
  const sortRef        = useRef(null);
  const searchFirstRef = useRef(true);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const askConfirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  useEffect(() => { fetchCategories(); }, []);

  // Fetch immÃ©diat sur tous les filtres sauf search
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
      console.error("Erreur chargement catÃ©gories:", err);
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
        showToast("Erreur lors de la mise Ã  jour", "error");
      }
    } catch {
      showToast("Erreur lors de la mise Ã  jour", "error");
    }
  };

  const handleDelete = (productId, productName) => {
    askConfirm(`Supprimer "${productName}" dÃ©finitivement ?`, async () => {
      try {
        const res  = await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          showToast("Produit supprimÃ©");
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
      showToast(editingProduct ? "Produit modifiÃ©" : "Produit ajoutÃ©");
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
        "Nom", "Marque", "CatÃ©gorie", "Prix (â‚¬)", "Prix promo (â‚¬)",
        "XS", "S", "M", "L", "XL", "Stock total", "Visible", "AjoutÃ© le",
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
      const blob = new Blob(["ï»¿" + csv], { type: "text/csv;charset=utf-8;" });
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

  const FILTERS = [
    { label: "Tous",         value: "all" },
    { label: "Stock faible", value: "low" },
    { label: "Rupture",      value: "out" },
  ];

  const SORT_OPTIONS = [
    { label: "Date crÃ©ation", value: "createdAt" },
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
        <Link href="/admin/dashboard" className="ap-back-btn">â† Dashboard</Link>
        <h1 className="ap-topbar-title">Produits &amp; Stock</h1>
        <button className="ac-btn-export" onClick={exportCSV} disabled={exporting}>
          {exporting ? "Exportâ€¦" : "â†“ Export CSV"}
        </button>
        <button className="ap-btn-add" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Ajouter un produit
        </button>
      </div>

      {/* Toolbar */}
      <div className="ap-toolbar">

        {/* Recherche temps rÃ©el */}
        <input
          type="text"
          placeholder="Rechercher un produitâ€¦"
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (page !== 1) setPage(1); }}
          className="ap-search-input"
        />

        <div className="ap-divider" />

        {/* Filtre catÃ©gorie */}
        <select
          value={categoryFilter}
          onChange={(e) => setCatAndReset(e.target.value)}
          className="ap-category-select"
        >
          <option value="">Toutes catÃ©gories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="ap-divider" />

        {/* Filtres stock */}
        <div className="ap-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterAndReset(f.value)}
              className={`ap-filter-btn ${filter === f.value ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ap-divider" />

        {/* Tri */}
        <div className="ap-sort-wrap" ref={sortRef}>
          <button className="ap-sort-trigger" onClick={() => setSortOpen((o) => !o)}>
            {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            <span className={`ap-sort-trigger-arrow ${sortOpen ? "open" : ""}`}>â–¼</span>
          </button>
          {sortOpen && (
            <ul className="ap-sort-dropdown">
              {SORT_OPTIONS.map((o) => (
                <li
                  key={o.value}
                  className={`ap-sort-option ${sort === o.value ? "selected" : ""}`}
                  onClick={() => setSortAndReset(o.value)}
                >
                  {o.label}
                  {sort === o.value && <span className="ap-sort-check">âœ“</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")} className="ap-sort-btn">
          {order === "asc" ? "â†‘" : "â†“"}
        </button>

        {/* Stats inline */}
        {stats && (
          <>
            <div className="ap-divider" />
            <div className="ap-stats-inline">
              <div className="ap-stat-chip">
                <span className="ap-stat-chip-value">{stats.total}</span>
                <span className="ap-stat-chip-label">Total</span>
              </div>
              <div className="ap-stat-sep" />
              <div className="ap-stat-chip warn">
                <span className="ap-stat-chip-value">{stats.lowStock}</span>
                <span className="ap-stat-chip-label">Faible</span>
              </div>
              <div className="ap-stat-sep" />
              <div className="ap-stat-chip danger">
                <span className="ap-stat-chip-value">{stats.outOfStock}</span>
                <span className="ap-stat-chip-label">Rupture</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        {loading ? (
          <div className="ap-state"><span className="ap-state-icon">â³</span>Chargementâ€¦</div>
        ) : products.length === 0 ? (
          <div className="ap-state"><span className="ap-state-icon">ðŸ“­</span>Aucun produit trouvÃ©</div>
        ) : (
          <table className="ap-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>CatÃ©gorie</th>
                <th>Prix</th>
                <th>Stock par taille</th>
                <th>Statut</th>
                <th>Visible</th>
                <th>AjoutÃ© le</th>
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
                        : <div className="ap-product-no-img">ðŸ‘•</div>
                      }
                      <div>
                        <span className="ap-product-name">{product.name}</span>
                        {product.brand && <span className="ap-product-brand">{product.brand}</span>}
                      </div>
                    </div>
                  </td>
                  <td>{product.category?.name || <span style={{ color: "#a8a29e" }}>â€”</span>}</td>
                  <td>
                    {product.promoPrice ? (
                      <>
                        <span className="ap-price-original">{product.price.toLocaleString()} â‚¬</span>
                        <span className="ap-price-promo">{product.promoPrice.toLocaleString()} â‚¬</span>
                      </>
                    ) : (
                      <span className="ap-price">{product.price.toLocaleString()} â‚¬</span>
                    )}
                  </td>
                  <td><StockBySize stocks={product.stocks} /></td>
                  <td><StockBadge stock={product.stock} /></td>
                  <td>
                    <button
                      className={`ap-toggle ${product.isAvailable !== false ? "on" : "off"}`}
                      onClick={() => handleToggleAvailable(product)}
                      title={product.isAvailable !== false ? "Visible â€” cliquer pour masquer" : "MasquÃ© â€” cliquer pour afficher"}
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
                        â†—
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
            â† PrÃ©cÃ©dent
          </button>
          <span className="ap-page-info">
            Page {pagination.page} / {pagination.pages}
            <span className="ap-page-total"> â€” {pagination.total} produits</span>
          </span>
          <button
            className="ap-page-btn"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Suivant â†’
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
              <button className="ap-modal-close" onClick={closeForm}>âœ•</button>
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
  if (!date) return <span style={{ color: "#a8a29e" }}>â€”</span>;
  const d   = new Date(date);
  const day = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  return <span className="ap-date">{day}</span>;
}

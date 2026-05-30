"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import "./NotreCollectionSection.css";

const NotreCollectionSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("/api/products?limit=8");
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    const newProducts = products.slice(0, 4);

    const toggleWishlist = (id) => {
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <section className="ncs-section" id="featured">
            <div className="ncs-wrapper">

                <div className="ncs-header">
                    <div className="ncs-header-titles">
                        <p className="ncs-label">Notre collection</p>
                        <h2 className="ncs-title">Nos meilleures ventes</h2>
                    </div>
                    <Link href="/nos-mailles?sort=newest" className="ncs-btn-all">
                        Voir tous les produits
                    </Link>
                </div>

                {loading ? (
                    <div className="ncs-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="ncs-skeleton">
                                <div className="ncs-skeleton-img" />
                                <div className="ncs-skeleton-text" />
                                <div className="ncs-skeleton-text ncs-skeleton-text--short" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ncs-grid">
                        {newProducts.map((product) => {
                            const colorCount = product.colors?.length ?? null;
                            const isWishlisted = wishlist.includes(product._id);
                            return (
                                <div className="ncs-card" key={product._id}>

                                    <div className="ncs-card-image-outer">
                                        <button
                                            className={`ncs-wishlist-btn ${isWishlisted ? "active" : ""}`}
                                            onClick={() => toggleWishlist(product._id)}
                                            aria-label="Ajouter aux favoris"
                                        >
                                            <svg viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </button>

                                        {product.promoPrice && (
                                            <span className="ncs-badge-promo">
                                                -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                                            </span>
                                        )}

                                        <Link href={`/products/${product._id}`} className="ncs-card-image-link">
                                            <div className={`ncs-card-image-wrap ${product.stock === 0 ? "out-of-stock" : ""}`}>
                                                <Image
                                                    src={product.image || "/no-image.png"}
                                                    alt={product.name}
                                                    width={400}
                                                    height={480}
                                                    className="ncs-card-img-photo"
                                                />
                                                {product.stock === 0 && (
                                                    <div className="ncs-stock-overlay">Rupture de stock</div>
                                                )}
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="ncs-card-info">
                                        <Link href={`/products/${product._id}`} className="ncs-card-name">
                                            {product.name}
                                        </Link>

                                        <div className="ncs-card-price">
                                            {product.promoPrice ? (
                                                <>
                                                    <span className="ncs-price-promo">{product.promoPrice.toLocaleString()} €</span>
                                                    <span className="ncs-price-old">{product.price.toLocaleString()} €</span>
                                                </>
                                            ) : (
                                                <span className="ncs-price-current">{product.price.toLocaleString()} €</span>
                                            )}
                                        </div>

                                        {colorCount !== null && colorCount > 0 && (
                                            <p className="ncs-card-colors">
                                                {colorCount} couleur{colorCount > 1 ? "s" : ""}
                                            </p>
                                        )}

                                        <div className="ncs-card-bottom">
                                            <button
                                                className="ncs-add-to-cart"
                                                disabled={!product.isAvailable || product.stock === 0}
                                                onClick={() => addToCart({
                                                    _id: product._id,
                                                    name: product.name,
                                                    price: product.promoPrice ?? product.price,
                                                    image: product.image,
                                                    quantity: 1,
                                                    stock: product.stock,
                                                })}
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


            </div>
        </section>
    );
};

export default NotreCollectionSection;

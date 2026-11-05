import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { addToCart } from "../../../utils/CartUtil";
import SEO from "../../SEO/Seo";
import "../css/Products.css";

const PAGE = 3;

export default function Products({ variant = "full" }) {
  const isLight = variant === "light";
  const { setCart } = useOutletContext();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let dead = false;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !dead && setProducts(Array.isArray(d) ? d : d?.data || d?.products || []))
      .catch(() => !dead && setError(true))
      .finally(() => !dead && setLoading(false));
    return () => { dead = true; };
  }, []);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q
      ? products
      : products.filter((p) => p.name?.toLowerCase().includes(q) || String(p.price ?? "").includes(q));
  }, [products, search]);

  if (loading) return (
    <div className="products-loading"><div className="products-spinner" /><p>Loading shoes...</p></div>
  );

  const visible = isLight ? shown.slice(0, 3) : shown.slice(0, limit);
  const hasMore = !isLight && limit < shown.length;

  return (
    <>
      {!isLight && (
        <SEO
          title="All Shoes"
          description="Shop sneakers, Timberland boots, and office shoes in Nairobi. Real sizes, M-Pesa checkout, 24-hour delivery."
          keywords="shoes Nairobi, sneakers Kenya, Timberland boots, office shoes, buy shoes online Kenya"
        />
      )}

      <div className={`products-page ${isLight ? "products-page--light" : "products-page--full"}`}>
        <div className="products-header">
          <h2>{isLight ? "Trending Now" : "All Shoes"}</h2>
          <p>{isLight ? "Best selling this week." : "Premium shoes for every occasion."}</p>

          {!isLight && (
            <div className="searchbar">
              <input
                className="search-input"
                placeholder="Search by name or price…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setLimit(PAGE); }}
              />
            </div>
          )}
          {hasMore && (
            <button className="load-more-btn" onClick={() => setLimit((l) => l + PAGE)}>Load More</button>
          )}
        </div>

        <div className="products-grid">
          {visible.map((p) => (
            <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
              {p.badge && <span className="offer-badge">{p.badge}</span>}
              <div className="product-image">
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <div className="placeholder-image">SHOE IMG</div>}
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                {p.rating != null && <p className="product-rating">⭐ {p.rating} ({p.reviews ?? 0})</p>}
                <p className="product-price">KES {Number(p.price).toLocaleString()}</p>
              </div>
              <div className="product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => { e.stopPropagation(); setCart((prev) => addToCart(prev, p)); }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {(error || visible.length === 0) && (
          <div className="no-products">
            <p>{error ? "Could not load shoes." : search ? `No shoes match "${search}".` : "No shoes available right now."}</p>
          </div>
        )}
      </div>
    </>
  );
}
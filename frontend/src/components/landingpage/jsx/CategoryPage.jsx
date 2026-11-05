import { useEffect, useMemo, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { addToCart } from "../../../utils/CartUtil";
import "../css/CategoryPage.css";

const PAGE = 3;
const cap = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function CategoryPage() {
  const { category } = useParams();
  const { setCart } = useOutletContext();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const name = cap(category);

  useEffect(() => {
    let dead = false;
    setLoading(true);
    setError(false);
    setSearch("");
    setLimit(PAGE);

    fetch(`/api/products?category=${encodeURIComponent(category)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !dead && setProducts(Array.isArray(d) ? d : d?.data || d?.products || []))
      .catch(() => !dead && setError(true))
      .finally(() => !dead && setLoading(false));

    return () => { dead = true; };
  }, [category]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q
      ? products
      : products.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            String(p.price ?? "").includes(q) ||
            (p.sizes || []).includes(Number(q))
        );
  }, [products, search]);

  return (
    <div className="category-page">
      <p className="category-page__breadcrumb">Home / Shop / {name}</p>
      <h2 className="category-page__title">{name}</h2>

      <div className="category-page__toolbar">
        <div className="category-page__search">
          <span className="category-page__search-icon">🔍</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setLimit(PAGE); }}
            placeholder="Search by name, price or size…"
          />
        </div>
        {limit < shown.length && (
          <button className="category-page__load-more" onClick={() => setLimit((l) => l + PAGE)}>
            Load More
          </button>
        )}
      </div>

      <div className="category-page__grid">
        {loading
          ? [0, 1, 2].map((i) => <div key={i} className="skeleton-card" />)
          : error || shown.length === 0
          ? (
            <p className="category-page__empty">
              {error ? "Could not load products." : `No ${name.toLowerCase()} ${search ? `match "${search}"` : "available right now"}.`}
            </p>
          )
          : shown.slice(0, limit).map((p) => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="product-card__media">
                  <img src={p.image} alt={p.name} className="product-card__image" loading="lazy" />
                  {p.badge && <span className="product-card__badge">{p.badge}</span>}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__name">{p.name}</h3>
                  <p className="product-card__price">KES {Number(p.price).toLocaleString()}</p>
                  <button
                    className="product-card__add"
                    onClick={(e) => { e.stopPropagation(); setCart((prev) => addToCart(prev, p)); }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
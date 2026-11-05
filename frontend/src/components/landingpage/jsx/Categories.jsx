import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Categories.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const CATEGORIES_ENDPOINT = `${API_BASE}/api/categories`;

export default function Categories({ title = "Shop by Category" }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(CATEGORIES_ENDPOINT);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || json.categories || [];

        if (!cancelled) setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[Categories] fetch failed:", err.message);
        }
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // If API returns nothing (or fails), hide the whole section — no fake data
  if (!loading && categories.length === 0) return null;

  return (
    <section className="categories" aria-labelledby="categories-heading">
      <div className="categories__header">
        <h2 id="categories-heading" className="categories__title">
          {title}
        </h2>
        <Link to="/products" className="categories__view-all">
          View all →
        </Link>
      </div>

      <div className="categories__grid">
        {loading
          ? [0, 1, 2].map((i) => (
              <div
                key={i}
                className="category-card category-card--skeleton"
                aria-hidden="true"
              />
            ))
          : categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/collections/${cat.category}`}
                className="category-card"
                aria-label={`Shop ${cat.name}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-card__image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="category-card__overlay" aria-hidden="true" />
                <div className="category-card__content">
                  <h3 className="category-card__title">{cat.name}</h3>
                  <span className="category-card__cta">Shop now →</span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
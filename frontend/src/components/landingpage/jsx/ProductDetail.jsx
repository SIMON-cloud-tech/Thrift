import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { addToCart } from "../../../utils/CartUtil";
import "../css/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { setCart } = useOutletContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    let dead = false;
    setLoading(true);
    setProduct(null);
    setRelated([]);
    setQty(1);
    setImgIdx(0);

    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const p = d?.data || d?.product || d;
        if (!p?.name) throw new Error("Not found");
        if (dead) return;
        setProduct(p);

        return fetch(`/api/products?category=${encodeURIComponent(p.category)}`)
          .then((r) => (r.ok ? r.json() : []))
          .then((d) => {
            const list = Array.isArray(d) ? d : d?.data || d?.products || [];
            if (!dead) setRelated(list.filter((x) => String(x.id) !== String(id)).slice(0, 3));
          });
      })
      .catch(() => !dead && setProduct(null))
      .finally(() => !dead && setLoading(false));

    return () => { dead = true; };
  }, [id]);

  if (loading) return (
    <div className="pd-loading"><div className="pd-spinner" /><p>Loading…</p></div>
  );

  if (!product) return (
    <div className="pd-empty"><p>Product not found.</p></div>
  );

  const images = product.images?.length ? product.images.slice(0, 4) : product.image ? [product.image] : [];
  const total = Number(product.price) * qty;

  const add = (p, n = 1) => setCart((prev) => {
    let next = prev;
    for (let i = 0; i < n; i++) next = addToCart(next, p);
    return next;
  });

  return (
    <div className="pd-page">
      <div className="pd-main">
        <div className="pd-gallery">
          <div className="pd-hero">
            {images[imgIdx] ? (
              <img src={images[imgIdx]} alt={product.name} className="pd-hero__img" />
            ) : (
              <div className="pd-hero__placeholder">SHOE IMG</div>
            )}
            {product.badge && <span className="pd-badge">{product.badge}</span>}
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pd-thumb ${i === imgIdx ? "is-active" : ""}`}
                  onClick={() => setImgIdx(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <h3 className="pd-title">{product.name}</h3>
          <h5 className="pd-price">KES {Number(product.price).toLocaleString()}</h5>

          {product.rating != null && (
            <div className="pd-rating">
              <span className="pd-stars" aria-label={`${product.rating} out of 5`}>
                {"★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span className="pd-rating__meta">{product.rating} ({product.reviews ?? 0} reviews)</span>
            </div>
          )}

          {product.description && <p className="pd-description">{product.description}</p>}

          <div className="pd-qty">
            <span className="pd-qty__label">Quantity</span>
            <div className="pd-qty__control">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span className="pd-qty__value">{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
            </div>
          </div>

          <button type="button" className="pd-add-btn" onClick={() => { add(product, qty); setQty(1); }}>
            Add to Cart — KES {total.toLocaleString()}
          </button>

          <p className="pd-trust">Pay via Mpesa on checkout. Delivery within 24hrs.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pd-related">
          <h2 className="pd-related__title">You might also like</h2>
          <div className="pd-related__grid">
            {related.map((r) => (
              <div key={r.id} className="pd-related-card" onClick={() => navigate(`/product/${r.id}`)}>
                <div className="pd-related-card__media">
                  {r.image ? <img src={r.image} alt={r.name} loading="lazy" /> : <div className="pd-related-card__placeholder">SHOE IMG</div>}
                  {r.badge && <span className="pd-related-card__badge">{r.badge}</span>}
                </div>
                <div className="pd-related-card__body">
                  <h3 className="pd-related-card__name">{r.name}</h3>
                  <p className="pd-related-card__price">KES {Number(r.price).toLocaleString()}</p>
                  <button
                    type="button"
                    className="pd-related-card__add"
                    onClick={(e) => { e.stopPropagation(); add(r); }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
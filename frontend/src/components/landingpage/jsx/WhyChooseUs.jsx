import { useEffect, useRef } from 'react';
import { FaShippingFast, FaShieldAlt, FaUndoAlt, FaCrown } from 'react-icons/fa';
import '../css/WhyChooseUs.css';

const WhyChooseUs = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.target.dataset.visible = 'true')),
      { threshold: 0.15 }
    );
    gridRef.current.querySelectorAll('.why-card').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const cards = [
    { icon: <FaShippingFast />, title: 'Fast Delivery',     description: 'Same day delivery across Nairobi. Your kicks, at your doorstep.' },
    { icon: <FaShieldAlt />,    title: '100% Authentic',    description: 'Every pair verified. No fakes, no compromise, just quality.' },
    { icon: <FaUndoAlt />,      title: 'Easy Returns',      description: '7-day hassle-free returns. Shop with full confidence.' },
    { icon: <FaCrown />,        title: 'Premium Selection', description: "Curated collections from the world's most sought-after brands." },
  ];

  return (
    <section className="why-section">
      <h4 className="why-eyebrow">WHY DRIP MTAANI</h4>
      <h1 className="why-title">Built Different</h1>
      <div className="why-grid" ref={gridRef}>
        {cards.map((c, i) => (
          <div key={i} className="why-card" style={{ '--delay': `${i * 110}ms` }}>
            <div className="why-card__icon">{c.icon}</div>
            <h3 className="why-card__title">{c.title}</h3>
            <p className="why-card__desc">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
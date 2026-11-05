import { useEffect, useRef } from 'react';
import '../css/Story.css';
import aboutImage from '/shoe.webp';

const Story = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('mvv-visible');
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.mvv-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* ── HERO / INTRO ── */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1>About Drip Mtaani</h1>
          <p>Nairobi's home for authentic street footwear, since day one.</p>
        </div>
      </section>

      {/* ── COMPANY INFO + IMAGE ── */}
      <section className="about-content">
        <div className="about-image">
          <img
            src={aboutImage}
            alt="Drip Mtaani Store"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            <strong>Drip Mtaani</strong> is Nairobi's premier destination for
            authentic street footwear. We curate sneakers, boots, and formal
            shoes from the world's most sought-after brands — every pair
            verified, every style on point. From the latest drops to timeless
            classics, we bring the culture straight to your doorstep.
          </p>
          <p>
            Built for the streets, we serve everyone from sneakerheads chasing
            grails to professionals who need a clean pair of leather shoes for
            the office. Whether you're in Kilimani, Kasarani, Westlands, or
            anywhere across Nairobi, our same-day delivery gets your kicks to
            you fast. Countrywide deliveries available on request.
          </p>
          <p className="tagline">👟 Step Into The Culture</p>
        </div>
      </section>

      {/* ── MISSION, VISION, VALUES ── */}
      <section className="about-mvv" ref={sectionRef}>
        <div className="mvv-card">
          <h3>🎯 Mission</h3>
          <p>
            To make authentic, premium footwear accessible to every drip lover
            in Nairobi — without the fakes, without the markup, without the
            hassle.
          </p>
        </div>
        <div className="mvv-card">
          <h3>🔭 Vision</h3>
          <p>
            To become East Africa's most trusted name in street footwear —
            where every pair tells a story and every customer walks out
            with confidence.
          </p>
        </div>
        <div className="mvv-card">
          <h3>⭐ Core Values</h3>
          <ul>
            <li>Authenticity</li>
            <li>Style</li>
            <li>Reliability</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Story;
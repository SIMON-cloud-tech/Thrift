import { memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Hero.css';

// ── Constants ──
const VIDEO_SRC = '/shoe.mp4';            // put your video in the public folder
const SHOP_PATH = '/collections/sneakers'; // where "Shop Now" goes

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Play only while the hero is on screen, and not at all if the visitor prefers reduced motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true; // some browsers ignore the attribute for autoplay
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero">
      {/* ── Background video ── */}
      <video
        ref={videoRef}
        className="hero-video"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* ── Darkening + blur, left side only; the right side stays clear ── */}
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-blur" aria-hidden="true" />

      {/* ── Text, left ── */}
      <div className="hero-content">
        <h1 className="hero-title">
          Step Into <span className="highlight">Fresh Style</span>
        </h1>

        <p className="hero-subtitle">
          Hand-picked sneakers and Timberlands, ready for everyday wear.
        </p>

        <p className="marketing-strip">👟 Sneakers • 🥾 Timberlands • 🛒 Shop Online</p>

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => navigate(SHOP_PATH)}>
            Shop Now →
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/landingpage/jsx/Loader.jsx';
// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';

// Public pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Products from './components/landingpage/jsx/Products.jsx';
import BlogDetail from './components/landingpage/jsx/BlogDetail.jsx';
import BlogSection from './components/landingpage/jsx/BlogSection.jsx';
import CategoryPage from './components/landingpage/jsx/CategoryPage.jsx';
import ProductDetail from './components/landingpage/jsx/ProductDetail.jsx';
import Checkout from './components/landingpage/jsx/Checkout.jsx';
import Testimonials from './components/landingpage/jsx/Testimonials.jsx';

// Admin / Auth
import Auth from './components/dashboard/jsx/Auth.jsx';
import Reset from './components/dashboard/jsx/Reset.jsx';
import Dashboard from './components/dashboard/jsx/Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ===== PUBLIC ROUTES (with Navbar + Footer) ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
       <Route path="/collections/:category" element={<CategoryPage />} />
       <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Route>

      {/* ===== HIDDEN ADMIN LOGIN ===== */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Auth setUser={setUser} />
          )
        }
      />

      {/* ===== PASSWORD RESET ===== */}
      <Route path="/reset" element={<Reset />} />

      {/* ===== PROTECTED DASHBOARD ===== */}
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? (
            <Dashboard setUser={setUser} />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
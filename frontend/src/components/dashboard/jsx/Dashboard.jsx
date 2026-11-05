import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiPackage, FiEdit, FiBox, FiSettings,
  FiLogOut, FiSun, FiMoon,
  FiMenu, FiX, FiStar,
} from 'react-icons/fi';
import '../css/Dashboard.css';
import ProductManage from './ProductManage.jsx';
import BlogManage from './BlogManage.jsx';
import Inventory from './Inventory.jsx';
import TestimonialsManage from './TestimonialManage.jsx';

const MENU = [
  { id: 'products',     label: 'Products',     icon: FiPackage, component: ProductManage },
  { id: 'blog',         label: 'Blog',         icon: FiEdit,    component: BlogManage },
  { id: 'inventory',    label: 'Inventory',    icon: FiBox,     component: Inventory },
  { id: 'testimonials', label: 'Testimonials', icon: FiStar,    component: TestimonialsManage },
];

const Dashboard = ({ setUser }) => {
  const navigate = useNavigate();

  const [active, setActive] = useState('products');
  const [theme, setTheme] = useState('light');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then((r) => {
        if (r.status === 401) { navigate('/auth'); return null; }
        return r.ok ? r.json() : Promise.reject();
      })
      .then((d) => d && setProfile(d))
      .catch(() => navigate('/auth'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try { await fetch('/api/logout', { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null);
    navigate('/auth');
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  if (loading) return <div className="dashboard-status"><p>Loading dashboard...</p></div>;

  const activeMenu = MENU.find((m) => m.id === active);
  const ActiveComponent = activeMenu?.component;

  return (
    <div className={`dashboard ${theme}`}>
      <div className="mobile-topbar">
        <button
          className="mobile-hamburger"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Drip Mtaani</h2>
        </div>

        <nav>
          {MENU.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-item ${active === id ? 'active' : ''}`}
              onClick={() => { setActive(id); setSidebarOpen(false); }}
              title={label}
            >
              <span className="sidebar-icon"><Icon size={20} /></span>
              <span className="sidebar-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon"><FiLogOut size={20} /></span>
            <span className="sidebar-label">Logout</span>
          </button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            <span className="sidebar-icon">
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </span>
            <span className="sidebar-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <section className="dashboard-row dashboard-row-fixed">
          <div className="welcome-banner">
            <h1 className="welcome-title">
              {getGreeting()}, {profile?.name || 'Admin'}! 👋
            </h1>
          </div>
        </section>

        <section className="dashboard-row dashboard-row-scrollable">
          <div className="content-panel full-width">
            <h3>{activeMenu?.label || 'Dashboard'}</h3>
            {ActiveComponent ? <ActiveComponent /> : <p>Section not found</p>}
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Drip Mtaani. All Rights Reserved.</p>
          <Link to="/" className="dashboard-footer-link">
            <p>Step Into The Culture 👟</p>
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
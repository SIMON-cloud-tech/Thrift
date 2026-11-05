import { memo, useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FiShoppingCart, FiMenu, FiX, FiUser, FiPhone, FiMail, FiChevronDown,
} from 'react-icons/fi';
import Cart from './Cart';
import '../css/Navbar.css';
import LogoImage from '/logo.jpeg';

const PHONE_DISPLAY = '0789 679 161';
const PHONE_HREF = 'tel:+254789679161';
const EMAIL = 'support.dripmtaani@gmail.com';

const MENU_ITEMS = [
  { label: 'Home', path: '/' },
  {
    label: 'Collections',
    dropdown: [
      { label: 'Sneakers', path: '/collections/sneakers' },
      { label: 'Timberland', path: '/collections/timberland' },
      { label: 'Office Shoes', path: '/collections/office-shoes' },
    ],
  },
  { label: 'Blogs', path: '/blogs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;
const dropdownLinkClass = ({ isActive }) => `dropdown-link${isActive ? ' active' : ''}`;
const mobileLinkClass = ({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`;

const Navbar = ({ cart, setCart, cartCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCollections, setMobileCollections] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef(null);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileCollections(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (!openDropdown && !mobileOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpenDropdown(null); setMobileOpen(false); }
    };
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [openDropdown, mobileOpen]);

  return (
    <>
      <header className="site-header">
        <div className="top-bar">
          <div className="top-bar-container">
            <div className="top-bar-contact">
              <a href={PHONE_HREF} className="top-bar-link">
                <FiPhone size={14} />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <span className="top-bar-divider" aria-hidden="true">|</span>
              <a href={`mailto:${EMAIL}`} className="top-bar-link">
                <FiMail size={14} />
                <span>{EMAIL}</span>
              </a>
            </div>

            <Link to="/admin" className="admin-entry" aria-label="Admin dashboard">
              <FiUser size={18} />
            </Link>
          </div>
        </div>

        <nav className="navbar" aria-label="Main">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo" onClick={closeAll}>
              <img src={LogoImage} alt="Drip Mtaani" className="navbar-logo-img" />
            </Link>

            <ul className="nav-menu" ref={menuRef}>
              {MENU_ITEMS.map((item) => {
                if (!item.dropdown) {
                  return (
                    <li key={item.path} className="nav-item">
                      <NavLink to={item.path} end={item.path === '/'} className={navLinkClass} onClick={closeAll}>
                        {item.label}
                      </NavLink>
                    </li>
                  );
                }

                const isOpen = openDropdown === item.label;
                return (
                  <li
                    key={item.label}
                    className="nav-item"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className="nav-link nav-link-btn"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(item.label)}
                    >
                      {item.label}
                      <FiChevronDown size={16} className={`dropdown-arrow${isOpen ? ' open' : ''}`} />
                    </button>

                    <ul className={`dropdown-menu${isOpen ? ' open' : ''}`}>
                      {item.dropdown.map((sub) => (
                        <li key={sub.path}>
                          <NavLink to={sub.path} className={dropdownLinkClass} onClick={closeAll}>
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div className="nav-right">
              <button
                className="cart-icon-wrapper"
                onClick={() => setCartOpen((p) => !p)}
                aria-label="Open cart"
              >
                <FiShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        <div className={`mobile-menu${mobileOpen ? ' active' : ''}`}>
          <ul className="mobile-nav-menu">
            {MENU_ITEMS.map((item) => {
              if (!item.dropdown) {
                return (
                  <li key={item.path} className="mobile-nav-item">
                    <NavLink to={item.path} end={item.path === '/'} className={mobileLinkClass} onClick={closeAll}>
                      {item.label}
                    </NavLink>
                  </li>
                );
              }

              return (
                <li key={item.label} className="mobile-nav-item">
                  <button
                    type="button"
                    className="mobile-nav-link mobile-nav-toggle"
                    aria-expanded={mobileCollections}
                    onClick={() => setMobileCollections((p) => !p)}
                  >
                    {item.label}
                    <FiChevronDown size={18} className={`dropdown-arrow${mobileCollections ? ' open' : ''}`} />
                  </button>

                  {mobileCollections && (
                    <ul className="mobile-submenu">
                      {item.dropdown.map((sub) => (
                        <li key={sub.path}>
                          <NavLink to={sub.path} className={mobileLinkClass} onClick={closeAll}>
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <Cart cart={cart} setCart={setCart} isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default memo(Navbar);
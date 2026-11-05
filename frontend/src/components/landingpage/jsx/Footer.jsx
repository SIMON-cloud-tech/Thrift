import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* BRAND */}
          <div>
            <h2 className="footer-title main">DRIP MTAANI</h2>
            <p className="footer-text">
              Nairobi's premier destination for authentic street footwear.
              Step into the culture.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="footer-title small">Quick Links</h2>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>

          {/* HOURS + ADDRESS + CONTACT — all in one */}
          <div>
            <h2 className="footer-title small">Working Hours</h2>
            <div className="footer-hours">
              <p>Mon – Fri: 8AM – 6PM</p>
              <p>Saturday: 9AM – 4PM</p>
              <p>Sunday: Closed</p>
            </div>

            <div className="footer-location">
              <h2 className="footer-title small">Address</h2>
              <p>Nairobi, Kenya</p>
              <p>Drip Mtaani Store</p>
            </div>

            <div className="footer-location">
              <h2 className="footer-title small">Contact Us</h2>
              <p>📞 <a href="tel:+254789679161">0789 679 161</a></p>
              <p>✉️ <a href="mailto:support.dripmtaani@gmail.com">support.dripmtaani@gmail.com</a></p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Drip Mtaani. All Rights Reserved.</p>
          <p>Step Into The Culture <Link to="/admin" className="admin-sun-icon" aria-label="Admin login">👟</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
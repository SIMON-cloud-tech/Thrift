import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/Contact.css';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254789679161';

const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const details = [
    { icon: <FaMapMarkerAlt />, label: 'Location',        value: 'Nairobi, Kenya' },
    { icon: <FaPhone />,        label: 'Phone / WhatsApp', value: '+254 789 679 161', href: 'tel:+254789679161' },
    { icon: <FaEnvelope />,     label: 'Email',           value: 'support.dripmtaani@gmail.com', href: 'mailto:support.dripmtaani@gmail.com' },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { day: 'Saturday',        time: '9:00 AM – 4:00 PM' },
    { day: 'Sunday',          time: 'Closed' },
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hi Drip Mtaani Team 👋\n\nI'm interested in a pair of shoes.\n\n• Name: ${form.name}\n• Phone: ${form.phone}\n• Email: ${form.email || 'N/A'}\n\nMy enquiry:\n${form.message}\n\nPlease advise on availability, sizes, and delivery timeline.\n\nLooking forward to your reply 👟`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="contact-section">
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          Got a question about a pair? Need help finding your size? Reach out — we respond fast, and we deliver same-day across Nairobi.
        </p>
      </div>

      <div className="contact-body">
        <div className="contact-left">
          <h3>Contact Info</h3>
          {details.map((d, i) => (
            <div key={i} className="detail-row">
              <span className="detail-row__icon">{d.icon}</span>
              <span>
                <strong>{d.label}</strong>
                <p>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</p>
              </span>
            </div>
          ))}

          <div className="hours-card">
            <h4>Working Hours</h4>
            {hours.map((h) => <p key={h.day}>{h.day}: {h.time}</p>)}
          </div>

          <div className="delivery-areas">
            <h4>Delivery Areas</h4>
            <p>Same-day delivery across Nairobi. Countrywide delivery available — charges vary by location.</p>
          </div>
        </div>

        <div className="contact-right">
          <h3>Send Us a Message</h3>
          {submitted && <p className="success">✓ WhatsApp opened — we'll get back to you shortly 👟</p>}

          <form onSubmit={handleSubmit} className="contact-form">
            <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email Address (optional)" value={form.email} onChange={handleChange} />
            <textarea name="message" placeholder="Which shoe are you looking for? Include size and colour if you can." value={form.message} onChange={handleChange} required />
            <button type="submit">Send on WhatsApp 👟</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
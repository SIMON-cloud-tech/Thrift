import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getCartTotal, DELIVERY_FEE } from '../../../utils/CartUtil';
import '../css/Checkout.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const EMPTY_FORM = { name: '', phone: '', location: '', payment: 'mpesa' };
const EMPTY_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '254789679161',
  mpesa: null,
};

const Checkout = () => {
  const { cart, setCart } = useOutletContext();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState(EMPTY_CONFIG);

  /* Fetch config (whatsapp + mpesa) on mount */
  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setConfig({ ...EMPTY_CONFIG, ...data }))
      .catch((err) => console.error('[Checkout] config fetch failed:', err));
  }, []);

  const subtotal = getCartTotal(cart);
  const total = subtotal + DELIVERY_FEE;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    const orderNo = 'DM-' + Date.now().toString().slice(-6);
    const today = new Date().toLocaleDateString('en-KE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const items = cart
      .map((i, idx) => `${idx + 1}. ${i.name} × ${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`)
      .join('\n');

    const message =
      `🛒 *NEW ORDER — ${orderNo}*\n\n` +
      `*Customer:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Delivery:* ${form.location}\n` +
      `*Payment:* ${form.payment === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}\n\n` +
      `*Items:*\n${items}\n\n` +
      `Subtotal: KES ${subtotal.toLocaleString()}\n` +
      `Delivery: KES ${DELIVERY_FEE.toLocaleString()}\n` +
      `*TOTAL: KES ${total.toLocaleString()}*\n\n` +
      `📅 ${today}`;

    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

    fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNo,
        customer: form.name,
        phone: form.phone,
        location: form.location,
        payment: form.payment,
        items: cart,
        subtotal,
        delivery: DELIVERY_FEE,
        total,
        createdAt: new Date().toISOString(),
      }),
    }).catch((err) => console.error('[Order log failed]', err));

    setSuccess({ orderNo, date: today, location: form.location });
    setCart([]);
    setSubmitting(false);
  };

  /* ─── SUCCESS VIEW ─── */
  if (success) {
    return (
      <section className="checkout-success">
        <div className="checkout-success__icon">✓</div>
        <h2>Thanks for your order!</h2>
        <p>
          Your order has been received and we shall deliver within the day
          (<strong>{success.date}</strong>).
        </p>
        <p className="checkout-success__order">
          Order No: <strong>{success.orderNo}</strong>
        </p>
        <p>
          We're dropping it at <strong>{success.location}</strong>.
        </p>
        <button className="checkout-success__btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </section>
    );
  }

  /* ─── EMPTY CART GUARD ─── */
  if (cart.length === 0) {
    return (
      <section className="checkout-empty">
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </section>
    );
  }

  /* ─── FORM ─── */
  return (
    <section className="checkout">
      <h1 className="checkout__title">Checkout</h1>

      <form className="checkout__form" onSubmit={handlePlaceOrder}>
        <fieldset className="checkout__fieldset">
          <legend className="checkout__legend">Delivery Details</legend>

          <label className="checkout__label">
            Full Name
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="e.g. Jane Wanjiru" required
            />
          </label>

          <label className="checkout__label">
            Phone Number
            <input
              type="tel" name="phone" value={form.phone}
              onChange={handleChange} placeholder="e.g. 0712 345 678" required
            />
          </label>

          <label className="checkout__label">
            Delivery Location
            <input
              type="text" name="location" value={form.location}
              onChange={handleChange} placeholder="Estate / Street / Building" required
            />
          </label>
        </fieldset>

        <fieldset className="checkout__fieldset">
          <legend className="checkout__legend">Payment Method</legend>

          <div className="checkout__radios">
            <label className={`checkout__radio ${form.payment === 'mpesa' ? 'is-active' : ''}`}>
              <input
                type="radio" name="payment" value="mpesa"
                checked={form.payment === 'mpesa'} onChange={handleChange}
              />
              <span>M-Pesa</span>
            </label>

            <label className={`checkout__radio ${form.payment === 'cash' ? 'is-active' : ''}`}>
              <input
                type="radio" name="payment" value="cash"
                checked={form.payment === 'cash'} onChange={handleChange}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {/* Payment details fetched from /api/config */}
          {form.payment === 'mpesa' && (
            <div className="mpesa-card">
              {config.mpesa?.paybill ? (
                <>
                  <h3 className="mpesa-card__title">💳 M-Pesa Payment Details</h3>

                  <div className="mpesa-card__rows">
                    <div><span>Business Name</span><strong>{config.mpesa.businessName}</strong></div>
                    <div><span>Paybill No.</span><strong>{config.mpesa.paybill}</strong></div>
                    <div><span>Account No.</span><strong>{form.phone || 'Your phone number'}</strong></div>
                    <div><span>Amount</span><strong>KES {total.toLocaleString()}</strong></div>
                  </div>

                  <h4 className="mpesa-card__subtitle">How to pay:</h4>
                  <ol className="mpesa-card__steps">
                    <li>Go to <strong>M-Pesa</strong> menu on your phone</li>
                    <li>Select <strong>Lipa na M-Pesa</strong></li>
                    <li>Select <strong>Pay Bill</strong></li>
                    <li>Business No: <strong>{config.mpesa.paybill}</strong></li>
                    <li>Account No: <strong>{form.phone || 'your phone number'}</strong></li>
                    <li>Amount: <strong>KES {total.toLocaleString()}</strong></li>
                    <li>Enter your M-Pesa PIN and send</li>
                  </ol>

                  <p className="mpesa-card__note">
                    After paying, click <strong>Place Order</strong> below. Your order will be sent to us via WhatsApp for confirmation.
                  </p>
                </>
              ) : (
                <p className="mpesa-card__loading">Loading payment details…</p>
              )}
            </div>
          )}
        </fieldset>

        <div className="checkout__summary">
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="checkout__summary-row">
            <span>Delivery Fee</span>
            <span>KES {DELIVERY_FEE.toLocaleString()}</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>
        </div>

        <button type="submit" className="checkout__submit" disabled={submitting}>
          {submitting ? 'Processing…' : `Place Order — KES ${total.toLocaleString()}`}
        </button>
      </form>
    </section>
  );
};

export default Checkout;
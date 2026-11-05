import { FaTimes, FaShoppingBag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { memo, useCallback } from 'react';
import '../css/Cart.css';
import {
  incrementItem,
  decrementItem,
  removeFromCart,
  getCartTotal,
  DELIVERY_FEE,
} from '../../../utils/CartUtil';

const CartItem = memo(({ item, onIncrement, onDecrement, onRemove }) => (
  <li className="cart-item">
    <div className="cart-item__thumb">
      <img src={item.image || '/placeholder.jpg'} alt={item.name} loading="lazy" />
    </div>
    <div className="cart-item__details">
      <p className="cart-item__name">{item.name}</p>
      <p className="cart-item__unit-price">
        KES {Number(item.price).toLocaleString()} each
      </p>
      <div className="cart-item__controls">
        <button className="qty-btn" onClick={() => onDecrement(item.id)}>−</button>
        <span className="qty-value">{item.quantity}</span>
        <button className="qty-btn" onClick={() => onIncrement(item.id)}>+</button>
      </div>
    </div>
    <div className="cart-item__right">
      <p className="cart-item__line-total">
        KES {(item.price * item.quantity).toLocaleString()}
      </p>
      <button className="cart-item__remove" onClick={() => onRemove(item.id)}>
        <FaTimes />
      </button>
    </div>
  </li>
));
CartItem.displayName = 'CartItem';

const Cart = ({ cart, setCart, isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleIncrement = useCallback((id) => setCart(prev => incrementItem(prev, id)), [setCart]);
  const handleDecrement = useCallback((id) => setCart(prev => decrementItem(prev, id)), [setCart]);
  const handleRemove    = useCallback((id) => setCart(prev => removeFromCart(prev, id)), [setCart]);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    onClose();
    navigate('/checkout');
  }, [cart.length, navigate, onClose]);

  const subtotal = getCartTotal(cart);
  const total = subtotal + DELIVERY_FEE;

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? 'cart-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Order
            {cart.length > 0 && <span className="cart-drawer__count">{cart.length}</span>}
          </h2>
          <button className="cart-drawer__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <FaShoppingBag className="cart-empty__icon" />
              <p>No items yet.</p>
              <span>Hover a product and tap <strong>Add to Cart</strong>.</span>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            {/* SUMMARY */}
            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row">
                <span>Delivery Fee</span>
                <span>KES {DELIVERY_FEE.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/" className="continue-shopping" onClick={onClose}>
              ← Continue Shopping
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;